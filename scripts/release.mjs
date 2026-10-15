// Cut a release from main: compute the next version from conventional
// commits since the last v* tag, build, commit dist/ on a detached commit
// (main never contains dist/), tag it vX.Y.Z, push the tag and create the
// GitHub release. Consumers install `github:borjarafols-dev/ui#vX.Y.Z` and
// get prebuilt files — no install scripts run on their side.
//
// Usage: node scripts/release.mjs [--dry-run]   (CI: needs GH_TOKEN for `gh`)

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

import { nextVersion, releaseType } from './next-version.mjs'

const dryRun = process.argv.includes('--dry-run')
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], ...opts }).trim()

function lastTag() {
  try {
    return run('git', ['describe', '--tags', '--abbrev=0', '--match', 'v[0-9]*.[0-9]*.[0-9]*', 'HEAD'], {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch {
    return null
  }
}

const tag = lastTag()
const range = tag ? `${tag}..HEAD` : 'HEAD'
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
if (dryRun) process.exit(0)

const mainSha = run('git', ['rev-parse', 'HEAD'])

run('npm', ['run', 'build'], { stdio: 'inherit' })

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
pkg.version = version
writeFileSync('package.json', `${JSON.stringify(pkg, null, 2)}\n`)

run('git', ['checkout', '--detach'])
run('git', ['add', '-f', 'dist', 'package.json'])
run('git', ['-c', 'user.name=github-actions[bot]', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com', 'commit', '-m', `chore(release): ${next}`, '-m', `Built from ${mainSha}.`])
run('git', ['tag', '-a', next, '-m', next])
run('git', ['push', 'origin', next], { stdio: 'inherit' })
const notesFrom = tag ? ['--notes-start-tag', tag] : []
run('gh', ['release', 'create', next, '--verify-tag', '--generate-notes', ...notesFrom], { stdio: 'inherit' })

console.log(`Released ${next}.`)
