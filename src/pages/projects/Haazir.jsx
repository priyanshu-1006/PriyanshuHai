import ProjectNext from '../../components/project/ProjectNext'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectTheme from '../../components/ProjectTheme'
import { BrowserFrame } from '../../components/Device'
import { Gallery } from '../../components/Media'
import { useReveal } from '../../lib/useReveal'
import { getProject } from '../../data/projects'

const project = getProject('haazir')

/* Three gates. Defeating any one is easy; defeating all three at once, in
   ninety seconds, in a room with the teacher watching, is not worth it. */
const GATES = [
  {
    id: 'qr',
    n: '01',
    name: 'Scan the QR',
    defeat: 'Screenshot the code and send it to a friend.',
    guard: 'The code lives ninety seconds. By the time it has been shared and opened, it is dead.',
    spec: ['90-second lifetime', 'Session-bound', 'Teacher-generated'],
  },
  {
    id: 'face',
    n: '02',
    name: 'Match the face',
    defeat: 'Hold up a photo of the person who is absent.',
    guard: 'RetinaFace detects and aligns; ArcFace turns the aligned crop into a 512-dimensional embedding; a cosine similarity of 0.50 or better against the enrolled angles is required. Enrolment itself is OTP-verified and multi-angle, so a single stolen photo has nothing to match against.',
    spec: ['ArcFace 512-D', 'RetinaFace detect', 'cos ≥ 0.50', 'OTP-verified enrolment'],
  },
  {
    id: 'gps',
    n: '03',
    name: 'Be in the room',
    defeat: 'Do all of the above from the hostel.',
    guard: 'Haversine distance between the faculty session origin and the student, checked against a 100-metre radius that the faculty can configure per session.',
    spec: ['Haversine', '100 m default', 'per-session radius'],
  },
]

const HARD = [
  'No teacher double-booked',
  'No room double-booked',
  'No section double-booked',
  'Teacher availability windows respected',
  'Room type matches session type',
  'Room capacity ≥ section strength',
]

const SOFT = [
  ['Minimise teacher idle gaps', 3],
  ['Balance load across days', 3],
  ['Keep multi-hour labs consecutive', 2],
  ['Protect the lunch break', 2],
  ['Preferred slots for senior faculty', 1],
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

/* ── Signature: the three gates, framed as attack vs guard ── */
function GateStack() {
  const [open, setOpen] = useState('qr')

  return (
    <div className="mt-12 space-y-3">
      {GATES.map((g) => {
        const on = g.id === open
        return (
          <div
            key={g.id}
            className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
              on ? 'border-accent bg-accent/8' : 'border-rule bg-bg2'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(g.id)}
              aria-expanded={on}
              className="flex w-full items-center gap-5 p-5 text-left"
            >
              <span
                className={`font-mono text-[13px] tabular-nums ${on ? 'text-accent' : 'text-ink3'}`}
              >
                {g.n}
              </span>
              <span className="t-h3 flex-1 text-ink">{g.name}</span>
              <span
                className={`shrink-0 font-mono text-lg transition-transform duration-300 ${
                  on ? 'rotate-45 text-accent' : 'text-ink3'
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>

            {on && (
              <div className="grid gap-6 border-t border-rule px-5 pb-5 pt-5 lg:grid-cols-2 lg:gap-10">
                <div>
                  <p className="t-label mb-2 text-accent3">The attack</p>
                  <p className="text-[15px] leading-relaxed text-ink2">{g.defeat}</p>
                </div>
                <div>
                  <p className="t-label mb-2 text-accent2">The guard</p>
                  <p className="text-[15px] leading-relaxed text-ink">{g.guard}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {g.spec.map((sp) => (
                      <li
                        key={sp}
                        className="rounded-full border border-rule px-2.5 py-0.5 font-mono text-[11px] text-ink3"
                      >
                        {sp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Haazir() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="haazir" />

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
          <Link to="/projects" className="t-mono inline-flex items-center gap-2 text-ink3 transition-colors hover:text-accent">
            ← All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              AI Systems
            </span>
            <span className="t-mono text-ink3">2025 — 2026 · Backend &amp; AI</span>
          </div>

          <h1 className="t-hero mt-7 text-ink" aria-label="One student scans for six friends">
            One student scans
            <br />
            <span className="text-accent">for six friends.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            That is the entire failure mode of every attendance system, and it is why the paper
            register survives. Haazir is built on the assumption that any single signal will be
            defeated — so it requires three, inside ninety seconds.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            The second half of the problem looks unrelated and is not: building a conflict-free
            timetable by hand takes a department weeks, because every fix creates a new clash. Both
            are constraint problems wearing administrative clothes.
          </p>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent3/40 bg-accent3/10 px-4 py-2 font-mono text-[12px] text-accent3">
            ★ Finalist · Hackatron ’25, Infotsav, IIIT Gwalior
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="https://haazir-six.vercel.app" target="_blank" rel="noreferrer noopener" className="pill pill-solid">
              Live demo <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://github.com/priyanshu-1006/Haazir-Smart-Attendence-Management-System"
              target="_blank"
              rel="noreferrer noopener"
              className="pill pill-ghost"
            >
              Source ↗
            </a>
          </div>

          <div className="mt-14">
            <BrowserFrame src="/haazir.png" alt="Haazir attendance dashboard" label="haazir-six.vercel.app" />
          </div>
        </div>
      </header>

      {/* ══ ORIGIN ══ */}
      <Band>
        <Eyebrow>Where it started</Eyebrow>
        <h2 className="t-h1 max-w-3xl text-ink">
          We did not get past our own college qualifiers.
        </h2>

        <div className="mt-9 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <p className="text-[1.0625rem] leading-[1.72] text-ink2">
              The first version of Haazir was built for the Smart India Hackathon, against a problem
              statement on attendance monitoring. It was eliminated at the internal round — the
              stage before the competition actually begins.
            </p>
            <p className="mt-6 text-[1.0625rem] leading-[1.72] text-ink">
              That is a specific kind of rejection. Not losing to a better team on a national stage,
              but being told the idea was not good enough to be allowed to compete at all.
            </p>
            <p className="mt-6 text-[1.0625rem] leading-[1.72] text-ink2">
              It was also the most useful thing that happened to the project. We had built a
              single-signal system — a face check, and a lot of confidence in it. Losing forced us
              to look honestly at the architecture instead of defending it, and the honest answer was
              that any one signal can be defeated by a student holding up a phone.
            </p>
            <p className="mt-6 text-[1.0625rem] leading-[1.72] text-ink">
              We did not iterate on it. We tore it down and rebuilt it around the assumption that
              every individual signal will fail. That is where the three gates came from.
            </p>
          </div>

          <div className="lg:pt-2">
            <ol className="divide-y divide-rule border-y border-rule">
              <li className="grid gap-x-6 gap-y-1.5 py-5 sm:grid-cols-[112px_1fr]">
                <p className="t-mono pt-0.5" style={{ color: 'var(--c-ink3)' }}>SIH 2025</p>
                <div>
                  <h3 className="text-[15px] font-medium text-ink">Eliminated internally</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink2">
                    Version one. One signal, no fallback, no answer for the obvious attack.
                  </p>
                </div>
              </li>
              <li className="grid gap-x-6 gap-y-1.5 py-5 sm:grid-cols-[112px_1fr]">
                <p className="t-mono pt-0.5" style={{ color: 'var(--c-accent3)' }}>Rebuild</p>
                <div>
                  <h3 className="text-[15px] font-medium text-ink">Three gates, ninety seconds</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink2">
                    Rotating signed QR, geo-fence, face match. Each one assumes the others can be
                    beaten.
                  </p>
                </div>
              </li>
              <li className="grid gap-x-6 gap-y-1.5 py-5 sm:grid-cols-[112px_1fr]">
                <p className="t-mono pt-0.5" style={{ color: 'var(--c-accent)' }}>Oct 2025</p>
                <div>
                  <h3 className="text-[15px] font-medium text-ink">Top 50 of 1,300+ teams</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink2">
                    Hackatron ’25 at Infotsav, IIIT Gwalior. Thirty-six hours, on the rebuilt
                    architecture.
                  </p>
                </div>
              </li>
              <li className="grid gap-x-6 gap-y-1.5 py-5 sm:grid-cols-[112px_1fr]">
                <p className="t-mono pt-0.5" style={{ color: 'var(--c-accent2)' }}>2026</p>
                <div>
                  <h3 className="text-[15px] font-medium text-ink">Absorbed into Nexsus</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink2">
                    On a faculty suggestion, Haazir stopped being a standalone product and became the
                    academic core of the campus platform — which is how it ended up running a real
                    department timetable.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </Band>

      {/* ══ GATES — signature ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Three gates</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Each one is beatable. All three at once are not.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          The design question was never &ldquo;how do we make one check unbreakable&rdquo;. It was
          how to make the effort of cheating exceed the effort of showing up.
        </p>
        <GateStack />

        <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-ink2">
          Raw face images are never stored — only the 512-dimensional embeddings. There is nothing in the
          database that could be reconstructed into a photograph of a student.
        </p>
      </Band>

      {/* ══ NUMBERS ══ */}
      <Band>
        <div className="grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['512-D', 'ArcFace embedding per face'],
            ['0.50', 'Cosine match threshold'],
            ['3–5', 'Scored timetable solutions per run'],
            ['27', 'Migrations in the shipped schema'],
          ].map(([v, l]) => (
            <div key={l} className="bg-bg2 p-6">
              <div className="font-display text-3xl font-bold tracking-tight text-accent">{v}</div>
              <p className="mt-2.5 text-sm leading-snug text-ink2">{l}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* ══ CSP ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>The solver</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Constraints that must hold, and ones that get scored.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Modelled as a Constraint Satisfaction Problem. The distinction between hard and soft is
          what turns an impossible search into a tractable one.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-accent/40 bg-bg p-6">
            <p className="t-label mb-1 text-accent">Hard — must hold</p>
            <p className="t-mono mb-5 text-ink3">violation = invalid solution</p>
            <ul className="space-y-2.5">
              {HARD.map((h) => (
                <li key={h} className="flex gap-3 text-[14.5px] leading-relaxed text-ink">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-rule bg-bg p-6">
            <p className="t-label mb-1 text-accent2">Soft — optimised</p>
            <p className="t-mono mb-5 text-ink3">violation = lower score</p>
            <ul className="space-y-3">
              {SOFT.map(([s, w]) => (
                <li key={s} className="flex items-center justify-between gap-4">
                  <span className="text-[14.5px] leading-relaxed text-ink2">{s}</span>
                  <span className="flex shrink-0 gap-1" aria-label={`weight ${w} of 3`}>
                    {[1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${i <= w ? 'bg-accent2' : 'bg-rule2'}`}
                      />
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-bg p-4 sm:p-6">
          <pre className="ascii">{`constraints ──▶ CSP solver ──▶ 3–5 valid solutions ──▶ scored ──▶ coordinator picks
                 backtracking      hard: pruned during search
                 most-constrained  soft: evaluated after
                 variable first    10–30s for a full department`}</pre>
        </div>

        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-ink2">
          A naive search spends most of its time proving there is no solution down a branch it
          should never have entered. Most-constrained-variable ordering plus early constraint
          checking during backtracking brought realistic generation down to ten to thirty seconds —
          and the solver returns a best-effort partial rather than hanging.
        </p>
      </Band>

      {/* ══ FALLBACKS ══ */}
      <Band>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Eyebrow>Retrospect</Eyebrow>
            <h2 className="t-h1 text-ink">Build the dumb path first.</h2>
          </div>
          <div>
            <p className="text-[1.0625rem] leading-[1.72] text-ink2">
              We built the smart path first and the manual path last, which meant every early demo
              was one bad camera away from failure. A backlit window behind the class is enough to
              wreck face detection, and there was nothing to fall back to.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-[1.72] text-ink">
              A system that replaces a manual process needs the manual process available from day
              one. Once roll-call and bulk photo marking existed, the ninety-second window could
              stay strict — anyone who misses it gets marked another way, so the guard never has to
              be relaxed to accommodate reality.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {['Manual roll-call', 'Bulk class-photo marking', 'Coordinator override'].map((f) => (
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
          <Gallery items={project.gallery} title="Haazir" />
        </div>
      </Band>

      {/* ══ NEXT ══ */}
      <ProjectNext slug={project.slug} />
    </article>
  )
}
