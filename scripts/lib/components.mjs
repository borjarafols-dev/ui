// Component discovery and metadata source hashing. Deterministic: the same
// tree always gives the same hashes, so CI and the generator agree.

import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
export const COMPONENTS_DIR = join(ROOT, 'src/components')
export const PROMPT_FILE = join(ROOT, '.ai/metadata.prompt.md')
export const SCHEMA_FILE = join(ROOT, 'src/metadata/schema.ts')

const NOT_COMPONENT = /\.(test|stories|metadata)\.tsx?$/

/** Component ids (file basenames), e.g. `button`, `text-field`. */
export function componentIds(dir = COMPONENTS_DIR) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.tsx') && !NOT_COMPONENT.test(f))
    .map((f) => f.slice(0, -'.tsx'.length))
    .sort()
}

export function componentFiles(id, dir = COMPONENTS_DIR) {
  return {
    source: join(dir, `${id}.tsx`),
    stories: join(dir, `${id}.stories.tsx`),
    test: join(dir, `${id}.test.tsx`),
    metadata: join(dir, `${id}.metadata.ts`),
  }
}

/** Recipe files a source file imports from `../recipes/*`. */
export function recipeImports(source, dir = COMPONENTS_DIR) {
  const files = new Set()
  for (const match of source.matchAll(/from ['"]\.\.\/recipes\/([\w-]+)['"]/g)) {
    files.add(join(dir, '../recipes', `${match[1]}.ts`))
  }
  return [...files].sort()
}

/**
 * Files whose content decides a component's metadata: its source (including
 * `@usage` JSDoc), the recipes it imports, its stories, the generator prompt
 * and the schema. Tests and the metadata file itself are excluded.
 */
export function hashInputs(id, dir = COMPONENTS_DIR) {
  const files = componentFiles(id, dir)
  const source = readFileSync(files.source, 'utf8')
  return [files.source, ...recipeImports(source, dir), files.stories, PROMPT_FILE, SCHEMA_FILE].filter((f) =>
    existsSync(f),
  )
}

/** `sha256:<hex>` over each input's repo-relative path and content. */
export function hashFiles(paths, root = ROOT) {
  const hash = createHash('sha256')
  for (const path of paths) {
    hash.update(relative(root, path))
    hash.update('\0')
    hash.update(readFileSync(path, 'utf8').replace(/\r\n/g, '\n'))
    hash.update('\0')
  }
  return `sha256:${hash.digest('hex')}`
}

export function sourceHash(id, dir = COMPONENTS_DIR) {
  return hashFiles(hashInputs(id, dir))
}

const STAMP = /sourceHash:\s*'([^']*)'/

/** The hash recorded in a metadata file, or null if missing. */
export function recordedHash(metadataText) {
  return STAMP.exec(metadataText)?.[1] ?? null
}

export function withStamp(metadataText, hash) {
  if (!STAMP.test(metadataText)) throw new Error('metadata file has no sourceHash field')
  return metadataText.replace(STAMP, `sourceHash: '${hash}'`)
}

/**
 * Status of every component: `ok`, `stale` (hash mismatch or `pending`),
 * or `missing` (no metadata file). Also reports missing stories/tests (C3).
 */
export function statusAll(dir = COMPONENTS_DIR) {
  return componentIds(dir).map((id) => {
    const files = componentFiles(id, dir)
    const expected = sourceHash(id, dir)
    const missing = ['stories', 'test'].filter((k) => !existsSync(files[k]))
    if (!existsSync(files.metadata)) return { id, state: 'missing', expected, recorded: null, missing }
    const recorded = recordedHash(readFileSync(files.metadata, 'utf8'))
    return { id, state: recorded === expected ? 'ok' : 'stale', expected, recorded, missing }
  })
}
