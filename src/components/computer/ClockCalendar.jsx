import { useEffect, useRef, useState } from 'react'
import {
  calendarEvents,
  calendarMonth,
  eventsForDay,
  indiaDateParts,
} from '../../data/calendarEvents'
import SystemIcon from './SystemIcon'

const monthLabel = (year, month) =>
  new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
const shortDate = (event) =>
  new Date(
    Date.UTC(event.year || 2000, event.month - 1, event.day),
  ).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(event.year ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  })

export default function ClockCalendar() {
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const today = indiaDateParts(now)
  const [selected, setSelected] = useState(() => indiaDateParts(now))
  const wrapper = useRef(null)
  const toggle = useRef(null)
  const heading = useRef(null)
  const body = useRef(null)
  const selectedEvents = eventsForDay(
    selected.year,
    selected.month,
    selected.day,
  )

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), open ? 1000 : 30000)
    return () => clearInterval(timer)
  }, [open])

  useEffect(() => {
    if (!open) return
    heading.current?.focus({ preventScroll: true })
    const dismiss = (event) => {
      if (!wrapper.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [open])

  const moveMonth = (direction) => {
    const date = new Date(
      Date.UTC(selected.year, selected.month - 1 + direction, 1),
    )
    setSelected({
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: 1,
    })
  }
  const resetToday = () => setSelected(today)

  return (
    <div
      className="os-clock-calendar"
      ref={wrapper}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          event.stopPropagation()
          setOpen(false)
          toggle.current?.focus()
        }
      }}
    >
      <button
        ref={toggle}
        className="os-calendar-toggle"
        aria-label="Open calendar and clock"
        aria-expanded={open}
        aria-controls="desktop-calendar"
        onClick={() => {
          if (!open) resetToday()
          setOpen((value) => !value)
        }}
        title="Calendar & clock · India standard time"
      >
        <SystemIcon name="calendar" />
        <time dateTime={now.toISOString()}>
          <span>
            {now.toLocaleTimeString('en-IN', {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
            <small> IST</small>
          </span>
          <span className="os-taskbar-date">
            {now.toLocaleDateString('en-GB', {
              timeZone: 'Asia/Kolkata',
              day: '2-digit',
              month: 'short',
            })}
          </span>
        </time>
      </button>
      {open && (
        <section
          id="desktop-calendar"
          className="os-calendar-panel"
          role="dialog"
          aria-label="Calendar and clock"
          aria-modal="false"
        >
          <header className="os-calendar-titlebar">
            <span>
              <SystemIcon name="calendar" /> Date & time
            </span>
            <button
              aria-label="Close calendar"
              onClick={() => {
                setOpen(false)
                toggle.current?.focus()
              }}
            >
              <SystemIcon name="close" />
            </button>
          </header>
          <div className="os-calendar-body" ref={body}>
            <div className="os-calendar-time">
              <div>
                <small>INDIA STANDARD TIME</small>
                <strong>
                  {now.toLocaleTimeString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })}
                </strong>
              </div>
              <button className="os-calendar-today" onClick={resetToday}>
                Today ↗
              </button>
            </div>
            <p className="os-calendar-today-label">
              {now.toLocaleDateString('en-GB', {
                timeZone: 'Asia/Kolkata',
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <div className="os-calendar-navigation">
              <button aria-label="Previous month" onClick={() => moveMonth(-1)}>
                ‹
              </button>
              <h2 tabIndex={-1} ref={heading} aria-live="polite">
                {monthLabel(selected.year, selected.month)}
              </h2>
              <button aria-label="Next month" onClick={() => moveMonth(1)}>
                ›
              </button>
            </div>
            <div className="os-calendar-weekdays" aria-hidden="true">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <span key={index}>{day}</span>
              ))}
            </div>
            <div
              className="os-calendar-days"
              aria-label={monthLabel(selected.year, selected.month)}
            >
              {calendarMonth(selected.year, selected.month).map(
                (day, index) => {
                  if (!day) return <span key={`blank-${index}`} />
                  const events = eventsForDay(
                    selected.year,
                    selected.month,
                    day,
                  )
                  const isToday =
                    day === today.day &&
                    selected.month === today.month &&
                    selected.year === today.year
                  return (
                    <button
                      key={day}
                      aria-label={`${day} ${monthLabel(selected.year, selected.month)}${events.length ? `: ${events.map((event) => event.title).join(', ')}` : ''}`}
                      aria-pressed={selected.day === day}
                      aria-current={isToday ? 'date' : undefined}
                      className={`${isToday ? 'is-today' : ''} ${events.length ? 'has-event' : ''}`}
                      onClick={() => setSelected({ ...selected, day })}
                    >
                      {day}
                      {events.length > 0 && <i className={events[0].kind} />}
                    </button>
                  )
                },
              )}
            </div>
            <div className="os-calendar-selected" aria-live="polite">
              <small>
                {selected.day} {monthLabel(selected.year, selected.month)}
              </small>
              {selectedEvents.length ? (
                selectedEvents.map((event) => (
                  <div key={event.id}>
                    <strong>{event.title}</strong>
                    <p>{event.note}</p>
                  </div>
                ))
              ) : (
                <p>A little space for the next good memory.</p>
              )}
            </div>
            <div className="os-calendar-memories">
              <h3>
                Dates to remember <span>{calendarEvents.length}</span>
              </h3>
              {calendarEvents
                .toSorted((a, b) => a.month - b.month || a.day - b.day)
                .map((event) => (
                  <button
                    key={event.id}
                    className={event.kind}
                    onClick={() => {
                      setSelected({
                        year: event.year || today.year,
                        month: event.month,
                        day: event.day,
                      })
                      body.current?.scrollTo({ top: 0, behavior: 'instant' })
                      heading.current?.focus({ preventScroll: true })
                    }}
                  >
                    <span className="os-calendar-event-mark" aria-hidden="true">
                      {event.kind === 'milestone' ? '★' : '✦'}
                    </span>
                    <span>
                      <strong>{event.title}</strong>
                      <small>
                        {event.year ? 'Milestone · ' : 'Every year · '}
                        {shortDate(event)}
                      </small>
                    </span>
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
            </div>
            <p className="os-calendar-footnote">
              A few important days in my story.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
