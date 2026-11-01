const DAY = 86400000
const utcDay = (date) => new Date(date).toISOString().slice(0, 10)

export function calendarWeeks(days = []) {
  if (!days.length) return []
  const sorted = [...days].sort((a, b) => a.d.localeCompare(b.d))
  const cells = [
    ...Array(new Date(`${sorted[0].d}T00:00:00Z`).getUTCDay()).fill(null),
    ...sorted,
  ]
  const weeks = []
  for (let index = 0; index < cells.length; index += 7)
    weeks.push(cells.slice(index, index + 7))
  return weeks
}

export function contributionStreaks(days = [], now = new Date()) {
  const active = new Set(days.filter((day) => day.c > 0).map((day) => day.d))
  let longest = 0
  let run = 0
  let previous = null
  for (const day of [...days].sort((a, b) => a.d.localeCompare(b.d))) {
    const date = Date.parse(`${day.d}T00:00:00Z`)
    run = day.c > 0 ? (previous === date - DAY ? run : 0) + 1 : 0
    longest = Math.max(longest, run)
    previous = date
  }
  // An unfinished UTC day does not break yesterday's streak.
  let cursor = Date.parse(`${utcDay(now)}T00:00:00Z`)
  if (!active.has(utcDay(cursor))) cursor -= DAY
  let current = 0
  while (active.has(utcDay(cursor))) {
    current++
    cursor -= DAY
  }
  return { current, longest }
}

export function refreshDue(snapshot, now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const previous = new Date(snapshot?.generatedAt)
  return (
    !Number.isFinite(previous.getTime()) ||
    formatter.format(previous) !== formatter.format(now)
  )
}

export function snapshotStatus(snapshot, now = new Date()) {
  const updatedAt = snapshot?.calendar?.fetchedAt || snapshot?.generatedAt
  const age = (now.getTime() - new Date(updatedAt).getTime()) / DAY
  return { updatedAt, stale: !Number.isFinite(age) || age > 2 }
}
