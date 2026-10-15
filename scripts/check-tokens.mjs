// Contract C2: component styling resolves to tokens. Fails on Tailwind
// palette colors (bg-blue-600, text-white) and hex colors in the given files.
// Shadow colors are allowed (they're an effect, not a themed color).
//
// Usage: node scripts/check-tokens.mjs [dir ...]   (default: src/components src/recipes)

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const PALETTE =
  /(?<![\w-])(?:[\w-]+:)*(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|outline|fill|stroke|divide|accent|caret|decoration|from|via|to)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-\d{2,3})?(?:\/\d+)?(?![\w-])/g
const HEX = /#[0-9a-fA-F]{3,8}(?![\w-])/g
const CHECKED = /\.(tsx?|astro)$/
const SKIPPED = /\.(test|stories|metadata)\.tsx?$/

export function violations(text) {
  return [...text.matchAll(PALETTE), ...text.matchAll(HEX)].map((m) => m[0])
}

function* files(path) {
  if (statSync(path).isDirectory()) for (const entry of readdirSync(path)) yield* files(join(path, entry))
  else if (CHECKED.test(path) && !SKIPPED.test(path)) yield path
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const roots = process.argv.slice(2).length ? process.argv.slice(2) : ['src/components', 'src/recipes']
  const problems = []
  for (const root of roots) {
    for (const file of files(root)) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          for (const v of violations(line)) problems.push(`${relative(process.cwd(), file)}:${i + 1}  ${v}`)
        })
    }
  }
  if (problems.length) {
    console.error(`Hard-coded colors found (use token utilities such as bg-primary, text-muted-foreground):\n  ${problems.join('\n  ')}`)
    process.exit(1)
  }
  console.log('Token check passed.')
}
