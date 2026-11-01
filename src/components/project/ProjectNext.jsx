import { Link } from 'react-router-dom'
import { projects } from '../../data/projects'

export default function ProjectNext({ slug }) {
  const index = projects.findIndex((project) => project.slug === slug)
  const next = projects[(index + 1) % projects.length]
  return (
    <div className="shell pb-10 pt-6">
      <Link
        to={`/projects/${next.slug}`}
        className="group block rounded-2xl border border-rule bg-bg2 p-7 transition-colors hover:border-accent/50"
      >
        <span className="t-label">Next project</span>
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="t-h2 text-ink transition-colors group-hover:text-accent">
            {next.title}
          </span>
          <span aria-hidden="true" className="text-xl text-ink3">
            →
          </span>
        </div>
        <p className="mt-2 max-w-xl text-[15px] text-ink2">{next.blurb}</p>
      </Link>
    </div>
  )
}
