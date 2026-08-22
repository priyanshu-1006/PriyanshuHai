import { Link } from 'react-router-dom'
import { profile } from '../../data/profile'
import { projects } from '../../data/projects'
import { projectThemes, base } from '../../data/projectThemes'
import { useTheme } from '../../lib/themeContext'
import { useReveal } from '../../lib/useReveal'
import BrandMark from '../BrandMark'
import { orgBrand } from '../../data/brand'

function Head({ label, title, lead, action }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="reveal">
      <p className="t-label mb-4 flex items-center gap-3">
        <span className="inline-block h-px w-7 bg-accent" />
        {label}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="t-h1 max-w-2xl text-ink">{title}</h2>
        {action}
      </div>
      {lead && <p className="t-lead mt-5 max-w-2xl">{lead}</p>}
    </div>
  )
}

/* ── Numbers ─────────────────────────────────────────────── */
export function Stats() {
  const ref = useReveal()
  return (
    <section className="py-10 md:py-14">
      <div className="shell">
        <div
          ref={ref}
          className="reveal grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4"
        >
          {profile.signals.map((s) => (
            <div key={s.label} className="bg-bg2 p-6 lg:p-7">
              <div className="font-display text-4xl font-black tracking-tight text-accent lg:text-[2.75rem]">
                {s.value}
              </div>
              <p className="mt-3 text-sm leading-snug text-ink2">{s.label}</p>
              <p className="t-mono mt-2 text-ink3">{s.ref}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── About ───────────────────────────────────────────────── */
export function About() {
  const ref = useReveal()
  const paragraphs = profile.bio
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())

  return (
    <section id="about" className="scroll-mt-24 py-20 md:py-24">
      <div className="shell">
        <div ref={ref} className="reveal grid gap-10 lg:grid-cols-[0.4fr_0.6fr] lg:gap-16">
          <div>
            <p className="t-label mb-4 flex items-center gap-3">
              <span className="inline-block h-px w-7 bg-accent" />
              Who I am
            </p>
            <h2 className="t-h2 text-ink">
              I start at the architecture diagram and work outward.
            </h2>
          </div>
          <div className="space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[1.0625rem] leading-[1.72] text-ink2">
                {p}
              </p>
            ))}
            <p className="text-[1.0625rem] leading-[1.72] text-ink">
              I&apos;m most useful where a vague idea has to become a schema, a state machine and a
              set of invariants that will not be violated later.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Roles ───────────────────────────────────────────────── */
function RoleRow({ job }) {
  const ref = useReveal()
  const brand = orgBrand(job.org)
  return (
    <li ref={ref} className="reveal border-b border-rule">
      <div className="grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[150px_1fr] lg:grid-cols-[190px_1fr_auto]">
        <p className="t-mono pt-1 text-ink3">{job.period}</p>
        <div className="flex gap-4">
          {brand && <BrandMark brand={brand} size={44} className="mt-1" />}
          <div className="min-w-0 flex-1">
          <h3 className="t-h3 text-ink">{job.role}</h3>
          <p className="mt-1 text-[15px] text-ink2">
            {job.link ? (
              <a href={job.link} target="_blank" rel="noreferrer noopener" className="link-a">
                {job.org}
              </a>
            ) : (
              job.org
            )}
          </p>
          <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-ink2">{job.points[0]}</p>
          </div>
        </div>
        <span className="t-label hidden self-start pt-1.5 lg:block">{job.tag}</span>
      </div>
    </li>
  )
}

export function Roles() {
  return (
    <section id="work" className="scroll-mt-24 py-20 md:py-24">
      <div className="shell">
        <Head
          label="Roles"
          title="Where I've been operating."
          lead="Two CTO seats, a registered society I founded, and the hostel mess I ran in first year."
        />
        <ol className="mt-12 border-t border-rule">
          {profile.experience.map((job, i) => (
            <RoleRow key={`${job.org}-${job.role}-${i}`} job={job} />
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ── Record ──────────────────────────────────────────────── */
/* ── Full index ──────────────────────────────────────────── */
function ProjectCard({ project, accent }) {
  const ref = useReveal()
  return (
    <li ref={ref} className="reveal">
      <Link
        to={`/projects/${project.slug}`}
        className="group flex h-full flex-col rounded-2xl border border-rule bg-bg2 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-rule2 hover:shadow-xl"
        style={{ transitionTimingFunction: 'var(--ease)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em]"
            style={{
              background: `color-mix(in oklab, ${accent} 15%, transparent)`,
              color: accent,
            }}
          >
            {project.category}
          </span>
          <span className="t-mono text-ink3">{project.year}</span>
        </div>

        <h3 className="t-h3 mt-4 text-ink">{project.title}</h3>
        <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink2">{project.blurb}</p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-rule pt-3.5">
          <span className="t-mono truncate text-ink3">
            {project.tech.slice(0, 2).join(' · ')}
          </span>
          <span
            className="shrink-0 text-sm transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: accent }}
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </Link>
    </li>
  )
}

export function AllProjects() {
  const { mode } = useTheme()

  return (
    <section id="all-projects" className="scroll-mt-24 py-20 md:py-24">
      <div className="shell">
        <Head
          label="Index"
          title="Everything I've built."
          lead="Each opens a case study with its own design, architecture diagrams and the parts that were genuinely hard."
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.slug}
              project={p}
              accent={projectThemes[p.slug]?.[mode]?.accent || base[mode].ink}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
