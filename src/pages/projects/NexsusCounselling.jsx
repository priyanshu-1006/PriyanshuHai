import ProjectNext from '../../components/project/ProjectNext'
import { Link } from 'react-router-dom'
import ProjectTheme from '../../components/ProjectTheme'
import { BrowserFrame } from '../../components/Device'
import { Gallery } from '../../components/Media'
import { useReveal } from '../../lib/useReveal'
import { getProject } from '../../data/projects'

const project = getProject('nexsus-counselling')

/* The real funnel. Each step carries its conversion off the one above it —
   the 50% mentorship rate is the number that actually says something. */
const FUNNEL = [
  { n: '25,000+', label: 'Page views', note: 'Concentrated almost entirely into the counselling window', width: 100 },
  { n: '900', label: 'Students used it', note: 'Reached the guidance and worked through it', width: 72, conv: null },
  { n: '450', label: 'Took one-to-one mentorship', note: 'Paired with a current MMMUT student', width: 46, conv: '50% of visitors' },
  { n: '200+', label: 'Secured admission into MMMUT', note: 'The outcome the whole thing existed for', width: 26, conv: '44% of mentored', accent: true },
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

/* ── Signature: the funnel ── */
function Funnel() {
  return (
    <div className="mt-12 space-y-3">
      {FUNNEL.map((f) => (
        <div key={f.label} className="grid gap-x-8 gap-y-3 lg:grid-cols-[1fr_320px] lg:items-center">
          <div
            className={`relative overflow-hidden rounded-2xl border px-6 py-6 transition-colors ${
              f.accent ? 'border-accent/50 bg-accent/10' : 'border-rule bg-bg2'
            }`}
            style={{ width: `${f.width}%`, minWidth: '260px' }}
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span
                className={`font-display text-4xl font-bold tracking-tight sm:text-5xl ${
                  f.accent ? 'text-accent' : 'text-ink'
                }`}
              >
                {f.n}
              </span>
              <span className="text-[15px] text-ink2">{f.label}</span>
            </div>
          </div>

          <div className="lg:pl-2">
            {f.conv && (
              <p className="font-mono text-[12px] tracking-wide text-accent2">↳ {f.conv}</p>
            )}
            <p className="mt-1 text-[14px] leading-relaxed text-ink2">{f.note}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function NexsusCounselling() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="nexsus-counselling" />

      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[70vh]"
          style={{
            background:
              'radial-gradient(42% 38% at 70% 28%, color-mix(in oklab, var(--c-accent) 18%, transparent), transparent 70%),' +
              'radial-gradient(32% 32% at 18% 14%, color-mix(in oklab, var(--c-accent2) 14%, transparent), transparent 70%)',
          }}
        />
        <div className="shell relative">
          <Link
            to="/projects"
            className="t-mono inline-flex items-center gap-2 text-ink3 transition-colors hover:text-accent"
          >
            ← All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              Platform
            </span>
            <span className="t-mono text-ink3">2026 · Built and ran it under Nexsus</span>
          </div>

          <h1 className="t-hero mt-7 text-ink" aria-label="Two hundred students got in">
            Two hundred students
            <br />
            <span className="text-accent">got in.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            Engineering admission counselling in Uttar Pradesh is opaque in a way that costs
            students real outcomes. Choice-filling is a high-stakes, time-boxed decision made mostly
            on rumour — which branch, which college, in what order, against a cutoff nobody
            publishes clearly.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            The information exists. It is simply held by people who have already been through it,
            and there was no structured way for those two groups to find each other. So I built one.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="https://counselling.mmmut.app"
              target="_blank"
              rel="noreferrer noopener"
              className="pill pill-solid"
            >
              counselling.mmmut.app <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="mt-14">
            <BrowserFrame
              src="/Counselling-Support-1.png"
              alt="Nexsus counselling platform"
              label="counselling.mmmut.app"
            />
          </div>
        </div>
      </header>

      {/* ══ FUNNEL — signature ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>What happened</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">The funnel, honestly.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Half of everyone who used the site went on to take one-to-one mentorship — an unusually
          high rate for something free and entirely optional.
        </p>
        <Funnel />
      </Band>

      {/* ══ HOW ══ */}
      <Band>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Eyebrow>How it worked</Eyebrow>
            <h2 className="t-h1 text-ink">Two tiers, and no login wall.</h2>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-rule bg-bg2 p-6">
              <p className="t-label mb-2">Tier one — open</p>
              <p className="text-[15.5px] leading-relaxed text-ink2">
                College and branch guidance, the mechanics of the counselling rounds, and what a
                given rank realistically converts to. Readable without an account, because a login
                wall on admission advice defeats the entire point of publishing it.
              </p>
            </div>
            <div className="rounded-2xl border border-accent/40 bg-accent/5 p-6">
              <p className="t-label mb-2 text-accent">Tier two — mentorship</p>
              <p className="text-[15.5px] leading-relaxed text-ink2">
                Aspirants matched to current MMMUT students who made the same decision a year or two
                earlier. Advice from someone just ahead of you, not from a coaching brochure.
              </p>
            </div>
            <p className="text-[1.0625rem] leading-[1.72] text-ink">
              Making the content genuinely useful on its own is why the funnel holds up. Nobody had
              to commit anything to get value, so the ones who went deeper actually wanted to.
            </p>
          </div>
        </div>
      </Band>

      {/* ══ HARD PARTS ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Hard parts</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Where it got difficult.</h2>
        <div className="mt-10 space-y-4">
          {project.challenges.map((c, i) => (
            <div key={i} className="grid gap-5 rounded-2xl border border-rule bg-bg p-6 lg:grid-cols-2 lg:gap-10">
              <p className="flex gap-3 text-[15px] leading-relaxed text-ink">
                <span className="mt-0.5 shrink-0 font-mono text-[12px] text-accent3">✕</span>
                {c.challenge}
              </p>
              <p className="flex gap-3 text-[15px] leading-relaxed text-ink2">
                <span className="mt-0.5 shrink-0 font-mono text-[12px] text-accent2">→</span>
                {c.solution}
              </p>
            </div>
          ))}
        </div>
      </Band>

      {/* ══ THE CLAIM ══ */}
      <Band>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Being precise</Eyebrow>
          <h2 className="t-h1 text-ink">What this did and didn&apos;t do.</h2>
          <blockquote className="mt-8 border-l-2 border-accent pl-6">
            <p className="text-[1.1875rem] leading-[1.7] text-ink">
              Two hundred students who used this platform got into MMMUT. The platform did not get
              them their ranks. What it changed was whether a given rank turned into the best seat
              it could have.
            </p>
          </blockquote>
          <p className="mt-7 text-[1.0625rem] leading-[1.72] text-ink2">
            That is a narrower claim than &ldquo;we placed 200 students&rdquo;, and it is the honest
            one. The counselling system decides who gets what; all this did was make sure nobody
            walked into it guessing. It is still the clearest human outcome attached to anything I
            have built.
          </p>
        </div>
      </Band>

      {/* ══ SCREENS ══ */}
      <Band className="border-t border-rule">
        <Eyebrow>Screens</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">The platform, and how word got out.</h2>
        <div className="mt-10">
          <Gallery items={project.gallery} title="Nexsus Counselling Support" />
        </div>
      </Band>

      {/* ══ NEXT ══ */}
      <ProjectNext slug={project.slug} />
    </article>
  )
}
