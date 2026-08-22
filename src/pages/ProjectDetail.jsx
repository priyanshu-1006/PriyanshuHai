import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { projects, getProject } from '../data/projects'
import { Reveal } from '../components/Section'
import Prose from '../components/Prose'
import { Gallery, VideoEmbed } from '../components/Media'
import ProjectTheme from '../components/ProjectTheme'
import { getBespokePage } from './projects'

const LINK_LABELS = {
  live: 'Live site',
  github: 'Source',
  api: 'API',
  tools: 'Tools',
  demoVideo: 'Demo video',
  caseStudy: 'Writeup',
}

/** Block heading — same t-label device as the home page sections. */
function Block({ tag, title, children, className = '' }) {
  return (
    <section className={`py-10 md:py-12 ${className}`}>
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="t-label whitespace-nowrap">[ {tag} ]</span>
          <span className="rule-h" />
        </div>
        {title && (
          <h2 className="mt-5 font-display text-2xl font-black tracking-[-0.025em] text-ink sm:text-3xl">
            {title}
          </h2>
        )}
        <div className="mt-6">{children}</div>
      </Reveal>
    </section>
  )
}


/**
 * Click-to-load preview. Many deployed apps send X-Frame-Options / frame-ancestors
 * and will refuse to render here — so the direct link is always offered alongside.
 */
function LivePreview({ url, height, title }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="border border-rule bg-bg2">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
          <span className="truncate font-mono text-[11px] text-ink3">{url}</span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="shrink-0 font-mono text-[11px] text-accent2 hover:underline"
        >
          Open ↗
        </a>
      </div>

      {loaded ? (
        <iframe
          src={url}
          title={`${title} — live preview`}
          className="w-full border-0 bg-white"
          style={{ height }}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-4 px-6 text-center"
          style={{ height: Math.min(height, 320) }}
        >
          <p className="max-w-md text-sm leading-relaxed text-ink2">
            Load the deployed app right here in the page.
          </p>
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="border border-rule2 bg-bg px-5 py-2.5 font-mono text-[12px] tracking-wider text-ink transition-colors hover:border-accent2 hover:text-accent2"
          >
            LOAD LIVE PREVIEW
          </button>
          <p className="max-w-md font-mono text-[10.5px] leading-relaxed text-ink3">
            If it stays blank, the site blocks embedding — use Open ↗ instead.
          </p>
        </div>
      )}
    </div>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProject(slug)

  if (!project) return <Navigate to="/" replace />

  // A project with a bespoke page owns its own layout entirely.
  const bespoke = getBespokePage(slug)
  if (bespoke) return bespoke

  const index = projects.findIndex((p) => p.slug === slug)
  const next = projects[(index + 1) % projects.length]
  const links = Object.entries(project.links || {}).filter(([, v]) => v)

  return (
    <article className="pt-24 pb-8 md:pt-32">
      <ProjectTheme slug={slug} />
      <div className="shell">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-ink3 transition-colors hover:text-accent2"
        >
          ← Back to index
        </Link>

        {/* ── Header ── */}
        <header className="mt-8 border-b border-rule pb-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="t-label">{project.category}</span>
            <span className="h-3 w-px bg-rule" aria-hidden="true" />
            <span className="font-mono text-[11px] text-ink3">{project.year}</span>
            <span className="h-3 w-px bg-rule" aria-hidden="true" />
            <span className="font-mono text-[11px] text-ink3">{project.role}</span>
          </div>

          <h1 className="mt-5 font-display text-4xl font-black tracking-[-0.035em] text-ink sm:text-5xl md:text-6xl">
            {project.title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink2 md:text-xl">
            {project.blurb}
          </p>

          {project.award && (
            <p className="mt-6 inline-flex items-center gap-2 border border-accent bg-accent/5 px-3 py-1.5 font-mono text-[11.5px] tracking-wide text-accent">
              <svg viewBox="0 0 12 12" width="11" height="11" fill="currentColor" aria-hidden="true">
                <path d="M6 0l1.6 3.6L11.5 4l-3 2.7.8 3.9L6 8.7 2.7 10.6l.8-3.9L.5 4l3.9-.4L6 0z" />
              </svg>
              {project.award}
            </p>
          )}

          {links.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-3">
              {links.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border border-rule2 bg-bg2 px-4 py-2 font-mono text-[11.5px] tracking-wider text-ink transition-colors hover:border-accent2 hover:text-accent2"
                >
                  {(LINK_LABELS[key] || key).toUpperCase()} ↗
                </a>
              ))}
            </div>
          )}

          <ul className="mt-7 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li
                key={t}
                className="border border-rule px-2.5 py-1 font-mono text-[11px] text-ink3"
              >
                {t}
              </li>
            ))}
          </ul>
        </header>

        {/* ── Cover ── */}
        {project.cover && (
          <Reveal>
            <figure className="mt-10 border border-rule bg-bg2">
              <img
                src={project.cover}
                alt={`${project.title} — interface`}
                className="w-full object-cover object-top"
                loading="eager"
                decoding="async"
              />
            </figure>
          </Reveal>
        )}

        {/* ── Video ── */}
        {project.videos?.length > 0 && (
          <Block tag="WALKTHROUGH" title={project.videos.length > 1 ? 'On video' : 'See it running'}>
            <div
              className={`grid gap-5 ${project.videos.length > 1 ? 'lg:grid-cols-2' : 'max-w-3xl'}`}
            >
              {project.videos.map((v) => (
                <VideoEmbed key={v.id} id={v.id} label={v.label} />
              ))}
            </div>
          </Block>
        )}

        {/* ── Live embed ── */}
        {project.embed?.url && (
          <Block tag="LIVE" title="Running right here">
            <LivePreview
              url={project.embed.url}
              height={project.embed.height || 600}
              title={project.title}
            />
          </Block>
        )}

        {project.problem && (
          <Block tag="PROBLEM" title="What was actually broken">
            <Prose>{project.problem}</Prose>
          </Block>
        )}

        {project.approach && (
          <Block tag="APPROACH" title="How I attacked it">
            <Prose>{project.approach}</Prose>
          </Block>
        )}

        {/* ── Architecture: his own diagrams, preserved ── */}
        {project.architecture && (
          <Block tag="ARCHITECTURE" title="How it fits together">
            <div className="border border-rule bg-bg2 p-4 sm:p-6">
              <pre className="ascii">{project.architecture}</pre>
            </div>
          </Block>
        )}

        {/* ── Pipeline: a real sequence, so numbering is information ── */}
        {project.howItWorks?.length > 0 && (
          <Block tag="MECHANISM" title="Step by step">
            <ol className="border-t border-rule">
              {project.howItWorks.map((s, i) => (
                <li
                  key={s.step}
                  className="grid gap-x-5 gap-y-2 border-b border-rule py-5 sm:grid-cols-[48px_minmax(0,1fr)]"
                >
                  <span className="font-mono text-[11px] tracking-[0.14em] text-accent2">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.0625rem] font-bold tracking-tight text-ink">
                      {s.step}
                    </h3>
                    <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-ink2">
                      {s.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>
        )}

        {/* ── Screens ── */}
        {project.gallery?.length > 0 && (
          <Block
            tag="SCREENS"
            title={project.gallery.length > 4 ? 'From the programme' : 'What it looks like'}
          >
            <Gallery items={project.gallery} title={project.title} />
          </Block>
        )}

        {/* ── Challenges ── */}
        {project.challenges?.length > 0 && (
          <Block tag="HARD PARTS" title="Where it got difficult">
            <div className="grid gap-px border border-rule bg-rule">
              {project.challenges.map((c, i) => (
                <div key={i} className="bg-bg p-6">
                  <p className="flex gap-3 text-[15px] leading-relaxed text-ink">
                    <span className="mt-[3px] shrink-0 font-mono text-[11px] text-accent">✕</span>
                    <span>{c.challenge}</span>
                  </p>
                  <p className="mt-4 flex gap-3 text-[15px] leading-relaxed text-ink2">
                    <span className="mt-[3px] shrink-0 font-mono text-[11px] text-accent2">→</span>
                    <span>{c.solution}</span>
                  </p>
                </div>
              ))}
            </div>
          </Block>
        )}

        {/* ── Results ── */}
        {project.results?.length > 0 && (
          <Block tag="RESULTS" title="What it came out at">
            <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
              {project.results.map((r) => (
                <div key={r.label} className="bg-bg p-6">
                  <div className="font-display text-2xl font-black tracking-tight text-accent">
                    {r.metric}
                  </div>
                  <div className="mt-2 text-[13.5px] leading-snug text-ink2">{r.label}</div>
                </div>
              ))}
            </div>
          </Block>
        )}

        {project.learnings && (
          <Block tag="RETROSPECT" title="What I'd do differently">
            <Prose>{project.learnings}</Prose>
          </Block>
        )}

        {project.nextSteps?.length > 0 && (
          <Block tag="NEXT" title="Still open">
            <ul className="max-w-2xl space-y-2.5">
              {project.nextSteps.map((s) => (
                <li key={s} className="flex gap-3 text-[15px] leading-relaxed text-ink2">
                  <span className="mt-[9px] h-px w-3 shrink-0 bg-rule2" aria-hidden="true" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {/* ── Next project ── */}
        <nav className="mt-6 border-t border-rule pt-8">
          <Link to={`/projects/${next.slug}`} className="group block">
            <span className="t-label">Next project</span>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="font-display text-2xl font-black tracking-tight text-ink transition-colors group-hover:text-accent2 sm:text-3xl">
                {next.title}
              </span>
              <span
                className="shrink-0 font-mono text-lg text-ink3 transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent2"
                aria-hidden="true"
              >
                →
              </span>
            </div>
            <p className="mt-2 max-w-xl text-[15px] text-ink2">{next.blurb}</p>
          </Link>
        </nav>
      </div>
    </article>
  )
}
