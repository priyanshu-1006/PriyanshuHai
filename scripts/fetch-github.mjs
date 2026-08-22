/**
 * Snapshots public GitHub activity into src/data/github.json at build time.
 *
 * Deliberately a build step rather than a client fetch. The unauthenticated
 * REST API allows 60 requests an hour *per IP* — on a live site that budget is
 * shared across every visitor, so the third person to open the page would see
 * an empty panel. Baking the data in means the site makes zero API calls, ships
 * no token, and renders identically for everyone.
 *
 *   node scripts/fetch-github.mjs
 *   GITHUB_TOKEN=ghp_xxx node scripts/fetch-github.mjs   # 5000/hr instead of 60
 *
 * The script never throws on a network or rate-limit failure: it keeps whatever
 * it managed to collect and leaves the previous snapshot in place otherwise, so
 * a flaky build machine cannot break the site.
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const USER = process.env.GITHUB_USER || 'priyanshu-1006'
const TOKEN = process.env.GITHUB_TOKEN || ''
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/github.json')

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': `${USER}-portfolio-build`,
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
}

let budgetExhausted = false

async function api(path, { search = false } = {}) {
  if (budgetExhausted) return null
  const url = path.startsWith('http') ? path : `https://api.github.com${path}`
  try {
    const res = await fetch(url, { headers })
    if (res.status === 403 || res.status === 429) {
      const remaining = res.headers.get('x-ratelimit-remaining')
      if (remaining === '0') {
        console.warn(`  ! rate limit reached${search ? ' (search)' : ''} — keeping partial data`)
        if (!search) budgetExhausted = true
      }
      return null
    }
    if (!res.ok) {
      console.warn(`  ! ${res.status} ${path}`)
      return null
    }
    // 204 on an empty repository's contributor list — no body to parse.
    if (res.status === 204) return null
    const text = await res.text()
    return text ? JSON.parse(text) : null
  } catch (err) {
    console.warn(`  ! ${path}: ${err.message}`)
    return null
  }
}

/* ── Profile ─────────────────────────────────────────────────────────────── */
console.log(`Fetching GitHub data for ${USER}${TOKEN ? ' (authenticated)' : ' (anonymous, 60/hr)'}`)
const profile = await api(`/users/${USER}`)
if (!profile) {
  console.error('Could not reach the GitHub API. Leaving the existing snapshot alone.')
  process.exit(0)
}

/* ── Owned repositories ──────────────────────────────────────────────────── */
const owned = []
for (let page = 1; page <= 4; page++) {
  const batch = await api(`/users/${USER}/repos?per_page=100&page=${page}&sort=pushed`)
  if (!batch || batch.length === 0) break
  owned.push(...batch)
  if (batch.length < 100) break
}
console.log(`  ${owned.length} repositories`)

const sourceRepos = owned
  .filter((r) => !r.fork && !r.archived)
  .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))

/* ── Contributor breakdown ───────────────────────────────────────────────── *
 * One request per repo, so this is where the anonymous budget goes. Repos are
 * already sorted by most recently pushed, which is the order that matters if
 * the budget runs out partway through.                                       */
const contributions = []
for (const repo of sourceRepos) {
  const list = await api(`/repos/${repo.full_name}/contributors?per_page=100&anon=0`)
  if (!list || !Array.isArray(list)) continue

  const total = list.reduce((a, c) => a + (c.contributions || 0), 0)
  const mine = list.find((c) => c.login?.toLowerCase() === USER.toLowerCase())
  if (!mine) continue

  const rank = list.findIndex((c) => c.login?.toLowerCase() === USER.toLowerCase()) + 1
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
  })
}
console.log(`  ${contributions.length} repositories with attributed commits`)

/* ── External contributions ──────────────────────────────────────────────── *
 * Repos he committed to but does not own do not appear in /users/:u/repos.
 * The commit search is the only public way to surface them.                  */
const external = new Map()
const found = await api(
  `/search/commits?q=author:${USER}&per_page=100&sort=author-date&order=desc`,
  { search: true },
)
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
if (external.size) console.log(`  ${external.size} external repositories`)

/* ── Recent public activity ──────────────────────────────────────────────── *
 * The events feed covers roughly the last 90 days. It is the only commit
 * history available without a token; the contribution graph itself is
 * GraphQL-only.                                                              */
const byDay = {}
let pushes = 0
const events = []
for (let page = 1; page <= 3; page++) {
  const batch = await api(`/users/${USER}/events/public?per_page=100&page=${page}`)
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

const recent = events
  .filter((e) => ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'ReleaseEvent'].includes(e.type))
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
 * The green-squares graph and the true contribution totals — including private
 * work, as a count without detail — exist only in GraphQL, which requires a
 * token. Without one this block is skipped and the panel falls back to the
 * REST-derived numbers, so the site builds either way.                        */
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
    })
    const json = await res.json()
    const cc = json?.data?.user?.contributionsCollection
    if (cc) {
      const days = cc.contributionCalendar.weeks.flatMap((w) => w.contributionDays)
      calendar = {
        total: cc.contributionCalendar.totalContributions,
        commits: cc.totalCommitContributions,
        pullRequests: cc.totalPullRequestContributions,
        issues: cc.totalIssueContributions,
        reviews: cc.totalPullRequestReviewContributions,
        private: cc.restrictedContributionsCount,
        activeDays: days.filter((d) => d.contributionCount > 0).length,
        busiestDay: days.reduce((a, d) => (d.contributionCount > (a?.contributionCount ?? -1) ? d : a), null),
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
  console.log('  (no GITHUB_TOKEN — skipping the contribution calendar)')
}

/* ── Totals ──────────────────────────────────────────────────────────────── */
const languages = {}
for (const c of contributions) {
  if (c.language) languages[c.language] = (languages[c.language] || 0) + c.commits
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  partial: budgetExhausted,
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

/* Never replace a good snapshot with a worse one.
 *
 * A rate-limited run stops partway through the contributor loop, so it does not
 * come back empty — it comes back *short*. Comparing against zero let a partial
 * run of 5 repos overwrite a complete one of 18. Compare against what is
 * already on disk instead. */
if (existsSync(OUT)) {
  try {
    const prev = JSON.parse(readFileSync(OUT, 'utf8'))
    const prevCount = prev.contributions?.length || 0
    if (!snapshot.calendar && prev.calendar) {
      snapshot.calendar = prev.calendar
      console.warn('  ! no calendar this run — carrying the previous one forward')
    }
    if (prevCount > snapshot.contributions.length) {
      console.warn(
        `  ! this run collected ${snapshot.contributions.length} repos but the existing ` +
          `snapshot has ${prevCount} — keeping the existing one. Re-run when the rate ` +
          `limit resets, or set GITHUB_TOKEN.`,
      )
      process.exit(0)
    }
  } catch {
    /* unreadable snapshot — overwrite it */
  }
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`)

console.log(
  `\nWrote ${OUT}\n` +
    `  ${snapshot.totals.commits} commits across ${snapshot.totals.repos} repos\n` +
    `  top contributor in ${snapshot.totals.topContributorIn}\n` +
    `  ${snapshot.totals.recentPushes} public pushes in the event window` +
    (snapshot.partial ? '\n  (partial — rate limited)' : ''),
)
