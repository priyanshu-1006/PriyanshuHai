import { useState } from 'react'
import ProjectTheme from '../../components/ProjectTheme'
import { BrowserFrame } from '../../components/Device'
import { Gallery, VideoEmbed } from '../../components/Media'
import { Band, Eyebrow, BackLink, Meta, NextProject, Retrospect } from '../../components/project/Scaffold'
import { getProject } from '../../data/projects'

const project = getProject('pathfinder-ai')

/* The output shape is the product. Prose cannot be ticked off. */
const ROADMAP = [
  { step: 'Python fundamentals + pandas', weeks: '3 weeks' },
  { step: 'SQL and relational modelling', weeks: '2 weeks' },
  { step: 'Airflow — build one real pipeline', weeks: '3 weeks' },
  { step: 'Spark basics on a public dataset', weeks: '4 weeks' },
  { step: 'Cloud warehouse — BigQuery or Redshift', weeks: '2 weeks' },
  { step: 'Portfolio project, end to end', weeks: '4 weeks' },
]

export default function PathFinder() {
  const [done, setDone] = useState([0, 1])
  const toggle = (i) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))
  const pct = Math.round((done.length / ROADMAP.length) * 100)

  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="pathfinder-ai" />

      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[62vh]"
          style={{ background: 'radial-gradient(42% 38% at 68% 24%, color-mix(in oklab, var(--c-accent) 20%, transparent), transparent 70%)' }}
        />
        <div className="shell relative">
          <BackLink />
          <Meta category="AI Systems">2025 · Full stack</Meta>

          <h1 className="t-hero mt-7 text-ink" aria-label="Advice you can tick off">
            Advice you can
            <br />
            <span className="text-accent">tick off.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            Career advice given to Indian engineering students is either uselessly generic —
            &ldquo;learn DSA, do projects&rdquo; — or written for a job market that isn&apos;t
            theirs, with salary bands and company names from somewhere else entirely.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            And even good advice usually stops at the recommendation. It tells you to become a data
            engineer without telling you what the next twelve weeks look like.
          </p>

          <div className="mt-14">
            <BrowserFrame src="/pathfinder.png" alt="PathFinder AI roadmap" label="pathfinder · roadmap" />
          </div>
        </div>
      </header>

      {/* ── Prose vs schema — signature ── */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>The insight</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Prompt engineering was really schema design.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Ask a model for career advice and it returns beautifully written prose — which is exactly
          the wrong format, because you cannot track progress against a paragraph.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-rule bg-bg p-6 opacity-80">
            <p className="t-label mb-3">Asking for advice</p>
            <p className="text-[14.5px] italic leading-relaxed text-ink2">
              &ldquo;Data engineering would suit your interest in systems. You should build a strong
              foundation in Python and SQL, then explore distributed processing frameworks and
              orchestration tools. Cloud platforms are increasingly important…&rdquo;
            </p>
            <p className="mt-5 border-t border-rule pt-4 font-mono text-[12px] text-accent3">
              read once · closed · unmeasurable
            </p>
          </div>

          <div className="rounded-2xl border border-accent/50 bg-accent/8 p-6">
            <p className="t-label mb-3 text-accent">Asking it to fill a structure</p>
            <pre className="overflow-x-auto font-mono text-[11.5px] leading-relaxed text-ink2">{`{
  "career": "Data Engineer",
  "salary_inr": [700000, 1800000],
  "companies": ["Zoho", "Freshworks", "PhonePe"],
  "steps": [
    { "title": "Python + pandas", "weeks": 3 },
    { "title": "SQL & modelling",  "weeks": 2 },
    ...
  ]
}`}</pre>
            <p className="mt-5 border-t border-accent/25 pt-4 font-mono text-[12px] text-accent">
              every step is an object the app can persist
            </p>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-[15.5px] leading-relaxed text-ink2">
          Once I stopped asking the model for advice and started asking it to populate a fixed
          schema, the whole product became buildable. The model&apos;s job shrank to filling fields,
          and everything downstream could rely on the shape.
        </p>
      </Band>

      {/* ── The roadmap, live ── */}
      <Band>
        <Eyebrow>The output</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">A living document, not a one-time answer.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Because every step arrives as a discrete object, it renders as something you check off and
          come back to. Try it.
        </p>

        <div className="mt-10 max-w-2xl rounded-2xl border border-rule bg-bg2 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="t-h3 text-ink">Data Engineer</h3>
            <span className="font-mono text-[13px] text-accent">{pct}% complete</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg3">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${pct}%`, transitionTimingFunction: 'var(--ease)' }}
            />
          </div>

          <ul className="mt-6 space-y-1">
            {ROADMAP.map((r, i) => {
              const on = done.includes(i)
              return (
                <li key={r.step}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-pressed={on}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-bg3"
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded border transition-colors ${
                        on ? 'border-accent bg-accent text-onaccent' : 'border-rule2'
                      }`}
                      aria-hidden="true"
                    >
                      {on && <span className="text-[11px] leading-none">✓</span>}
                    </span>
                    <span className={`flex-1 text-[14.5px] ${on ? 'text-ink3 line-through' : 'text-ink'}`}>
                      {r.step}
                    </span>
                    <span className="t-mono shrink-0 text-ink3">{r.weeks}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink2">
          Salary bands and company names are anchored explicitly to the Indian market, so they mean
          something to the student reading them.
        </p>
      </Band>

      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Walkthrough</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">See it running.</h2>
        <div className="mt-10 max-w-3xl">
          {project.videos.map((v) => (
            <VideoEmbed key={v.id} id={v.id} label={v.label} />
          ))}
        </div>
      </Band>

      <Retrospect heading="Constrain the model, free the product.">
        <p className="text-[1.0625rem] leading-[1.72] text-ink2">
          The same lesson turned up again in{' '}
          <a href="/projects/nexsus-assist" className="link-a">Nexsus Assist</a> — let a model
          produce free-form output and you inherit its ambiguity; give it a fixed shape to fill and
          everything downstream becomes ordinary software.
        </p>
      </Retrospect>

      <Band className="border-t border-rule">
        <Eyebrow>Screens</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">What it looks like.</h2>
        <div className="mt-10">
          <Gallery items={project.gallery} title="PathFinder AI" />
        </div>
      </Band>

      <NextProject
        to="/projects/medichain-ai"
        title="MediChain AI"
        blurb="Federated learning across hospitals, with provenance on-chain."
      />
    </article>
  )
}
