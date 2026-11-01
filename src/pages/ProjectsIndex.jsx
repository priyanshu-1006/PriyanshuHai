import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AnimatedHeading from '../components/AnimatedHeading'
import { TechRow } from '../components/ProjectCard'
import { projects } from '../data/projects'
import { useReveal } from '../lib/useReveal'
import { usePageTitle } from '../lib/usePageTitle'
import ProjectIcon from '../components/ProjectIcon'

const SPOTLIGHTS = ['little-code', 'little-terminal', 'mmmut-notice', 'manakmitra', 'satyadwar']
const spotlightProjects = SPOTLIGHTS.map((slug) => projects.find((p) => p.slug === slug))

function ShowcaseCard({ project, index }) {
  const ref = useReveal()
  return (
    <li className="showcase-card reveal" ref={ref}>
      <Link to={`/projects/${project.slug}`} className="showcase-card-link">
        <div className="showcase-card-bar">
          <span>
            {String(index + 1).padStart(2, '0')} / {project.category}
          </span>
          <span>{project.year}</span>
        </div>
        <div className="showcase-card-image">
          {project.cover ? (
            <img
              src={project.cover}
              alt={`${project.title} product preview`}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="showcase-card-no-image">
              <span>Project notes</span>
              <strong>{project.title}</strong>
            </div>
          )}
          <span className="showcase-card-open" aria-hidden="true">
            ↗
          </span>
        </div>
        <div className="showcase-card-copy">
          <div>
            <h3 className="project-title-with-icon">
              <ProjectIcon slug={project.slug} />
              <span>{project.title}</span>
            </h3>
            <span>{project.status}</span>
          </div>
          <p>{project.blurb}</p>
          <footer>
            <TechRow tech={project.tech} max={5} size={18} />
            <span>
              Explore project <span aria-hidden="true">↗</span>
            </span>
          </footer>
        </div>
      </Link>
    </li>
  )
}

export default function ProjectsIndex() {
  usePageTitle(
    'Projects',
    'Developer tools, campus infrastructure and products by Priyanshu Chaurasia. Explore 25 projects with screenshots and engineering case studies.',
  )
  const [selected, setSelected] = useState(SPOTLIGHTS[0])
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const active = spotlightProjects.find((p) => p.slug === selected)
  const categories = useMemo(() => ['All', ...new Set(projects.map((p) => p.category))], [])
  const shown = projects.filter((p) => {
    const matchesQuery = `${p.title} ${p.blurb} ${p.tech.join(' ')}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
    return (filter === 'All' || p.category === filter) && matchesQuery
  })
  return (
    <div className="project-showcase">
      <header className="shell showcase-header">
        <div className="page-eyebrow">
          <Link to="/">← Back to the computer</Link>
          <span>Selected work / 2024—2026</span>
        </div>
        <div className="showcase-intro">
          <AnimatedHeading text="Ideas, made real." accent="made real." />
          <div>
            <p>
              Developer tools, campus infrastructure, and products built to be used. A few recent
              favourites, then the whole collection.
            </p>
            <a href="#collection" className="paper-link">
              Explore all {projects.length} projects <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </header>
      <section className="shell showcase-spotlight" aria-label="Recent project showcase">
        <div className="showcase-spotlight-frame">
          <div className="showcase-frame-bar">
            <span className="window-lights" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>Recently on my desktop</span>
            <span>0{SPOTLIGHTS.indexOf(selected) + 1} / 05</span>
          </div>
          <div className="showcase-spotlight-grid">
            <div className="showcase-project-picker" aria-label="Choose a project preview">
              {spotlightProjects.map((p, i) => (
                <button
                  key={p.slug}
                  aria-pressed={selected === p.slug}
                  onClick={() => setSelected(p.slug)}
                >
                  <span>0{i + 1}</span>
                  <span>
                    {p.title}
                    <small>{p.category}</small>
                  </span>
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            <div key={active.slug} className="showcase-preview">
              <Link to={`/projects/${active.slug}`} className="showcase-preview-image">
                <img
                  src={active.cover}
                  alt={`${active.title} product interface`}
                  fetchPriority="high"
                />
                <span>View case study ↗</span>
              </Link>
              <div className="showcase-preview-copy">
                <div>
                  <p className="t-label">{active.status}</p>
                  <Link to={`/projects/${active.slug}`}>
                    <h2>
                      {active.title} <span aria-hidden="true">↗</span>
                    </h2>
                  </Link>
                </div>
                <p>{active.blurb}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="collection" className="shell showcase-collection">
        <div className="showcase-collection-heading">
          <div>
            <p className="t-label">The complete collection</p>
            <h2>All the things.</h2>
          </div>
          <span aria-live="polite">
            {shown.length} of {projects.length} projects
          </span>
        </div>
        <div className="showcase-tools">
          <label className="showcase-search">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" />
            </svg>
            <input
              type="search"
              aria-label="Search the project collection"
              placeholder="Find a project, tool or technology…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="showcase-category">
            <span>Browse by</span>
            <select
              aria-label="Project category"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <ul className="showcase-grid">
          {shown.map((p) => (
            <ShowcaseCard key={p.slug} project={p} index={projects.indexOf(p)} />
          ))}
        </ul>
        {!shown.length && (
          <div className="showcase-empty">
            <h3>No projects found.</h3>
            <p>Try a different name, technology or category.</p>
            <button
              className="pill pill-solid"
              onClick={() => {
                setQuery('')
                setFilter('All')
              }}
            >
              Show all projects
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
