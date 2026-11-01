import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../../data/projects'
import ProjectTheme from '../ProjectTheme'
import { Gallery } from '../Media'
import ProjectIcon from '../ProjectIcon'

export default function CaseStudy({ slug, children }) {
  const p = projects.find((item) => item.slug === slug)
  const next = projects[(projects.indexOf(p) + 1) % projects.length]
  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.getAttribute('content')
    document.title = `${p.title} — Priyanshu Chaurasia`
    description?.setAttribute('content', p.blurb)
    return () => {
      document.title = previousTitle
      if (previousDescription !== null && previousDescription !== undefined) {
        description?.setAttribute('content', previousDescription)
      }
    }
  }, [p.title, p.blurb])
  return (
    <article className={`case-study case-${slug}`}>
      <ProjectTheme slug={slug} />
      <header className="shell case-header">
        <Link to="/projects" className="case-back">
          ← Project showcase
        </Link>
        <div className="case-kicker">
          <span>{p.category}</span>
          <span>
            {p.year} / {p.status}
          </span>
        </div>
        <p className="case-name project-title-with-icon">
          <ProjectIcon slug={p.slug} />
          {p.title}
        </p>
        <h1 aria-label={p.headline.replace('\n', ' ')}>
          {p.headline.split('\n').map((line, i) => (
            <span key={line} className={i ? 'text-accent' : ''}>
              {line}
            </span>
          ))}
        </h1>
        <div className="case-intro">
          <p>{p.intro}</p>
          <div>
            <span className="t-label">Contribution</span>
            <p className="mt-2 text-sm text-ink">{p.role}</p>
            {Object.entries(p.links).map(([label, url]) => (
              <a
                className="case-link"
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {label === 'github'
                  ? 'View source'
                  : label === 'live'
                    ? 'Visit website'
                    : 'Visit project'}{' '}
                ↗
              </a>
            ))}
          </div>
        </div>
        <figure className="case-cover">
          <div className="case-window-bar">
            <span aria-hidden="true">● ● ●</span>
            <span>{p.title} / product view</span>
          </div>
          <img
            src={p.cover}
            alt={`${p.title} product interface`}
            width="1600"
            height="950"
            fetchPriority="high"
          />
          <figcaption>
            {p.coverCaption ||
              p.gallery[0]?.caption ||
              'Workflow illustration based on the source implementation'}
          </figcaption>
        </figure>
        <dl className="case-stats">
          {p.results.map((r) => (
            <div key={r.label}>
              <dt>{r.metric}</dt>
              <dd>{r.label}</dd>
            </div>
          ))}
        </dl>
      </header>
      <section className="shell case-section case-problem">
        <p className="t-label">01 / The problem</p>
        <h2>Why this needed to exist.</h2>
        <p className="case-problem-description">{p.problem}</p>
      </section>
      {children}
      <section className="shell case-section">
        <div className="case-section-heading">
          <p className="t-label">03 / Engineering decisions</p>
          <h2>How the pieces fit.</h2>
        </div>
        <div className="case-feature-grid">
          {p.features.map(([title, text], i) => (
            <div key={title}>
              <span className="case-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="case-architecture">
        <div className="shell case-section">
          <div className="case-section-heading">
            <p className="t-label">04 / Architecture</p>
            <h2>Follow the request.</h2>
          </div>
          <ol>
            {p.architecture.map((step, i) => (
              <li key={step}>
                <span className="case-number">0{i + 1}</span>
                <span>{step}</span>
                {i < p.architecture.length - 1 && (
                  <span aria-hidden="true" className="case-flow-arrow">
                    ↓
                  </span>
                )}
              </li>
            ))}
          </ol>
          <ul className="case-tech">
            {p.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>
      {p.gallery.length > 0 && (
        <section className="shell case-section">
          <div className="case-section-heading">
            <p className="t-label">05 / Inside the product</p>
            <h2>The actual screens.</h2>
          </div>
          <Gallery items={p.gallery} title={`${p.title} screenshots`} />
        </section>
      )}
      <section className="shell case-section">
        <div className="case-boundary">
          <p className="t-label">Status & evidence</p>
          <p>{p.boundary}</p>
          <small>{p.sourceNote}</small>
        </div>
      </section>
      <div className="shell case-next">
        <span className="t-label">Keep exploring</span>
        <Link to={`/projects/${next.slug}`}>
          <span>{next.title}</span>
          <span aria-hidden="true">↗</span>
        </Link>
        <Link to="/projects" className="case-back">
          View the complete project showcase →
        </Link>
      </div>
    </article>
  )
}

export function StudySection({ title, children }) {
  return (
    <section className="shell case-section">
      <div className="case-section-heading">
        <p className="t-label">02 / Product logic</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}
