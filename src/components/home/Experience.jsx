import { useState } from 'react'
import { profile } from '../../data/profile'
import { orgBrand } from '../../data/brand'
import BrandMark from '../BrandMark'
import { useReveal } from '../../lib/useReveal'

const TAG_TONE = {
  BUILD: 'text-accent border-accent/40 bg-accent/8',
  LEAD: 'text-accent2 border-accent2/40 bg-accent2/8',
  SHIP: 'text-ink3 border-rule',
}

/**
 * One role. Collapsed it is a scannable row; expanded it reveals the detail.
 *
 * The old version printed every bullet for every role inline, which turned the
 * section into a wall nobody reads. Seven roles at a glance, detail on demand.
 */
function Role({ job, open, onToggle }) {
  const brand = orgBrand(job.org)
  const id = `role-${job.org.replace(/\W+/g, '-')}-${job.period.replace(/\W+/g, '')}`

  return (
    <li
      className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
        open ? 'border-accent/50 bg-bg2' : 'border-rule bg-bg2/50 hover:border-rule2'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center gap-4 p-5 text-left sm:gap-5"
      >
        {brand ? (
          <BrandMark brand={brand} size={46} />
        ) : (
          <span className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-xl border border-rule bg-bg font-display text-[15px] font-bold text-ink3">
            {job.org.slice(0, 1)}
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[16px] font-bold text-ink sm:text-[17px]">
            {job.role}
          </span>
          <span className="mt-0.5 block truncate text-[13.5px] text-ink2">{job.org}</span>
        </span>

        <span className="hidden shrink-0 sm:block">
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] ${
              TAG_TONE[job.tag] || TAG_TONE.SHIP
            }`}
          >
            {job.tag}
          </span>
        </span>

        <span className="t-mono hidden shrink-0 text-ink3 md:block">{job.period}</span>

        <span
          className={`shrink-0 font-mono text-lg transition-transform duration-300 ${
            open ? 'rotate-45 text-accent' : 'text-ink3'
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      {open && (
        <div id={id} className="border-t border-rule px-5 pb-6 pt-5 sm:pl-[86px]">
          <p className="t-mono mb-4 text-ink3 md:hidden">{job.period}</p>
          <ul className="space-y-3">
            {job.points.map((pt, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink2">
                <span className="mt-[10px] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
          {job.link && (
            <a
              href={job.link}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 inline-flex items-center gap-1.5 font-mono text-[12px] text-accent2 transition-opacity hover:opacity-75"
            >
              {job.link.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} ↗
            </a>
          )}
        </div>
      )}
    </li>
  )
}

export default function Experience() {
  const [open, setOpen] = useState(0)
  const ref = useReveal()

  return (
    <section id="experience" className="scroll-mt-24 py-20 md:py-24">
      <div className="shell">
        <div ref={ref} className="reveal">
          <p className="t-label mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-7 bg-accent" />
            Experience
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="t-h1 max-w-2xl text-ink">Where I&apos;ve been operating.</h2>
            <p className="t-mono text-ink3">{profile.experience.length} roles · tap to expand</p>
          </div>
        </div>

        <ul className="mt-10 space-y-2.5">
          {profile.experience.map((job, i) => (
            <Role
              key={`${job.org}-${job.role}-${i}`}
              job={job}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
