import { useMemo, useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import { useReveal } from '../lib/useReveal'

const ALL = 'All'

export default function Projects() {
  const ref = useReveal()
  const [filter, setFilter] = useState(ALL)

  const categories = useMemo(() => {
    const counts = new Map()
    for (const p of projects) counts.set(p.category, (counts.get(p.category) || 0) + 1)
    return [[ALL, projects.length], ...[...counts.entries()].sort((a, b) => b[1] - a[1])]
  }, [])

  const shown = filter === ALL ? projects : projects.filter((p) => p.category === filter)

  return (
    <main className="pt-28 md:pt-32">
      <header className="relative overflow-hidden pb-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-48 h-[60vh]"
          style={{
            background:
              'radial-gradient(46% 42% at 70% 26%, color-mix(in oklab, var(--c-accent) 20%, transparent), transparent 72%)',
          }}
        />
        <div className="shell relative">
          <p className="t-label mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-7 bg-accent" />
            Index
          </p>
          <h1 className="t-hero max-w-3xl text-ink">
            Everything I&apos;ve <span className="t-accent text-accent">built</span>.
          </h1>
          <p className="t-lead mt-6 max-w-2xl">
            Nineteen projects — startups, hackathon builds, a campus ecosystem and a couple of
            things that only exist because nobody else was going to make them. Each opens a case
            study with its own design, architecture and the parts that were genuinely hard.
          </p>
        </div>
      </header>

      {/* filter rail */}
      <div className="sticky top-[76px] z-30 border-y border-rule bg-bg/85 py-3 backdrop-blur-xl">
        <div className="shell">
          <ul className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(([cat, n]) => {
              const on = cat === filter
              return (
                <li key={cat} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setFilter(cat)}
                    aria-pressed={on}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-[13.5px] transition-colors ${
                      on
                        ? 'border-accent bg-accent text-onaccent'
                        : 'border-rule bg-bg2 text-ink2 hover:border-rule2 hover:text-ink'
                    }`}
                  >
                    {cat}
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
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </ul>

          {shown.length === 0 && (
            <p className="py-16 text-center text-ink3">Nothing in this category yet.</p>
          )}
        </div>
      </section>
    </main>
  )
}
