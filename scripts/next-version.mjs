// Conventional-commit version bump, semantic-release rules:
//   `type!:` or a `BREAKING CHANGE:` footer -> major
//   feat -> minor; fix / perf -> patch; anything else -> no release.
// agentic's commits (`feat(BOR-12): …`) and squash-merged PR titles both parse.

const HEADER = /^(?<type>\w+)(?:\([^)]*\))?(?<bang>!)?: /

const RANK = { none: 0, patch: 1, minor: 2, major: 3 }

/** @param {string} message full commit message (subject + body) */
export function bumpOf(message) {
  const header = message.split('\n', 1)[0]
  const match = HEADER.exec(header)
  if (/^BREAKING[ -]CHANGE: /m.test(message)) return 'major'
  if (!match) return 'none'
  if (match.groups.bang) return 'major'
  if (match.groups.type === 'feat') return 'minor'
  if (match.groups.type === 'fix' || match.groups.type === 'perf') return 'patch'
  return 'none'
}

/** Highest bump across commits. */
export function releaseType(messages) {
  return messages.map(bumpOf).reduce((a, b) => (RANK[b] > RANK[a] ? b : a), 'none')
}

/**
 * @param {string | null} lastVersion e.g. "1.4.2", or null before the first release
 * @param {'none'|'patch'|'minor'|'major'} type
 * @returns {string | null} the next version, or null when nothing releases
 */
export function nextVersion(lastVersion, type) {
  if (type === 'none') return null
  if (lastVersion === null) return '1.0.0'
  const [major, minor, patch] = lastVersion.split('.').map(Number)
  if (type === 'major') return `${major + 1}.0.0`
  if (type === 'minor') return `${major}.${minor + 1}.0`
  return `${major}.${minor}.${patch + 1}`
}
