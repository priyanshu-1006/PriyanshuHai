import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeCommitHistory } from '../scripts/lib/github-history.mjs'
import {
  calendarDayKey,
  indexCommitHistory,
} from '../src/lib/githubActivity.js'
import {
  assertDataOnlyChanges,
  assertPortfolioOrigin,
  needsDailyRefresh,
} from '../scripts/refresh-github-local.mjs'

const sha = 'a'.repeat(40)
const item = {
  sha,
  repository: {
    name: 'PriyanshuHai',
    full_name: 'priyanshu-1006/PriyanshuHai',
  },
  commit: {
    message: 'Build calendar\n\nMore details',
    author: { date: '2026-11-01T20:00:00Z' },
    committer: { date: '2026-11-01T20:01:00Z' },
  },
}

test('public history preserves genuine commit identities, removes duplicates and rejects incomplete records', () => {
  const commits = normalizeCommitHistory([
    item,
    item,
    { ...item, sha: 'invalid' },
  ])
  assert.equal(commits.length, 1)
  assert.equal(commits[0].message, 'Build calendar')
  assert.equal(commits[0].shortSha, 'aaaaaaa')
  assert.equal(
    commits[0].url,
    `https://github.com/priyanshu-1006/PriyanshuHai/commit/${sha}`,
  )
  assert.equal(commits[0].automated, false)
  assert.equal(
    normalizeCommitHistory([
      {
        ...item,
        commit: {
          ...item.commit,
          message: 'chore: refresh GitHub activity (2026-11-02)',
        },
      },
    ])[0].automated,
    true,
  )
})

test('the India calendar places a UTC evening commit on the following India date', () => {
  const commits = normalizeCommitHistory([item])
  const index = indexCommitHistory(commits)
  assert.equal(
    index.get(calendarDayKey({ year: 2026, month: 11, day: 2 })).length,
    1,
  )
  assert.equal(index.has('2026-11-01'), false)
})

test('local publisher only accepts the intended repository and generated snapshot', () => {
  assert.doesNotThrow(() =>
    assertPortfolioOrigin('https://github.com/priyanshu-1006/PriyanshuHai.git'),
  )
  assert.doesNotThrow(() =>
    assertPortfolioOrigin('git@github.com:priyanshu-1006/PriyanshuHai.git'),
  )
  assert.throws(() =>
    assertPortfolioOrigin('https://github.com/someone/other.git'),
  )
  assert.doesNotThrow(() => assertDataOnlyChanges(['src/data/github.json']))
  assert.throws(() =>
    assertDataOnlyChanges(['src/data/github.json', 'src/App.jsx']),
  )
  assert.throws(() => assertDataOnlyChanges(['.env.local']))
  assert.throws(() => assertDataOnlyChanges([]))
})

test('a daily automation commit blocks another one even when a snapshot is old', () => {
  const now = new Date('2026-11-02T05:47:00Z')
  assert.equal(
    needsDailyRefresh(
      { generatedAt: '2026-08-22T00:00:00Z' },
      '2026-11-02T03:00:00Z',
      now,
    ),
    false,
  )
  assert.equal(
    needsDailyRefresh(
      { generatedAt: '2026-11-02T03:00:00Z', history: { commits: [] } },
      '',
      now,
    ),
    false,
  )
  assert.equal(
    needsDailyRefresh({ generatedAt: '2026-11-02T03:00:00Z' }, '', now),
    true,
  )
  assert.equal(
    needsDailyRefresh(
      { generatedAt: '2026-11-01T03:00:00Z', history: { commits: [] } },
      '2026-11-01T03:00:00Z',
      now,
    ),
    true,
  )
})
