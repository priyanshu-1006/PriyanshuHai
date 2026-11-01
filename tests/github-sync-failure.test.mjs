import test from 'node:test'
import assert from 'node:assert/strict'
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
  rmdirSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

test('strict scheduled sync fails without changing saved data when the calendar is unavailable', () => {
  const folder = mkdtempSync(join(tmpdir(), 'portfolio-github-test-'))
  const output = join(folder, 'snapshot.json')
  const saved = JSON.stringify({
    generatedAt: '2026-08-22T21:00:00Z',
    calendar: { total: 99, days: [] },
  })
  writeFileSync(output, saved)
  const mock = `globalThis.fetch = async (url) => {
    const address = String(url);
    if (new URL(address).hostname === 'github.com') return new Response('Unavailable', { status: 503 });
    const body = address.includes('/search/') ? { items: [] } : address.includes('/repos?') || address.includes('/events/') ? [] : { login: 'priyanshu-1006', name: 'Priyanshu', public_repos: 0 };
    return new Response(JSON.stringify(body), { status: 200 });
  }`
  try {
    const result = spawnSync(
      process.execPath,
      [
        '--import',
        `data:text/javascript,${encodeURIComponent(mock)}`,
        fileURLToPath(new URL('../scripts/fetch-github.mjs', import.meta.url)),
        '--strict',
      ],
      {
        encoding: 'utf8',
        timeout: 10000,
        env: {
          ...process.env,
          GITHUB_USER: 'priyanshu-1006',
          GITHUB_TOKEN: '',
          GITHUB_SNAPSHOT_PATH: output,
        },
      },
    )
    assert.equal(result.status, 1, result.stderr)
    assert.match(result.stderr, /No fresh calendar was available/)
    assert.equal(readFileSync(output, 'utf8'), saved)
  } finally {
    // The test only creates this explicitly named temporary directory.
    unlinkSync(output)
    rmdirSync(folder)
  }
})

test('commit search and the public calendar still refresh when the core REST quota is exhausted', () => {
  const folder = mkdtempSync(join(tmpdir(), 'portfolio-github-test-'))
  const output = join(folder, 'snapshot.json')
  writeFileSync(
    output,
    JSON.stringify({
      generatedAt: '2026-08-22T21:00:00Z',
      user: {
        login: 'priyanshu-1006',
        url: 'https://github.com/priyanshu-1006',
        publicRepos: 1,
      },
      contributions: [
        {
          name: 'Saved',
          full: 'priyanshu-1006/Saved',
          commits: 3,
          top: true,
          stars: 0,
          language: 'JavaScript',
        },
      ],
      totals: { recentPushes: 2 },
      activity: [{ date: '2026-11-01', pushes: 2 }],
      recent: [],
    }),
  )
  const mock = `globalThis.fetch = async (url) => {
    const u = new URL(String(url));
    if (u.hostname === 'github.com') {
      const html = Array.from({length:365},(_,i)=> {
        const date = new Date(Date.UTC(2026,10,1-i)).toISOString().slice(0,10);
        return '<td id="d'+i+'" data-date="'+date+'"></td><tool-tip for="d'+i+'">1 contribution on this day.</tool-tip>';
      }).join('');
      return new Response(html,{status:200});
    }
    if (u.pathname === '/search/commits') return new Response(JSON.stringify({total_count:1,items:[{
      sha:'a'.repeat(40),repository:{name:'Saved',full_name:'priyanshu-1006/Saved',owner:{login:'priyanshu-1006'}},
      commit:{message:'Actual public change',author:{date:'2026-11-01T20:00:00Z'}}
    }]}),{status:200});
    return new Response(JSON.stringify({message:'API rate limit exceeded'}),{status:403,headers:{'x-ratelimit-remaining':'0'}});
  }`
  try {
    const result = spawnSync(
      process.execPath,
      [
        '--import',
        `data:text/javascript,${encodeURIComponent(mock)}`,
        fileURLToPath(new URL('../scripts/fetch-github.mjs', import.meta.url)),
        '--strict',
      ],
      {
        encoding: 'utf8',
        timeout: 10000,
        windowsHide: true,
        env: {
          ...process.env,
          GITHUB_USER: 'priyanshu-1006',
          GITHUB_TOKEN: '',
          GITHUB_SNAPSHOT_PATH: output,
        },
      },
    )
    assert.equal(result.status, 0, result.stderr)
    const saved = JSON.parse(readFileSync(output, 'utf8'))
    assert.equal(saved.calendar.total, 365)
    assert.equal(saved.history.commits.length, 1)
    assert.equal(saved.history.commits[0].message, 'Actual public change')
    assert.equal(saved.contributions[0].cached, true)
    assert.equal(saved.totals.commits, 3)
    assert.equal(saved.totals.recentPushes, 2)
    assert.equal(saved.partial, true)
  } finally {
    unlinkSync(output)
    rmdirSync(folder)
  }
})
