// Metadata toolkit for CI and the generator (agentic, or anyone running it).
//
//   node scripts/metadata.mjs check           exit 1 if any metadata is stale/missing, or a
//                                             component lacks stories or tests (CI)
//   node scripts/metadata.mjs stale [--json]  list components whose metadata needs regenerating
//   node scripts/metadata.mjs inputs <id>     print everything the generator needs for <id>
//   node scripts/metadata.mjs stamp <id>      write the current source hash into <id>.metadata.ts

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { relative } from 'node:path'

import {
  ROOT,
  PROMPT_FILE,
  SCHEMA_FILE,
  componentFiles,
  componentIds,
  hashInputs,
  recipeImports,
  sourceHash,
  statusAll,
  withStamp,
} from './lib/components.mjs'

const [command, arg] = process.argv.slice(2)
const rel = (p) => relative(ROOT, p)

function requireId(id) {
  if (!id || !componentIds().includes(id)) {
    console.error(`Unknown component "${id ?? ''}". Known: ${componentIds().join(', ')}`)
    process.exit(2)
  }
  return id
}

function section(title, path) {
  return `\n===== ${title}: ${rel(path)} =====\n${readFileSync(path, 'utf8')}`
}

switch (command) {
  case 'check': {
    const statuses = statusAll()
    const problems = []
    for (const s of statuses) {
      if (s.state !== 'ok') problems.push(`${s.id}: metadata ${s.state} (expected ${s.expected}, recorded ${s.recorded ?? 'none'})`)
      for (const m of s.missing) problems.push(`${s.id}: missing ${m} file`)
    }
    if (problems.length) {
      console.error(`Metadata check failed:\n  ${problems.join('\n  ')}`)
      console.error('\nRegenerate per .ai/metadata.prompt.md, or add the skip-metadata label to the PR.')
      process.exit(1)
    }
    console.log(`Metadata up to date for ${statuses.length} components.`)
    break
  }

  case 'stale': {
    const stale = statusAll()
      .filter((s) => s.state !== 'ok')
      .map((s) => ({ id: s.id, state: s.state, expected: s.expected, inputs: hashInputs(s.id).map(rel) }))
    if (process.argv.includes('--json')) console.log(JSON.stringify(stale, null, 2))
    else console.log(stale.length ? stale.map((s) => `${s.id} (${s.state})`).join('\n') : 'Nothing stale.')
    break
  }

  case 'inputs': {
    const id = requireId(arg)
    const files = componentFiles(id)
    const source = readFileSync(files.source, 'utf8')
    let out = readFileSync(PROMPT_FILE, 'utf8')
    out += section('SCHEMA', SCHEMA_FILE)
    out += section('COMPONENT SOURCE', files.source)
    for (const recipe of recipeImports(source)) out += section('RECIPE', recipe)
    if (existsSync(files.stories)) out += section('STORIES', files.stories)
    out += `\n===== LIBRARY COMPONENTS =====\n${componentIds().join('\n')}\n`
    out += existsSync(files.metadata)
      ? section('CURRENT METADATA', files.metadata)
      : '\n===== CURRENT METADATA =====\n(none: write a new file)\n'
    process.stdout.write(out)
    break
  }

  case 'stamp': {
    const id = requireId(arg)
    const { metadata } = componentFiles(id)
    if (!existsSync(metadata)) {
      console.error(`${rel(metadata)} does not exist. Write it first.`)
      process.exit(1)
    }
    const hash = sourceHash(id)
    writeFileSync(metadata, withStamp(readFileSync(metadata, 'utf8'), hash))
    console.log(`${id}: ${hash}`)
    break
  }

  default:
    console.error('Usage: node scripts/metadata.mjs <check|stale [--json]|inputs <id>|stamp <id>>')
    process.exit(2)
}
