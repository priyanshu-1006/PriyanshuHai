/**
 * Refreshes the saved portfolio activity from GitHub, with no browser token.
 * The GraphQL calendar is preferred when API access is available; otherwise
 * exact counts come from GitHub's public contribution-calendar tooltips.
 *
 * npm run sync:github             — refresh locally
 * npm run sync:github -- --strict — fail rather than commit a stale calendar
 * node scripts/fetch-github.mjs --check-due — daily workflow guard
 */

import { writeFileSync, readFileSync, mkdirSync, appendFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parsePublicCalendar } from './lib/github-calendar.mjs'
import { refreshDue } from '../src/lib/githubActivity.js'
import { normalizeCommitHistory } from './lib/github-history.mjs'

const USER = process.env.GITHUB_USER || 'priyanshu-1006'
const TOKEN = process.env.GITHUB_TOKEN || ''
const OUT = process.env.GITHUB_SNAPSHOT_PATH
  ? resolve(process.env.GITHUB_SNAPSHOT_PATH)
  : resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/github.json')
const STRICT = process.argv.includes('--strict')
let previous = {}
try {
  previous = JSON.parse(readFileSync(OUT, 'utf8'))
} catch {
  /* First snapshot. */
}

if (process.argv.includes('--check-due')) {
  const due = refreshDue(previous)
  if (process.env.GITHUB_OUTPUT)
    appendFileSync(process.env.GITHUB_OUTPUT, `refresh=${due}\n`)
  console.log(
    due
      ? 'A new daily refresh is due.'
      : 'Today’s snapshot is already saved; skipping a second commit.',
  )
  process.exit(0)
}
if (!/^[a-z\d][a-z\d-]{0,38}$/i.test(USER))
  throw new Error('Invalid GitHub username.')

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': `${USER}-portfolio-build`,
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
}

let budgetExhausted = false
let partial = false

async function api(path, { search = false } = {}) {
  // Commit search has a separate rate limit from the REST core endpoints.
  if (budgetExhausted && !search) return null
  const url = path.startsWith('http') ? path : `https://api.github.com${path}`
  try {
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(15000),
    })
    if (res.status === 403 || res.status === 429) {
      const remaining = res.headers.get('x-ratelimit-remaining')
      if (remaining === '0') {
        console.warn(
          `  ! rate limit reached${search ? ' (search)' : ''} — keeping partial data`,
        )
        if (!search) budgetExhausted = true
      }
      partial = true
      return null
    }
    if (!res.ok) {
      partial = true
      console.warn(`  ! ${res.status} ${path}`)
      return null
    }
    // 204 on an empty repository's contributor list — no body to parse.
    if (res.status === 204) return []
    const text = await res.text()
    return text ? JSON.parse(text) : null
  } catch (err) {
    partial = true
    console.warn(`  ! ${path}: ${err.message}`)
    return null
  }
}

/* ── Profile ─────────────────────────────────────────────────────────────── */
console.log(
  `Fetching GitHub data for ${USER}${TOKEN ? ' (authenticated)' : ' (anonymous, 60/hr)'}`,
)
let profile = await api(`/users/${USER}`)
if (!profile && previous.user?.login?.toLowerCase() === USER.toLowerCase()) {
  const saved = previous.user
  profile = {
    login: saved.login,
    name: saved.name,
    html_url: saved.url,
    avatar_url: saved.avatar,
    bio: saved.bio,
    public_repos: saved.publicRepos,
    followers: saved.followers,
    following: saved.following,
    created_at: saved.createdAt,
  }
  partial = true
  console.warn(
    '  ! using the last saved public profile while the REST API is unavailable',
  )
}
if (!profile) {
  console.error(
    'Could not reach the GitHub API. Leaving the existing snapshot alone.',
  )
  process.exit(STRICT ? 1 : 0)
}

/* ── Owned repositories ──────────────────────────────────────────────────── */
const owned = []
let ownedComplete = true
for (let page = 1; page <= 4; page++) {
  const batch = await api(
    `/users/${USER}/repos?per_page=100&page=${page}&sort=pushed`,
  )
  if (!batch) {
    ownedComplete = false
    break
  }
  if (batch.length === 0) break
  owned.push(...batch)
  if (batch.length < 100) break
}
console.log(`  ${owned.length} repositories`)

const sourceRepos = owned
  .filter((r) => !r.fork && !r.archived)
  .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))

const found = await api(
  `/search/commits?q=author:${USER}&per_page=100&sort=author-date&order=desc`,
  { search: true },
)

/* ── Contributor breakdown ───────────────────────────────────────────────── *
 * One request per repo, so this is where the anonymous budget goes. Repos are
 * already sorted by most recently pushed, which is the order that matters if
 * the budget runs out partway through.                                       */
const contributions = []
const repositoryLimit = TOKEN ? sourceRepos.length : 45
if (sourceRepos.length > repositoryLimit) partial = true
for (const [index, repo] of sourceRepos.entries()) {
  if (index >= repositoryLimit) {
    const cached = previous.contributions?.find(
      (item) => item.full === repo.full_name,
    )
    if (cached) contributions.push({ ...cached, cached: true })
    continue
  }
  const list = await api(
    `/repos/${repo.full_name}/contributors?per_page=100&anon=0`,
  )
  if (!list || !Array.isArray(list)) {
    const cached = previous.contributions?.find(
      (item) => item.full === repo.full_name,
    )
    if (cached) contributions.push({ ...cached, cached: true })
    continue
  }

  const total = list.reduce((a, c) => a + (c.contributions || 0), 0)
  const mine = list.find((c) => c.login?.toLowerCase() === USER.toLowerCase())
  if (!mine) continue

  const rank =
    list.findIndex((c) => c.login?.toLowerCase() === USER.toLowerCase()) + 1
  contributions.push({
    name: repo.name,
    full: repo.full_name,
    owner: repo.owner.login,
    url: repo.html_url,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
    commits: mine.contributions,
    totalCommits: total,
    share: total ? mine.contributions / total : 1,
    rank,
    contributors: list.length,
    top: rank === 1,
    external: repo.owner.login.toLowerCase() !== USER.toLowerCase(),
    checkedAt: new Date().toISOString(),
  })
}
if (!ownedComplete) {
  const known = new Set(contributions.map((repo) => repo.full))
  for (const repo of previous.contributions || [])
    if (!known.has(repo.full)) contributions.push({ ...repo, cached: true })
}
console.log(`  ${contributions.length} repositories with attributed commits`)

/* ── External contributions ──────────────────────────────────────────────── *
 * Repos he committed to but does not own do not appear in /users/:u/repos.
 * The commit search is the only public way to surface them.                  */
const external = new Map()
for (const item of found?.items || []) {
  const r = item.repository
  if (!r || r.owner?.login?.toLowerCase() === USER.toLowerCase()) continue
  const prev = external.get(r.full_name)
  external.set(r.full_name, {
    name: r.name,
    full: r.full_name,
    owner: r.owner.login,
    url: r.html_url,
    description: r.description,
    commits: (prev?.commits || 0) + 1,
    lastCommit: prev?.lastCommit || item.commit?.author?.date || null,
    external: true,
  })
}
if (!found)
  for (const item of previous.external || [])
    external.set(item.full, { ...item, cached: true })
if (external.size) console.log(`  ${external.size} external repositories`)

/* ── Recent public activity ──────────────────────────────────────────────── *
 * The public events feed is a limited recent activity window, not a full commit
 * history. Calendar counts are fetched independently below.                   */
const byDay = {}
let pushes = 0
const events = []
for (let page = 1; page <= 3; page++) {
  const batch = await api(
    `/users/${USER}/events/public?per_page=100&page=${page}`,
  )
  if (!batch || batch.length === 0) break
  events.push(...batch)
  if (batch.length < 100) break
}
for (const e of events) {
  if (e.type !== 'PushEvent') continue
  const day = e.created_at.slice(0, 10)
  pushes += 1
  byDay[day] = (byDay[day] || 0) + 1
}
if (!events.length && budgetExhausted) {
  for (const day of previous.activity || []) byDay[day.date] = day.pushes
  pushes = previous.totals?.recentPushes || 0
}

const recent =
  !events.length && budgetExhausted
    ? previous.recent || []
    : events
        .filter((e) =>
          [
            'PushEvent',
            'CreateEvent',
            'PullRequestEvent',
            'ReleaseEvent',
          ].includes(e.type),
        )
        .slice(0, 12)
        .map((e) => ({
          type: e.type,
          repo: e.repo.name,
          at: e.created_at,
          // `payload.commits` and `payload.size` are both stripped from the public
          // feed now, so there is no honest per-event commit count to record.
          ref: e.payload?.ref_type || null,
          action: e.payload?.action || null,
        }))

/* ── Contribution calendar ───────────────────────────────────────────────── *
 * GraphQL provides a richer activity breakdown when token permissions allow it.
 * The public profile calendar remains available without a personal token.     */
let calendar = null
if (TOKEN) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          totalPullRequestReviewContributions
          restrictedContributionsCount
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount } }
          }
        }
      }
    }`
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { login: USER } }),
      signal: AbortSignal.timeout(15000),
    })
    const json = await res.json()
    const cc = json?.data?.user?.contributionsCollection
    if (cc) {
      const days = cc.contributionCalendar.weeks.flatMap(
        (w) => w.contributionDays,
      )
      calendar = {
        source: 'github-graphql',
        fetchedAt: new Date().toISOString(),
        total: cc.contributionCalendar.totalContributions,
        commits: cc.totalCommitContributions,
        pullRequests: cc.totalPullRequestContributions,
        issues: cc.totalIssueContributions,
        reviews: cc.totalPullRequestReviewContributions,
        private: cc.restrictedContributionsCount,
        activeDays: days.filter((d) => d.contributionCount > 0).length,
        busiestDay: days.reduce(
          (a, d) =>
            d.contributionCount > (a?.contributionCount ?? -1) ? d : a,
          null,
        ),
        days: days.map((d) => ({ d: d.date, c: d.contributionCount })),
      }
      console.log(
        `  calendar: ${calendar.total} contributions in the last year, ` +
          `${calendar.activeDays} active days`,
      )
    } else if (json?.errors) {
      console.warn(`  ! GraphQL: ${json.errors[0]?.message}`)
    }
  } catch (err) {
    console.warn(`  ! GraphQL: ${err.message}`)
  }
} else {
  console.log('  no API token — using GitHub’s public profile calendar')
}

if (!calendar) {
  try {
    const response = await fetch(
      `https://github.com/users/${USER}/contributions`,
      {
        headers: {
          'User-Agent': `${USER}-portfolio-sync`,
          'Accept-Language': 'en-US',
        },
        signal: AbortSignal.timeout(20000),
      },
    )
    if (!response.ok)
      throw new Error(`Public calendar returned HTTP ${response.status}`)
    calendar = parsePublicCalendar(await response.text())
    console.log(
      `  public calendar: ${calendar.total} contributions, ${calendar.activeDays} active days`,
    )
  } catch (error) {
    console.warn(`  ! ${error.message}`)
  }
}
if (!calendar && STRICT) {
  console.error(
    'No fresh calendar was available. Keeping the saved snapshot; no automated commit will be made.',
  )
  process.exit(1)
}
if (!found && !Array.isArray(previous.history?.commits) && STRICT) {
  console.error(
    'No initial public commit history was available. Keeping the saved snapshot; no automated commit will be made.',
  )
  process.exit(1)
}
if (!calendar && previous.calendar) {
  calendar = {
    ...previous.calendar,
    fetchedAt: previous.calendar.fetchedAt || previous.generatedAt,
  }
  partial = true
}

/* ── Totals ──────────────────────────────────────────────────────────────── */
const languages = {}
for (const c of contributions) {
  if (c.language)
    languages[c.language] = (languages[c.language] || 0) + c.commits
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  partial: partial || budgetExhausted,
  user: {
    login: profile.login,
    name: profile.name,
    url: profile.html_url,
    avatar: profile.avatar_url,
    bio: profile.bio,
    publicRepos: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
    createdAt: profile.created_at,
  },
  totals: {
    repos: contributions.length,
    commits: contributions.reduce((a, c) => a + c.commits, 0),
    topContributorIn: contributions.filter((c) => c.top).length,
    stars: contributions.reduce((a, c) => a + c.stars, 0),
    externalRepos: external.size,
    // The public events feed no longer carries `payload.commits`, so a commit
    // count from it would always be zero. Pushes are what the feed can honestly
    // report; the commit totals above come from the contributors endpoint.
    recentPushes: pushes,
    activeDays: Object.keys(byDay).length,
  },
  calendar,
  history: found
    ? {
        source: 'github-public-commit-search',
        fetchedAt: new Date().toISOString(),
        totalIndexed: found.total_count ?? null,
        sampled: (found.total_count || 0) > (found.items?.length || 0),
        incomplete: Boolean(found.incomplete_results),
        commits: normalizeCommitHistory(found.items),
      }
    : { ...(previous.history || {}), incomplete: true },
  languages: Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([name, commits]) => ({ name, commits })),
  contributions: contributions.sort((a, b) => b.commits - a.commits),
  external: [...external.values()].sort((a, b) => b.commits - a.commits),
  activity: Object.entries(byDay)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, pushes]) => ({ date, pushes })),
  recent,
}

// Counts may legitimately shrink when repositories become private or archived.
// Failed per-repository requests retain their known data, marked as cached;
// a successfully refreshed calendar must not remain stuck behind an old total.

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`)

console.log(
  `\nWrote ${OUT}\n` +
    `  ${snapshot.totals.commits} commits across ${snapshot.totals.repos} repos\n` +
    `  top contributor in ${snapshot.totals.topContributorIn}\n` +
    `  ${snapshot.totals.recentPushes} public pushes in the event window` +
    (snapshot.partial
      ? '\n  (partial — some repository details were unavailable)'
      : ''),
)
