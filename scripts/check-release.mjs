import { execFileSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const paths = [
  ...new Set(
    execFileSync(
      'git',
      ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
      { cwd: root, encoding: 'utf8' },
    )
      .split('\0')
      .filter(Boolean),
  ),
]
const textTypes = new Set([
  '.js',
  '.jsx',
  '.mjs',
  '.ts',
  '.tsx',
  '.json',
  '.md',
  '.yml',
  '.yaml',
  '.html',
  '.css',
  '.py',
  '.txt',
  '.toml',
])
const patterns = [
  [
    'GitHub token',
    /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/,
  ],
  ['API secret', /\bsk-[A-Za-z0-9_-]{32,}\b/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['Private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
]
const issues = []
let largest = { path: '', bytes: 0 },
  total = 0,
  scanned = 0
for (const path of paths) {
  const absolute = resolve(root, path)
  let stat
  try {
    stat = statSync(absolute)
  } catch {
    continue
  }
  if (!stat.isFile()) continue
  total += stat.size
  if (stat.size > largest.bytes) largest = { path, bytes: stat.size }
  if (stat.size >= 95 * 1024 * 1024)
    issues.push(`${path}: large file needs review`)
  const name = path.split('/').at(-1)
  if (
    /^\.env(?:\..+)?$/.test(name) &&
    !/^\.env\.(example|sample|template)$/.test(name)
  )
    issues.push(`${path}: environment file must stay private`)
  if (!textTypes.has(extname(path)) || stat.size > 2 * 1024 * 1024) continue
  scanned++
  const source = readFileSync(absolute, 'utf8')
  for (const [label, pattern] of patterns)
    if (pattern.test(source))
      issues.push(`${path}: possible ${label}; inspect before committing`)
}
if (issues.length) {
  console.error(issues.join('\n'))
  process.exitCode = 1
} else
  console.log(
    `Release file check passed. ${scanned} text files scanned; ${paths.length} repository paths; ${(total / 1024 / 1024).toFixed(1)} MiB total. Largest: ${largest.path} (${(largest.bytes / 1024 / 1024).toFixed(2)} MiB).`,
  )
