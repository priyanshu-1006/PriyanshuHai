import { useState } from 'react'
import { Link } from 'react-router-dom'
import { profile } from '../../data/profile'
import { projects } from '../../data/projects'

const SYSTEMS = [
  {
    slug: 'nexsus-universe',
    label: 'Campus',
    title: 'One campus. Connected.',
    note: 'Five portals, two mobile apps and a department timetable on one backend.',
    proof: '37 people / one society',
    icon: 'N',
    x: 22,
    y: 25,
  },
  {
    slug: 'little-code',
    label: 'Developer tools',
    title: 'Build the tools I want to use.',
    note: 'A standalone coding companion with context, native diffs and supervised agents.',
    proof: 'Ask → Plan → Edit → Agent',
    icon: '⌘',
    x: 76,
    y: 25,
  },
  {
    slug: 'gryork',
    label: 'Fintech',
    title: 'Architecture with real stakes.',
    note: 'A bill-discounting marketplace connecting infrastructure contractors and lenders.',
    proof: '₹2.5 lakh architecture grant',
    icon: 'G',
    x: 22,
    y: 75,
  },
  {
    slug: 'manakmitra',
    label: 'Applied AI',
    title: 'Answers that carry evidence.',
    note: 'Indian Standards discovery and certification decisions with official sources attached.',
    proof: 'SIH 2026 / cited compliance',
    icon: 'M',
    x: 76,
    y: 75,
  },
]

export default function Hero() {
  const [active, setActive] = useState(0)
  const system = SYSTEMS[active]
  const project = projects.find((p) => p.slug === system.slug)
  return (
    <section className="studio-hero">
      <div className="shell">
        <div className="studio-topline">
          <span>Priyanshu Chaurasia / Engineer & builder</span>
          <span className="studio-location">
            Gorakhpur, India <span aria-hidden="true">↗</span>
          </span>
        </div>
        <div className="studio-layout">
          <div className="studio-copy">
            <p className="studio-eyebrow">
              <span className="status-dot" />
              Independent thinking. Shared impact.
            </p>
            <h1 aria-label="I build the systems people rely on.">
              I build the
              <br />
              <span className="studio-serif">systems</span>
              <br />
              people rely on<span className="studio-period">.</span>
            </h1>
            <p className="studio-description">
              Full-stack engineer. CTO at two startups. Founder of Nexsus. Turning complicated
              problems into software that earns its place in the real world.
            </p>
            <div className="studio-actions">
              <a href="#work" className="pill pill-solid">
                Explore my work <span aria-hidden="true">↘</span>
              </a>
              <a
                href={profile.resumeUrl}
                download="Priyanshu-Chaurasia-Resume.pdf"
                className="studio-resume"
              >
                Download résumé <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="studio-availability">
              <span className="status-dot" />
              {profile.availability}
            </p>
          </div>
          <div className="system-desk">
            <div className="desk-title">
              <span className="t-label">The systems desk</span>
              <span className="desk-index">0{active + 1} / 04</span>
            </div>
            <div className="system-map" role="group" aria-label="Explore areas of my work">
              <svg viewBox="0 0 500 280" preserveAspectRatio="none" aria-hidden="true">
                <path d="M110 70H250V140M380 70H250V140M110 210H250V140M380 210H250V140" />
                <circle cx="250" cy="140" r="27" />
              </svg>
              <div className="map-core" aria-hidden="true">
                PC<span>build()</span>
              </div>
              {SYSTEMS.map((s, i) => (
                <button
                  className={`map-node ${active === i ? 'is-active' : ''}`}
                  key={s.slug}
                  type="button"
                  aria-pressed={active === i}
                  onClick={() => setActive(i)}
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                >
                  <span className="map-node-symbol" aria-hidden="true">
                    {s.icon}
                  </span>
                  <span>{s.label}</span>
                </button>
              ))}
              <span className="map-coordinate" aria-hidden="true">
                IDEA → ARCHITECTURE → PEOPLE
              </span>
            </div>
            <div className="desk-project" aria-live="polite">
              <div className="desk-project-copy">
                <p className="t-label">{project.title}</p>
                <h2>{system.title}</h2>
                <p>{system.note}</p>
              </div>
              <Link
                to={`/projects/${system.slug}`}
                className="desk-project-image"
                aria-label={`Read the ${project.title} case study`}
              >
                <img
                  key={project.cover}
                  src={project.cover}
                  alt={`${project.title} interface`}
                  width="700"
                  height="430"
                />
                <span aria-hidden="true">↗</span>
              </Link>
              <div className="desk-footer">
                <span>{system.proof}</span>
                <Link to={`/projects/${system.slug}`}>Open case study ↗</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="studio-roles">
          <p>
            Currently
            <br />
            <span>building & leading</span>
          </p>
          <Link to="/projects/gryork">
            <strong>CTO</strong>
            <span>Gryork</span>
          </Link>
          <Link to="/projects/washtro">
            <strong>CTO</strong>
            <span>Washtro</span>
          </Link>
          <Link to="/projects/nexsus-universe">
            <strong>Founder & President</strong>
            <span>Nexsus</span>
          </Link>
          <Link to="/projects/gdg-mmmut">
            <strong>Organiser & Campus Lead</strong>
            <span>GDGoC · Since Sep 2026</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
