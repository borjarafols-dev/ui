import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { beforeEach, describe, expect, it } from 'vitest'

import { allowed, levelViolations } from './check-levels.mjs'
import { componentLevel, hashInputs, recipeImports, recordedHash, sourceHash, statusAll, withStamp } from './lib/components.mjs'
import { colorBridge, tokensUsed } from './lib/tokens.mjs'

let dir

function write(path, content) {
  mkdirSync(dirname(join(dir, path)), { recursive: true })
  writeFileSync(join(dir, path), content)
}

beforeEach(() => {
  const root = mkdtempSync(join(tmpdir(), 'ui-meta-'))
  dir = join(root, 'components')
  mkdirSync(dir)
  mkdirSync(join(root, 'recipes'))
  write('../recipes/thing.ts', "export const thing = tv({ base: 'bg-primary' })\n")
  write('atoms/thing.tsx', "import { thing } from '../../recipes/thing'\n/** @usage Rarely. */\nexport function Thing() {}\n")
  write('atoms/thing.stories.tsx', 'export default {}\n')
  write('atoms/thing.test.tsx', '// test\n')
})

describe('source hash', () => {
  it('covers source, imported recipes and stories, but not tests', () => {
    const inputs = hashInputs('thing', dir).map((p) => p.split('/').slice(-2).join('/'))
    expect(inputs).toEqual(
      expect.arrayContaining(['atoms/thing.tsx', 'recipes/thing.ts', 'atoms/thing.stories.tsx']),
    )
    expect(inputs.some((p) => p.endsWith('.test.tsx'))).toBe(false)
  })

  it('is stable, and changes when a recipe or @usage line changes', () => {
    const first = sourceHash('thing', dir)
    expect(sourceHash('thing', dir)).toBe(first)

    write('../recipes/thing.ts', "export const thing = tv({ base: 'bg-secondary' })\n")
    const afterRecipe = sourceHash('thing', dir)
    expect(afterRecipe).not.toBe(first)

    write('atoms/thing.tsx', "import { thing } from '../../recipes/thing'\n/** @usage Often. */\nexport function Thing() {}\n")
    expect(sourceHash('thing', dir)).not.toBe(afterRecipe)
  })

  it('ignores test-only edits', () => {
    const before = sourceHash('thing', dir)
    write('atoms/thing.test.tsx', '// another test\n')
    expect(sourceHash('thing', dir)).toBe(before)
  })
})

describe('status', () => {
  it('reports missing, then stale (pending), then ok once stamped', () => {
    expect(statusAll(dir)[0].state).toBe('missing')

    write('atoms/thing.metadata.ts', "export default { component: 'Thing', sourceHash: 'pending' }\n")
    expect(statusAll(dir)[0].state).toBe('stale')

    write('atoms/thing.metadata.ts', withStamp("export default { sourceHash: 'pending' }\n", sourceHash('thing', dir)))
    expect(statusAll(dir)[0].state).toBe('ok')
  })

  it('reports missing stories and tests', () => {
    write('molecules/other.tsx', 'export function Other() {}\n')
    const other = statusAll(dir).find((s) => s.id === 'other')
    expect(other.missing).toEqual(['stories', 'test'])
  })
})

describe('atomic levels (C6)', () => {
  it('finds components in level folders and reports their level', () => {
    write('organisms/big.tsx', 'export function Big() {}\n')
    expect(statusAll(dir).map((s) => [s.id, s.level])).toEqual([
      ['big', 'organisms'],
      ['thing', 'atoms'],
    ])
    expect(componentLevel('big', dir)).toBe('organisms')
  })

  it('allows imports from lower levels only, plus organism to organism', () => {
    expect(allowed('molecules', 'atoms')).toBe(true)
    expect(allowed('organisms', 'molecules')).toBe(true)
    expect(allowed('organisms', 'organisms')).toBe(true)
    expect(allowed('atoms', 'atoms')).toBe(false)
    expect(allowed('molecules', 'molecules')).toBe(false)
    expect(allowed('atoms', 'molecules')).toBe(false)
  })

  it('flags upward and sideways imports, and components outside a level', () => {
    write('molecules/field.tsx', "import { Thing } from '../atoms/thing'\nexport function Field() {}\n")
    expect(levelViolations(dir)).toEqual([])

    write('atoms/thing.tsx', "import { Field } from '../molecules/field'\nexport function Thing() {}\n")
    write('atoms/other.tsx', "import { Thing } from './thing'\nexport function Other() {}\n")
    write('loose.tsx', 'export function Loose() {}\n')
    expect(levelViolations(dir).map((v) => v.split('  ')[0]).sort()).toEqual([
      'atoms/other',
      'atoms/thing',
      'src/components/loose.tsx',
    ])
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
