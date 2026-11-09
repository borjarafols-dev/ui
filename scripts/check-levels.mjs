#!/usr/bin/env node
// Contract C6: components follow atomic design.
//
//   - Every component lives in src/components/{atoms,molecules,organisms}/.
//   - A component imports library components only from a lower level:
//     atoms import none, molecules import atoms, organisms import atoms and
//     molecules (and may compose other organisms).
//
// Only component sources are checked. Stories and tests may compose anything.
//
// Usage: node scripts/check-levels.mjs   (exit 1 on any violation)

import { readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { COMPONENTS_DIR, LEVELS, ROOT, componentFiles, componentIds, componentLevel, strayComponents } from './lib/components.mjs'

const IMPORT = /(?:from|import)\s*\(?\s*['"](\.[^'"]+)['"]/g

/** May a component at `from` import one at `to`? */
export function allowed(from, to) {
  const a = LEVELS.indexOf(from)
  const b = LEVELS.indexOf(to)
  return b < a || (from === 'organisms' && to === 'organisms')
}

/** Every C6 violation under `dir`, as human-readable lines. */
export function levelViolations(dir = COMPONENTS_DIR) {
  const out = strayComponents(dir).map((id) => `src/components/${id}.tsx  not in a level folder (${LEVELS.join(', ')})`)
  for (const id of componentIds(dir)) {
    const level = componentLevel(id, dir)
    const { source } = componentFiles(id, dir)
    for (const [, spec] of readFileSync(source, 'utf8').matchAll(IMPORT)) {
      const target = relative(dir, resolve(dirname(source), spec)).split('/')
      if (target.length !== 2 || !LEVELS.includes(target[0])) continue
      const [toLevel, toId] = target
      if (!allowed(level, toLevel)) out.push(`${level}/${id}  imports ${toLevel}/${toId.replace(/\.tsx?$/, '')}`)
    }
  }
  return out
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const problems = levelViolations()
  if (problems.length) {
    console.error(`Atomic level check failed (C6):\n  ${problems.join('\n  ')}`)
    console.error('\nA component may only import components from a lower level. Move it up a level, or split it.')
    process.exit(1)
  }
  console.log(`Atomic levels OK for ${componentIds().length} components (${relative(ROOT, join(COMPONENTS_DIR))}).`)
}
