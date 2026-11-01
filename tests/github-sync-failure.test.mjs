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
