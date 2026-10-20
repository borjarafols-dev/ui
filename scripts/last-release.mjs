// The previous release, as a tag plus the main commit it was built from.
// Releases are tagged on the main commit itself, so that commit is the base
// of the next range. Tags up to v1.x sit on a detached `chore(release):`
// commit that added dist/ on top of main (never an ancestor of main); for
// those the base is the commit's first parent. Take the highest vX.Y.Z tag.

import { execFileSync } from 'node:child_process'

const git = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()

/**
 * @param {string} [cwd]
 * @returns {{ tag: string, base: string } | null} null before the first release
 */
export const lastRelease = (cwd) => {
  const [tag] = git(['tag', '--list', 'v[0-9]*.[0-9]*.[0-9]*', '--sort=-v:refname'], cwd).split('\n').filter(Boolean)
  if (!tag) return null
  const commit = `${tag}^{commit}`
  const legacy = git(['log', '-1', '--format=%s', commit], cwd).startsWith('chore(release): ')
  return { tag, base: git(['rev-parse', legacy ? `${commit}^1` : commit], cwd) }
}
