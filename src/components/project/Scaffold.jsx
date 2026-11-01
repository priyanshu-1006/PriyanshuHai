import ProjectNext from './ProjectNext'
import { Link } from 'react-router-dom'
import { useReveal } from '../../lib/useReveal'

/**
 * Shared scaffolding for the lighter project pages.
 *
 * The larger case studies each define their own layout primitives because their
 * sections genuinely differ. These smaller projects don't need that — a shared
 * band and eyebrow keeps them consistent without pretending they carry the same
 * weight as Nexsus or Gryork.
 */

export function Band({ children, className = '', id }) {
  const ref = useReveal()
  return (
    <section id={id} className={`scroll-mt-24 py-14 md:py-20 ${className}`}>
      <div ref={ref} className="reveal shell">{children}</div>
    </section>
  )
}

export function Eyebrow({ children, tone = 'accent' }) {
  return (
    <p className="t-label mb-4 flex items-center gap-3">
      <span className={`inline-block h-px w-7 bg-${tone}`} />
      {children}
    </p>
  )
}

export function BackLink() {
  return (
    <Link
      to="/projects"
      className="t-mono inline-flex items-center gap-2 text-ink3 transition-colors hover:text-accent"
    >
      ← All projects
    </Link>
  )
}

export function Meta({ category, children }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
        {category}
      </span>
      <span className="t-mono text-ink3">{children}</span>
    </div>
  )
}

export function Stats({ items }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([v, l]) => (
        <div key={l} className="bg-bg2 p-6">
          <div className="font-display text-2xl font-bold tracking-tight text-accent sm:text-3xl">
            {v}
          </div>
          <p className="mt-2.5 text-sm leading-snug text-ink2">{l}</p>
        </div>
      ))}
    </div>
  )
}

export function NextProject({ slug }) {
  return <ProjectNext slug={slug} />
}

export function Retrospect({ heading, children }) {
  return (
    <Band className="border-t border-rule">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <Eyebrow>Retrospect</Eyebrow>
          <h2 className="t-h1 text-ink">{heading}</h2>
        </div>
        <div className="space-y-5">{children}</div>
      </div>
    </Band>
  )
}
