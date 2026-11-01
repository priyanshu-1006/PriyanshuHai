import test from 'node:test'
import assert from 'node:assert/strict'
import {
  calendarWeeks,
  contributionStreaks,
  refreshDue,
  snapshotStatus,
} from '../src/lib/githubActivity.js'
import { parsePublicCalendar } from '../scripts/lib/github-calendar.mjs'

const days = [
  { d: '2026-10-28', c: 1 },
  { d: '2026-10-29', c: 2 },
  { d: '2026-10-30', c: 1 },
  { d: '2026-10-31', c: 0 },
  { d: '2026-11-01', c: 7 },
  { d: '2026-11-02', c: 0 },
]

test('current streak allows an unfinished UTC day, but does not revive stale activity', () => {
  assert.deepEqual(
    contributionStreaks(days, new Date('2026-11-02T05:00:00Z')),
    { current: 1, longest: 3 },
  )
  assert.deepEqual(
    contributionStreaks(days, new Date('2026-11-03T05:00:00Z')),
    { current: 0, longest: 3 },
  )
  assert.deepEqual(
    contributionStreaks(
      [
        { d: '2026-10-30', c: 1 },
        { d: '2026-11-01', c: 2 },
      ],
      new Date('2026-11-01T12:00:00Z'),
    ),
    { current: 1, longest: 1 },
  )
})

test('calendar columns align dates with their actual UTC weekdays', () => {
  const weeks = calendarWeeks(days)
  assert.deepEqual(weeks[0].slice(0, 3), [null, null, null])
  assert.equal(weeks[0][3].d, '2026-10-28')
  assert.equal(weeks[1][0].d, '2026-11-01')
  assert.deepEqual(calendarWeeks([]), [])
})

test('daily commit guard follows the India date, including its midnight boundary', () => {
  const snapshot = { generatedAt: '2026-11-01T18:20:00Z' }
  assert.equal(refreshDue(snapshot, new Date('2026-11-01T18:29:59Z')), false)
  assert.equal(refreshDue(snapshot, new Date('2026-11-01T18:30:00Z')), true)
  assert.equal(refreshDue({}, new Date('2026-11-02T06:00:00Z')), true)
})

test('retained old calendar cannot be presented as freshly fetched repository data', () => {
  const snapshot = {
    generatedAt: '2026-11-02T05:00:00Z',
    calendar: { fetchedAt: '2026-08-22T21:00:00Z' },
  }
  assert.equal(
    snapshotStatus(snapshot, new Date('2026-11-02T06:00:00Z')).stale,
    true,
  )
  assert.equal(
    snapshotStatus(
      { generatedAt: '2026-11-02T05:00:00Z' },
      new Date('2026-11-02T06:00:00Z'),
    ).stale,
    false,
  )
})

const html = `<td data-date="2026-11-02" data-level="4" id="b"></td>
  <td id="a" data-level="0" data-date="2026-11-01"></td>
  <tool-tip for="b">1,234 contributions on November 2nd.</tool-tip>
  <tool-tip for="a">No contributions on November 1st.</tool-tip>`

test('public calendar reads exact tooltip counts, sorts row-oriented markup, and leaves unavailable metrics unknown', () => {
  const cal = parsePublicCalendar(html, {
    minimumDays: 2,
    fetchedAt: '2026-11-02T06:00:00Z',
  })
  assert.deepEqual(cal.days, [
    { d: '2026-11-01', c: 0 },
    { d: '2026-11-02', c: 1234 },
  ])
  assert.equal(cal.total, 1234)
  assert.equal(cal.activeDays, 1)
  assert.equal(cal.private, null)
  assert.equal(cal.source, 'github-public-profile')
})

test('missing counts or changed markup fail instead of inventing zeroes', () => {
  assert.throws(() => parsePublicCalendar(html), /incomplete calendar/)
  assert.throws(
    () =>
      parsePublicCalendar(
        html.replace('1,234 contributions', 'New tooltip format'),
        { minimumDays: 2 },
      ),
    /format changed/,
  )
  assert.throws(
    () =>
      parsePublicCalendar(html.replace('2026-11-02', '2026-11-03'), {
        minimumDays: 2,
      }),
    /date gap/,
  )
})
