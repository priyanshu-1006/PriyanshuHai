import { useMemo, useState } from 'react'
import gh from '../../data/github.json'
import { useReveal } from '../../lib/useReveal'

/**
 * Public commit record, snapshotted at build time by scripts/fetch-github.mjs.
 *
 * The claim worth making is not "I have repositories" — anyone has those. It is
 * *share*: how much of each codebase is actually his, and where that share is
 * the largest of anyone on the project. So every row carries the same bar,
 * drawn to his fraction of that repo's total commits, and the repos where he
 * leads are marked. A repo where he wrote 43 of 94 commits alongside three
 * other people says more than one where he wrote all 40 of 40 alone, and the
 * bar lets you see which is which without reading a number.
 */

/* GitHub's own language colours, for the languages actually present. */
const LANG = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  'C++': '#f34b7d',
  'Jupyter Notebook': '#da5b0b',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572a5',
  Java: '#b07219',
  Dart: '#00b4ab',
  Shell: '#89e051',
}
const langColor = (l) => LANG[l] || 'var(--c-rule2)'

const FILTERS = [
  { key: 'all', label: 'All repos' },
  { key: 'top', label: 'Top contributor' },
  { key: 'team', label: 'Team repos' },
]

/* Intensity ramp for the contribution graph. Deliberately not GitHub's green —
   a pasted-in widget in someone else's brand colour reads as an embed. */
const STEPS = [
  { min: 0, bg: 'var(--c-bg3)' },
  { min: 1, bg: 'color-mix(in oklab, var(--c-accent) 28%, var(--c-bg3))' },
  { min: 4, bg: 'color-mix(in oklab, var(--c-accent) 52%, var(--c-bg3))' },
  { min: 10, bg: 'color-mix(in oklab, var(--c-accent) 76%, var(--c-bg3))' },
  { min: 20, bg: 'var(--c-accent)' },
]
const stepFor = (n) => STEPS.reduce((a, s) => (n >= s.min ? s : a), STEPS[0])

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * A year of contributions, one column per week.
 *
 * The calendar comes from the GraphQL API, which is the only place the real
 * totals live — the REST endpoints see public commits only, and roughly two
 * thirds of this year's work was in private repositories.
 */
function Heatmap({ cal }) {
  const weeks = useMemo(() => {
    const out = []
    for (let i = 0; i < cal.days.length; i += 7) out.push(cal.days.slice(i, i + 7))
    return out
  }, [cal.days])

  // Label a column when its first day starts a month the previous column did not.
  const labels = useMemo(() => {
    const out = []
    let last = -1
    weeks.forEach((w, i) => {
      const m = new Date(w[0].d).getMonth()
      if (m !== last) {
        out.push({ i, label: MONTHS[m] })
        last = m
      }
    })
    return out
  }, [weeks])

  return (
    <div className="overflow-x-auto pb-1">
      <div className="min-w-[720px]">
        {/* month rail */}
        <div className="relative mb-1.5 h-3.5">
          {labels.map((l) => (
            <span
              key={`${l.i}-${l.label}`}
              className="absolute top-0 font-mono text-[10px] text-ink3"
              style={{ left: `${(l.i / weeks.length) * 100}%` }}
            >
              {l.label}
            </span>
          ))}
        </div>

        <div className="flex gap-[3px]">
          {weeks.map((w) => (
            <div key={w[0].d} className="flex flex-col gap-[3px]">
              {w.map((d) => (
                <span
                  key={d.d}
                  className="block h-[11px] w-[11px] rounded-[2px]"
                  style={{ background: stepFor(d.c).bg }}
                  title={`${d.c} contribution${d.c === 1 ? '' : 's'} on ${d.d}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function RepoRow({ r }) {
  const share = Math.round(r.share * 100)
  return (
    <li>
      <a
        href={r.url}
        target="_blank"
        rel="noreferrer noopener"
        className="group grid gap-x-6 gap-y-3 border-b border-rule py-4 transition-colors hover:bg-bg2/60 sm:grid-cols-[minmax(0,1fr)_180px_92px]"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h3 className="truncate font-mono text-[13.5px] text-ink transition-colors group-hover:text-accent">
              {r.external && <span className="text-ink3">{r.owner}/</span>}
              {r.name}
            </h3>
            {r.top && (
              <span
                className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.1em]"
                style={{
                  background: 'color-mix(in oklab, var(--c-accent) 16%, transparent)',
                  color: 'var(--c-accent)',
                }}
              >
                Top
              </span>
            )}
            {r.external && (
              <span className="shrink-0 rounded-full border border-rule2 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink3">
                Team
              </span>
            )}
          </div>
          {r.description && (
            <p className="mt-1.5 line-clamp-1 text-[13.5px] leading-snug text-ink3">
              {r.description}
            </p>
          )}
        </div>

        {/* share bar */}
        <div className="self-center">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg3">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max(share, 3)}%`,
                background: r.top ? 'var(--c-accent)' : 'var(--c-accent2)',
                transitionTimingFunction: 'var(--ease)',
              }}
            />
          </div>
          <p className="t-mono mt-1.5 text-ink3">
            {r.commits} of {r.totalCommits} commits
            {r.contributors > 1 && ` · ${r.contributors} contributors`}
          </p>
        </div>

        <div className="flex items-center gap-2 self-center sm:justify-end">
          {r.language && (
            <>
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: langColor(r.language) }}
                aria-hidden="true"
              />
              <span className="t-mono truncate text-ink3">{r.language}</span>
            </>
          )}
        </div>
      </a>
    </li>
  )
}

export default function GitHub() {
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(false)
  const headRef = useReveal()

  /* External repos come from commit search, which has no contributor counts —
     normalise them into the same shape so one row component renders both. */
  const all = useMemo(() => {
    const owned = gh.contributions || []
    const team = (gh.external || []).map((e) => ({
      ...e,
      totalCommits: e.commits,
      share: 1,
      rank: null,
      contributors: 0,
      top: false,
      language: null,
    }))
    return [...owned, ...team].sort((a, b) => b.commits - a.commits)
  }, [])

  const rows = useMemo(() => {
    if (filter === 'top') return all.filter((r) => r.top)
    if (filter === 'team') return all.filter((r) => r.external || r.contributors > 1)
    return all
  }, [all, filter])

  const shown = expanded ? rows : rows.slice(0, 8)

  const langTotal = (gh.languages || []).reduce((a, l) => a + l.commits, 0)

  const cal = gh.calendar
  const stats = cal
    ? [
        { v: cal.total.toLocaleString(), l: 'Contributions in the last year' },
        { v: `${cal.activeDays}/365`, l: 'Days with at least one contribution' },
        { v: gh.totals.topContributorIn, l: 'Repos where I am the top contributor' },
        { v: gh.totals.repos + gh.totals.externalRepos, l: 'Repos with commits of mine in them' },
      ]
    : [
        { v: gh.totals.commits.toLocaleString(), l: 'Commits attributed across public repos' },
        { v: gh.totals.topContributorIn, l: 'Repos where I am the top contributor' },
        { v: gh.totals.repos + gh.totals.externalRepos, l: 'Repos with commits of mine in them' },
        { v: gh.user.publicRepos, l: 'Public repositories' },
      ]

  return (
    <section id="github" className="scroll-mt-24 py-20 md:py-24">
      <div className="shell">
        <div ref={headRef} className="reveal">
          <p className="t-label mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-7 bg-accent" />
            Commit record
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="t-h1 max-w-2xl text-ink">What the git history says.</h2>
            <a
              href={gh.user.url}
              target="_blank"
              rel="noreferrer noopener"
              className="pill pill-ghost"
            >
              @{gh.user.login} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="t-lead mt-5 max-w-2xl">
            Pulled from the public GitHub API at build time — no cherry-picking, and no way for me
            to round anything up. Private and organisation work is not counted here, so this is a
            floor rather than a total.
          </p>
        </div>

        {/* ── Totals ── */}
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-bg2 p-6">
              <div className="font-display text-4xl font-black tracking-tight text-accent">
                {s.v}
              </div>
              <p className="mt-2.5 text-sm leading-snug text-ink2">{s.l}</p>
            </div>
          ))}
        </div>

        {/* ── A year of contributions ── */}
        {cal && (
          <div className="mt-12 rounded-3xl border border-rule bg-bg2 p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <p className="t-label">Last 12 months</p>
              <p className="t-mono text-ink3">
                busiest day {cal.busiestDay.contributionCount} on{' '}
                {fmtDate(cal.busiestDay.date)}
              </p>
            </div>

            <Heatmap cal={cal} />

            <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-rule pt-5">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {[
                  ['public commits', cal.commits],
                  ['private contributions', cal.private],
                  ['pull requests', cal.pullRequests],
                ].map(([label, n]) => (
                  <li key={label} className="flex items-baseline gap-2">
                    <span className="font-display text-lg font-bold tabular-nums text-ink">{n}</span>
                    <span className="t-mono text-ink3">{label}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2">
                <span className="t-mono text-ink3">less</span>
                {STEPS.map((s) => (
                  <span
                    key={s.min}
                    className="block h-[11px] w-[11px] rounded-[2px]"
                    style={{ background: s.bg }}
                    aria-hidden="true"
                  />
                ))}
                <span className="t-mono text-ink3">more</span>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-ink2">
              Private contributions are counted but not itemised — most of Nexsus, Gryork and
              Washtro lives in private repositories, which is why the public commit numbers below
              are a fraction of the total.
            </p>
          </div>
        )}

        {/* ── Languages, by commits ── */}
        {langTotal > 0 && (
          <div className="mt-10">
            <p className="t-label mb-3">Languages, weighted by commits</p>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full">
              {gh.languages.map((l) => (
                <span
                  key={l.name}
                  className="h-full"
                  style={{ width: `${(l.commits / langTotal) * 100}%`, background: langColor(l.name) }}
                  title={`${l.name} — ${l.commits} commits`}
                />
              ))}
            </div>
            <ul className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2">
              {gh.languages.map((l) => (
                <li key={l.name} className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: langColor(l.name) }}
                    aria-hidden="true"
                  />
                  <span className="t-mono text-ink2">{l.name}</span>
                  <span className="t-mono text-ink3">{Math.round((l.commits / langTotal) * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Filter ── */}
        <div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filter repositories">
          {FILTERS.map((f) => {
            const on = filter === f.key
            const n =
              f.key === 'all'
                ? all.length
                : f.key === 'top'
                  ? all.filter((r) => r.top).length
                  : all.filter((r) => r.external || r.contributors > 1).length
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => { setFilter(f.key); setExpanded(false) }}
                aria-pressed={on}
                className="rounded-full border px-3.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.1em] transition-colors"
                style={{
                  borderColor: on ? 'var(--c-accent)' : 'var(--c-rule)',
                  color: on ? 'var(--c-accent)' : 'var(--c-ink3)',
                  background: on ? 'color-mix(in oklab, var(--c-accent) 10%, transparent)' : 'transparent',
                }}
              >
                {f.label}
                <span className="ml-2 opacity-55">{n}</span>
              </button>
            )
          })}
        </div>

        {/* ── Repos ── */}
        <ul className="mt-6 border-t border-rule">
          {shown.map((r) => (
            <RepoRow key={r.full} r={r} />
          ))}
        </ul>

        {rows.length > 8 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-6 font-mono text-[12px] uppercase tracking-[0.12em] text-ink3 transition-colors hover:text-accent"
          >
            {expanded ? '− Show fewer' : `+ Show all ${rows.length}`}
          </button>
        )}

        <p className="t-mono mt-8 text-ink3">
          Snapshot taken {fmtDate(gh.generatedAt)}
          {gh.partial && ' · partial, rate limited at build time'}
        </p>
      </div>
    </section>
  )
}
