import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectTheme from '../../components/ProjectTheme'
import BrandMark from '../../components/BrandMark'
import { BrowserFrame } from '../../components/Device'
import { Gallery } from '../../components/Media'
import { useReveal } from '../../lib/useReveal'
import { getProject } from '../../data/projects'

const project = getProject('washing-bro')

/* A WashCash ledger. Spending consumes oldest-first, which is what makes any
   balance reconstructible and any charge traceable to the credits it ate. */
const ENTRIES = [
  { id: 'e1', on: '12 Jan', origin: 'Referral — rahul', amount: 50 },
  { id: 'e2', on: '19 Jan', origin: 'Referral — anjali', amount: 30 },
  { id: 'e3', on: '02 Feb', origin: 'Promo — SEMSTART', amount: 40 },
  { id: 'e4', on: '11 Feb', origin: 'Referral — vikas', amount: 50 },
]

const SURFACES = [
  { name: 'Customer', who: 'Students', d: 'Schedule a pickup, choose garments, track the order.', shot: '/WashingBro-home.png' },
  { name: 'Admin', who: 'Operations', d: 'Plans, pricing, users, order oversight.', shot: null },
  { name: 'Delivery agent', who: 'Riders', d: 'Pickup and drop runs with live GPS and bag-tag scanning.', shot: null },
  { name: 'Washing centre', who: 'Centre staff', d: 'Intake, processing and handoff.', shot: null },
  { name: 'Flutter app', who: 'Students, on mobile', d: 'The full customer loop natively, with push notifications.', shot: null },
]

const PLANS = ['TRIAL', 'BASIC', 'MONTHLY', 'QUARTERLY', 'SEMESTER', 'ANNUAL']

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

/* ── Signature: the FIFO wallet ── */
function FifoLedger() {
  const [spend, setSpend] = useState(0)
  const total = ENTRIES.reduce((a, e) => a + e.amount, 0)

  // Consume oldest-first and record how much each entry gave up. Derived purely
  // from `spend` — nothing is reassigned while rendering.
  const consumed = ENTRIES.reduce((rows, e) => {
    const alreadyTaken = rows.reduce((sum, r) => sum + r.take, 0)
    const take = Math.min(Math.max(spend - alreadyTaken, 0), e.amount)
    return [...rows, { ...e, take, remaining: e.amount - take }]
  }, [])
  const balance = total - spend

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <label htmlFor="wb-spend" className="text-[15px] font-medium text-ink">
            Spend from wallet
          </label>
          <span className="font-mono text-[15px] tabular-nums text-accent">₹{spend}</span>
        </div>
        <input
          id="wb-spend"
          type="range"
          min="0"
          max={total}
          step="5"
          value={spend}
          onChange={(e) => setSpend(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--c-accent)]"
        />

        <ul className="mt-8 space-y-2.5">
          {consumed.map((e) => {
            const spent = e.take > 0
            const drained = e.remaining === 0
            return (
              <li
                key={e.id}
                className={`rounded-xl border p-4 transition-colors duration-300 ${
                  drained ? 'border-rule bg-bg2/50 opacity-60'
                    : spent ? 'border-accent/50 bg-accent/8'
                    : 'border-rule bg-bg2'
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="text-[14.5px] text-ink">{e.origin}</span>
                  <span className="t-mono text-ink3">{e.on}</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg3">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-300"
                      style={{ width: `${(e.remaining / e.amount) * 100}%`, transitionTimingFunction: 'var(--ease)' }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right font-mono text-[12.5px] tabular-nums text-ink2">
                    ₹{e.remaining} / ₹{e.amount}
                  </span>
                </div>
                {spent && (
                  <p className="mt-2 font-mono text-[11px] text-accent">
                    consumed ₹{e.take} {drained ? '· fully drained' : ''}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-rule bg-bg2 p-6 lg:sticky lg:top-24 lg:self-start">
        <p className="t-label mb-4">WashCash balance</p>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-5xl font-bold tabular-nums tracking-tight text-accent">
            ₹{balance}
          </span>
        </div>
        <dl className="mt-6 space-y-2 border-t border-rule pt-4">
          {[
            ['credited', `₹${total}`],
            ['spent', `₹${spend}`],
            ['entries', `${ENTRIES.length}`],
            ['order', 'oldest first'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="t-mono text-ink3">{k}</dt>
              <dd className="t-mono tabular-nums text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 border-t border-rule pt-4 text-[13.5px] leading-relaxed text-ink2">
          Because consumption is ordered and recorded per entry, a disputed charge can be traced to
          the exact credits it consumed — and any balance rebuilt from history.
        </p>
      </div>
    </div>
  )
}

export default function WashingBro() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="washing-bro" />

      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[72vh]"
          style={{
            background:
              'radial-gradient(44% 40% at 70% 26%, color-mix(in oklab, var(--c-accent) 20%, transparent), transparent 70%),' +
              'radial-gradient(34% 34% at 18% 12%, color-mix(in oklab, var(--c-accent2) 14%, transparent), transparent 70%)',
          }}
        />
        <div className="shell relative">
          <Link to="/#projects" className="t-mono inline-flex items-center gap-2 text-ink3 transition-colors hover:text-accent">
            ← All projects
          </Link>

          <div className="mt-8 flex items-center gap-4">
            <BrandMark brand="washing-bro" size={60} />
            <div>
              <p className="t-mono text-ink3">Washing Bro · MMMUT campus</p>
              <p className="t-mono text-ink3">2026 · Solo — my own product</p>
            </div>
          </div>

          <h1 className="t-hero mt-8 text-ink" aria-label="A bag, a promise, and no record">
            A bag, a promise,
            <br />
            <span className="text-accent">and no record.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            Hostel laundry at MMMUT runs on WhatsApp messages, paper slips and memory. You hand over
            a bag, you get told a day, and there is nothing recording what went in, what it costs or
            where it is.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            For a few thousand students that is not a minor annoyance — it is a service everybody
            uses weekly with no system behind it.
          </p>

          <div className="mt-14">
            <BrowserFrame src="/WashingBro-home.png" alt="Washing Bro customer app" label="washing bro · customer" />
          </div>
        </div>
      </header>

      {/* ══ TWO DECISIONS ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Two decisions</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Priced to the semester, not the month.</h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-rule bg-bg p-6">
            <h3 className="t-h3 text-ink">Subscriptions, not per-order billing</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink2">
              Students think in semesters and holidays, not in calendar months. The plans follow the
              academic year because that is the unit the customer actually budgets in.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {PLANS.map((p) => (
                <li key={p} className="rounded-full border border-rule px-3 py-1 font-mono text-[11.5px] text-ink2">
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-6">
            <h3 className="t-h3 text-ink">WashCash, as a ledger</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink2">
              A wallet that mixes referral credit, promotional credit and real money becomes
              unauditable the moment someone disputes a balance. So it is not a running integer —
              it is an ordered set of entries.
            </p>
            <p className="mt-4 font-mono text-[12.5px] text-accent">consume oldest → newest</p>
          </div>
        </div>
      </Band>

      {/* ══ LEDGER — signature ══ */}
      <Band>
        <Eyebrow>The wallet</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Spend it and watch which credits go.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Credits are consumed oldest-first, and every entry records what it gave up.
        </p>
        <FifoLedger />
      </Band>

      {/* ══ SURFACES ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Surfaces</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Four web apps and a Flutter client.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          One Express + Prisma API in a pnpm/Turborepo monorepo, with shared types, UI and pricing
          utilities so four frontends cannot drift apart.
        </p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {SURFACES.map((s, i) => (
            <li key={s.name} className={i === 0 ? 'sm:col-span-2' : ''}>
              <BrowserFrame src={s.shot} alt={`Washing Bro ${s.name}`} label={s.name.toLowerCase()} />
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="t-h3 text-ink">{s.name}</h3>
                <span className="t-mono shrink-0 text-ink3">{s.who}</span>
              </div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink2">{s.d}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* ══ RUNS ANYWHERE ══ */}
      <Band>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Eyebrow>Retrospect</Eyebrow>
            <h2 className="t-h1 text-ink">Every integration optional.</h2>
          </div>
          <div>
            <p className="text-[1.0625rem] leading-[1.72] text-ink2">
              Razorpay, MSG91, Resend and OneSignal are all optional. Without keys the app logs to
              console and mock-checkouts instead of failing, so the entire stack — four web apps, an
              API and a Flutter client — runs end to end on a laptop with nothing but a database
              URL.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-[1.72] text-ink">
              That was the decision that kept the project moving. Development never blocked on
              somebody else&apos;s dashboard, and onboarding a second developer took minutes rather
              than a day of credential wrangling.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {['Live GPS tracking', 'QR bag-tag scanning', 'Push via OneSignal', 'Support tickets', 'Multi-role access'].map((f) => (
                <li key={f} className="rounded-full border border-rule px-3 py-1 text-[12.5px] text-ink2">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      {/* ══ SCREENS ══ */}
      <Band className="border-t border-rule">
        <Eyebrow>Screens</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">What it looks like.</h2>
        <div className="mt-10">
          <Gallery items={project.gallery} title="Washing Bro" />
        </div>
      </Band>

      {/* ══ NEXT ══ */}
      <div className="shell pb-10">
        <Link to="/projects/finagent-ai" className="group block rounded-2xl border border-rule bg-bg2 p-7 transition-colors hover:border-accent/50">
          <span className="t-label">Next project</span>
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="t-h2 text-ink transition-colors group-hover:text-accent">FinAgent</span>
            <span className="shrink-0 text-xl text-ink3 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </div>
          <p className="mt-2 max-w-xl text-[15px] text-ink2">
            An agent that stops to ask before it moves your money.
          </p>
        </Link>
      </div>
    </article>
  )
}
