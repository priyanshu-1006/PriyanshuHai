import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { projects } from '../src/data/projects.js'

test('the first ten projects follow the requested editorial priority', () => {
  assert.deepEqual(
    projects.slice(0, 10).map((p) => p.slug),
    [
      'little-code',
      'little-terminal',
      'nexsus-universe',
      'cognito-learning-hub',
      'fracturevision-ai',
      'nexsus-assist',
      'haazir',
      'washtro',
      'washing-bro',
      'aurorahai',
    ],
  )
  assert.equal(new Set(projects.map((p) => p.slug)).size, 25)
})
test('every local project image has a case-correct file and each project has substantial reader content', () => {
  const files = new Set(
    readdirSync(new URL('../public', import.meta.url), { recursive: true }).map(
      (path) => path.replaceAll('\\', '/'),
    ),
  )
  for (const project of projects) {
    for (const path of [
      project.cover,
      project.architectureImage,
      ...(project.gallery || []).map((item) => item.src),
    ].filter(Boolean)) {
      if (path.startsWith('/'))
        assert.ok(
          files.has(decodeURIComponent(path.slice(1))),
          `${project.slug}: ${path}`,
        )
    }
    assert.ok(project.problem?.length > 70, project.slug)
    assert.ok(
      project.approach?.length > 100 || project.features?.length >= 3,
      project.slug,
    )
    for (const url of Object.values(project.links || {}))
      assert.ok(['https:', 'http:'].includes(new URL(url).protocol), url)
  }
})
test('updated hero assets and public product links stay connected', () => {
  const find = (slug) => projects.find((p) => p.slug === slug)
  assert.equal(find('aurorahai').cover, '/Aurora/Aurora-Map-3d.jpeg')
  assert.equal(
    find('little-code').links.live,
    'https://little-code.vercel.app/',
  )
  assert.equal(
    find('little-terminal').links.live,
    'https://little-terminal.vercel.app/',
  )
  assert.equal(
    find('little-terminal').cover,
    '/projects/little-terminal/product-overview.webp',
  )
  assert.equal(find('manakmitra').cover, '/projects/manakmitra/hero.webp')
  assert.equal(find('satyadwar').cover, '/projects/satyadwar/hero.webp')
})
