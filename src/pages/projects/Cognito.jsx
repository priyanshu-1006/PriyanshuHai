import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectTheme from '../../components/ProjectTheme'
import { BrowserFrame } from '../../components/Device'
import { Gallery, VideoEmbed, ArchitectureImage } from '../../components/Media'
import { useReveal } from '../../lib/useReveal'
import { getProject } from '../../data/projects'

const project = getProject('cognito-learning-hub')

/* Nine services behind a gateway. The `why` column is the whole argument —
   microservices in a hackathon are indefensible unless the workloads differ. */
const SERVICES = [
  { name: 'API Gateway', port: 3000, load: 'routing', why: 'Owns routing, rate limiting, CORS and JWT verification so no downstream service re-implements auth.', keep: true },
  { name: 'Auth', port: 3001, load: 'read-heavy', why: 'Tokens and roles. In hindsight this belonged with quiz and result.', merge: true },
  { name: 'Quiz', port: 3002, load: 'CPU + API bound', why: 'Gemini generation and file parsing — slow, bursty, and nothing else should wait on it.' },
  { name: 'Result', port: 3003, load: 'write-heavy', why: 'Submissions, analytics and leaderboards.', merge: true },
  { name: 'Live', port: 3004, load: 'socket, stateful', why: 'Synchronised multiplayer sessions. Stateful and long-lived — genuinely different from everything else.', keep: true },
  { name: 'Social', port: 3006, load: 'graph reads', why: 'Friends, challenges, chat, notifications, duels.' },
  { name: 'Gamification', port: 3007, load: 'eventually consistent', why: 'XP, levels, achievements, streaks — computed by Bull workers off the request path.', keep: true },
  { name: 'Moderation', port: 3008, load: 'low volume', why: 'Reports, flagging, content review.' },
  { name: 'Meeting', port: 3009, load: 'media transport', why: 'MediaSoup SFU. A completely separate transport problem — isolated so a video failure cannot take down quizzes.', keep: true },
]

const FEATURES = [
  { t: 'AI quiz generation', d: 'Google Gemini builds quizzes from a topic or an uploaded PDF, TXT or DOCX, with configurable difficulty and question count.' },
  { t: 'Live multiplayer', d: 'Socket.IO drives synchronised sessions with live leaderboards, plus 1v1 duels with quick matchmaking.' },
  { t: 'Video rooms', d: 'MediaSoup SFU for multi-participant WebRTC with screen sharing.' },
  { t: 'Gamification', d: '50+ levels, 15+ achievements, streaks, daily and weekly quests — all computed asynchronously.' },
  { t: 'Social hub', d: 'Friend requests, real-time presence, challenge notifications with inline actions.' },
  { t: 'Four roles', d: 'Student, teacher, moderator and admin, each with a scoped surface.' },
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

/* ── Signature: the service mesh, with the retrospective verdict on each ── */
function ServiceMesh() {
  const [sel, setSel] = useState(0)
  const s = SERVICES[sel]

  return (
    <div className="mt-12">
      <div className="overflow-hidden rounded-2xl border border-rule bg-bg2">
        {/* gateway */}
        <div className="border-b border-rule bg-accent/10 p-4 text-center">
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">
            API Gateway :3000 — every request enters here
          </span>
        </div>

        {/* the fan-out */}
        <ul className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-4 lg:grid-cols-8">
          {SERVICES.slice(1).map((svc, i) => {
            const on = sel === i + 1
            return (
              <li key={svc.name}>
                <button
                  type="button"
                  onClick={() => setSel(i + 1)}
                  aria-pressed={on}
                  className={`h-full w-full p-3 text-left transition-colors ${
                    on ? 'bg-accent/15' : 'bg-bg2 hover:bg-bg3'
                  }`}
                >
                  <span
                    className={`block font-display text-[13px] font-semibold leading-tight ${
                      on ? 'text-accent' : 'text-ink'
                    }`}
                  >
                    {svc.name}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] text-ink3">:{svc.port}</span>
                  <span
                    className={`mt-2 block h-[3px] rounded-full ${
                      svc.keep ? 'bg-accent2' : svc.merge ? 'bg-accent3' : 'bg-rule2'
                    }`}
                  />
                </button>
              </li>
            )
          })}
        </ul>

        {/* shared infra */}
        <div className="grid gap-px border-t border-rule bg-rule sm:grid-cols-2">
          <div className="bg-bg2 p-3 text-center font-mono text-[11px] text-ink3">
            MongoDB Atlas — shared, service-scoped collections
          </div>
          <div className="bg-bg2 p-3 text-center font-mono text-[11px] text-ink3">
            Redis Cloud — cache, sessions, Bull queues
          </div>
        </div>

        {/* inspector */}
        <div className="border-t border-rule p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="t-h3 text-ink">{s.name}</h3>
            <span className="t-mono text-ink3">:{s.port}</span>
            <span className="rounded-full border border-rule px-2.5 py-0.5 font-mono text-[10.5px] text-ink3">
              {s.load}
            </span>
            {s.keep && (
              <span className="rounded-full bg-accent2/15 px-2.5 py-0.5 font-mono text-[10.5px] text-accent2">
                would split again
              </span>
            )}
            {s.merge && (
              <span className="rounded-full bg-accent3/15 px-2.5 py-0.5 font-mono text-[10.5px] text-accent3">
                would merge
              </span>
            )}
          </div>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink2">{s.why}</p>
        </div>
      </div>

      <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink3">
        <span className="flex items-center gap-2">
          <span className="h-[3px] w-6 rounded-full bg-accent2" /> split for a real load or failure reason
        </span>
        <span className="flex items-center gap-2">
          <span className="h-[3px] w-6 rounded-full bg-accent3" /> split for symmetry — a mistake
        </span>
      </p>
    </div>
  )
}

export default function Cognito() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="cognito-learning-hub" />

      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[75vh]"
          style={{
            background:
              'radial-gradient(46% 42% at 68% 26%, color-mix(in oklab, var(--c-accent) 22%, transparent), transparent 70%),' +
              'radial-gradient(34% 34% at 18% 12%, color-mix(in oklab, var(--c-accent2) 14%, transparent), transparent 70%)',
          }}
        />
        <div className="shell relative">
          <Link
            to="/#projects"
            className="t-mono inline-flex items-center gap-2 text-ink3 transition-colors hover:text-accent"
          >
            ← All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              Platform
            </span>
            <span className="t-mono text-ink3">2025 · Team — OPTIMISTIC MUTANT CODERS</span>
          </div>

          <h1 className="t-hero mt-7 text-ink" aria-label="Twelve services, one hackathon deadline">
            Twelve services,
            <br />
            <span className="text-accent">one deadline.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            Microservices at a hackathon are an unusual and mostly indefensible choice. We made it
            anyway — because the workloads here genuinely differ, and because a video call falling
            over should never take a quiz down with it.
          </p>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent3/40 bg-accent3/10 px-4 py-2 font-mono text-[12px] text-accent3">
            ★ National Winner · IIT Bombay Techfest ’25
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="https://cognito-learning-hub.vercel.app"
              target="_blank"
              rel="noreferrer noopener"
              className="pill pill-solid"
            >
              Live platform <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://github.com/amitesh-7/Cognito_Learning_Hub"
              target="_blank"
              rel="noreferrer noopener"
              className="pill pill-ghost"
            >
              Source ↗
            </a>
          </div>

          <div className="mt-14">
            <BrowserFrame
              src="/Cognito-Learning-hub-home.png"
              alt="Cognito Learning Hub"
              label="cognito-learning-hub.vercel.app"
            />
          </div>
        </div>
      </header>

      {/* ══ NUMBERS ══ */}
      <Band>
        <div className="grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['National Winner', 'IIT Bombay Techfest ’25'],
            ['12', 'Microservices in the final architecture'],
            ['2–3 months', 'Build time before the finals'],
            ['4', 'Roles — student, teacher, moderator, admin'],
          ].map(([v, l]) => (
            <div key={l} className="bg-bg2 p-6">
              <div className="font-display text-2xl font-bold tracking-tight text-accent sm:text-3xl">
                {v}
              </div>
              <p className="mt-2.5 text-sm leading-snug text-ink2">{l}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* ══ SERVICE MESH — signature ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>The architecture argument</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Nine services. Not all of them earned it.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Quiz generation is CPU-and-API bound. Live sessions are socket-bound and stateful.
          Gamification is write-heavy and eventually consistent. Video is a different transport
          problem entirely. Those four differences justify a split — the rest were symmetry.
        </p>
        <ServiceMesh />
      </Band>

      {/* ══ ARCHITECTURE ══ */}
      <Band>
        <Eyebrow>Diagram</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">How it fits together.</h2>
        <div className="mt-8">
          <ArchitectureImage src={project.architectureImage} alt="Cognito Learning Hub architecture" />
        </div>
        <p className="t-label mb-3 mt-10">As drawn in the repo</p>
        <div className="overflow-hidden rounded-2xl border border-rule bg-bg2 p-4 sm:p-6">
          <pre className="ascii">{project.architecture}</pre>
        </div>
      </Band>

      {/* ══ FEATURES ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>What it does</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Learning, made competitive.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Studying alone against static material has no feedback loop. The bet was that real-time
          competition between students would supply one.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.t} className="rounded-2xl border border-rule bg-bg p-5">
              <h3 className="t-h3 text-ink">{f.t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink2">{f.d}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* ══ HARD PARTS ══ */}
      <Band>
        <Eyebrow>Hard parts</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Where it got difficult.</h2>
        <div className="mt-10 space-y-4">
          {project.challenges.map((c, i) => (
            <div key={i} className="grid gap-5 rounded-2xl border border-rule bg-bg2 p-6 lg:grid-cols-2 lg:gap-10">
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

      {/* ══ VIDEO ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>On video</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">The platform, and the win.</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {project.videos.map((v) => (
            <VideoEmbed key={v.id} id={v.id} label={v.label} />
          ))}
        </div>
      </Band>

      {/* ══ SCREENS ══ */}
      <Band>
        <Eyebrow>Screens</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">What it looks like.</h2>
        <div className="mt-10">
          <Gallery items={project.gallery} title="Cognito Learning Hub" />
        </div>
      </Band>

      {/* ══ RETROSPECT ══ */}
      <Band className="border-t border-rule">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Eyebrow>Retrospect</Eyebrow>
            <h2 className="t-h1 text-ink">Isolation bought, velocity paid.</h2>
          </div>
          <div>
            <p className="text-[1.0625rem] leading-[1.72] text-ink2">
              Microservices gave us real isolation and cost us real velocity. I would make the same
              call again for the video and live services — those genuinely needed to fail
              independently.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-[1.72] text-ink">
              I would keep auth, quiz and result as one service. They were split for symmetry rather
              than for any load or failure reason, and every cross-service call between them was
              pure overhead we paid for nothing.
            </p>
          </div>
        </div>
      </Band>

      {/* ══ NEXT ══ */}
      <div className="shell pb-10">
        <Link
          to="/projects/washing-bro"
          className="group block rounded-2xl border border-rule bg-bg2 p-7 transition-colors hover:border-accent/50"
        >
          <span className="t-label">Next project</span>
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="t-h2 text-ink transition-colors group-hover:text-accent">
              Washing Bro
            </span>
            <span
              className="shrink-0 text-xl text-ink3 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </div>
          <p className="mt-2 max-w-xl text-[15px] text-ink2">
            Campus laundry — four web surfaces, a Flutter app and a FIFO wallet ledger.
          </p>
        </Link>
      </div>
    </article>
  )
}
