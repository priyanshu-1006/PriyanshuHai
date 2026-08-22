import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ParticleField from '../components/ParticleField'
import { publishedPosts } from '../data/posts'
import { projects } from '../data/projects'
import { projectThemes, base } from '../data/projectThemes'
import { useTheme } from '../lib/themeContext'
import { useReveal } from '../lib/useReveal'

const ALL = 'All'

const fmtDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

function PostCard({ post, feature = false }) {
  const ref = useReveal()
  const { mode } = useTheme()
  const accent = projectThemes[post.project]?.[mode]?.accent || base[mode].ink
  const project = projects.find((p) => p.slug === post.project)

  return (
    <li ref={ref} className={`reveal ${feature ? 'sm:col-span-2' : ''}`}>
      <Link
        to={`/blog/${post.slug}`}
        className="group flex h-full flex-col rounded-3xl border border-rule bg-bg2 p-6 transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl lg:p-7"
        style={{ transitionTimingFunction: 'var(--ease)' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '' }}
      >
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
          <span className="t-mono ml-auto text-ink3">{post.minutes} min</span>
        </div>

        <h2
          className={`mt-4 font-display font-bold tracking-tight text-ink ${
            feature ? 't-h2' : 't-h3'
          }`}
        >
          {post.title}
        </h2>

        <p className={`mt-3 flex-1 leading-relaxed text-ink2 ${feature ? 'text-[15.5px]' : 'text-[14.5px]'}`}>
          {post.dek}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-rule pt-4">
          <span className="t-mono text-ink3">{fmtDate(post.date)}</span>
          {project && (
            <span className="t-mono truncate text-ink3">on {project.title}</span>
          )}
          <span
            className="shrink-0 text-[15px] transition-transform duration-300 group-hover:translate-x-1"
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

export default function Blog() {
  const ref = useReveal()
  const [tag, setTag] = useState(ALL)

  const tags = useMemo(() => {
    const counts = new Map()
    for (const p of publishedPosts) for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1)
    return [[ALL, publishedPosts.length], ...[...counts.entries()].sort((a, b) => b[1] - a[1])]
  }, [])

  const sorted = useMemo(
    () => [...publishedPosts].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [],
  )
  const shown = tag === ALL ? sorted : sorted.filter((p) => p.tags.includes(tag))

  return (
    <main className="pt-28 md:pt-32">
      {/* ── Hero, with the Waves shader ── */}
      <header className="relative overflow-hidden pb-6">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <ParticleField
            style={{
              maskImage: 'radial-gradient(110% 100% at 50% 0%, #000 0%, rgba(0,0,0,0.6) 55%, transparent 92%)',
              WebkitMaskImage: 'radial-gradient(110% 100% at 50% 0%, #000 0%, rgba(0,0,0,0.6) 55%, transparent 92%)',
            }}
          />
        </div>

        <div className="shell relative">
          <p className="t-label mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-7 bg-accent" />
            Writing
          </p>
          <h1 className="t-hero max-w-3xl text-ink">
            Notes from <span className="t-accent text-accent">shipping</span>.
          </h1>
          <p className="t-lead mt-6 max-w-2xl">
            Decisions I had to actually defend — the architecture calls that paid off, the ones that
            did not, and the results I would rather have quietly dropped.
          </p>
          <p className="t-mono mt-6 text-ink3">
            {publishedPosts.length} posts · roughly{' '}
            {publishedPosts.reduce((a, p) => a + p.minutes, 0)} minutes of reading
          </p>
        </div>
      </header>

      {/* ── Tag filter ── */}
      <div className="sticky top-[76px] z-30 border-y border-rule bg-bg/85 py-3 backdrop-blur-xl">
        <div className="shell">
          <ul className="flex gap-2 overflow-x-auto pb-1">
            {tags.map(([t, n]) => {
              const on = t === tag
              return (
                <li key={t} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setTag(t)}
                    aria-pressed={on}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-[13.5px] transition-colors ${
                      on
                        ? 'border-accent bg-accent text-onaccent'
                        : 'border-rule bg-bg2 text-ink2 hover:border-rule2 hover:text-ink'
                    }`}
                  >
                    {t}
                    <span className={`font-mono text-[11px] ${on ? 'opacity-70' : 'text-ink3'}`}>
                      {n}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <section ref={ref} className="reveal py-12 md:py-16">
        <div className="shell">
          <ul className="grid gap-5 sm:grid-cols-2">
            {shown.map((p, i) => (
              <PostCard key={p.slug} post={p} feature={tag === ALL && i === 0} />
            ))}
          </ul>
          {shown.length === 0 && (
            <p className="py-16 text-center text-ink3">Nothing tagged {tag} yet.</p>
          )}
        </div>
      </section>
    </main>
  )
}
