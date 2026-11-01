import { useMemo, useRef, useState } from 'react'
import { profile } from '../../data/profile'
import {
  systemSkills,
  systemStages,
  systemBuildPaths,
  projectsForSkill,
} from '../../data/systemSkills'
import SkillIcon from '../SkillIcon'
import ProjectIcon from '../ProjectIcon'
import { projects } from '../../data/projects'
import { useExperience } from '../../lib/experienceContext'

export default function SystemInfo({ onOpen }) {
  const { reducedMotion } = useExperience()
  const details = useRef(null)
  const [stage, setStage] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('TypeScript')
  const [build, setBuild] = useState('campus')
  const current = systemStages.find((item) => item.id === stage)
  const skill = systemSkills.find((item) => item.name === selected)
  const proof = useMemo(
    () => projectsForSkill(selected).slice(0, 3),
    [selected],
  )
  const visible = systemSkills.filter(
    (item) =>
      (stage === 'all' || item.groups.includes(stage)) &&
      `${item.name} ${item.groups.join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  const path = systemBuildPaths.find((item) => item.id === build)
  const project = projects.find((item) => item.slug === path.project)
  const chooseSkill = (name) => {
    setSelected(name)
    if (window.matchMedia('(max-width: 500px)').matches)
      requestAnimationFrame(() => {
        const panel = details.current
        const scroller = panel?.closest('.os-window-content')
        if (scroller)
          scroller.scrollTo({
            top:
              panel.getBoundingClientRect().top -
              scroller.getBoundingClientRect().top +
              scroller.scrollTop -
              12,
            behavior: reducedMotion ? 'instant' : 'smooth',
          })
      })
  }
  return (
    <div className="system-info">
      <header className="system-identity">
        <img src="/computer/icons/this-pc.svg" alt="" />
        <div>
          <p>THIS PC / SYSTEM PROPERTIES</p>
          <h2>Priyanshu’s working system.</h2>
          <span>{profile.name} · CSE ’28 · MMMUT</span>
        </div>
        <span className="system-status">
          <i />
          Curiosity running
        </span>
      </header>
      <div className="system-summary">
        <span>
          <small>System owner</small>
          <strong>Engineer & founder</strong>
        </span>
        <span>
          <small>Installed toolkit</small>
          <strong>{systemSkills.length} technologies</strong>
        </span>
        <span>
          <small>Output directory</small>
          <button onClick={() => onOpen('projects')}>
            {projects.length} projects ↗
          </button>
        </span>
      </div>
      <section className="system-story">
        <h3>From an idea to a working system.</h3>
        <p>
          Follow the build from left to right. Choose a layer, then a technology
          to see where it appears in my work.
        </p>
        <nav className="system-stages" aria-label="Engineering story">
          {systemStages.map((item, index) => (
            <button
              key={item.id}
              aria-pressed={stage === item.id}
              onClick={() => {
                setStage(item.id)
                setQuery('')
                setSelected(
                  systemSkills.find((skill) => skill.groups.includes(item.id))
                    .name,
                )
              }}
            >
              <small>0{index + 1}</small>
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </button>
          ))}
        </nav>
      </section>
      <div className="system-browser-toolbar">
        <button
          className="os-button"
          aria-pressed={stage === 'all'}
          onClick={() => {
            setStage('all')
            setQuery('')
          }}
        >
          All technologies
        </button>
        <label>
          <span className="sr-only">Search installed technologies</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a language, framework or tool…"
          />
        </label>
        <span>{visible.length} found</span>
      </div>
      <section className="system-layer">
        <h3>
          {current
            ? `${current.title}: ${current.subtitle}`
            : 'The complete toolkit'}
        </h3>
        <p>
          {current?.description ||
            'Choose a technology to follow it into the project directory.'}
        </p>
      </section>
      <div className="system-skill-layout">
        <div className="system-skill-grid" aria-label="Installed technologies">
          {visible.map((item) => (
            <button
              key={item.name}
              aria-pressed={selected === item.name}
              onClick={() => chooseSkill(item.name)}
            >
              <SkillIcon skill={item} />
              <span>{item.name}</span>
            </button>
          ))}
          {!visible.length && (
            <p className="system-no-results">
              No matching technology. Try a name such as Rust, React or Python.
            </p>
          )}
        </div>
        <aside
          className="system-skill-details"
          aria-live="polite"
          ref={details}
        >
          <SkillIcon key={skill.name} skill={skill} />
          <p className="system-detail-label">SELECTED TECHNOLOGY</p>
          <h3>{skill.name}</h3>
          <p>{skill.groups.join(' · ')}</p>
          <h4>{proof.length ? 'In my project directory' : 'In my toolkit'}</h4>
          {proof.length ? (
            proof.map((item) => (
              <button
                key={item.slug}
                onClick={() => onOpen(`project:${item.slug}`)}
              >
                <ProjectIcon slug={item.slug} />
                <span>
                  {item.title}
                  <small>{item.category} ↗</small>
                </span>
              </button>
            ))
          ) : (
            <p>
              Listed in my engineering toolkit. Explore the project collection
              to see how I approach complete systems.
            </p>
          )}
          <button className="os-text-button" onClick={() => onOpen('projects')}>
            Open the project directory ↗
          </button>
        </aside>
      </div>
      <section className="system-build-paths">
        <h3>See the pieces work together.</h3>
        <div className="system-build-options" aria-label="Example build paths">
          {systemBuildPaths.map((item) => (
            <button
              key={item.id}
              aria-pressed={build === item.id}
              onClick={() => setBuild(item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="system-build-detail">
          <ProjectIcon slug={path.project} />
          <div>
            <h4>{path.title}</h4>
            <p>{path.text}</p>
            <div className="system-build-stack">
              {path.skills.map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    chooseSkill(name)
                    setStage('all')
                    setQuery(name)
                  }}
                >
                  <SkillIcon
                    skill={systemSkills.find((item) => item.name === name)}
                  />
                  <span>{name}</span>
                </button>
              ))}
            </div>
            <button
              className="os-button"
              onClick={() => onOpen(`project:${path.project}`)}
            >
              Explore {project.title} ↗
            </button>
          </div>
        </div>
      </section>
      <footer className="system-info-footer">
        Choose a technology. Follow it into a project. See what it helped build.
      </footer>
    </div>
  )
}
