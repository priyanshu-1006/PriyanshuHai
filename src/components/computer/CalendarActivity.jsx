import { useMemo, useState } from 'react'
import gh from '../../data/github.json'
import {
  calendarDayKey,
  calendarWeeks,
  contributionStreaks,
  indexCommitHistory,
} from '../../lib/githubActivity'

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
  })
const levels = ['#dfe4ec', '#b6c5d9', '#859ebf', '#57769e', '#2f4b70']
const level = (count) =>
  count === 0 ? 0 : count < 4 ? 1 : count < 10 ? 2 : count < 20 ? 3 : 4

export default function CalendarActivity({ selected }) {
  const [view, setView] = useState('day')
  const [limit, setLimit] = useState(6)
  const commits = gh.history?.commits || []
  const index = useMemo(() => indexCommitHistory(commits), [commits])
  const weeks = useMemo(() => calendarWeeks(gh.calendar?.days), [])
  const streak = contributionStreaks(gh.calendar?.days)
  const dayCommits = index.get(calendarDayKey(selected)) || []
  const rows = view === 'day' ? dayCommits : commits
  const selectedDate = `${selected.day}/${selected.month}/${selected.year}`

  return (
    <section
      className="os-calendar-activity"
      aria-label="GitHub commit history"
    >
      <div className="os-calendar-activity-heading">
        <div>
          <img src="/svg/GitHub.svg" alt="" />
          <h3>The build log</h3>
        </div>
        <a href={gh.user.url} target="_blank" rel="noreferrer noopener">
          GitHub ↗
        </a>
      </div>
      <div className="os-calendar-git-stats">
        <span>
          <strong>{(gh.calendar?.total || 0).toLocaleString()}</strong>
          contributions
        </span>
        <span>
          <strong>{streak.current} days</strong>current streak
        </span>
        <span>
          <strong>{streak.longest} days</strong>longest streak
        </span>
      </div>
      {weeks.length > 0 && (
        <div
          className="os-calendar-git-year"
          role="img"
          aria-label={`${gh.calendar.total} GitHub contributions in the last year. Calendar dates use UTC.`}
        >
          {weeks.map((week) => (
            <div key={week.find(Boolean).d}>
              {week.map((day, cell) => (
                <span
                  key={day?.d || cell}
                  style={{
                    background: day ? levels[level(day.c)] : 'transparent',
                  }}
                  title={
                    day ? `${day.d} · ${day.c} contributions · UTC` : undefined
                  }
                />
              ))}
            </div>
          ))}
        </div>
      )}
      <p className="os-calendar-git-note">
        A year of contributions · GitHub dates in UTC
      </p>
      <div className="os-calendar-history-toolbar">
        <h4>Commit history</h4>
        <div role="group" aria-label="Commit history filter">
          <button
            aria-pressed={view === 'day'}
            onClick={() => {
              setView('day')
              setLimit(6)
            }}
          >
            Selected day
          </button>
          <button
            aria-pressed={view === 'latest'}
            onClick={() => {
              setView('latest')
              setLimit(6)
            }}
          >
            Latest
          </button>
        </div>
      </div>
      <p className="os-calendar-history-caption">
        {view === 'day'
          ? `${selectedDate} · ${dayCommits.length} indexed public commit${dayCommits.length === 1 ? '' : 's'}`
          : `Latest ${Math.min(limit, rows.length)} of ${rows.length} indexed public commits`}{' '}
        · IST
      </p>
      {rows.length > 0 ? (
        <div className="os-calendar-history-table-scroll">
          <table className="os-calendar-history-table">
            <caption className="sr-only">
              Public commit history for{' '}
              {view === 'day' ? selectedDate : 'recent activity'}, times in
              India standard time
            </caption>
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Commit / repository</th>
                <th scope="col">Code</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, limit).map((commit) => (
                <tr key={`${commit.repository}:${commit.sha}`}>
                  <td>
                    <time dateTime={commit.authoredAt}>
                      {view === 'latest' && (
                        <small>{formatDate(commit.authoredAt)}</small>
                      )}
                      {new Date(commit.authoredAt).toLocaleTimeString('en-GB', {
                        timeZone: 'Asia/Kolkata',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </time>
                  </td>
                  <td>
                    <span
                      className="os-calendar-commit-message"
                      title={commit.message}
                    >
                      {commit.message}
                    </span>
                    <small>{commit.repository}</small>
                    {commit.automated && (
                      <span className="os-calendar-auto-tag">
                        Scheduled refresh
                      </span>
                    )}
                  </td>
                  <td>
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Open commit ${commit.shortSha} in ${commit.repository}`}
                    >
                      {commit.shortSha} ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="os-calendar-history-empty">
          <strong>
            {commits.length
              ? 'No indexed public commits for this day.'
              : 'Commit history is waiting for its first refresh.'}
          </strong>
          <p>
            Private work and other contribution types can still appear in the
            calendar. Choose Latest to explore the saved public history.
          </p>
        </div>
      )}
      {rows.length > limit && (
        <button
          className="os-calendar-history-more"
          onClick={() => setLimit((count) => count + 10)}
        >
          Show {Math.min(10, rows.length - limit)} more commits ↓
        </button>
      )}
      <p className="os-calendar-git-note">
        {gh.history?.fetchedAt
          ? `History checked ${formatDate(gh.history.fetchedAt)} · recent public search results`
          : 'History refresh pending'}
        {gh.history?.incomplete ? ' · saved data' : ''}
      </p>
    </section>
  )
}
