import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectTheme from '../../components/ProjectTheme'
import { MacBook, Phone } from '../../components/Device'
import { Gallery, ArchitectureImage } from '../../components/Media'
import { useReveal } from '../../lib/useReveal'
import { getProject } from '../../data/projects'

const project = getProject('nexsus-universe')

/* ── Surfaces: the whole thesis of the product is one backend, many faces ── */
const SURFACES = [
  {
    id: 'main',
    name: 'Main Client',
    audience: 'Students & public',
    port: ':5173',
    kind: 'web',
    shot: '/Nexsus-dark.png',
    blurb:
      'The public face. Notices, PYQ archive, Malviya Market, AI bots, societies, events, virtual labs — everything a student touches daily.',
    highlights: ['Notice board', 'PYQ archive', 'Marketplace', 'AI bots', 'Virtual labs'],
  },
  {
    id: 'admin',
    name: 'Admin Portal',
    audience: 'Super admin',
    port: ':5174',
    kind: 'web',
    shot: '/Nexsus-admin.png',
    blurb:
      'Twenty-two-plus management pages for total institutional control — departments, faculty, batches, hostels, mess menus, AI configuration.',
    highlights: ['Master data', 'Bulk CSV upload', 'Hostel & mess', 'AI config', 'Moderation'],
  },
  {
    id: 'society',
    name: 'Society Portal',
    audience: 'Club committees',
    port: ':5175',
    kind: 'web',
    shot: '/Nexsus_club.png',
    blurb:
      'A full CMS for college societies with their own credentials — events with a drag-and-drop form builder, galleries, bulk email, auto-generated certificates.',
    highlights: ['Event builder', 'Members', 'Gallery', 'Bulk email', 'Certificates'],
  },
  {
    id: 'haazir',
    name: 'Haazir Portal',
    audience: 'Faculty & coordinators',
    port: ':5176',
    kind: 'web',
    shot: '/Nexsus-haazir.png',
    blurb:
      'Attendance as a sub-platform: QR, face and geofence verification, timetable generation, exam scheduling and a visual seating planner.',
    highlights: ['QR + face', 'Geofencing', 'Timetables', 'Exam seating'],
  },
  {
    id: 'mobile',
    name: 'Nexsus Mobile',
    audience: 'Students, on Android',
    port: 'Expo 54',
    kind: 'mobile',
    shot: null,
    blurb:
      'React Native app with the full student feature set — offline caching via React Query, push notifications, biometric auth, dark mode.',
    highlights: ['Offline cache', 'Push', 'Biometrics', 'Dark mode'],
  },
  {
    id: 'haazir-mobile',
    name: 'Haazir Mobile',
    audience: 'Faculty & students',
    port: 'Expo 54',
    kind: 'mobile',
    shot: null,
    blurb:
      'Attendance in the hand: session management, face enrolment and geofenced QR scanning from the classroom.',
    highlights: ['Face setup', 'Geofenced scan', 'Sessions'],
  },
]

const BOTS = [
  { name: 'Super Bot', role: 'Campus knowledge', detail: 'Answers anything about MMMUT from a RAG index built by scraping the college portal.' },
  { name: 'PYQ Expert', role: 'Past papers', detail: 'Analyses previous-year questions, generates answers, surfaces recurring topics.' },
  { name: 'Career Guide', role: 'Direction', detail: 'Personalised roadmaps, skill-gap analysis and actionable study plans.' },
  { name: 'Wellness Bot', role: 'Support', detail: 'Mood tracking with persistent state, crisis detection, campus wellness resources.' },
  { name: 'Code Assistant', role: 'Debugging', detail: 'Syntax-highlighted code help and concept explanation.' },
]

/* The LangGraph state machine every query walks through. */
const GRAPH = [
  { n: 'buildContext', d: 'Load the asker’s profile, department, semester and conversation history into state.' },
  { n: 'classifyIntent', d: 'Decide what kind of question this is. The only node whose output changes the route.' },
  { n: 'retrieveKnowledge', d: 'Campus and academic queries only — vector search, then a metadata filter by department and semester.' },
  { n: 'routeToAgent', d: 'Wellness, career and code queries skip retrieval and go straight to their specialist agent.' },
  { n: 'generateResponse', d: 'System prompt, retrieved context, query. Sources travel with the answer.' },
  { n: 'saveConversation', d: 'Persist the turn so the next one has history to build on.' },
  { n: 'logUsage', d: 'Tokens and latency recorded per service, per user, before the graph terminates.' },
]

/* Chunk size is a function of content type. One strategy for everything loses either context or precision. */
const CHUNKING = [
  { type: 'Study notes', strat: 'semantic', size: '4,000', ov: '400' },
  { type: 'Course info', strat: 'paragraph', size: '2,000', ov: '200' },
  { type: 'Events & notices', strat: 'paragraph', size: '2,000', ov: '200' },
  { type: 'Past-year questions', strat: 'fixed', size: '2,000', ov: '0' },
  { type: 'Hostel info', strat: 'fixed', size: '1,500', ov: '0' },
  { type: 'Syllabus units', strat: 'paragraph', size: '1,200', ov: '100' },
]

/* Idea to institutional infrastructure. The gap in the middle is the real story. */
const ROAD = [
  { d: '9 Nov 2025', t: 'The first feature document', b: 'Written in one night, after a week of wondering why campus life felt so digitally shattered. Not an app — a campus operating system.', tone: 'accent' },
  { d: '11 Nov 2025', t: 'One sentence changes the scope', b: 'I showed the raw proposal to Dr. Sumit Kumar. He asked: why don’t you integrate Haazir inside Nexsus itself? That turned a student utility into institutional infrastructure.', tone: 'accent' },
  { d: 'Dec — Feb', t: 'The bench outside the office', b: 'Three months walking to the department every single day with my laptop, hoping for ten minutes. Meetings postponed. Priorities elsewhere. Doors closed. We used the delay to ruthlessly optimise, and Haazir became production-ready while nobody was watching.', tone: 'wait' },
  { d: 'March 2026', t: 'Ten minutes, no slides', b: 'Ushered in without warning. No projector, no deck, no prep. A laptop and one chance to explain the architecture. Seven faculty advisors aligned with the vision that week.', tone: 'accent2' },
  { d: '7 Apr 2026', t: 'Registered as a departmental society', b: 'Bureaucracy that had taken three months to open a door then moved in twelve days.', tone: 'accent2' },
  { d: '19 Apr 2026', t: 'Institutional approval', b: 'Granted by Vice Chancellor Prof. Jay Prakash Saini. Nexsus was real, and immediately load-bearing.', tone: 'accent2' },
]

/* The live CSE timetable. Every cohort the solver had to satisfy at once. */
const COHORTS = [
  { c: 'B.Tech CSE', s: 'Sem II · IV · VI · VIII' },
  { c: 'B.Tech EE', s: 'Freshman year' },
  { c: 'B.Tech ECE / IoT', s: 'Freshman year' },
  { c: 'Minor Degree', s: 'Sem IV · VI · VIII' },
  { c: 'M.Tech CSE', s: 'Sem II · IV' },
  { c: 'M.Sc Mathematics', s: 'Service courses' },
]

/* Weekly contact hours the allocation had to balance. L + T + P = 1,955. */
const LOAD = [
  { k: 'L', label: 'Lecture', hours: 1009 },
  { k: 'T', label: 'Tutorial', hours: 206 },
  { k: 'P', label: 'Practical', hours: 740 },
]

/* A timetable is a constraint satisfaction problem. These are the constraints. */
const CONSTRAINTS = {
  hard: [
    'No faculty member in two rooms at once',
    'No section attending two classes at once',
    'No lab occupied by two batches at once',
    'Every course meets its full weekly L-T-P quota',
    'Lab sessions stay contiguous — never split across a break',
  ],
  soft: [
    'Faculty subject preferences, ranked and honoured in order',
    'Teaching load spread evenly rather than dumped on one day',
    'Morning-heavy theory, afternoon labs',
    'Minimise gaps in a section’s day',
  ],
}

const FRAGMENTED = [
  'WhatsApp notices', 'PYQ drive links', 'Paper attendance', 'Timetable PDFs',
  'Club Instagram', 'Mess menu photos', 'Hostel registers', 'Placement sheets',
  'Lost & found groups', 'Fest forms',
]

/* ── Local building blocks ── */
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

/* ── The signature element ── */
function SurfaceSwitcher() {
  const [active, setActive] = useState(SURFACES[0].id)
  const surface = SURFACES.find((s) => s.id === active)

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
      {/* the spine */}
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-4 bottom-4 hidden w-px bg-rule lg:block"
        />
        <ul role="tablist" aria-label="Nexsus surfaces" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {SURFACES.map((s) => {
            const on = s.id === active
            return (
              <li key={s.id} className="relative shrink-0 lg:pl-7">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1/2 hidden h-[15px] w-[15px] -translate-y-1/2 rounded-full border-2 transition-colors duration-300 lg:block ${
                    on ? 'border-accent bg-accent' : 'border-rule2 bg-bg'
                  }`}
                />
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(s.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                    on
                      ? 'border-accent bg-accent/10'
                      : 'border-rule bg-bg2 hover:border-rule2'
                  }`}
                  style={{ transitionTimingFunction: 'var(--ease)' }}
                >
                  <span className="block whitespace-nowrap font-display text-[15px] font-bold text-ink">
                    {s.name}
                  </span>
                  <span className="mt-0.5 block whitespace-nowrap font-mono text-[10.5px] text-ink3">
                    {s.audience}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* the panel */}
      <div role="tabpanel" aria-label={surface.name}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
            {surface.kind === 'mobile' ? 'React Native' : 'React + Vite'}
          </span>
          <span className="t-mono text-ink3">{surface.port}</span>
        </div>

        <h3 className="t-h2 mt-4 text-ink">{surface.name}</h3>
        <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink2">{surface.blurb}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {surface.highlights.map((h) => (
            <li key={h} className="rounded-full border border-rule px-3 py-1 text-[12.5px] text-ink2">
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          {surface.kind === 'mobile' ? (
            <div className="mx-auto max-w-[220px]">
              <Phone src={surface.shot} alt={surface.name} />
            </div>
          ) : (
            <MacBook src={surface.shot} alt={surface.name} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function NexsusUniverse() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="nexsus-universe" />

      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden pb-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[85vh]"
          style={{
            background:
              'radial-gradient(50% 45% at 70% 30%, color-mix(in oklab, var(--c-accent) 26%, transparent), transparent 70%),' +
              'radial-gradient(40% 40% at 20% 15%, color-mix(in oklab, var(--c-accent2) 18%, transparent), transparent 70%)',
          }}
        />
        <div className="shell relative">
          <Link
            to="/#projects"
            className="t-mono inline-flex items-center gap-2 text-ink3 transition-colors hover:text-accent"
          >
            ← All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
              Platform
            </span>
            <span className="t-mono text-ink3">2025 — Present</span>
            <span className="t-mono text-ink3">Founder, President &amp; Architect</span>
          </div>

          <h1 className="t-hero mt-6 text-ink" aria-label="Nexsus — Innovation Continuum">
            Nex<span className="text-accent">sus</span>
          </h1>
          <p className="t-accent mt-2 text-2xl text-accent sm:text-3xl">Innovation Continuum</p>

          <p className="t-lead mt-7 max-w-2xl">
            A unified digital ecosystem for the MMMUT campus. Ten fragmented tools, replaced by one
            backend with many faces — five web portals, two Android apps and five
            retrieval-grounded AI assistants, on a single seventy-model schema.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://mmmut.app" target="_blank" rel="noreferrer noopener" className="pill pill-solid">
              Visit mmmut.app <span aria-hidden="true">↗</span>
            </a>
            <a href="https://nexsus.mmmut.app" target="_blank" rel="noreferrer noopener" className="pill pill-ghost">
              nexsus.mmmut.app ↗
            </a>
            <a
              href="https://nexsus-tools-frontend.vercel.app/"
              target="_blank"
              rel="noreferrer noopener"
              className="pill pill-ghost"
            >
              Student tools ↗
            </a>
          </div>

          <div className="mt-14">
            <MacBook src="/Nexsus-dark.png" live="https://mmmut.app" alt="Nexsus" eager />
          </div>
        </div>
      </header>

      {/* ══ NUMBERS ══ */}
      <Band>
        <div className="grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: '41', l: 'Courses on the live CSE timetable' },
            { v: '31', l: 'Faculty allocated, conflict-free' },
            { v: '1,955', l: 'Weekly contact hours balanced' },
            { v: '70+', l: 'Prisma models on one schema' },
          ].map((s) => (
            <div key={s.l} className="bg-bg2 p-6">
              <div className="font-display text-4xl font-extrabold tracking-tight text-accent">
                {s.v}
              </div>
              <p className="mt-2.5 text-sm leading-snug text-ink2">{s.l}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* ══ PROBLEM ══ */}
      <Band>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Eyebrow>The problem</Eyebrow>
            <h2 className="t-h1 text-ink">Ten places to look, none of them talking.</h2>
          </div>
          <div>
            <p className="text-[1.0625rem] leading-[1.72] text-ink2">
              At MMMUT — and at most Indian colleges — students run their entire academic life across
              ten or more disconnected platforms. Critical notices drown in WhatsApp groups. There is
              no trusted way to buy or sell anything on campus. PYQs, timetables, attendance, club
              information and mess menus each live somewhere different, or nowhere at all. Freshers
              get essentially zero structured guidance. Attendance is still roll-call on paper, and
              proxy attendance is routine.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {FRAGMENTED.map((f) => (
                <li
                  key={f}
                  className="rounded-lg border border-dashed border-rule2 px-3 py-1.5 font-mono text-[12px] text-ink3 line-through decoration-accent/60"
                >
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-mono text-[12.5px] text-accent">
              → one identity, one permission model, one notification system
            </p>
          </div>
        </div>
      </Band>

      {/* ══ SURFACES — signature ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>One backend, many faces</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Six surfaces, one API.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Each audience gets an app scoped to their job and permission set. They share almost no
          screens — and every one of them authenticates against the same JWT and RBAC layer.
        </p>
        <SurfaceSwitcher />
      </Band>

      {/* ══ AI ══ */}
      <Band>
        <Eyebrow>The AI hub</Eyebrow>
        <h2 className="t-h1 max-w-3xl text-ink">
          Five assistants that answer from the college, not from the model.
        </h2>
        <p className="t-lead mt-6 max-w-2xl">
          A campus assistant that invents a hostel rule or an exam date is worse than no assistant at
          all. Nothing here is answered from the model&apos;s own weights: every response is grounded
          in retrieved college content, and every response carries its sources.
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BOTS.map((b, i) => (
            <li
              key={b.name}
              className="group rounded-2xl border border-rule bg-bg2 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              style={{ transitionTimingFunction: 'var(--ease)' }}
            >
              <div className="flex items-center justify-between">
                <span className="t-mono text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span className="t-label">{b.role}</span>
              </div>
              <h3 className="t-h3 mt-3 text-ink">{b.name}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink2">{b.detail}</p>
            </li>
          ))}
          <li className="rounded-2xl border border-dashed border-rule2 p-5">
            <p className="t-label mb-3">Shared infrastructure</p>
            <ul className="space-y-1.5 text-[13px] text-ink2">
              <li>pgvector semantic index</li>
              <li>LangChain + LangGraph</li>
              <li>LangFuse observability</li>
              <li>Redis response cache</li>
              <li>Key rotation across 4 providers</li>
            </ul>
          </li>
        </ul>

        {/* ── The graph ── */}
        <div className="mt-16">
          <p className="t-mono text-accent2">One graph, five destinations</p>
          <h3 className="t-h2 mt-3 max-w-2xl text-ink">
            Every query walks the same state machine.
          </h3>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink2">
            Five separate bots would have meant five separate implementations of context building,
            logging, persistence and rate limiting. Instead there is one LangGraph workflow with a
            single conditional edge: <code className="font-mono text-[13px] text-accent">classifyIntent</code> decides
            whether a question needs retrieval, and everything downstream is shared.
          </p>

          <ol className="mt-10 divide-y divide-rule border-y border-rule">
            {GRAPH.map((g, i) => {
              const branch = g.n === 'retrieveKnowledge' || g.n === 'routeToAgent'
              return (
                <li key={g.n} className="grid gap-x-7 gap-y-1.5 py-4 sm:grid-cols-[38px_230px_1fr]">
                  <span className="t-mono pt-1 text-ink3">{String(i + 1).padStart(2, '0')}</span>
                  <code
                    className="pt-1 font-mono text-[13px]"
                    style={{ color: branch ? 'var(--c-accent2)' : 'var(--c-accent)' }}
                  >
                    {branch && <span className="mr-1.5 opacity-60">&#9492;</span>}
                    {g.n}
                  </code>
                  <p className="text-[14.5px] leading-relaxed text-ink2">{g.d}</p>
                </li>
              )
            })}
          </ol>
        </div>

        {/* ── Retrieval ── */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="t-mono text-accent3">Chunking</p>
            <h3 className="t-h2 mt-3 text-ink">Chunk size is a function of content type.</h3>
            <p className="mt-5 text-[15px] leading-relaxed text-ink2">
              A single chunking strategy either shreds a set of study notes mid-argument or pads one
              past-year question with three unrelated ones. Each source type gets the strategy and
              overlap its structure actually calls for.
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-rule2">
                    <th className="t-label pb-2.5 font-normal">Source</th>
                    <th className="t-label pb-2.5 font-normal">Strategy</th>
                    <th className="t-label pb-2.5 text-right font-normal">Chars</th>
                    <th className="t-label pb-2.5 text-right font-normal">Overlap</th>
                  </tr>
                </thead>
                <tbody>
                  {CHUNKING.map((c) => (
                    <tr key={c.type} className="border-b border-rule">
                      <td className="py-2.5 text-[14px] text-ink">{c.type}</td>
                      <td className="py-2.5 font-mono text-[12.5px] text-accent2">{c.strat}</td>
                      <td className="py-2.5 text-right font-mono text-[12.5px] tabular-nums text-ink2">{c.size}</td>
                      <td className="py-2.5 text-right font-mono text-[12.5px] tabular-nums text-ink3">{c.ov}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:pt-14">
            <div className="rounded-3xl border border-rule bg-bg2 p-7">
              <p className="t-label mb-5">Embedding, with a fallback</p>
              <div className="space-y-3">
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--c-accent)' }}>
                  <p className="font-mono text-[13px] text-ink">Nomic Embed Text v1</p>
                  <p className="t-mono mt-1 text-ink3">768 dimensions · primary</p>
                </div>
                <p className="t-mono pl-4 text-ink3">&#8595; on failure or quota</p>
                <div className="rounded-xl border border-rule p-4">
                  <p className="font-mono text-[13px] text-ink2">Gemini text-embedding-004</p>
                  <p className="t-mono mt-1 text-ink3">768 dimensions · fallback</p>
                </div>
              </div>
              <p className="mt-5 text-[14px] leading-relaxed text-ink2">
                Both produce 768-dimensional vectors, so a fallback embedding stays directly
                comparable to a primary one and the index never has to be rebuilt.
              </p>
            </div>

            <div className="mt-6 rounded-3xl border border-rule p-7">
              <p className="t-label mb-4">Retrieval, per query</p>
              <ol className="space-y-2.5 text-[14px] leading-relaxed text-ink2">
                <li><span className="t-mono mr-2 text-accent">01</span>Embed the question</li>
                <li><span className="t-mono mr-2 text-accent">02</span>Cosine top-K over pgvector</li>
                <li><span className="t-mono mr-2 text-accent">03</span>Filter by department and semester</li>
                <li><span className="t-mono mr-2 text-accent">04</span>Build the context string</li>
                <li><span className="t-mono mr-2 text-accent">05</span>Answer, with sources attached</li>
              </ol>
            </div>
          </div>
        </div>
      </Band>


      {/* ══ ARCHITECTURE ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Architecture</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">How it fits together.</h2>
        <div className="mt-8">
          <ArchitectureImage src={project.architectureImage} alt="Nexsus system architecture" />
        </div>
        <p className="t-label mb-3 mt-10">As drawn in the repo</p>
        <div className="overflow-hidden rounded-2xl border border-rule bg-bg p-4 sm:p-6">
          <pre className="ascii">{project.architecture}</pre>
        </div>
      </Band>

      {/* ══ DEPLOYMENT ══ */}
      <Band>
        <Eyebrow>The deployment</Eyebrow>
        <h2 className="t-h1 max-w-3xl text-ink">
          The department runs its timetable on this.
        </h2>
        <p className="t-lead mt-6 max-w-2xl">
          In 2026 the CSE department handed us the real thing. Not a pilot, not a parallel run —
          the live academic timetable, for every cohort the department teaches. If the solver is
          wrong, the schedule is wrong, and three hundred people walk to the wrong room.
        </p>

        {/* Cohorts covered */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="t-label mb-4">Cohorts scheduled together</p>
            <ul className="divide-y divide-rule border-y border-rule">
              {COHORTS.map((c) => (
                <li key={c.c} className="flex items-baseline justify-between gap-6 py-3.5">
                  <span className="text-[15px] font-medium text-ink">{c.c}</span>
                  <span className="t-mono shrink-0 text-ink3">{c.s}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14.5px] leading-relaxed text-ink2">
              All four B.Tech years, both M.Tech semesters, the minor-degree track and the M.Sc
              service courses — solved as one problem, because they share faculty and rooms.
            </p>
          </div>

          {/* Weekly load, to scale */}
          <div>
            <p className="t-label mb-4">Weekly contact hours, to scale</p>
            <div className="space-y-5">
              {LOAD.map((l, i) => {
                const total = LOAD.reduce((a, b) => a + b.hours, 0)
                const pct = (l.hours / total) * 100
                const tone = ['var(--c-accent)', 'var(--c-accent2)', 'var(--c-accent3)'][i]
                return (
                  <div key={l.k}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-[15px] text-ink">
                        <span className="t-mono mr-2" style={{ color: tone }}>{l.k}</span>
                        {l.label}
                      </span>
                      <span className="font-display text-2xl font-bold tabular-nums text-ink">
                        {l.hours.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg3">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: tone }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-6 border-t border-rule pt-4 text-[14.5px] leading-relaxed text-ink2">
              1,955 hours a week, across 41 courses and 31 faculty members, with zero clashes. The
              previous version of this document was a spreadsheet and a whiteboard.
            </p>
          </div>
        </div>

        {/* The solver */}
        <div className="mt-14 rounded-3xl border border-rule bg-bg2 p-7 sm:p-10">
          <p className="t-mono text-accent">Constraint satisfaction, not a heuristic</p>
          <h3 className="t-h2 mt-3 max-w-2xl text-ink">
            A timetable is a CSP. So I wrote a CSP solver.
          </h3>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink2">
            The naive approach is greedy placement plus a pile of special cases, and it collapses the
            first time two constraints disagree. Modelling it properly means separating what{' '}
            <em>cannot</em> be violated from what we would <em>prefer</em> — then searching for an
            assignment that satisfies every hard constraint while maximising the soft ones.
          </p>

          <div className="mt-9 grid gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <p className="t-label mb-4" style={{ color: 'var(--c-accent3)' }}>
                Hard — a violation is a broken timetable
              </p>
              <ul className="space-y-2.5">
                {CONSTRAINTS.hard.map((c) => (
                  <li key={c} className="flex gap-3 text-[14.5px] leading-relaxed text-ink">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--c-accent3)' }} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="t-label mb-4" style={{ color: 'var(--c-accent2)' }}>
                Soft — scored and maximised, not required
              </p>
              <ul className="space-y-2.5">
                {CONSTRAINTS.soft.map((c) => (
                  <li key={c} className="flex gap-3 text-[14.5px] leading-relaxed text-ink2">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--c-accent2)' }} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-9 border-t border-rule pt-6 text-[15px] leading-relaxed text-ink2">
            Faculty submit ranked subject preferences; a scoring pass allocates courses before the
            solver ever places a slot, so the schedule people receive is one they had a say in. That
            ordering — preferences first, placement second — is the part that made the department
            trust it.
          </p>
        </div>

        {/* Patent */}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-dashed border-rule2 px-6 py-5">
          <span className="t-mono" style={{ color: 'var(--c-accent3)' }}>In preparation</span>
          <p className="text-[14.5px] leading-relaxed text-ink2">
            A design patent covering the attendance verification and timetable generation methods is
            currently being drafted with the department.
          </p>
        </div>
      </Band>

      {/* ══ HARD PARTS ══ */}
      <Band>
        <Eyebrow>Hard parts</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Where it got difficult.</h2>
        <div className="mt-10 space-y-4">
          {project.challenges.map((c, i) => (
            <div
              key={i}
              className="grid gap-5 rounded-2xl border border-rule bg-bg2 p-6 lg:grid-cols-2 lg:gap-10"
            >
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

      {/* ══ THE ROAD ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>How it got approved</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">
          The hardest part was not the code.
        </h2>
        <p className="t-lead mt-6 max-w-2xl">
          Every technical problem on this page had a solution I could go and find. The three months
          in the middle of this list did not.
        </p>

        <ol className="mt-12 space-y-0">
          {ROAD.map((r, i) => {
            const waiting = r.tone === 'wait'
            const dot = waiting ? 'var(--c-ink3)' : `var(--c-${r.tone})`
            return (
              <li key={r.d} className="grid gap-x-7 gap-y-2 sm:grid-cols-[130px_28px_1fr]">
                <p className="t-mono pt-1 sm:pt-[5px]" style={{ color: dot }}>{r.d}</p>

                {/* rail */}
                <div className="relative hidden justify-center sm:flex" aria-hidden="true">
                  <span
                    className="absolute top-0 h-full w-px"
                    style={{
                      background:
                        i === ROAD.length - 1
                          ? 'transparent'
                          : waiting
                            ? 'repeating-linear-gradient(to bottom, var(--c-rule2) 0 3px, transparent 3px 9px)'
                            : 'var(--c-rule2)',
                    }}
                  />
                  <span
                    className="relative mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full ring-4"
                    style={{ background: dot, '--tw-ring-color': 'var(--c-bg2)' }}
                  />
                </div>

                <div className="pb-10">
                  <h3 className="t-h3 text-ink">{r.t}</h3>
                  <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink2">{r.b}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <blockquote className="mt-4 max-w-2xl border-l-2 pl-6" style={{ borderColor: 'var(--c-accent)' }}>
          <p className="t-accent text-xl leading-snug text-ink sm:text-2xl">
            There is a profound psychological gap between knowing you have built something
            revolutionary and waiting for someone in power to actually look at it.
          </p>
        </blockquote>
      </Band>

      {/* ══ SCREENS ══ */}
      <Band>
        <Eyebrow>Screens</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">What it looks like.</h2>
        <div className="mt-10">
          <Gallery items={project.gallery} title="Nexsus" />
        </div>
      </Band>

      {/* ══ RETROSPECT ══ */}
      <Band className="border-t border-rule">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Eyebrow>Retrospect</Eyebrow>
            <h2 className="t-h1 text-ink">What I&apos;d do differently.</h2>
          </div>
          <div>
            <p className="text-[1.0625rem] leading-[1.72] text-ink2">
              Consolidation is a political problem before it is a technical one. The hard part was
              never the schema — it was getting societies, faculty and the administration to agree to
              route through one system. Registering Nexsus as an official university society in April
              2026 is what made adoption possible; the code had been ready for months.
            </p>
            <p className="t-label mt-8 mb-3">Still open</p>
            <ul className="space-y-2">
              {project.nextSteps.map((s) => (
                <li key={s} className="flex gap-3 text-[15px] leading-relaxed text-ink2">
                  <span className="mt-[9px] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      {/* ══ NEXT ══ */}
      <div className="shell pb-10">
        <Link
          to="/projects/nexsus-counselling"
          className="group block rounded-2xl border border-rule bg-bg2 p-7 transition-colors hover:border-accent/50"
        >
          <span className="t-label">Next project</span>
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="t-h2 text-ink transition-colors group-hover:text-accent">
              Nexsus Counselling Support
            </span>
            <span
              className="shrink-0 text-xl text-ink3 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </div>
          <p className="mt-2 max-w-xl text-[15px] text-ink2">
            900 students, 450 mentorships, 200+ admissions into MMMUT.
          </p>
        </Link>
      </div>
    </article>
  )
}
