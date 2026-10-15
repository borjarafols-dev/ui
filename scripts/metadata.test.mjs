import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { beforeEach, describe, expect, it } from 'vitest'

import { hashInputs, recipeImports, recordedHash, sourceHash, statusAll, withStamp } from './lib/components.mjs'
import { colorBridge, tokensUsed } from './lib/tokens.mjs'

let dir

function write(path, content) {
  writeFileSync(join(dir, path), content)
}

beforeEach(() => {
  const root = mkdtempSync(join(tmpdir(), 'ui-meta-'))
  dir = join(root, 'components')
  mkdirSync(dir)
  mkdirSync(join(root, 'recipes'))
  write('../recipes/thing.ts', "export const thing = tv({ base: 'bg-primary' })\n")
  write('thing.tsx', "import { thing } from '../recipes/thing'\n/** @usage Rarely. */\nexport function Thing() {}\n")
  write('thing.stories.tsx', 'export default {}\n')
  write('thing.test.tsx', '// test\n')
})

describe('source hash', () => {
  it('covers source, imported recipes and stories, but not tests', () => {
    const inputs = hashInputs('thing', dir).map((p) => p.split('/').slice(-2).join('/'))
    expect(inputs).toEqual(
      expect.arrayContaining(['components/thing.tsx', 'recipes/thing.ts', 'components/thing.stories.tsx']),
    )
    expect(inputs.some((p) => p.endsWith('.test.tsx'))).toBe(false)
  })

  it('is stable, and changes when a recipe or @usage line changes', () => {
    const first = sourceHash('thing', dir)
    expect(sourceHash('thing', dir)).toBe(first)

    write('../recipes/thing.ts', "export const thing = tv({ base: 'bg-secondary' })\n")
    const afterRecipe = sourceHash('thing', dir)
    expect(afterRecipe).not.toBe(first)

    write('thing.tsx', "import { thing } from '../recipes/thing'\n/** @usage Often. */\nexport function Thing() {}\n")
    expect(sourceHash('thing', dir)).not.toBe(afterRecipe)
  })

  it('ignores test-only edits', () => {
    const before = sourceHash('thing', dir)
    write('thing.test.tsx', '// another test\n')
    expect(sourceHash('thing', dir)).toBe(before)
  })
})

describe('status', () => {
  it('reports missing, then stale (pending), then ok once stamped', () => {
    expect(statusAll(dir)[0].state).toBe('missing')

    write('thing.metadata.ts', "export default { component: 'Thing', sourceHash: 'pending' }\n")
    expect(statusAll(dir)[0].state).toBe('stale')

    write('thing.metadata.ts', withStamp("export default { sourceHash: 'pending' }\n", sourceHash('thing', dir)))
    expect(statusAll(dir)[0].state).toBe('ok')
  })

  it('reports missing stories and tests', () => {
    write('other.tsx', 'export function Other() {}\n')
    const other = statusAll(dir).find((s) => s.id === 'other')
    expect(other.missing).toEqual(['stories', 'test'])
  })
})

describe('stamp helpers', () => {
  it('reads and replaces the recorded hash', () => {
    const text = "  sourceHash: 'sha256:abc',\n"
    expect(recordedHash(text)).toBe('sha256:abc')
    expect(recordedHash(withStamp(text, 'sha256:def'))).toBe('sha256:def')
    expect(() => withStamp('no field', 'x')).toThrow()
  })

  it('finds recipe imports', () => {
    expect(recipeImports("from '../recipes/a'\nfrom \"../recipes/b-c\"", dir).map((p) => p.split('/').pop())).toEqual([
      'a.ts',
      'b-c.ts',
    ])
  })
})

describe('tokensUsed', () => {
  const bridge = colorBridge(`
    --color-primary: var(--primary);
    --color-muted-foreground: var(--muted-foreground);
    --color-background: var(--background);
    --color-button-primary: var(--button-primary-bg);
  `)

  it('maps utilities through variants and opacity to tokens', () => {
    const source = "'bg-button-primary hover:bg-primary/90 text-muted-foreground focus-visible:ring-offset-background'"
    expect(tokensUsed(source, bridge)).toEqual(['--background', '--button-primary-bg', '--muted-foreground', '--primary'])
  })

  it('does not match a token by suffix', () => {
    expect(tokensUsed("'text-foreground-ish bg-primaryx'", bridge)).toEqual([])
  })
})

describe('check-tokens violations', async () => {
  const { violations } = await import('./check-tokens.mjs')

  it('flags palette and hex colors, including behind variants', () => {
    expect(violations("'bg-blue-600 hover:text-gray-900 text-white border-[#fff]'")).toEqual([
      'bg-blue-600',
      'hover:text-gray-900',
      'text-white',
      '#fff',
    ])
  })

  it('allows token utilities and shadow colors', () => {
    expect(violations("'bg-primary text-muted-foreground ring-ring/50 dark:shadow-black/40 bg-button-primary'")).toEqual([])
  })
})
