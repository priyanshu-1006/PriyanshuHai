// Birthdays recur every year. Milestones retain their original year.
export const calendarEvents = [
  {
    id: 'birthday-priyanshu',
    month: 6,
    day: 10,
    title: 'Priyanshu’s birthday',
    kind: 'birthday',
    note: 'Another trip around the sun. Keep building.',
  },
  {
    id: 'birthday-rakshita',
    month: 10,
    day: 17,
    title: 'Rakshita’s birthday',
    kind: 'birthday',
    note: 'A day for someone special.',
  },
  {
    id: 'birthday-mother',
    month: 8,
    day: 8,
    title: 'Mother’s birthday',
    kind: 'birthday',
    note: 'For the person who has always been there.',
  },
  {
    id: 'birthday-father',
    month: 5,
    day: 3,
    title: 'Father’s birthday',
    kind: 'birthday',
    note: 'A little gratitude, and a lot of love.',
  },
  {
    id: 'birthday-sister',
    month: 3,
    day: 13,
    title: 'Sister’s birthday',
    kind: 'birthday',
    note: 'Family, laughter, and another year of memories.',
  },
  {
    id: 'techfest-win',
    year: 2025,
    month: 12,
    day: 21,
    title: 'Won at IIT Bombay Techfest',
    kind: 'milestone',
    note: '21 December 2025. A win to remember.',
  },
]

export function eventsForDay(year, month, day) {
  return calendarEvents.filter(
    (event) =>
      event.month === month &&
      event.day === day &&
      (!event.year || event.year === year),
  )
}

export function indiaDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date)
  return Object.fromEntries(
    parts
      .filter(({ type }) => ['year', 'month', 'day'].includes(type))
      .map(({ type, value }) => [type, Number(value)]),
  )
}

export function calendarMonth(year, month) {
  const first = new Date(Date.UTC(year, month - 1, 1))
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const offset = (first.getUTCDay() + 6) % 7
  return [
    ...Array(offset).fill(null),
    ...Array.from({ length: days }, (_, index) => index + 1),
  ]
}
