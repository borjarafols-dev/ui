// The previous release, as a tag plus the main commit it was built from.
// Release tags sit on a detached commit that adds dist/ on top of main, so
// they are never ancestors of main and `git describe` cannot see them: take
// the highest vX.Y.Z tag instead, and its release commit's first parent as
// the base of the next release's commit range.

import { execFileSync } from 'node:child_process'

const git = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()

/**
 * @param {string} [cwd]
 * @returns {{ tag: string, base: string } | null} null before the first release
 */
export const lastRelease = (cwd) => {
  const [tag] = git(['tag', '--list', 'v[0-9]*.[0-9]*.[0-9]*', '--sort=-v:refname'], cwd).split('\n').filter(Boolean)
  if (!tag) return null
  return { tag, base: git(['rev-parse', `${tag}^{commit}^1`], cwd) }
}
