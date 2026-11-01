import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectTheme from '../../components/ProjectTheme'
import BrandMark from '../../components/BrandMark'
import { MacBook } from '../../components/Device'
import { Gallery, LocalVideo, ArchitectureImage } from '../../components/Media'
import { useReveal } from '../../lib/useReveal'
import { getProject } from '../../data/projects'

const project = getProject('gryork')

/* The bill's journey from illiquid paper to funded cash. Each gate has an
   actor, because in lending an unattributed state change is a hole. */
const GATES = [
  {
    id: 'onboard',
    stage: 'Onboarding',
    actor: 'Sales team',
    via: 'GryLink',
    status: 'EPC on platform',
    detail:
      'The sales team brings the EPC on first, through a dedicated surface. The EPC is the trust anchor — nothing below them can be verified without them, so nothing else can begin.',
  },
  {
    id: 'submit',
    stage: 'Submission',
    actor: 'Sub-contractor',
    via: 'Seller portal',
    status: 'Bill raised',
    detail:
      'The sub-contractor submits the receivable and raises a working-capital request against it. At this point it is a claim, not yet an asset anyone will lend against.',
  },
  {
    id: 'validate',
    stage: 'Validation',
    actor: 'EPC (buyer)',
    via: 'Buyer portal',
    status: 'Work confirmed',
    detail:
      'The EPC above them confirms the sub-contractor is real and the work was done. This is the signature that converts a claim into something financeable.',
  },
  {
    id: 'verify',
    stage: 'Verification',
    actor: 'Ops team',
    via: 'Internal tooling',
    status: 'Documents checked',
    detail:
      'Ops independently verifies the documentation. Deliberately separate from the EPC — neither party alone is sufficient, because both have an incentive for the deal to clear.',
  },
  {
    id: 'assess',
    stage: 'Risk',
    actor: 'RMT',
    via: 'Risk desk',
    status: 'Scored',
    detail:
      'The risk management team scores the request before any funder sees it. Nothing reaches the market unassessed.',
  },
  {
    id: 'fund',
    stage: 'Funding',
    actor: 'NBFC',
    via: 'Funder portal',
    status: 'Cash released',
    detail:
      'Funders see assessed requests and bid to fund them. The sub-contractor gets liquidity now instead of in ninety days.',
  },
]

const SIDES = [
  {
    role: 'Sub-contractor',
    tag: 'Seller',
    pain: 'Did the work, holds the bill, needs payroll money now.',
    gets: 'Liquidity against a receivable they already own.',
  },
  {
    role: 'EPC',
    tag: 'Buyer',
    pain: 'Pays on its own cycle; wants its supply chain to survive that cycle.',
    gets: 'A stable sub-contractor base without paying early itself.',
  },
  {
    role: 'NBFC',
    tag: 'Funder',
    pain: 'Willing to lend, but cannot cheaply prove a bill is genuine and unfinanced.',
    gets: 'Verified, risk-scored, single-financed receivables.',
  },
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
      <span className="inline-block h-px w-7 bg-accent3" />
      {children}
    </p>
  )
}

/* ── Signature: the deal flow ── */
function DealFlow() {
  const [active, setActive] = useState(0)
  const gate = GATES[active]

  return (
    <div className="mt-12">
      {/* the rail */}
      <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {GATES.map((g, i) => {
          const done = i < active
          const on = i === active
          return (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={on ? 'step' : undefined}
                className="group w-full text-left"
              >
                <span
                  className={`block h-[3px] w-full rounded-full transition-colors duration-500 ${
                    on ? 'bg-accent3' : done ? 'bg-accent' : 'bg-rule2'
                  }`}
                />
                <span className="mt-3 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={`mt-1 block font-display text-[15px] font-semibold transition-colors ${
                    on ? 'text-accent3' : 'text-ink group-hover:text-accent'
                  }`}
                >
                  {g.stage}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* the panel — a ledger row */}
      <div className="mt-9 overflow-hidden rounded-2xl border border-rule bg-bg2">
        <div className="grid divide-y divide-rule sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ['Actor', gate.actor],
            ['Surface', gate.via],
            ['Bill status', gate.status],
          ].map(([k, v], i) => (
            <div key={k} className="p-5">
              <p className="t-label mb-2">{k}</p>
              <p
                className={`font-display text-[17px] font-semibold ${
                  i === 2 ? 'text-accent3' : 'text-ink'
                }`}
              >
                {v}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-rule p-6">
          <p className="max-w-3xl text-[15.5px] leading-relaxed text-ink2">{gate.detail}</p>
        </div>
      </div>
    </div>
  )
}

export default function Gryork() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="gryork" />

      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[80vh]"
          style={{
            background:
              'radial-gradient(48% 44% at 68% 28%, color-mix(in oklab, var(--c-accent) 22%, transparent), transparent 70%),' +
              'radial-gradient(38% 38% at 22% 12%, color-mix(in oklab, var(--c-accent3) 14%, transparent), transparent 70%)',
          }}
        />
        <div className="shell relative">
          <Link
            to="/projects"
            className="t-mono inline-flex items-center gap-2 text-ink3 transition-colors hover:text-accent"
          >
            ← All projects
          </Link>

          <div className="mt-8 flex items-center gap-4">
            <BrandMark brand="gryork" size={64} />
            <div>
              <p className="t-mono text-ink3">Gryork Consultants Pvt Ltd</p>
              <p className="t-mono text-ink3">CTO · 2025 — Present</p>
            </div>
          </div>

          <h1 className="t-hero mt-8 text-ink" aria-label="Ninety days of waiting">
            Ninety days
            <br />
            <span className="t-accent text-accent3">of waiting.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            Sub-contractors in Indian infrastructure do the work, raise the bill, and then wait —
            often ninety days or more — while payroll for the next site comes due. The money exists.
            The receivable is real. It is simply illiquid.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            Gryork is the marketplace that makes it liquid. I designed the whole thing — the
            three-sided flow, the role model, the internal ops and risk tooling — from an idea to a
            demonstrable architecture. That architecture is what won the company a{' '}
            <span className="font-semibold text-accent3">₹2.5 lakh grant</span> from IIIT Allahabad.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="https://www.gryork.com"
              target="_blank"
              rel="noreferrer noopener"
              className="pill pill-solid"
            >
              Visit gryork.com <span aria-hidden="true">↗</span>
            </a>
          </div>

          {/* credentials strip — reads as a filing, not a badge row */}
          <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-3">
            {[
              ['Grant', '₹2.5 Lakh', 'IIIT Allahabad'],
              ['Status', 'DPIIT registered', 'GSTIN holding'],
              ['Team', '9–10 engineers', 'led by me'],
            ].map(([k, v, sub]) => (
              <div key={k} className="bg-bg2 p-5">
                <dt className="t-label mb-2">{k}</dt>
                <dd className="font-display text-[19px] font-semibold text-ink">{v}</dd>
                <dd className="t-mono mt-1 text-ink3">{sub}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-14">
            <MacBook src="/Gryork-v4.png" live="https://www.gryork.com" alt="Gryork platform" eager />
          </div>
        </div>
      </header>

      {/* ══ THREE SIDES ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>The market</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">
          Three parties who don&apos;t trust each other.
        </h2>
        <p className="t-lead mt-5 max-w-2xl">
          The entire design problem. Each side has something the others need and no cheap way to
          verify the others are telling the truth.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {SIDES.map((s) => (
            <div key={s.role} className="rounded-2xl border border-rule bg-bg p-6">
              <span className="rounded-full bg-accent/12 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">
                {s.tag}
              </span>
              <h3 className="t-h3 mt-4 text-ink">{s.role}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink2">{s.pain}</p>
              <p className="mt-4 border-t border-rule pt-4 text-[14.5px] leading-relaxed text-ink">
                <span className="t-label mr-2">Gets</span>
                {s.gets}
              </p>
            </div>
          ))}
        </div>
      </Band>

      {/* ══ DEAL FLOW — signature ══ */}
      <Band>
        <Eyebrow>Deal flow</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">How a bill becomes cash.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Six gates, each with a named actor. In lending the audit trail{' '}
          <span className="t-accent text-accent3">is</span> the product — a state change nobody owns
          is a hole in it.
        </p>
        <DealFlow />
      </Band>

      {/* ══ THE ADMIN SUITE ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Inside the desk</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">The tooling ops actually runs on.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          The marketplace is the visible half. The other half is the internal desk — company
          onboarding, role management and an audit trail that has to survive a lender asking
          questions months later.
        </p>
        <div className="mt-10 space-y-6">
          {(project.clips || []).map((c) => (
            <LocalVideo key={c.src} src={c.src} poster={c.poster} label={c.label} />
          ))}
        </div>
      </Band>

      {/* ══ ARCHITECTURE ══ */}
      <Band>
        <Eyebrow>Ecosystem</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">The whole board.</h2>
        <div className="mt-8">
          <ArchitectureImage src={project.architectureImage} alt="Gryork ecosystem architecture" />
        </div>
        <p className="t-label mb-3 mt-10">As drawn in the repo</p>
        <div className="overflow-hidden rounded-2xl border border-rule bg-bg2 p-4 sm:p-6">
          <pre className="ascii">{project.architecture}</pre>
        </div>
      </Band>

      {/* ══ EVOLUTION ══ */}
      <Band>
        <Eyebrow>Screens</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">The desk, and four versions of the front.</h2>
        <div className="mt-10">
          <Gallery items={project.gallery} title="Gryork" />
        </div>
      </Band>

      {/* ══ RETROSPECT ══ */}
      <Band className="border-t border-rule">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Eyebrow>Retrospect</Eyebrow>
            <h2 className="t-h1 text-ink">The schema is the risk policy.</h2>
          </div>
          <div>
            <p className="text-[1.0625rem] leading-[1.72] text-ink2">
              Every field I made nullable early on became a place where an unverified bill could slip
              through, and every state I allowed to be set without an actor became a gap in the audit
              trail. In consumer software a loose schema is technical debt; in lending it is
              underwriting risk wearing a different hat.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-[1.72] text-ink">
              I now design the state machine and the actor model before anything else — a habit that
              carried straight into{' '}
              <Link to="/projects/washtro" className="link-a">
                Washtro
              </Link>
              , where the same discipline became a single guarded transition function.
            </p>
          </div>
        </div>
      </Band>

      {/* ══ NEXT ══ */}
      <div className="shell pb-10">
        <Link
          to="/projects/washtro"
          className="group block rounded-2xl border border-rule bg-bg2 p-7 transition-colors hover:border-accent/50"
        >
          <span className="t-label">Next project</span>
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="t-h2 text-ink transition-colors group-hover:text-accent">Washtro</span>
            <span
              className="shrink-0 text-xl text-ink3 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </div>
          <p className="mt-2 max-w-xl text-[15px] text-ink2">
            Garment-level chain of custody — every item tracked, timestamped and provable.
          </p>
        </Link>
      </div>
    </article>
  )
}
