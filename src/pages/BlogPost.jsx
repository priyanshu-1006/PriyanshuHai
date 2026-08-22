import { Link, useParams, Navigate } from 'react-router-dom'
import { getPost, publishedPosts } from '../data/posts'
import { projects } from '../data/projects'
import { projectThemes, base } from '../data/projectThemes'
import { useTheme } from '../lib/themeContext'
import { useReveal } from '../lib/useReveal'

const fmtDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

/** Renders one typed body block. Keeps all article typography in one place. */
function Block({ block, accent }) {
  switch (block.t) {
    case 'h':
      return <h2 className="t-h2 mt-14 mb-5 text-ink">{block.c}</h2>
    case 'ul':
      return (
        <ul className="my-6 space-y-3">
          {block.c.map((li, i) => (
            <li key={i} className="flex gap-4 text-[1.0625rem] leading-[1.75] text-ink2">
              <span className="mt-[13px] h-px w-3.5 shrink-0" style={{ background: accent }} aria-hidden="true" />
              <span>{li}</span>
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className="my-6 space-y-3">
          {block.c.map((li, i) => (
            <li key={i} className="flex gap-4 text-[1.0625rem] leading-[1.75] text-ink2">
              <span className="mt-0.5 shrink-0 font-mono text-[13px] tabular-nums" style={{ color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{li}</span>
            </li>
          ))}
        </ol>
      )
    case 'quote':
      return (
        <blockquote className="my-10 border-l-2 pl-6" style={{ borderColor: accent }}>
          <p className="text-[1.1875rem] leading-[1.65] text-ink">{block.c}</p>
        </blockquote>
      )
    case 'code':
      return (
        <div className="my-8 overflow-x-auto rounded-2xl border border-rule bg-bg2 p-5">
          <pre className="ascii">{block.c}</pre>
        </div>
      )
    default:
      return <p className="my-5 text-[1.0625rem] leading-[1.75] text-ink2">{block.c}</p>
  }
}

export default function BlogPost() {
  const { slug } = useParams()
  const ref = useReveal()
  const { mode } = useTheme()
  const post = getPost(slug)

  if (!post) return <Navigate to="/blog" replace />

  const accent = projectThemes[post.project]?.[mode]?.accent || base[mode].ink
  const project = projects.find((p) => p.slug === post.project)
  const idx = publishedPosts.findIndex((p) => p.slug === slug)
  const next = publishedPosts[(idx + 1) % publishedPosts.length]

  return (
    <article className="pt-28 md:pt-32">
      <div className="shell">
        <Link
          to="/blog"
          className="t-mono inline-flex items-center gap-2 text-ink3 transition-colors hover:text-accent"
        >
          ← All writing
        </Link>

        {/* ── Header ── */}
        <header className="mx-auto mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em]"
                style={{ background: `color-mix(in oklab, ${accent} 16%, transparent)`, color: accent }}
              >
                {t}
              </span>
            ))}
            <span className="t-mono text-ink3">{fmtDate(post.date)}</span>
            <span className="t-mono text-ink3">· {post.minutes} min read</span>
          </div>

          <h1 className="t-hero mt-6 text-ink">{post.title}</h1>
          <p className="t-lead mt-6">{post.dek}</p>

          {post.pdf && (
            <a
              href={post.pdf}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-rule bg-bg2 px-4 py-2 font-mono text-[12px] text-ink2 transition-colors hover:border-accent hover:text-accent"
            >
              Read the original PDF ↗
            </a>
          )}

          {project && (
            <Link
              to={`/projects/${project.slug}`}
              className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-rule bg-bg2 p-4 transition-colors hover:border-rule2"
            >
              <span className="min-w-0">
                <span className="t-label block">Related case study</span>
                <span className="mt-1 block truncate font-display text-[15px] font-bold text-ink">
                  {project.title}
                </span>
              </span>
              <span className="shrink-0 text-[15px]" style={{ color: accent }} aria-hidden="true">→</span>
            </Link>
          )}
        </header>

        {/* ── Body ── */}
        {/* Measure. Note `ch` is the width of the ZERO glyph (0.66em here), not
            the average character (0.45em) — 66ch measured out at 98 real
            characters. 34rem lands around 72, inside the comfortable range. */}
        <div ref={ref} className="reveal mx-auto mt-12 max-w-[34rem] border-t border-rule pt-4">
          {post.body.map((block, i) => (
            <Block key={i} block={block} accent={accent} />
          ))}
        </div>

        {/* ── Next ── */}
        {next && next.slug !== post.slug && (
          <nav className="mx-auto mt-20 max-w-3xl pb-10">
            <Link
              to={`/blog/${next.slug}`}
              className="group block rounded-2xl border border-rule bg-bg2 p-7 transition-colors hover:border-accent/50"
            >
              <span className="t-label">Next post</span>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="t-h3 text-ink transition-colors group-hover:text-accent">
                  {next.title}
                </span>
                <span
                  className="shrink-0 text-xl text-ink3 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
              <p className="mt-2 text-[15px] text-ink2">{next.dek}</p>
            </Link>
          </nav>
        )}
      </div>
    </article>
  )
}
