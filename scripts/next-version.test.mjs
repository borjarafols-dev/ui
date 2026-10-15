import { describe, expect, it } from 'vitest'

import { bumpOf, nextVersion, releaseType } from './next-version.mjs'

describe('bumpOf', () => {
  it.each([
    ['feat(BOR-12): add Switch', 'minor'],
    ['feat: add Switch', 'minor'],
    ['fix(BOR-3): focus ring in dark mode', 'patch'],
    ['perf: memoise recipe slots', 'patch'],
    ['feat!: drop asChild', 'major'],
    ['refactor(BOR-9)!: rename tokens', 'major'],
    ['fix: x\n\nBREAKING CHANGE: --overlay removed', 'major'],
    ['chore: bump deps', 'none'],
    ['docs: README', 'none'],
    ['Merge pull request #4 from borjarafols-dev/x', 'none'],
    ['merge(BOR-12): merge spec/BOR-12', 'none'],
  ])('%s -> %s', (message, bump) => {
    expect(bumpOf(message)).toBe(bump)
  })
})

describe('releaseType', () => {
  it('takes the highest bump', () => {
    expect(releaseType(['fix: a', 'feat: b', 'chore: c'])).toBe('minor')
    expect(releaseType(['chore: a'])).toBe('none')
  })
})

describe('nextVersion', () => {
  it('starts at 1.0.0 and follows semver', () => {
    expect(nextVersion(null, 'patch')).toBe('1.0.0')
    expect(nextVersion('1.4.2', 'patch')).toBe('1.4.3')
    expect(nextVersion('1.4.2', 'minor')).toBe('1.5.0')
    expect(nextVersion('1.4.2', 'major')).toBe('2.0.0')
    expect(nextVersion('1.4.2', 'none')).toBeNull()
  })
})
