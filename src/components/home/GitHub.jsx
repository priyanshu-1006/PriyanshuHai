import { useMemo, useRef, useState } from 'react'
import gh from '../../data/github.json'
import { useReveal } from '../../lib/useReveal'
import {
  calendarWeeks,
  contributionStreaks,
  snapshotStatus,
} from '../../lib/githubActivity'

/** Saved GitHub activity, refreshed daily without browser-side API credentials. */

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

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** Exact daily counts from GitHub, aligned to Sunday-first UTC weeks. */
function Heatmap({ cal }) {
  const days = useMemo(
    () => [...cal.days].sort((a, b) => a.d.localeCompare(b.d)),
    [cal.days],
  )
  const weeks = useMemo(() => calendarWeeks(days), [days])
  const [selected, setSelected] = useState(days.at(-1)?.d)
  const calendar = useRef(null)
  const inspected = days.find((day) => day.d === selected) || days.at(-1)

  // Label a column when its first day starts a month the previous column did not.
  const labels = useMemo(() => {
    const out = []
    let last = -1
    weeks.forEach((w, i) => {
      const m = new Date(w.find(Boolean).d).getUTCMonth()
      if (m !== last) {
        out.push({ i, label: MONTHS[m] })
        last = m
      }
    })
    return out
  }, [weeks])

  return (
    <div className="github-calendar">
      <div
        className="github-calendar-scroll"
        ref={calendar}
        role="group"
        aria-label="Daily GitHub contributions"
      >
        <div className="github-calendar-inner">
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

          <div className="github-calendar-weeks">
            {weeks.map((w) => (
              <div key={w.find(Boolean).d} className="github-calendar-week">
                {w.map((d, index) =>
                  d ? (
                    <button
                      key={d.d}
                      type="button"
                      className="github-calendar-day"
                      data-date={d.d}
                      aria-label={`${d.c} contribution${d.c === 1 ? '' : 's'} on ${fmtDate(d.d)}`}
                      aria-pressed={d.d === selected}
                      tabIndex={d.d === selected ? 0 : -1}
                      style={{ background: stepFor(d.c).bg }}
                      title={`${d.c} contribution${d.c === 1 ? '' : 's'} on ${d.d}`}
                      onMouseEnter={() => setSelected(d.d)}
                      onFocus={() => setSelected(d.d)}
                      onClick={() => setSelected(d.d)}
                      onKeyDown={(event) => {
                        const moves = {
                          ArrowLeft: -7,
                          ArrowRight: 7,
                          ArrowUp: -1,
                          ArrowDown: 1,
                        }
                        if (
                          !(event.key in moves) &&
                          !['Home', 'End'].includes(event.key)
                        )
                          return
                        event.preventDefault()
                        const nextIndex =
                          event.key === 'Home'
                            ? 0
                            : event.key === 'End'
                              ? days.length - 1
                              : Math.max(
                                  0,
                                  Math.min(
                                    days.length - 1,
                                    days.findIndex((day) => day.d === d.d) +
                                      moves[event.key],
                                  ),
                                )
                        calendar.current
                          ?.querySelector(`[data-date="${days[nextIndex].d}"]`)
                          ?.focus()
                      }}
                    />
                  ) : (
                    <span
                      className="github-calendar-day is-empty"
                      key={`empty-${index}`}
                    />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="github-calendar-inspection" aria-live="polite">
        <span>
          <strong>{inspected?.c.toLocaleString() || '0'}</strong> contribution
          {inspected?.c === 1 ? '' : 's'} on {inspected && fmtDate(inspected.d)}
        </span>
        <span>Hover a day · use arrow keys when focused</span>
      </div>
    </div>
  )
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

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
                  background:
                    'color-mix(in oklab, var(--c-accent) 16%, transparent)',
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
          {r.external ? (
            <p className="t-mono text-ink3">
              {r.commits} indexed commits
              <br />
              Recent public commit search
            </p>
          ) : (
            <>
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
            </>
          )}
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
    if (filter === 'team')
      return all.filter((r) => r.external || r.contributors > 1)
    return all
  }, [all, filter])

  const shown = expanded ? rows : rows.slice(0, 8)

  const langTotal = (gh.languages || []).reduce((a, l) => a + l.commits, 0)

  const cal = gh.calendar
  const streak = contributionStreaks(cal?.days)
  const status = snapshotStatus(gh)
  const stats = cal
    ? [
        { v: cal.total.toLocaleString(), l: 'Contributions in the last year' },
        { v: `${streak.current} days`, l: 'Current contribution streak · UTC' },
        { v: `${streak.longest} days`, l: 'Longest streak in this calendar' },
        {
          v: `${cal.activeDays}/${cal.days.length}`,
          l: 'Days with a contribution',
        },
      ]
    : [
        {
          v: gh.totals.commits.toLocaleString(),
          l: 'Commits attributed across public repos',
        },
        {
          v: gh.totals.topContributorIn,
          l: 'Repos where I am the top contributor',
        },
        {
          v: gh.totals.repos + gh.totals.externalRepos,
          l: 'Repos with commits of mine in them',
        },
        { v: gh.user.publicRepos, l: 'Public repositories' },
      ]

  return (
    <section
      id="github"
      className="github-activity-section scroll-mt-24 py-20 md:py-24"
    >
      <div className="shell">
        <div ref={headRef} className="reveal">
          <p className="t-label mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-7 bg-accent" />
            GitHub / The build log
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="t-h1 max-w-2xl text-ink">The work, day by day.</h2>
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
            A daily snapshot of my GitHub calendar and public repositories.
            Contributions, active days, and the projects behind the record —
            straight from GitHub.
          </p>
          <div
            className={`github-snapshot-status ${status.stale ? 'is-stale' : ''}`}
          >
            <span>
              <i />
              {status.stale ? 'Saved snapshot' : 'Daily snapshot'}
            </span>
            <time dateTime={status.updatedAt}>
              Updated{' '}
              {new Date(status.updatedAt).toLocaleString('en-GB', {
                timeZone: 'Asia/Kolkata',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}{' '}
              IST
            </time>
            {status.stale && (
              <a href={gh.user.url} target="_blank" rel="noreferrer noopener">
                See latest on GitHub ↗
              </a>
            )}
          </div>
        </div>

        {/* ── Totals ── */}
        <div className="github-summary-stats mt-12 grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="github-calendar-card mt-12 rounded-3xl border border-rule bg-bg2 p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <p className="t-label">
                {fmtDate(cal.days[0].d)} — {fmtDate(cal.days.at(-1).d)}
              </p>
              <p className="t-mono text-ink3">
                busiest day {cal.busiestDay?.contributionCount || 0} on{' '}
                {cal.busiestDay && fmtDate(cal.busiestDay.date)}
              </p>
            </div>

            <Heatmap cal={cal} />

            <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-rule pt-5">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {[
                  ['commit contributions', cal.commits],
                  ['private contributions', cal.private],
                  ['pull requests', cal.pullRequests],
                ]
                  .filter(([, n]) => Number.isFinite(n))
                  .map(([label, n]) => (
                    <li key={label} className="flex items-baseline gap-2">
                      <span className="font-display text-lg font-bold tabular-nums text-ink">
                        {n}
                      </span>
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
              The calendar follows GitHub’s visible contribution record,
              including anonymised private contributions when shared. Repository
              details below cover public work. Dates and streaks use UTC,
              matching GitHub’s calendar.
            </p>
          </div>
        )}

        {/* ── Languages, by commits ── */}
        {langTotal > 0 && (
          <div className="mt-10">
            <p className="t-label mb-3">
              Repository languages · weighted by attributed commits
            </p>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full">
              {gh.languages.map((l) => (
                <span
                  key={l.name}
                  className="h-full"
                  style={{
                    width: `${(l.commits / langTotal) * 100}%`,
                    background: langColor(l.name),
                  }}
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
                  <span className="t-mono text-ink3">
                    {Math.round((l.commits / langTotal) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Filter ── */}
        <div className="github-repository-summary">
          <span>{gh.totals.repos} public repositories indexed</span>
          <span>Top contributor in {gh.totals.topContributorIn}</span>
        </div>
        <div
          className="mt-12 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter repositories"
        >
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
                onClick={() => {
                  setFilter(f.key)
                  setExpanded(false)
                }}
                aria-pressed={on}
                className="rounded-full border px-3.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.1em] transition-colors"
                style={{
                  borderColor: on ? 'var(--c-accent)' : 'var(--c-rule)',
                  color: on ? 'var(--c-accent)' : 'var(--c-ink3)',
                  background: on
                    ? 'color-mix(in oklab, var(--c-accent) 10%, transparent)'
                    : 'transparent',
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
          Repository snapshot{' '}
          {new Date(gh.generatedAt).toLocaleDateString('en-GB', {
            timeZone: 'Asia/Kolkata',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}{' '}
          IST · Updated daily
          {gh.partial &&
            ' · some repository details use the last available snapshot'}
        </p>
      </div>
    </section>
  )
}
