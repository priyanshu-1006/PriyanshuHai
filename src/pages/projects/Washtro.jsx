import ProjectNext from '../../components/project/ProjectNext'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectTheme from '../../components/ProjectTheme'
import BrandMark from '../../components/BrandMark'
import { MacBook, BrowserFrame } from '../../components/Device'
import { Gallery } from '../../components/Media'
import { useReveal } from '../../lib/useReveal'
import { getProject } from '../../data/projects'

const project = getProject('washtro')

/* The twelve no-skip stages, as they appear in the append-only log. Times are
   illustrative of one garment's journey, not captured production data. */
const CHAIN = [
  { at: '09:14', from: '—', to: 'Order Placed', actor: 'customer', role: 'CUSTOMER' },
  { at: '11:02', from: 'Order Placed', to: 'Picked Up', actor: 'agent_04', role: 'AGENT' },
  { at: '11:48', from: 'Picked Up', to: 'At Center (Queued)', actor: 'wc_north', role: 'CENTER' },
  { at: '12:05', from: 'At Center (Queued)', to: 'Stain Check', actor: 'wc_north', role: 'CENTER' },
  { at: '12:31', from: 'Stain Check', to: 'In Wash', actor: 'wc_north', role: 'CENTER' },
  { at: '14:10', from: 'In Wash', to: 'Ironing', actor: 'wc_north', role: 'CENTER' },
  { at: '15:22', from: 'Ironing', to: 'Scanned & Billed', actor: 'scanner_02', role: 'CENTER' },
  { at: '15:40', from: 'Scanned & Billed', to: 'Packed', actor: 'wc_north', role: 'CENTER' },
  { at: '16:05', from: 'Packed', to: 'Hold / Staged', actor: 'wc_north', role: 'CENTER' },
  { at: '17:30', from: 'Hold / Staged', to: 'Loaded', actor: 'agent_11', role: 'AGENT' },
  { at: '17:52', from: 'Loaded', to: 'Out for Delivery', actor: 'agent_11', role: 'AGENT' },
  { at: '18:44', from: 'Out for Delivery', to: 'Delivered', actor: 'agent_11', role: 'AGENT' },
]

/* His own numbered invariants — the thing the product actually rests on. */
const INVARIANTS = [
  'Every garment state change goes through the single guarded applyEvent(). No status writes outside it; no skipping stages.',
  'GarmentEvent is append-only — it is the audit trail. Never updated, never deleted.',
  'Every event carries actorId + actorRole + timestamp. A transition with no actor is rejected.',
  'Every field action carries a client-generated UUIDv7; a DB unique constraint makes replays idempotent no-ops.',
  'Money is always integer paise — no floats anywhere near money.',
  'Hard business rules are enforced server-side, never in the client.',
  'Capacity is a Redis counter, never COUNT(*) on the request path.',
  'The Washtro ID is signed and opaque; the server verifies the HMAC, the secret never ships.',
  'Structured addresses only — routing depends on it.',
  'Pincode serviceability is an allow-list, fail-closed. Unlisted is never "unknown and allowed".',
]

const SURFACES = [
  { name: 'Customer', detail: 'Two-step order builder, live garment-level tracking, saved addresses with a serviceability check before checkout, COD or Razorpay.', stack: 'Next.js', shot: '/Washtro-home.png' },
  { name: 'Delivery agent', detail: 'Installable offline-first PWA for the pickup and delivery custody loop, backed by a durable IndexedDB outbox.', stack: 'Next.js PWA', shot: '/Washtro-delivery-agent.png' },
  { name: 'Washing centre', detail: 'Intake and stain-check scanning, plus a post-iron keyboard-wedge flow built for a physical barcode gun, not a touchscreen.', stack: 'Next.js', shot: '/Washtro-owner-wc.png' },
  { name: 'Ops admin', detail: 'Live pipeline and capacity gauges, priority-breach alerts, agent map, and garment-level dispute lookup by Washtro ID.', stack: 'Next.js', shot: '/washtro-ops.png' },
  { name: 'Admin', detail: 'Rate cards, GST settings, pincode serviceability allow-list, waitlist and partner applications.', stack: 'Next.js', shot: '/Washtro-admin.png' },
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
      <span className="inline-block h-px w-7 bg-accent2" />
      {children}
    </p>
  )
}

/* ── Signature: the append-only custody chain ── */
function CustodyChain() {
  const [open, setOpen] = useState(11)

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      {/* the tag */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border-2 border-dashed border-rule2 bg-bg2 p-6">
          <p className="t-label mb-3">Washtro ID</p>
          <p className="font-mono text-2xl font-semibold tracking-tight text-ink">
            WSH·7K2M·A41Q
          </p>
          <p className="t-mono mt-2 text-ink3">HMAC-signed · opaque · server-verified</p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`aspect-square rounded-sm ${
                  [0, 2, 4, 5, 7, 8].includes(i) ? 'bg-ink' : 'bg-rule2'
                }`}
              />
            ))}
          </div>

          <dl className="mt-6 space-y-2 border-t border-rule pt-4">
            <div className="flex justify-between gap-4">
              <dt className="t-mono text-ink3">Stages</dt>
              <dd className="t-mono text-ink">12 · no skips</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="t-mono text-ink3">Events</dt>
              <dd className="t-mono text-accent2">append-only</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="t-mono text-ink3">Written by</dt>
              <dd className="t-mono text-ink">applyEvent()</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* the log */}
      <ol className="relative">
        <span
          aria-hidden="true"
          className="absolute left-[6px] top-3 bottom-3 w-px bg-rule"
        />
        {CHAIN.map((e, i) => {
          const on = i === open
          return (
            <li key={e.to} className="relative pl-8">
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[15px] h-[13px] w-[13px] rounded-full border-2 transition-colors duration-300 ${
                  on ? 'border-accent2 bg-accent2' : 'border-rule2 bg-bg'
                }`}
              />
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="w-full border-b border-rule py-3 text-left"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="t-mono tabular-nums text-ink3">{e.at}</span>
                  <span
                    className={`font-display text-[15px] font-semibold transition-colors ${
                      on ? 'text-accent2' : 'text-ink'
                    }`}
                  >
                    {e.to}
                  </span>
                </div>
                {on && (
                  <div className="mt-2.5 rounded-lg bg-bg2 p-3 font-mono text-[11.5px] leading-relaxed text-ink2">
                    <div>
                      <span className="text-ink3">from</span> {e.from}{' '}
                      <span className="text-ink3">→</span> {e.to}
                    </div>
                    <div className="mt-1">
                      <span className="text-ink3">actorId</span> {e.actor}
                      <span className="ml-3 text-ink3">actorRole</span>{' '}
                      <span className="text-accent">{e.role}</span>
                    </div>
                    <div className="mt-1 text-ink3">record sealed · never updated, never deleted</div>
                  </div>
                )}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default function Washtro() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="washtro" />

      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[80vh]"
          style={{
            background:
              'radial-gradient(46% 42% at 70% 26%, color-mix(in oklab, var(--c-accent) 20%, transparent), transparent 70%),' +
              'radial-gradient(36% 36% at 20% 14%, color-mix(in oklab, var(--c-accent2) 16%, transparent), transparent 70%)',
          }}
        />
        <div className="shell relative">
          <Link
            to="/projects"
            className="t-mono inline-flex items-center gap-2 text-ink3 transition-colors hover:text-accent"
          >
            ← All projects
          </Link>

          <div className="mt-8">
            <BrandMark brand="washtro" size={72} />
            <p className="t-mono mt-3 text-ink3">CTO · complete technical architecture · 2026 — Present</p>
          </div>

          <h1 className="t-hero mt-8 text-ink" aria-label="Eleven in, eleven out">
            Eleven in,
            <br />
            <span className="text-accent2">eleven out.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            That is the entire record a normal laundry keeps. So when a customer says a shirt came
            back stained — or never came back at all — nobody can prove anything. Custody disputes,
            stain billing and delivery-window promises are all unprovable at order granularity.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            Washtro tracks the <span className="font-semibold text-accent2">garment</span>. Every
            item carries a signed QR tag and walks a single no-skip pipeline, and every transition
            appends an immutable record naming who did it and when. That one constraint is what
            turns guesswork into evidence.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="https://www.washtro.com"
              target="_blank"
              rel="noreferrer noopener"
              className="pill pill-solid"
            >
              Visit washtro.com <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="mt-14">
            <MacBook src="/Washtro-home.png" live="https://www.washtro.com" alt="Washtro" eager />
          </div>
        </div>
      </header>

      {/* ══ GRANULARITY ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>The distinction</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Order-level versus garment-level.</h2>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-rule bg-bg p-6 opacity-75">
            <p className="t-label mb-4">Competitors — order level</p>
            <p className="font-mono text-[13px] leading-relaxed text-ink2">
              ORDER #4471
              <br />
              items_collected: 11
              <br />
              items_returned: 11
              <br />
              status: complete
            </p>
            <p className="mt-5 border-t border-rule pt-4 text-[14.5px] leading-relaxed text-ink2">
              A dispute about one shirt has nothing to interrogate. The record is a count.
            </p>
          </div>

          <div className="rounded-2xl border border-accent2/50 bg-bg p-6">
            <p className="t-label mb-4 text-accent2">Washtro — garment level</p>
            <p className="font-mono text-[13px] leading-relaxed text-ink2">
              WSH·7K2M·A41Q
              <br />
              events: 12 (append-only)
              <br />
              last: Delivered @ 18:44 by agent_11
              <br />
              stain_declared: true · billed: 4000 paise
            </p>
            <p className="mt-5 border-t border-rule pt-4 text-[14.5px] leading-relaxed text-ink">
              The same dispute returns a full custody chain with an actor on every step.
            </p>
          </div>
        </div>
      </Band>

      {/* ══ CUSTODY CHAIN — signature ══ */}
      <Band>
        <Eyebrow>Chain of custody</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">One garment, twelve sealed records.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Every arrow passes through one guarded function and appends who, when, and from where to
          where. Tap a stage to open its record.
        </p>
        <CustodyChain />
      </Band>

      {/* ══ INVARIANTS ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Invariants</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Ten sentences that are never violated.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Written before any code. They constrained the design more usefully than any amount of
          upfront schema work — the single highest-leverage thing I did on this project.
        </p>
        <ol className="mt-10 grid gap-x-10 gap-y-0 sm:grid-cols-2">
          {INVARIANTS.map((inv, i) => (
            <li key={i} className="flex gap-4 border-b border-rule py-4">
              <span className="t-mono shrink-0 tabular-nums text-accent2">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[14.5px] leading-relaxed text-ink2">{inv}</span>
            </li>
          ))}
        </ol>
      </Band>

      {/* ══ SURFACES ══ */}
      <Band>
        <Eyebrow>Surfaces</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Five apps, one state machine.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Customer, agent, washing centre, ops and admin share almost no screens — but every one
          of them writes through the same guarded transition.
        </p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {SURFACES.map((s, i) => (
            <li key={s.name} className={i === 0 ? 'sm:col-span-2' : ''}>
              <BrowserFrame src={s.shot} alt={`Washtro ${s.name} surface`} label={s.name.toLowerCase()} />
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="t-h3 text-ink">{s.name}</h3>
                <span className="t-mono shrink-0 text-ink3">{s.stack}</span>
              </div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink2">{s.detail}</p>
            </li>
          ))}
        </ul>
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

      {/* ══ SCREENS ══ */}
      <Band>
        <Eyebrow>Screens</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">What it looks like.</h2>
        <div className="mt-10">
          <Gallery items={project.gallery} title="Washtro" />
        </div>
      </Band>

      {/* ══ NEXT ══ */}
      <ProjectNext slug={project.slug} />
    </article>
  )
}
