import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { profile } from '../../data/profile'
import { timeline, certifications, KINDS } from '../../data/timeline'
import { useReveal } from '../../lib/useReveal'

/**
 * The record as a dated rail rather than a trophy shelf.
 *
 * Two things the ordering has to carry that a plain list cannot. First, density:
 * one entry in 2021 and eight in 2026 is the actual shape of the story, and it
 * only reads if the years share a scale. Second, the pivot — the rail below
 * January 2025 is drawn dashed and dim, because the years before the six-month
 * pact are not continuous with the years after it.
 *
 * Entries are newest first, so the most relevant work is not below the fold.
 */

/* Kinds map to the page's accent slots; ink2 is the neutral for roles. */
const toneVar = (k) => (KINDS[k].tone === 'ink2' ? 'var(--c-ink2)' : `var(--c-${KINDS[k].tone})`)

const PRE_PACT_YEAR = 2025

function Entry({ item, first }) {
  const tone = toneVar(item.kind)
  const pre = Number(item.year) < PRE_PACT_YEAR
  const big = item.weight === 'primary'

  const body = (
    <>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <h3
          className={`font-display font-bold leading-snug text-ink ${big ? 'text-[17px] sm:text-[19px]' : 'text-[15.5px]'}`}
        >
          {item.title}
        </h3>
        {item.pivot && (
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]"
            style={{ background: 'color-mix(in oklab, var(--c-accent) 16%, transparent)', color: 'var(--c-accent)' }}
          >
            The turn
          </span>
        )}
      </div>
      <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink2">{item.detail}</p>
      {item.href && (
        <span className="t-mono mt-2.5 inline-flex items-center gap-1.5 text-ink3 transition-colors group-hover:text-accent">
          Read more
          <span aria-hidden="true">&rarr;</span>
        </span>
      )}
    </>
  )

  return (
    <li className="grid grid-cols-[24px_1fr] gap-x-5 sm:grid-cols-[104px_24px_1fr] sm:gap-x-6">
      {/* date */}
      <p
        className="t-mono order-2 pt-0.5 sm:order-none sm:col-start-1 sm:pt-[3px]"
        style={{ color: pre ? 'var(--c-ink3)' : tone }}
      >
        {item.when}
      </p>

      {/* rail */}
      <div className="relative order-1 row-span-2 flex justify-center sm:order-none sm:col-start-2 sm:row-span-1" aria-hidden="true">
        <span
          className="absolute w-px"
          style={{
            top: first ? '10px' : 0,
            bottom: 0,
            background: pre
              ? 'repeating-linear-gradient(to bottom, var(--c-rule2) 0 3px, transparent 3px 9px)'
              : 'var(--c-rule2)',
          }}
        />
        <span
          className="relative mt-[5px] shrink-0 rounded-full ring-4 ring-bg"
          style={{
            width: big ? 11 : 8,
            height: big ? 11 : 8,
            background: tone,
            // 0.7 is the floor that keeps every kind x theme pairing above the
            // 3:1 AA bar for graphical objects. Below it the light-mode dots
            // drop to ~2.5:1 and a state-rank NTSE stops being visible at all.
            opacity: pre ? 0.7 : 1,
          }}
        />
      </div>

      {/* content */}
      <div className="order-3 pb-9 sm:order-none sm:col-start-3">
        {item.href ? (
          <Link to={item.href} className="group block">
            {body}
          </Link>
        ) : (
          body
        )}
      </div>
    </li>
  )
}

function YearRule({ year, count }) {
  return (
    <li className="grid grid-cols-[24px_1fr] gap-x-5 pb-6 sm:grid-cols-[104px_24px_1fr] sm:gap-x-6">
      <div className="order-2 sm:order-none sm:col-start-1" />
      <div className="relative order-1 row-span-2 flex justify-center sm:order-none sm:col-start-2 sm:row-span-1" aria-hidden="true">
        <span className="absolute inset-y-0 w-px bg-rule" />
      </div>
      <div className="order-3 flex items-baseline gap-4 border-b border-rule pb-3 sm:order-none sm:col-start-3">
        <span className="font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">{year}</span>
        <span className="t-mono text-ink3">
          {count} {count === 1 ? 'entry' : 'entries'}
        </span>
      </div>
    </li>
  )
}

export default function Timeline() {
  const [filter, setFilter] = useState('all')
  const headRef = useReveal()

  const items = useMemo(
    () => (filter === 'all' ? timeline : timeline.filter((t) => t.kind === filter)),
    [filter],
  )

  /* Group into years without losing order. */
  const groups = useMemo(() => {
    const out = []
    for (const item of items) {
      const last = out[out.length - 1]
      if (last && last.year === item.year) last.items.push(item)
      else out.push({ year: item.year, items: [item] })
    }
    return out
  }, [items])

  const counts = useMemo(() => {
    const c = { all: timeline.length }
    for (const t of timeline) c[t.kind] = (c[t.kind] || 0) + 1
    return c
  }, [])

  return (
    <section id="record" className="scroll-mt-24 py-20 md:py-24">
      <div className="shell">
        <div ref={headRef} className="reveal">
          <p className="t-label mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-7 bg-accent" />
            Record
          </p>
          <h2 className="t-h1 max-w-2xl text-ink">Five years, and one of them did the work.</h2>
          <p className="t-lead mt-5 max-w-2xl">
            Competitions, deployments and the decisions in between. The gap between 2021 and 2025 is
            not a formatting accident.
          </p>
        </div>

        {/* ── Filter ── */}
        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter the record">
          {[['all', 'Everything'], ...Object.entries(KINDS).map(([k, v]) => [k, v.label])].map(
            ([key, label]) => {
              const on = filter === key
              const tone = key === 'all' ? 'var(--c-ink)' : toneVar(key)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  aria-pressed={on}
                  className="rounded-full border px-3.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.1em] transition-colors"
                  style={{
                    borderColor: on ? tone : 'var(--c-rule)',
                    color: on ? tone : 'var(--c-ink3)',
                    background: on ? `color-mix(in oklab, ${tone} 10%, transparent)` : 'transparent',
                  }}
                >
                  {label}
                  <span className="ml-2 opacity-55">{counts[key] || 0}</span>
                </button>
              )
            },
          )}
        </div>

        {/* ── Rail ── */}
        <ol className="mt-12">
          {groups.map((g, gi) => (
            <li key={g.year}>
              <ol>
                <YearRule year={g.year} count={g.items.length} />
                {g.items.map((item, i) => (
                  <Entry key={item.title} item={item} first={gi === 0 && i === 0} />
                ))}
              </ol>
            </li>
          ))}
        </ol>

        {/* ── Certifications ── */}
        <div className="mt-6 border-t border-rule pt-14">
          <p className="t-label mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-7 bg-accent2" />
            Certifications
          </p>
          <h2 className="t-h2 max-w-2xl text-ink">Coursework and credentials.</h2>

          {certifications.length > 0 ? (
            <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((c) => {
                const inner = (
                  <>
                    {/* The certificate itself, when the image is in public/Certificates. */}
                    {c.image && (
                      <img
                        src={c.image}
                        alt={`${c.name} certificate`}
                        loading="lazy"
                        decoding="async"
                        className="mb-4 block w-full rounded-lg border border-rule object-cover"
                        style={{ aspectRatio: '4 / 3' }}
                      />
                    )}
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-[15.5px] font-bold leading-snug text-ink">
                        {c.name}
                      </h3>
                      {c.href && (
                        <span className="t-mono shrink-0 text-ink3 transition-colors group-hover:text-accent2" aria-hidden="true">
                          &#8599;
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[14px] text-ink2">{c.issuer}</p>
                    <p className="t-mono mt-3 text-ink3">
                      {c.when}
                      {c.credentialId ? ` · ${c.credentialId}` : ''}
                    </p>
                  </>
                )
                return (
                  <li key={c.name}>
                    {c.href ? (
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group block h-full rounded-2xl border border-rule bg-bg2 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent2/50"
                        style={{ transitionTimingFunction: 'var(--ease)' }}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="h-full rounded-2xl border border-rule bg-bg2 p-5">{inner}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink2">
              Listed on request, and on{' '}
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent2 underline decoration-accent2/40 underline-offset-4 hover:decoration-accent2"
              >
                LinkedIn
              </a>
              .
            </p>
          )}
        </div>

        {/* ── Schooling ── */}
        <div className="mt-14 border-t border-rule pt-14">
          <p className="t-label mb-6 flex items-center gap-3">
            <span className="inline-block h-px w-7 bg-accent3" />
            Schooling
          </p>
          <ul className="grid gap-x-10 gap-y-0 border-t border-rule sm:grid-cols-2">
            {profile.education.map((e) => (
              <li key={`${e.school}-${e.period}`} className="border-b border-rule py-5">
                <p className="t-mono text-ink3">{e.period}</p>
                <h3 className="mt-2 font-display text-[15px] font-bold leading-snug text-ink">
                  {e.school}
                </h3>
                <p className="mt-1.5 text-sm text-ink2">{e.degree}</p>
                {e.detail && <p className="t-mono mt-1.5 text-ink3">{e.detail}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
