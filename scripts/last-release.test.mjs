import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { beforeEach, describe, expect, it } from 'vitest'

import { lastRelease } from './last-release.mjs'

let dir

const git = (...args) =>
  execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd: dir, encoding: 'utf8' }).trim()

const commit = (message) => {
  git('commit', '--allow-empty', '-m', message)
  return git('rev-parse', 'HEAD')
}

// Mirrors scripts/release.mjs: detach, commit dist/, annotate-tag, back to main.
const release = (tag) => {
  git('checkout', '-q', '--detach')
  commit(`chore(release): ${tag}`)
  git('tag', '-a', tag, '-m', tag)
  git('checkout', '-q', 'main')
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'ui-release-'))
  git('init', '-q', '-b', 'main')
})

describe('lastRelease', () => {
  it('is null before the first release', () => {
    commit('feat: a')
    expect(lastRelease(dir)).toBeNull()
  })

  it('finds a release tag that is not an ancestor of main, based on the commit it was built from', () => {
    const built = commit('feat: a')
    release('v1.0.0')
    commit('feat: b')
    expect(lastRelease(dir)).toEqual({ tag: 'v1.0.0', base: built })
    expect(git('log', '--format=%s', `${lastRelease(dir).base}..HEAD`)).toBe('feat: b')
  })

  it('takes the highest version, not the latest lexically', () => {
    commit('feat: a')
    release('v1.9.0')
    const built = commit('feat: b')
    release('v1.10.0')
    expect(lastRelease(dir)).toEqual({ tag: 'v1.10.0', base: built })
  })
})
