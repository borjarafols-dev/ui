// @vitest-environment node

import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { beforeEach, describe, expect, it } from 'vitest'

import { check, isChecked, violations } from './check-tokens.mjs'

const SCRIPT = fileURLToPath(new URL('./check-tokens.mjs', import.meta.url))

let app

function write(path, content) {
  mkdirSync(dirname(join(app, path)), { recursive: true })
  writeFileSync(join(app, path), content)
}

function run(bin, args) {
  return spawnSync(process.execPath, [bin, ...args], { cwd: app, encoding: 'utf8' })
}

beforeEach(() => {
  app = mkdtempSync(join(tmpdir(), 'ui-tokens-'))
})

describe('violations', () => {
  it('finds palette classes and hex colors, not tokens or shadows', () => {
    expect(violations("'bg-blue-600 hover:text-white bg-primary shadow-black/10 #fff'")).toEqual([
      'bg-blue-600',
      'hover:text-white',
      '#fff',
    ])
  })
})

describe('isChecked', () => {
  it.each([
    ['src/a.ts', true],
    ['src/a.tsx', true],
    ['src/pages/index.astro', true],
    ['src/a.test.tsx', false],
    ['src/a.test.ts', false],
    ['src/a.stories.tsx', false],
    ['src/a.metadata.ts', false],
    ['src/a.css', false],
  ])('%s -> %s', (path, checked) => {
    expect(isChecked(path)).toBe(checked)
  })
})

describe('check', () => {
  it('lists file:line  class for the given paths, skipping tests, stories, metadata and node_modules', () => {
    write('src/hero.astro', '<section class="bg-primary">\n  <h1 class="text-gray-500">Hi</h1>\n</section>\n')
    write('src/card.tsx', "export const c = 'border-border'\nexport const d = '#ff0000'\n")
    write('src/card.test.tsx', "'bg-red-500'\n")
    write('src/card.stories.tsx', "'bg-red-500'\n")
    write('src/card.metadata.ts', "'bg-red-500'\n")
    write('src/node_modules/x/y.ts', "'bg-red-500'\n")
    expect(check(['src'], app).sort()).toEqual(['src/card.tsx:2  #ff0000', 'src/hero.astro:2  text-gray-500'])
  })

  it('skips dist and dot-directories', () => {
    write('src/a.tsx', "'text-white'\n")
    write('src/dist/a.ts', "'bg-red-500'\n")
    write('src/.astro/types.ts', "'bg-red-500'\n")
    write('src/.cache/a.tsx', "'bg-red-500'\n")
    expect(check(['src'], app)).toEqual(['src/a.tsx:1  text-white'])
  })

  it('defaults to src/components and src/recipes', () => {
    write('src/components/a.tsx', "'text-white'\n")
    write('src/recipes/a.ts', "'bg-black'\n")
    write('src/other/a.ts', "'bg-red-500'\n")
    expect(check(undefined, app).sort()).toEqual(['src/components/a.tsx:1  text-white', 'src/recipes/a.ts:1  bg-black'])
  })
})

describe('CLI', () => {
  it('exits 1 listing each violation', () => {
    write('src/a.tsx', "'bg-blue-600'\n")
    const result = run(SCRIPT, ['src'])
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('src/a.tsx:1  bg-blue-600')
  })

  it('exits 0 and says so when there are none', () => {
    write('src/a.tsx', "'bg-primary'\n")
    const result = run(SCRIPT, ['src'])
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Token check passed.')
  })

  it('runs through a node_modules/.bin symlink', () => {
    write('src/a.astro', '<p class="text-red-500">x</p>\n')
    mkdirSync(join(app, 'node_modules/.bin'), { recursive: true })
    const bin = join(app, 'node_modules/.bin/brafols-ui-check-tokens')
    symlinkSync(SCRIPT, bin)
    const failing = run(bin, ['src'])
    expect(failing.status).toBe(1)
    expect(failing.stderr).toContain('src/a.astro:1  text-red-500')

    write('src/a.astro', '<p class="text-destructive">x</p>\n')
    const passing = run(bin, ['src'])
    expect(passing.status).toBe(0)
    expect(passing.stdout).toContain('Token check passed.')
  })
})
