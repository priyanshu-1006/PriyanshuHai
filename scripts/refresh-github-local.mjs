/** Local, data-only publishing. The normal portfolio checkout is never committed. */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  openSync,
  closeSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
  realpathSync,
  copyFileSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { refreshDue } from '../src/lib/githubActivity.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DATA = 'src/data/github.json'
const EXPECTED_ORIGIN = 'https://github.com/priyanshu-1006/PriyanshuHai'

export function assertDataOnlyChanges(paths) {
  if (!paths.length || paths.some((path) => path !== DATA))
    throw new Error(`Only ${DATA} may be committed by this automation.`)
}

export function assertPortfolioOrigin(origin) {
  const normalized = origin
    .trim()
    .replace(/^git@github.com:/, 'https://github.com/')
    .replace(/\.git\/?$/, '')
    .replace(/\/$/, '')
  if (normalized !== EXPECTED_ORIGIN)
    throw new Error(
      'The automation origin must be the existing PriyanshuHai repository.',
    )
}

export function needsDailyRefresh(
  snapshot,
  lastAutomatedCommit,
  now = new Date(),
) {
  if (
    lastAutomatedCommit &&
    !refreshDue({ generatedAt: lastAutomatedCommit }, now)
  )
    return false
  return refreshDue(snapshot, now) || !Array.isArray(snapshot.history?.commits)
}

function command(bin, args, cwd, capture = false, env = {}) {
  return (
    execFileSync(bin, args, {
      cwd,
      encoding: 'utf8',
      stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
      timeout: 600000,
      windowsHide: true,
      env: {
        ...process.env,
        GIT_TERMINAL_PROMPT: '0',
        GCM_INTERACTIVE: 'never',
        ...env,
      },
    })?.trim() || ''
  )
}

export async function runLocalRefresh({ publish = false } = {}) {
  const local = join(ROOT, '.automation')
  const checkout = join(local, 'github-refresh')
  const lock = join(local, 'github-refresh.lock')
  const state = join(local, 'last-run.json')
  mkdirSync(local, { recursive: true })
  if (existsSync(lock)) {
    const previous = JSON.parse(readFileSync(lock, 'utf8'))
    if (!Number.isInteger(previous.pid) || previous.pid < 1)
      throw new Error('Unrecognised refresh lock; inspect it before retrying.')
    let alive = true
    try {
      process.kill(previous.pid, 0)
    } catch (error) {
      if (error.code === 'ESRCH') alive = false
      else throw error
    }
    if (alive) throw new Error('A GitHub refresh is already running.')
    unlinkSync(lock)
  }
  const handle = openSync(lock, 'wx')
  closeSync(handle)
  writeFileSync(
    lock,
    JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }),
  )
  const result = {
    startedAt: new Date().toISOString(),
    mode: publish ? 'publish' : 'check',
    checkout,
  }
  const git = (args, capture = false, cwd = checkout, env = {}) =>
    command('git', args, cwd, capture, env)
  let wroteSnapshot = false
  let committed = false
  const mark = (status, detail) => {
    Object.assign(result, {
      status,
      detail,
      finishedAt: new Date().toISOString(),
    })
    writeFileSync(state, `${JSON.stringify(result, null, 2)}\n`)
    console.log(detail)
    return result
  }

  try {
    const origin = git(['remote', 'get-url', 'origin'], true, ROOT)
    assertPortfolioOrigin(origin)
    if (!existsSync(join(checkout, '.git'))) {
      if (existsSync(checkout))
        throw new Error(
          'The dedicated refresh directory already exists without a Git checkout.',
        )
      git(
        [
          'clone',
          '--depth',
          '1',
          '--single-branch',
          '--branch',
          'main',
          origin,
          checkout,
        ],
        false,
        ROOT,
      )
    }
    if (
      realpathSync(
        git(['rev-parse', '--show-toplevel'], true),
      ).toLowerCase() !== realpathSync(checkout).toLowerCase()
    )
      throw new Error(
        'The refresh checkout is not the dedicated automation directory.',
      )
    assertPortfolioOrigin(git(['remote', 'get-url', 'origin'], true))
    if (git(['branch', '--show-current'], true) !== 'main')
      throw new Error('The dedicated refresh checkout must stay on main.')
    const dirty = git(
      ['status', '--porcelain=v1', '--untracked-files=all'],
      true,
    )
    if (dirty)
      throw new Error(
        'The dedicated refresh checkout has unfinished changes. Inspect it before retrying; your portfolio checkout has not been touched.',
      )

    git(['fetch', '--depth', '30', 'origin', 'main'])
    const [ahead, behind] = git(
      ['rev-list', '--left-right', '--count', 'HEAD...origin/main'],
      true,
    )
      .split(/\s+/)
      .map(Number)
    if (ahead) {
      const pendingPaths = git(
        ['diff', '--name-only', 'origin/main...HEAD'],
        true,
      )
        .split('\n')
        .filter(Boolean)
      assertDataOnlyChanges(pendingPaths)
      const subjects = git(
        ['log', '--format=%s', 'origin/main..HEAD'],
        true,
      ).split('\n')
      if (
        subjects.some(
          (subject) => !subject.startsWith('chore: refresh GitHub activity ('),
        )
      )
        throw new Error(
          'The dedicated checkout has an unexpected unpublished commit.',
        )
      if (behind)
        throw new Error(
          'An earlier data commit could not be pushed and main has moved. Resolve the dedicated checkout without force pushing.',
        )
      if (publish) {
        git(['push', 'origin', 'HEAD:main'])
        return mark(
          'pushed',
          'Retried the previously validated data commit successfully.',
        )
      }
      git(['push', '--dry-run', 'origin', 'HEAD:main'])
      return mark(
        'checked',
        'A validated data commit is waiting to push; authentication is working.',
      )
    }
    if (behind) git(['merge', '--ff-only', 'origin/main'])

    const target = join(checkout, DATA)
    const snapshot = JSON.parse(readFileSync(target, 'utf8'))
    const lastAutomatedCommit = git(
      [
        'log',
        '-1',
        '--format=%aI',
        '--fixed-strings',
        '--grep=chore: refresh GitHub activity (',
      ],
      true,
    )
    const due = needsDailyRefresh(snapshot, lastAutomatedCommit)
    if (publish && !due)
      return mark(
        'skipped',
        'Today’s snapshot is already present. No second daily commit was created.',
      )

    const npmCli =
      process.env.npm_execpath ||
      join(
        dirname(process.execPath),
        'node_modules',
        'npm',
        'bin',
        'npm-cli.js',
      )
    if (!existsSync(npmCli))
      throw new Error(
        'Node/npm could not be located. Run this through npm run refresh:local.',
      )
    const npm = (args) => command(process.execPath, [npmCli, ...args], checkout)
    const stamp = join(local, 'dependencies.sha256')
    const lockHash = createHash('sha256')
      .update(readFileSync(join(checkout, 'package-lock.json')))
      .digest('hex')
    if (
      !existsSync(join(checkout, 'node_modules')) ||
      !existsSync(stamp) ||
      readFileSync(stamp, 'utf8') !== lockHash
    ) {
      npm(['ci'])
      writeFileSync(stamp, lockHash)
    }
    if (due) {
      wroteSnapshot = true
      command(
        process.execPath,
        [join(ROOT, 'scripts', 'fetch-github.mjs'), '--strict'],
        ROOT,
        false,
        {
          GITHUB_SNAPSHOT_PATH: target,
          GITHUB_TOKEN:
            process.env.GITHUB_ACTIVITY_TOKEN || process.env.GITHUB_TOKEN || '',
        },
      )
    }
    npm(['test'])
    npm(['run', 'check:release'])
    npm(['run', 'build'])
    git(['diff', '--check'])
    if (!publish) {
      git(['push', '--dry-run', 'origin', 'HEAD:main'])
      result.preview = join(local, 'preview-github.json')
      copyFileSync(target, result.preview)
      return mark(
        'checked',
        'Local refresh, tests, build and Git authentication passed. Nothing was committed or pushed.',
      )
    }

    const changed = git(['diff', '--name-only'], true)
      .split('\n')
      .filter(Boolean)
    if (!changed.length)
      return mark(
        'skipped',
        'GitHub data is unchanged; no empty commit was created.',
      )
    assertDataOnlyChanges(changed)
    git(['add', '--', DATA])
    assertDataOnlyChanges(
      git(['diff', '--cached', '--name-only'], true)
        .split('\n')
        .filter(Boolean),
    )
    const refreshed = JSON.parse(readFileSync(target, 'utf8'))
    const day = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date())
    git(
      ['commit', '-m', `chore: refresh GitHub activity (${day})`],
      false,
      checkout,
      {
        GIT_AUTHOR_NAME: 'Priyanshu Chaurasia',
        GIT_AUTHOR_EMAIL:
          process.env.PORTFOLIO_GIT_EMAIL ||
          '220466360+priyanshu-1006@users.noreply.github.com',
        GIT_COMMITTER_NAME: 'Priyanshu OS automation',
        GIT_COMMITTER_EMAIL:
          process.env.PORTFOLIO_GIT_EMAIL ||
          '220466360+priyanshu-1006@users.noreply.github.com',
      },
    )
    committed = true
    result.commit = git(['rev-parse', 'HEAD'], true)
    result.contributions = refreshed.calendar?.total
    result.historyCommits = refreshed.history?.commits?.length
    git(['push', 'origin', 'HEAD:main'])
    if (process.env.VERCEL_DEPLOY_HOOK) {
      const hook = new URL(process.env.VERCEL_DEPLOY_HOOK)
      if (hook.protocol !== 'https:' || hook.hostname !== 'api.vercel.com')
        throw new Error(
          'The configured deployment hook must be an HTTPS Vercel hook.',
        )
      const response = await fetch(hook, {
        method: 'POST',
        signal: AbortSignal.timeout(20000),
      })
      if (!response.ok)
        throw new Error(
          `Vercel deploy hook returned HTTP ${response.status}. The data commit was already pushed.`,
        )
    }
    return mark(
      'pushed',
      'Refreshed GitHub activity and public commit history, then pushed the single data file.',
    )
  } catch (error) {
    mark('failed', error.message)
    throw error
  } finally {
    // Only discard generated data in the verified, automation-owned checkout.
    if (wroteSnapshot && !committed) {
      try {
        git(['restore', '--source=HEAD', '--staged', '--worktree', '--', DATA])
      } catch {
        /* Preserve a failed checkout for inspection. */
      }
    }
    unlinkSync(lock)
  }
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  runLocalRefresh({ publish: process.argv.includes('--publish') }).catch(
    (error) => {
      console.error(error.message)
      process.exitCode = 1
    },
  )
}
