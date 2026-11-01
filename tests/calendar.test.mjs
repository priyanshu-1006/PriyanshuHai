import test from 'node:test'
import assert from 'node:assert/strict'
import {
  calendarEvents,
  eventsForDay,
  indiaDateParts,
  calendarMonth,
} from '../src/data/calendarEvents.js'

test('the five birthdays recur without invented birth years', () => {
  const expected = [
    [6, 10, 'birthday-priyanshu'],
    [10, 17, 'birthday-rakshita'],
    [8, 8, 'birthday-mother'],
    [5, 3, 'birthday-father'],
    [3, 13, 'birthday-sister'],
  ]
  assert.equal(
    calendarEvents.filter((event) => event.kind === 'birthday').length,
    5,
  )
  for (const [month, day, id] of expected) {
    assert.equal(eventsForDay(2026, month, day)[0].id, id)
    assert.equal(eventsForDay(2027, month, day)[0].id, id)
    assert.equal(
      calendarEvents.find((event) => event.id === id).year,
      undefined,
    )
  }
})

test('Techfest win is a dated milestone, not an annual win', () => {
  assert.equal(eventsForDay(2025, 12, 21)[0].id, 'techfest-win')
  assert.deepEqual(eventsForDay(2026, 12, 21), [])
})

test('calendar follows IST across UTC midnight and lays out leap years correctly', () => {
  assert.deepEqual(indiaDateParts(new Date('2025-12-20T19:00:00Z')), {
    day: 21,
    month: 12,
    year: 2025,
  })
  const february = calendarMonth(2028, 2)
  assert.equal(february.at(-1), 29)
  assert.equal(
    february.findIndex((day) => day === 1),
    1,
  )
  assert.equal(
    calendarMonth(2026, 11).findIndex((day) => day === 1),
    6,
  )
})
