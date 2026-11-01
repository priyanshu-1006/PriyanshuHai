import { Link } from 'react-router-dom'
import { projects } from '../../data/projects'

const SELECTION = ['nexsus-universe', 'little-code', 'manakmitra', 'little-terminal']
const RECENT = ['mmmut-notice', 'satyadwar']

export default function Featured() {
  return (
    <section id="work" className="selected-work shell">
      <header className="work-heading">
        <div>
          <p className="t-label">01 / Selected systems</p>
          <h2>
            Different problems.
            <br />
            <span className="studio-serif">Same instinct to build.</span>
          </h2>
        </div>
        <Link to="/projects" className="work-index-link">
          The complete index <span>{projects.length} projects ↗</span>
        </Link>
      </header>
      <div className="work-grid">
        {SELECTION.map((slug, i) => {
          const p = projects.find((item) => item.slug === slug)
          return (
            <Link key={slug} to={`/projects/${slug}`} className={`work-item work-item-${i}`}>
              <div className="work-image">
                <div className="work-image-label">
                  <span>
                    0{i + 1} / {p.category}
                  </span>
                  <span>{p.status}</span>
                </div>
                <img
                  src={p.cover}
                  alt={`${p.title} product interface`}
                  width="1200"
                  height="750"
                  loading="lazy"
                  decoding="async"
                />
                <span className="work-open" aria-hidden="true">
                  ↗
                </span>
              </div>
              <div className="work-caption">
                <h3>{p.title}</h3>
                <span aria-hidden="true">↗</span>
              </div>
              <p>{p.blurb}</p>
            </Link>
          )
        })}
      </div>
      <div className="work-latest">
        <p className="t-label">Also on the desk</p>
        {RECENT.map((slug) => {
          const p = projects.find((item) => item.slug === slug)
          return (
            <Link key={slug} to={`/projects/${slug}`}>
              <span>{p.title}</span>
              <small>
                {p.category} / {p.year}
              </small>
              <span aria-hidden="true">↗</span>
            </Link>
          )
        })}
      </div>
      <div className="studio-proof">
        <div>
          <span className="t-label">A few outcomes</span>
          <p>
            Code is the starting point.
            <br />
            This is what came out of it.
          </p>
        </div>
        <dl>
          {[
            ['₹2.5L', 'Architecture grant · IIIT Allahabad'],
            ['200+', 'MMMUT admissions supported'],
            ['National winner', 'Upskill India · Techfest ’25'],
          ].map(([value, label]) => (
            <div key={label}>
              <dt>{value}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
