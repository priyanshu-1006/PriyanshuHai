import { Link } from 'react-router-dom'
import Coverflow from '../Coverflow'
import { projects } from '../../data/projects'
import { useReveal } from '../../lib/useReveal'

const featured = projects.filter((p) => p.featured)

export default function Featured() {
  const ref = useReveal()

  return (
    <section id="work" className="scroll-mt-24 overflow-hidden py-20 md:py-28">
      <div className="shell">
        <div ref={ref} className="reveal">
          <p className="t-label mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-7 bg-accent" />
            Selected work
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="t-h1 max-w-2xl text-ink">
              Systems that shipped, and the people using them.
            </h2>
            <Link to="/projects" className="pill pill-ghost shrink-0">
              All {projects.length} projects
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <Coverflow items={featured} ariaLabel="Featured projects" />
      </div>
    </section>
  )
}
