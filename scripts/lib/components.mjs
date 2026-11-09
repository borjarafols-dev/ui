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

/**
 * Atomic design levels, lowest first. Each component lives in
 * `src/components/<level>/` and may only import components from a lower
 * level (organisms may also compose other organisms). See `check-levels.mjs`.
 */
export const LEVELS = ['atoms', 'molecules', 'organisms']

const sourcesIn = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith('.tsx') && !NOT_COMPONENT.test(f))
        .map((f) => f.slice(0, -'.tsx'.length))
    : []

/** Component ids (file basenames, unique across levels), e.g. `button`, `text-field`. */
export function componentIds(dir = COMPONENTS_DIR) {
  return LEVELS.flatMap((level) => sourcesIn(join(dir, level))).sort()
}

/** The level folder a component lives in, or null if it isn't in one. */
export function componentLevel(id, dir = COMPONENTS_DIR) {
  return LEVELS.find((level) => existsSync(join(dir, level, `${id}.tsx`))) ?? null
}

/** Component sources sitting directly in `src/components/`, outside any level. */
export function strayComponents(dir = COMPONENTS_DIR) {
  return sourcesIn(dir)
}

export function componentFiles(id, dir = COMPONENTS_DIR) {
  const base = join(dir, componentLevel(id, dir) ?? '')
  return {
    source: join(base, `${id}.tsx`),
    stories: join(base, `${id}.stories.tsx`),
    test: join(base, `${id}.test.tsx`),
    metadata: join(base, `${id}.metadata.ts`),
  }
}

/** Recipe files a source file imports from `src/recipes/*`. */
export function recipeImports(source, dir = COMPONENTS_DIR) {
  const files = new Set()
  for (const match of source.matchAll(/from ['"](?:\.\.\/)+recipes\/([\w-]+)['"]/g)) {
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
    const level = componentLevel(id, dir)
    const expected = sourceHash(id, dir)
    const missing = ['stories', 'test'].filter((k) => !existsSync(files[k]))
    if (!existsSync(files.metadata)) return { id, level, state: 'missing', expected, recorded: null, missing }
    const recorded = recordedHash(readFileSync(files.metadata, 'utf8'))
    return { id, level, state: recorded === expected ? 'ok' : 'stale', expected, recorded, missing }
  })
}
