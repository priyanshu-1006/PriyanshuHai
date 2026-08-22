import { Link } from 'react-router-dom'
import { profile } from '../../data/profile'
import { projectThemes } from '../../data/projectThemes'
import { useTheme } from '../../lib/themeContext'
import ParticleField from '../ParticleField'

/**
 * Editorial hero.
 *
 * The illustration ships on pure black and pure white, matched to the two
 * themes — so it gets no frame, no border and no scrim. The figure emerges
 * straight out of the page background, which only works because the asset
 * backgrounds are exactly the theme backgrounds.
 */

const ORGS = [
  { role: 'CTO', org: 'Gryork', theme: 'gryork', href: 'https://www.gryork.com' },
  { role: 'CTO', org: 'Washtro', theme: 'washtro', href: 'https://www.washtro.com' },
  { role: 'President', org: 'Nexsus', theme: 'nexsus-universe', href: 'https://mmmut.app' },
]

export default function Hero() {
  const { mode } = useTheme()
  const [first, ...rest] = profile.name.split(' ')
  const last = rest.join(' ')
  const portrait = mode === 'light' ? '/Me-light.png' : '/Me-dark.png'

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      {/* particle field — quiet, no hard edges */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <ParticleField
          color={mode === 'light' ? '154, 98, 8' : '233, 160, 59'}
          density={mode === 'light' ? 0.00007 : 0.00011}
          style={{
            maskImage: 'radial-gradient(120% 100% at 50% 0%, #000 0%, rgba(0,0,0,0.65) 55%, transparent 92%)',
            WebkitMaskImage: 'radial-gradient(120% 100% at 50% 0%, #000 0%, rgba(0,0,0,0.65) 55%, transparent 92%)',
          }}
        />
      </div>

      <div className="shell relative">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-rule bg-bg2 px-3.5 py-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                  style={{ animation: 'pulse-signal 2.4s ease-in-out infinite' }}
                />
                <span className="t-mono text-ink2">{profile.availability}</span>
              </span>
              <span className="t-label">{profile.role}</span>
            </div>

            <h1 className="t-display mt-6 text-ink" aria-label={profile.name}>
              <span aria-hidden="true" className="block">{first}</span>
              <span aria-hidden="true" className="t-accent block text-accent">{last}</span>
            </h1>

            <p className="t-lead mt-7 max-w-xl">
              {profile.tagline}{' '}
              <span className="text-ink">
                Two startups run on architecture I designed. A university runs its timetable on
                a platform I built.
              </span>
            </p>

            <ul className="mt-8 grid max-w-xl grid-cols-3 gap-2.5">
              {ORGS.map((o) => {
                const accent = projectThemes[o.theme]?.[mode]?.accent || 'var(--c-accent)'
                return (
                  <li key={o.org}>
                    <a
                      href={o.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block rounded-2xl border border-rule bg-bg2 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5"
                      style={{ transitionTimingFunction: 'var(--ease)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '' }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                        <span className="truncate text-[13.5px] font-semibold text-ink">{o.role}</span>
                      </span>
                      <span className="mt-1 block truncate font-mono text-[11px] text-ink3">{o.org}</span>
                    </a>
                  </li>
                )
              })}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/projects" className="pill pill-solid">
                See the work
                <span aria-hidden="true">→</span>
              </Link>
              <a href="#contact" className="pill pill-ghost">Get in touch</a>
            </div>
          </div>

          {/* No frame: the asset background is the page background. */}
          <div className="order-first mx-auto w-full max-w-[300px] lg:order-none lg:max-w-none">
            <img
              key={portrait}
              src={portrait}
              alt={`${profile.name}, illustrated at his desk`}
              width={1129}
              height={1411}
              fetchPriority="high"
              className="w-full select-none"
              draggable="false"
            />
          </div>
        </div>

        <dl className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {profile.signals.map((s) => (
            <div key={s.label} className="bg-bg2 p-5 lg:p-6">
              <dt className="font-display text-3xl font-black tracking-tight text-accent lg:text-4xl">
                {s.value}
              </dt>
              <dd className="mt-2.5 text-[13.5px] leading-snug text-ink2">{s.label}</dd>
              <dd className="t-mono mt-1.5 text-ink3">{s.ref}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
