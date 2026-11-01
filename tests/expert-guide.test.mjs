import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { guideAnswers, guideById, findGuideQuestions } from '../src/data/assistantKnowledge.js'
import { projectLogos, projectMarks } from '../src/data/projectIdentity.js'
import { projects } from '../src/data/projects.js'

const publicFile = (path) => fileURLToPath(new URL(`../public${path}`, import.meta.url))

test('every saved answer has a unique ID, useful text, an existing image and valid follow-ups', () => {
  assert.equal(new Set(guideAnswers.map((a) => a.id)).size, guideAnswers.length)
  for (const answer of guideAnswers) {
    assert.ok(answer.question && answer.title && answer.topic, answer.id)
    assert.ok(
      answer.paragraphs.length &&
        answer.paragraphs.every((p) => typeof p === 'string' && p.length > 10),
      answer.id,
    )
    assert.ok(answer.image.alt && answer.image.caption, answer.id)
    assert.ok(existsSync(publicFile(answer.image.src)), `${answer.id}: missing image`)
    assert.ok(answer.followUps.length > 1, answer.id)
    for (const id of answer.followUps) assert.ok(guideById[id], `${answer.id} → ${id}`)
  }
})

test('all answers are reachable from the initial topic graph', () => {
  const seen = new Set()
  const visit = (id) => {
    if (seen.has(id)) return
    seen.add(id)
    guideById[id].followUps.forEach(visit)
  }
  visit('start')
  assert.deepEqual([...seen].sort(), guideAnswers.map((a) => a.id).sort())
})

test('question search resolves topics and technology keywords without inventing answers', () => {
  assert.ok(findGuideQuestions('gryork').some((a) => a.id === 'gryork'))
  assert.ok(findGuideQuestions('rust').some((a) => a.id === 'little-terminal'))
  assert.ok(findGuideQuestions('resume').some((a) => a.id === 'resume'))
  assert.deepEqual(findGuideQuestions('unlisted-topic-82741'), [])
})

test('project identities cover the collection and all supplied brand assets exist', () => {
  for (const project of projects)
    assert.ok(projectLogos[project.slug] || projectMarks[project.slug], project.slug)
  for (const path of Object.values(projectLogos)) assert.ok(existsSync(publicFile(path)), path)
})

test('project actions resolve to real portfolio projects and GDGoC history stays accurate', () => {
  const slugs = new Set(projects.map((p) => p.slug))
  for (const answer of guideAnswers)
    for (const action of answer.actions) {
      if (action.to?.startsWith('/projects/'))
        assert.ok(slugs.has(action.to.split('/')[2]), action.to)
      if (action.app?.startsWith('project:')) assert.ok(slugs.has(action.app.slice(8)), action.app)
    }
  assert.match(guideById['gdg-mmmut'].paragraphs.join(' '), /September 2026/)
  assert.match(guideById['gdg-mmmut'].paragraphs.join(' '), /July 2025 to August 2026/)
})
