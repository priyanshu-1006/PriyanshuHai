import ProjectNext from '../../components/project/ProjectNext'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectTheme from '../../components/ProjectTheme'
import { VideoEmbed, ArchitectureImage } from '../../components/Media'
import { useReveal } from '../../lib/useReveal'
import { getProject } from '../../data/projects'

const project = getProject('finagent-ai')

const PROTECTED = [
  { action: 'Bill payment', example: '"pay my electricity bill of ₹1,500"' },
  { action: 'Fund transfer', example: '"transfer 5000 to Mom"' },
  { action: 'Gold purchase', example: '"buy gold worth 2000 rupees"' },
  { action: 'Profile update', example: '"change my registered address"' },
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

/**
 * Conscious Pause, rebuilt from the spec as a working component — the countdown
 * really runs and really expires into "cancelled". A static screenshot could not
 * show the part that matters: what happens when nobody is watching.
 */
function ConsciousPause() {
  const [decision, setDecision] = useState(null) // null | 'approved' | 'rejected'
  const [left, setLeft] = useState(60)

  // Expiry is a fact about the countdown, not a separate piece of state to sync.
  const state = decision ?? (left <= 0 ? 'expired' : 'waiting')

  useEffect(() => {
    if (decision || left <= 0) return
    const t = setTimeout(() => setLeft((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [decision, left])

  const reset = () => {
    setLeft(60)
    setDecision(null)
  }

  const tone =
    state === 'approved' ? 'var(--c-accent2)'
      : state === 'rejected' || state === 'expired' ? 'var(--c-accent3)'
      : 'var(--c-accent)'

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-12">
      <div>
        <div
          className="overflow-hidden rounded-2xl border-2 bg-bg2 transition-colors duration-300"
          style={{ borderColor: tone }}
        >
          <div className="border-b border-rule px-5 py-3 text-center">
            <span className="font-mono text-[12px] uppercase tracking-[0.16em]" style={{ color: tone }}>
              {state === 'waiting' && '⚠ Approval required'}
              {state === 'approved' && '✓ Approved by human'}
              {state === 'rejected' && '✕ Rejected'}
              {state === 'expired' && '⏱ Auto-cancelled'}
            </span>
          </div>

          <dl className="space-y-3 p-6">
            {[
              ['Action', 'Fund transfer'],
              ['Amount', '₹5,000.00'],
              ['To', 'Mom (A/C ····1234)'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="t-mono text-ink3">{k}</dt>
                <dd className="font-mono text-[14px] text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          {state === 'waiting' ? (
            <>
              <div className="flex gap-3 px-6">
                <button
                  type="button"
                  onClick={() => setDecision('approved')}
                  className="flex-1 rounded-xl bg-accent2 py-3 font-semibold text-onaccent transition-transform hover:-translate-y-0.5"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setDecision('rejected')}
                  className="flex-1 rounded-xl border border-rule2 py-3 font-semibold text-ink transition-colors hover:border-accent3 hover:text-accent3"
                >
                  Reject
                </button>
              </div>

              <div className="px-6 pb-6 pt-5">
                <div className="h-1.5 overflow-hidden rounded-full bg-bg3">
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-linear"
                    style={{ width: `${(left / 60) * 100}%` }}
                  />
                </div>
                <p className="mt-2.5 text-center font-mono text-[11.5px] text-ink3">
                  auto-cancel in {left}s
                </p>
              </div>
            </>
          ) : (
            <div className="px-6 pb-6">
              <p className="rounded-xl border border-rule bg-bg p-4 text-center font-mono text-[12.5px]" style={{ color: tone }}>
                {state === 'approved' && 'transfer executed'}
                {state === 'rejected' && 'nothing happened'}
                {state === 'expired' && 'nobody answered → nothing happened'}
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-4 w-full rounded-xl border border-rule py-2.5 font-mono text-[12px] text-ink2 transition-colors hover:border-accent hover:text-accent"
              >
                Run it again
              </button>
            </div>
          )}
        </div>

        <p className="t-mono mt-3 text-ink3">
          Recreated from the spec — a working component, not a screenshot.
        </p>
      </div>

      <div>
        <p className="text-[1.0625rem] leading-[1.72] text-ink2">
          Let it run out. That is the whole design: the default outcome of an unattended agent is
          that <span className="text-ink">nothing happens</span>.
        </p>
        <p className="mt-5 text-[1.0625rem] leading-[1.72] text-ink">
          An approval prompt that times out into &ldquo;approved&rdquo; is theatre. Timing out into
          &ldquo;cancelled&rdquo; is a guarantee — and it is the difference between a safety feature
          and a screenshot of one.
        </p>
        <p className="mt-5 text-[15px] leading-relaxed text-ink2">
          The agent parses intent, plans the task and drives a real browser through Playwright. But
          any action classified as high-risk halts before execution and surfaces the exact action,
          amount and recipient first.
        </p>
      </div>
    </div>
  )
}

export default function FinAgent() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="finagent-ai" />

      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[62vh]"
          style={{
            background:
              'radial-gradient(40% 38% at 68% 24%, color-mix(in oklab, var(--c-accent) 18%, transparent), transparent 70%)',
          }}
        />
        <div className="shell relative">
          <Link to="/projects" className="t-mono inline-flex items-center gap-2 text-ink3 transition-colors hover:text-accent">
            ← All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              AI Systems
            </span>
            <span className="t-mono text-ink3">2025 · Google Developer Groups event</span>
          </div>

          <h1 className="t-hero mt-7 text-ink" aria-label="The moment before it acts">
            The moment
            <br />
            <span className="text-accent">before it acts.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            An AI agent with access to your bank account is a genuinely bad idea executed carelessly.
            But &ldquo;pay my electricity bill of ₹1,500&rdquo; is exactly the tedious, well-specified
            work an agent should handle. The question is not whether it can. It is what happens in the
            second before it does.
          </p>
        </div>
      </header>

      {/* ══ CONSCIOUS PAUSE — signature ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Conscious Pause</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Try letting the timer run out.</h2>
        <ConsciousPause />
      </Band>

      {/* ══ PROTECTED ══ */}
      <Band>
        <Eyebrow>Scope</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Four actions never run unattended.</h2>
        <ul className="mt-10 divide-y divide-rule border-y border-rule">
          {PROTECTED.map((p) => (
            <li key={p.action} className="grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[210px_1fr]">
              <span className="text-[15px] font-medium text-ink">{p.action}</span>
              <span className="font-mono text-[13px] text-ink2">{p.example}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink2">
          Everything runs against a purpose-built dummy bank. No real financial institution is
          touched at any point.
        </p>
      </Band>

      {/* ══ ARCHITECTURE ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Architecture</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">How it fits together.</h2>
        <div className="mt-8">
          <ArchitectureImage src={project.architectureImage} alt="FinAgent system architecture" />
        </div>
        <p className="t-label mb-3 mt-10">As drawn in the repo</p>
        <div className="overflow-hidden rounded-2xl border border-rule bg-bg p-4 sm:p-6">
          <pre className="ascii">{project.architecture}</pre>
        </div>
      </Band>

      {/* ══ VIDEO ══ */}
      <Band>
        <Eyebrow>Walkthrough</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">See it running.</h2>
        <div className="mt-10 max-w-3xl">
          {project.videos.map((v) => (
            <VideoEmbed key={v.id} id={v.id} label={v.label} />
          ))}
        </div>
      </Band>

      {/* ══ NEXT ══ */}
      <ProjectNext slug={project.slug} />
    </article>
  )
}
