import { Link } from 'react-router-dom'
import { projectThemes, base } from '../data/projectThemes'
import { useTheme } from '../lib/themeContext'
import { splitTech } from '../lib/techIcon'
import { useReveal } from '../lib/useReveal'

/** Stack row: real SVGs where one exists, text chips where none legitimately does. */
export function TechRow({ tech, max = 6, size = 20 }) {
  const { withIcon, textOnly } = splitTech(tech)
  const shown = withIcon.slice(0, max)
  const hidden = withIcon.length - shown.length + textOnly.length

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {shown.map((t) => (
        <li key={t.name} title={t.name} className="shrink-0">
          <img
            src={t.url}
            alt={t.name}
            loading="lazy"
            decoding="async"
            className="object-contain"
            style={{ width: size, height: size }}
          />
        </li>
      ))}
      {hidden > 0 && (
        <li className="font-mono text-[11px] text-ink3">+{hidden}</li>
      )}
    </ul>
  )
}

/**
 * Project card.
 *
 * `feature` gives the card a screenshot and a two-column layout; the compact
 * form is title, blurb and stack only. Each card borrows its own project's
 * accent so the grid previews the colour world each page opens into.
 */
export default function ProjectCard({ project, feature = false }) {
  const ref = useReveal()
  const { mode } = useTheme()
  const accent = projectThemes[project.slug]?.[mode]?.accent || base[mode].ink

  return (
    <li ref={ref} className={`reveal ${feature ? 'sm:col-span-2' : ''}`}>
      <Link
        to={`/projects/${project.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-rule bg-bg2 transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl"
        style={{
          transitionTimingFunction: 'var(--ease)',
          '--card-accent': accent,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '' }}
      >
        {feature && project.cover && (
          <div className="relative aspect-[16/8] w-full overflow-hidden bg-black">
            <img
              src={project.cover}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top opacity-85 transition-transform duration-700 group-hover:scale-[1.04]"
              style={{ transitionTimingFunction: 'var(--ease)' }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: `linear-gradient(to top, ${accent}22, transparent 55%)` }}
            />
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span
              className="rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em]"
              style={{ background: `color-mix(in oklab, ${accent} 16%, transparent)`, color: accent }}
            >
              {project.category}
            </span>
            <span className="t-mono text-ink3">{project.year}</span>
            {project.status === 'Live' && (
              <span className="ml-auto flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink3">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                Live
              </span>
            )}
          </div>

          <h3
            className="t-h3 mt-4 text-ink transition-colors duration-300"
            style={{ color: undefined }}
          >
            {project.title}
            {project.tagline && (
              <span className="t-accent ml-2 text-[0.8em]" style={{ color: accent }}>
                {project.tagline}
              </span>
            )}
          </h3>

          <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-ink2">{project.blurb}</p>

          {project.award && (
            <p
              className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-[11.5px] font-medium"
              style={{ background: `color-mix(in oklab, ${accent} 14%, transparent)`, color: accent }}
            >
              <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor" aria-hidden="true">
                <path d="M6 0l1.6 3.6L11.5 4l-3 2.7.8 3.9L6 8.7 2.7 10.6l.8-3.9L.5 4l3.9-.4L6 0z" />
              </svg>
              {project.award}
            </p>
          )}

          {feature && project.results?.length > 0 && (
            <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-rule pt-4">
              {project.results.slice(0, 3).map((r) => (
                <div key={r.label}>
                  <dt className="font-display text-lg font-extrabold tracking-tight" style={{ color: accent }}>
                    {r.metric}
                  </dt>
                  <dd className="mt-0.5 text-[11.5px] leading-snug text-ink3">{r.label}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-rule pt-4">
            <TechRow tech={project.tech} max={feature ? 7 : 5} />
            <span
              className="shrink-0 text-[15px] transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: accent }}
              aria-hidden="true"
            >
              →
            </span>
          </div>
        </div>
      </Link>
    </li>
  )
}
