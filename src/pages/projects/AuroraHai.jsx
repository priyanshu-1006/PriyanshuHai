import ProjectNext from '../../components/project/ProjectNext'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectTheme from '../../components/ProjectTheme'
import { BrowserFrame } from '../../components/Device'
import { Gallery, VideoEmbed, ArchitectureImage } from '../../components/Media'
import { useReveal } from '../../lib/useReveal'
import { getProject } from '../../data/projects'

const project = getProject('aurorahai')

const SOURCES = [
  { name: 'NOAA DSCOVR', data: 'IMF Bx, By, Bz, Bt · wind speed, density', every: '1 min', fail: 'fails over to ACE' },
  { name: 'NOAA OVATION', data: 'Aurora probability grid, 360×181', every: '30 min', fail: 'last-good retained' },
  { name: 'NOAA Kp', data: 'Planetary K-index, 0–9', every: '3 hr', fail: 'interpolated' },
  { name: 'NOAA Alerts', data: 'Geomagnetic storm alerts', every: 'event-driven', fail: '—' },
  { name: 'Open-Meteo', data: 'Cloud cover by layer, humidity, wind', every: 'on demand', fail: '15 min cache' },
]

const BANDS = [
  { min: 80, label: 'Excellent — go now', tone: 'accent' },
  { min: 60, label: 'Good — favourable', tone: 'accent3' },
  { min: 40, label: 'Moderate — possible with patience', tone: 'ink2' },
  { min: 0, label: 'Poor — unlikely', tone: 'ink3' },
]

const STRETCH = [
  { t: 'Substorm early warning', d: 'Monitors the rate of change of Bz to detect substorm onset five to fifteen minutes before peak. That window is the difference between catching it and reading about it.' },
  { t: 'Route optimiser', d: 'Searches concentric rings from 10 to 200 km for the five best nearby spots that are simultaneously dark, clear and aurora-active.' },
  { t: 'Photography advisor', d: 'Recommends ISO, aperture and shutter speed from the current aurora intensity classification.' },
  { t: 'Community sightings', d: 'Geo-tagged reports from other observers, because ground truth beats a model.' },
]

function Band({ children, className = '', id }) {
  const ref = useReveal()
  return (
    <section id={id} className={`scroll-mt-24 py-16 md:py-24 ${className}`}>
      <div ref={ref} className="reveal shell">{children}</div>
    </section>
  )
}

function Eyebrow({ children }) {
  return (
    <p className="t-label mb-4 flex items-center gap-3">
      <span className="inline-block h-px w-7 bg-accent" />
      {children}
    </p>
  )
}

/* ── Signature: the actual visibility formula, live ── */
function ScoreEngine() {
  const [aurora, setAurora] = useState(78)
  const [dark, setDark] = useState(85)
  const [clear, setClear] = useState(40)

  const score = Math.round(0.5 * aurora + 0.3 * dark + 0.2 * clear)
  const band = BANDS.find((b) => score >= b.min)
  const tone = `var(--c-${band.tone})`

  const inputs = [
    { key: 'aurora', label: 'Aurora probability', weight: 50, value: aurora, set: setAurora, of: 'OVATION, interpolated to your coordinates' },
    { key: 'dark', label: 'Sky darkness', weight: 30, value: dark, set: setDark, of: 'Bortle class · moon interference · solar terminator' },
    { key: 'clear', label: 'Sky clarity', weight: 20, value: clear, set: setClear, of: '60% low + 30% mid + 10% high cloud' },
  ]

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
      <div className="space-y-7">
        {inputs.map((i) => (
          <div key={i.key}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <label htmlFor={`aur-${i.key}`} className="text-[15px] font-medium text-ink">
                {i.label}
                <span className="ml-2 font-mono text-[12px] text-accent">×{i.weight}%</span>
              </label>
              <span className="font-mono text-[15px] tabular-nums text-ink">{i.value}</span>
            </div>
            <input
              id={`aur-${i.key}`}
              type="range"
              min="0"
              max="100"
              value={i.value}
              onChange={(e) => i.set(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--c-accent)]"
            />
            <p className="t-mono mt-2 text-ink3">{i.of}</p>
          </div>
        ))}

        <p className="border-t border-rule pt-5 font-mono text-[12.5px] text-ink2">
          score = 0.5 × aurora + 0.3 × darkness + 0.2 × clarity
        </p>
      </div>

      {/* readout */}
      <div className="rounded-2xl border border-rule bg-bg2 p-6 lg:sticky lg:top-24 lg:self-start">
        <p className="t-label mb-4">Visibility score</p>
        <div className="flex items-baseline gap-2">
          <span
            className="font-display text-6xl font-bold tabular-nums tracking-tight transition-colors duration-300"
            style={{ color: tone }}
          >
            {score}
          </span>
          <span className="font-mono text-lg text-ink3">/100</span>
        </div>
        <p className="mt-3 text-[15px] font-medium transition-colors duration-300" style={{ color: tone }}>
          {band.label}
        </p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-bg3">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${score}%`, background: tone, transitionTimingFunction: 'var(--ease)' }}
          />
        </div>

        <dl className="mt-6 space-y-2 border-t border-rule pt-4">
          {inputs.map((i) => (
            <div key={i.key} className="flex justify-between gap-4">
              <dt className="t-mono text-ink3">{i.label.split(' ')[0].toLowerCase()}</dt>
              <dd className="t-mono tabular-nums text-ink">
                {i.value} × {i.weight / 100} = {((i.value * i.weight) / 100).toFixed(1)}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 border-t border-rule pt-4 text-[13.5px] leading-relaxed text-ink2">
          Every sub-component stays visible. A low score should tell you whether to blame the sun,
          the moon or the weather.
        </p>
      </div>
    </div>
  )
}

export default function AuroraHai() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="aurorahai" />

      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[78vh]"
          style={{
            background:
              'radial-gradient(46% 42% at 66% 24%, color-mix(in oklab, var(--c-accent) 22%, transparent), transparent 70%),' +
              'radial-gradient(36% 36% at 22% 12%, color-mix(in oklab, var(--c-accent2) 16%, transparent), transparent 70%)',
          }}
        />
        <div className="shell relative">
          <Link to="/projects" className="t-mono inline-flex items-center gap-2 text-ink3 transition-colors hover:text-accent">
            ← All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              Data
            </span>
            <span className="t-mono text-ink3">2026 · Full stack · Orion Astrathon, IIT Mandi</span>
          </div>

          <h1 className="t-hero mt-7 text-ink" aria-label="Kp nine is worthless under cloud">
            Kp 9 is worthless
            <br />
            <span className="text-accent">under cloud.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            Every aurora forecast reports the planetary Kp index. It is a global number, and it
            cannot answer the only question a photographer actually has: can I see aurora from where
            I am standing, right now, and what should I do about it?
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            Aurora visibility is a <span className="font-semibold text-accent">join</span>, not a
            lookup. Space weather has to meet your sky.
          </p>

          <div className="mt-14">
            <BrowserFrame src={project.cover} alt="AuroraHai 3D aurora forecast map" label="aurorahai · 3D forecast map" aspect="1599 / 804" />
          </div>
        </div>
      </header>

      {/* ══ SCORE ENGINE — signature ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>The score</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Three factors, weighted and always visible.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          This is the real formula the platform runs on. Move the inputs.
        </p>
        <ScoreEngine />
      </Band>

      {/* ══ PIPELINE ══ */}
      <Band>
        <Eyebrow>The pipeline</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Five live sources, four polling loops.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Every external source will change its schema or go down, usually during a demo. Failover,
          schema-change detection and gap detection went into the collectors from the start — which
          is why the dashboard kept working when DSCOVR dropped out.
        </p>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-rule bg-bg2">
          <table className="w-full min-w-[620px] text-left">
            <thead>
              <tr className="border-b border-rule">
                <th className="t-label p-4 font-normal">Source</th>
                <th className="t-label p-4 font-normal">Data</th>
                <th className="t-label p-4 font-normal">Cadence</th>
                <th className="t-label p-4 font-normal">On failure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {SOURCES.map((s) => (
                <tr key={s.name}>
                  <td className="p-4 text-[14.5px] font-medium text-ink">{s.name}</td>
                  <td className="p-4 text-[14px] text-ink2">{s.data}</td>
                  <td className="p-4 font-mono text-[12.5px] text-accent">{s.every}</td>
                  <td className="p-4 font-mono text-[12.5px] text-ink3">{s.fail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-3">
          {[
            ['21', 'REST endpoints plus a live WebSocket stream'],
            ['360×181', 'OVATION grid interpolated per query'],
            ['5–15 min', 'Substorm warning lead time'],
          ].map(([v, l]) => (
            <div key={l} className="bg-bg2 p-5">
              <div className="font-display text-2xl font-bold tracking-tight text-accent">{v}</div>
              <p className="mt-2 text-[13.5px] leading-snug text-ink2">{l}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* ══ ARCHITECTURE ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Architecture</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">How it fits together.</h2>
        <div className="mt-8">
          <ArchitectureImage src={project.architectureImage} alt="AuroraHai system architecture" />
        </div>
        <p className="t-label mb-3 mt-10">As drawn in the repo</p>
        <div className="overflow-hidden rounded-2xl border border-rule bg-bg p-4 sm:p-6">
          <pre className="ascii">{project.architecture}</pre>
        </div>
      </Band>

      {/* ══ BEYOND ══ */}
      <Band>
        <Eyebrow>Beyond the score</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">What a photographer does next.</h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {STRETCH.map((s) => (
            <li key={s.t} className="rounded-2xl border border-rule bg-bg2 p-6">
              <h3 className="t-h3 text-ink">{s.t}</h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink2">{s.d}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* ══ VIDEO ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Walkthrough</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">See it running.</h2>
        <div className="mt-10 max-w-3xl">
          {project.videos.map((v) => (
            <VideoEmbed key={v.id} id={v.id} label={v.label} />
          ))}
        </div>
      </Band>

      {/* ══ SCREENS ══ */}
      <Band>
        <Eyebrow>Screens</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Maps, telemetry and advice.</h2>
        <div className="mt-10">
          <Gallery items={project.gallery} title="AuroraHai" />
        </div>
      </Band>

      {/* ══ NEXT ══ */}
      <ProjectNext slug={project.slug} />
    </article>
  )
}
