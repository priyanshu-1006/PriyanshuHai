import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  systemSkills,
  systemStages,
  systemBuildPaths,
  projectsForSkill,
} from '../src/data/systemSkills.js'
import { profile } from '../src/data/profile.js'
import { techGroups } from '../src/data/techStack.js'
import { projects } from '../src/data/projects.js'

test('This PC covers every declared technology without duplicate tiles or missing brand files', () => {
  const names = new Set(systemSkills.map((skill) => skill.name))
  assert.equal(names.size, systemSkills.length)
  for (const group of profile.skills)
    for (const value of group.items)
      for (const name of value.split(' · ')) assert.ok(names.has(name), name)
  for (const group of techGroups)
    for (const item of group.items) assert.ok(names.has(item.name), item.name)
  for (const skill of systemSkills) {
    assert.ok(skill.groups.length)
    for (const group of skill.groups)
      assert.ok(
        systemStages.some((stage) => stage.id === group),
        group,
      )
    if (skill.icon)
      assert.ok(
        existsSync(
          fileURLToPath(
            new URL(`../public/svg/${skill.icon}.svg`, import.meta.url),
          ),
        ),
        skill.icon,
      )
  }
})
test('Build paths use real projects and declared skills; Java is not mistaken for JavaScript', () => {
  for (const path of systemBuildPaths) {
    assert.ok(
      projects.some((project) => project.slug === path.project),
      path.project,
    )
    for (const name of path.skills) {
      assert.ok(
        systemSkills.some((skill) => skill.name === name),
        name,
      )
      const project = projects.find((project) => project.slug === path.project)
      assert.ok(
        project.tech.some((tech) => tech.toLowerCase() === name.toLowerCase()),
        `${path.project}: ${name}`,
      )
    }
  }
  for (const project of projectsForSkill('Java'))
    assert.ok(project.tech.some((tech) => tech.toLowerCase() === 'java'))
  assert.ok(
    projectsForSkill('Rust').some(
      (project) => project.slug === 'little-terminal',
    ),
  )
})
