// Build dist/ai/: the agent-facing manifest shipped inside the package.
//
//   dist/ai/components.json  facts (exports, own props, variants, tokens, since)
//                            + metadata (when to use, alternatives, pitfalls)
//   dist/ai/USAGE.md         rules for apps consuming the library
//
// Facts are extracted here on every build. The judgement calls come from the
// model-owned src/components/*.metadata.ts. Run after tsup (it reads dist/recipes.js).

import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

import ts from 'typescript'

import { ROOT, componentFiles, componentIds, recipeImports, statusAll } from './lib/components.mjs'
import { colorBridge, tokensUsed } from './lib/tokens.mjs'

const OUT = join(ROOT, 'dist/ai')
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
const version = process.env.RELEASE_VERSION ?? pkg.version
const rel = (p) => relative(ROOT, p)

// ---- TypeScript: exports and the props each component declares itself ----

const config = ts.getParsedCommandLineOfConfigFile(join(ROOT, 'tsconfig.json'), {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} })
const program = ts.createProgram([join(ROOT, 'src/index.ts')], config.options)
const checker = program.getTypeChecker()
const inSrc = (decl) => decl.getSourceFile().fileName.startsWith(join(ROOT, 'src'))

// `RACButtonProps` -> `react-aria-components ButtonProps`, so agents know which docs apply.
function importAliases(sf) {
  const aliases = {}
  for (const stmt of sf.statements) {
    if (!ts.isImportDeclaration(stmt) || !stmt.importClause?.namedBindings) continue
    const from = stmt.moduleSpecifier.text
    if (from.startsWith('.')) continue
    const bindings = stmt.importClause.namedBindings
    if (!ts.isNamedImports(bindings)) continue
    for (const el of bindings.elements) aliases[el.name.text] = `${from} ${(el.propertyName ?? el.name).text}`
  }
  return aliases
}

const unalias = (text, aliases) => text.replace(/\b[A-Za-z_]\w*\b/g, (word) => aliases[word] ?? word)

function describeFile(path) {
  const sf = program.getSourceFile(path)
  const aliases = importAliases(sf)
  const moduleSymbol = checker.getSymbolAtLocation(sf)
  const exported = checker.getExportsOfModule(moduleSymbol)
  const components = exported.filter((s) => s.flags & ts.SymbolFlags.Function).map((s) => s.name)
  const propsTypes = exported.filter((s) => s.flags & ts.SymbolFlags.Interface && s.name.endsWith('Props'))

  const props = propsTypes.map((symbol) => {
    const decl = symbol.declarations[0]
    const type = checker.getDeclaredTypeOfSymbol(symbol)
    return {
      type: symbol.name,
      extends: (decl.heritageClauses ?? []).flatMap((h) => h.types.map((t) => unalias(t.getText(sf), aliases))),
      own: checker
        .getPropertiesOfType(type)
        .filter((p) => p.declarations?.some(inSrc))
        .map((p) => ({
          name: p.name,
          type: checker.typeToString(checker.getTypeOfSymbolAtLocation(p, decl)),
          optional: Boolean(p.flags & ts.SymbolFlags.Optional),
          doc: ts.displayPartsToString(p.getDocumentationComment(checker)) || undefined,
        })),
    }
  })

  const fn = exported.find((s) => s.name === components[0])
  const docs = fn ? ts.displayPartsToString(fn.getDocumentationComment(checker)) : ''
  const usage = fn ? fn.getJsDocTags(checker).filter((t) => t.name === 'usage').map((t) => ts.displayPartsToString(t.text)) : []
  return { components, props, docs, usage }
}

// ---- Recipes: variant names and values at runtime ----

const recipes = await import(pathToFileURL(join(ROOT, 'dist/recipes.js')).href)

function recipesOf(recipeFile) {
  const source = readFileSync(recipeFile, 'utf8')
  return [...source.matchAll(/export const (\w+) = tv\(/g)].map(([, name]) => {
    const r = recipes[name]
    return {
      name,
      import: `import { ${name} } from '@brafols/ui/recipes'`,
      slots: r.slots && Object.keys(r.slots).length ? Object.keys(r.slots).filter((s) => s !== 'base') : undefined,
      variants: Object.fromEntries(Object.entries(r.variants ?? {}).map(([k, v]) => [k, Object.keys(v)])),
      defaultVariants: r.defaultVariants ?? {},
    }
  })
}

// ---- Git: the release each component first shipped in ----

function since(path) {
  try {
    const opts = { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    const added = execFileSync('git', ['log', '--diff-filter=A', '--format=%H', '--', rel(path)], opts).trim().split('\n').at(-1)
    if (!added) return version
    const tags = execFileSync('git', ['tag', '--contains', added, '--sort=v:refname', '--list', 'v*'], opts).trim()
    return tags ? tags.split('\n')[0].slice(1) : version
  } catch {
    return version
  }
}

// ---- Assemble ----

const bridge = colorBridge(readFileSync(join(ROOT, 'src/styles.css'), 'utf8'))
const status = Object.fromEntries(statusAll().map((s) => [s.id, s.state]))

const components = []
for (const id of componentIds()) {
  const files = componentFiles(id)
  const source = readFileSync(files.source, 'utf8')
  const recipeFiles = recipeImports(source)
  const facts = describeFile(files.source)
  const metadata = existsSync(files.metadata)
    ? (await import(pathToFileURL(files.metadata).href)).default
    : null
  if (metadata) delete metadata.sourceHash

  components.push({
    id,
    exports: facts.components,
    import: `import { ${facts.components.join(', ')} } from '@brafols/ui'`,
    description: facts.docs || undefined,
    usage: facts.usage.length ? facts.usage : undefined,
    props: facts.props,
    recipes: recipeFiles.flatMap(recipesOf),
    tokens: tokensUsed([source, ...recipeFiles.map((f) => readFileSync(f, 'utf8'))].join('\n'), bridge),
    since: since(files.source),
    metadataFresh: status[id] === 'ok',
    metadata,
    source: `src/components/${basename(files.source)}`,
  })
}

const allTokens = [...readFileSync(join(ROOT, 'src/styles.css'), 'utf8').matchAll(/^\s*(--[\w-]+):/gm)]
  .map((m) => m[1])
  .filter((t) => !t.startsWith('--color-'))

const manifest = {
  package: pkg.name,
  version,
  generatedBy: 'scripts/build-manifest.mjs',
  read: 'Pick components by metadata (whenToUse / whenNotToUse). Props, variants and tokens are extracted from source and authoritative. See USAGE.md for the rules.',
  tokens: [...new Set(allTokens)],
  components,
}

mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'components.json'), `${JSON.stringify(manifest, null, 2)}\n`)
copyFileSync(join(ROOT, 'docs/USAGE.md'), join(OUT, 'USAGE.md'))
console.log(`dist/ai: ${components.length} components, ${components.filter((c) => !c.metadataFresh).length} with stale metadata`)
