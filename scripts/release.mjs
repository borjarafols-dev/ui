// Cut a release from main: compute the next version from conventional
// commits since the last v* tag, build, commit dist/ on a detached commit
// (main never contains dist/), tag it vX.Y.Z, push the tag and create the
// GitHub release. Consumers install `github:borjarafols-dev/ui#vX.Y.Z` and
// get prebuilt files — no install scripts run on their side.
//
// Usage: node scripts/release.mjs [--dry-run]   (CI: needs GH_TOKEN for `gh`)

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

import { lastRelease } from './last-release.mjs'
import { nextVersion, releaseType } from './next-version.mjs'

const dryRun = process.argv.includes('--dry-run')
// With stdio 'inherit' execFileSync returns null; normalise to ''.
const run = (cmd, args, opts = {}) =>
  (execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], ...opts }) ?? '').trim()

const previous = lastRelease()
const tag = previous?.tag ?? null
const range = previous ? `${previous.base}..HEAD` : 'HEAD'
const messages = run('git', ['log', '--no-merges', '--format=%B%x00', range])
  .split('\0')
  .map((m) => m.trim())
  .filter(Boolean)

const type = releaseType(messages)
const version = nextVersion(tag ? tag.slice(1) : null, type)

if (!version) {
  console.log(`No releasable commits since ${tag ?? 'the start'}.`)
  process.exit(0)
}

const next = `v${version}`
console.log(`${tag ?? '(none)'} -> ${next} (${type}, ${messages.length} commits)`)
// A collision means the previous release was missed: fail loudly, never skip.
if (run('git', ['tag', '--list', next])) {
  console.error(`${next} already exists, but the last release found was ${tag ?? '(none)'}.`)
  process.exit(1)
}
if (dryRun) process.exit(0)

const mainSha = run('git', ['rev-parse', 'HEAD'])

// Version first: the build stamps it into dist/ai/components.json.
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
pkg.version = version
writeFileSync('package.json', `${JSON.stringify(pkg, null, 2)}\n`)

run('npm', ['run', 'build'], { stdio: 'inherit', env: { ...process.env, RELEASE_VERSION: version } })

run('git', ['checkout', '--detach'])
run('git', ['add', '-f', 'dist', 'package.json'])
// CI runners have no git identity; both the commit and the annotated tag need one.
const bot = ['-c', 'user.name=github-actions[bot]', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com']
run('git', [...bot, 'commit', '-m', `chore(release): ${next}`, '-m', `Built from ${mainSha}.`])
run('git', [...bot, 'tag', '-a', next, '-m', next])
run('git', ['push', 'origin', next], { stdio: 'inherit' })
const notesFrom = tag ? ['--notes-start-tag', tag] : []
run('gh', ['release', 'create', next, '--verify-tag', '--generate-notes', ...notesFrom], { stdio: 'inherit' })

console.log(`Released ${next}.`)
