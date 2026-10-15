#!/usr/bin/env node
// Contract C2: component styling resolves to tokens. Fails on Tailwind
// palette colors (bg-blue-600, text-white) and hex colors in the given files.
// Shadow colors are allowed (they're an effect, not a themed color).
//
// Usage: node scripts/check-tokens.mjs [path ...]   (default: src/components src/recipes)
// Apps run the same check through the package bin: npx brafols-ui-check-tokens src

import { readdirSync, readFileSync, realpathSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PALETTE =
  /(?<![\w-])(?:[\w-]+:)*(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|outline|fill|stroke|divide|accent|caret|decoration|from|via|to)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-\d{2,3})?(?:\/\d+)?(?![\w-])/g
const HEX = /#[0-9a-fA-F]{3,8}(?![\w-])/g
const CHECKED = /\.(tsx?|astro)$/
const SKIPPED = /\.(test|stories)\.[^/\\]+$|\.metadata\.ts$/
const IGNORED_DIRS = new Set(['node_modules', 'dist'])
const DEFAULT_ROOTS = ['src/components', 'src/recipes']

export function violations(text) {
  return [...text.matchAll(PALETTE), ...text.matchAll(HEX)].map((m) => m[0])
}

export function isChecked(path) {
  return CHECKED.test(path) && !SKIPPED.test(path)
}

function* files(path) {
  if (statSync(path).isDirectory()) {
    for (const entry of readdirSync(path)) {
      if (!IGNORED_DIRS.has(entry) && !entry.startsWith('.')) yield* files(join(path, entry))
    }
  } else if (isChecked(path)) yield path
}

/** Every violation under `roots`, as `file:line  class` relative to `cwd`. */
export function check(roots = DEFAULT_ROOTS, cwd = process.cwd()) {
  const problems = []
  for (const root of roots) {
    for (const file of files(resolve(cwd, root))) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          for (const v of violations(line)) problems.push(`${relative(cwd, file)}:${i + 1}  ${v}`)
        })
    }
  }
  return problems
}

// Resolve symlinks so the guard also holds when run through node_modules/.bin.
function isMain() {
  if (!process.argv[1]) return false
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1])
  } catch {
    return false
  }
}

if (isMain()) {
  const args = process.argv.slice(2)
  const problems = check(args.length ? args : DEFAULT_ROOTS)
  if (problems.length) {
    console.error(`Hard-coded colors found (use token utilities such as bg-primary, text-muted-foreground):\n  ${problems.join('\n  ')}`)
    process.exit(1)
  }
  console.log('Token check passed.')
}
