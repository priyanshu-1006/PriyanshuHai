import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectTheme from '../../components/ProjectTheme'
import { MacBook } from '../../components/Device'
import { Gallery, ArchitectureImage } from '../../components/Media'
import { useReveal } from '../../lib/useReveal'
import { getProject } from '../../data/projects'

const project = getProject('vigilant-bhai')

const QUESTIONS = [
  { q: 'Is this fraud?', by: 'NLP classification', asked: true, note: 'Every spam filter asks this.' },
  { q: 'Is this link safe?', by: 'Multi-signal URL analysis', asked: false, note: 'Domain age, brand similarity, SSL, blacklists.' },
  { q: 'Where did it start?', by: 'Betweenness centrality', asked: false, note: 'Which node is an origin, not a relay.' },
  { q: 'How is it spreading?', by: 'Propagation mapping', asked: false, note: 'Reach, speed and depth across the graph.' },
  { q: 'Where next?', by: 'Spread prediction', asked: false, note: 'Which clusters the campaign reaches next.' },
]

const SCORE = [
  { label: 'Text', weight: 55, value: 0.91, of: 'XLM-RoBERTa classification' },
  { label: 'URL', weight: 35, value: 0.78, of: 'Domain age · brand distance · SSL' },
  { label: 'Metadata', weight: 10, value: 0.4, of: 'Sender pattern, timing' },
]

/* A deliberately laid-out propagation network: one planted source, three
   campaign clusters, five hops. Mirrors the simulated graph the engine was
   validated against — roughly 500 nodes and 2,000 edges in the real dataset. */
const NODES = [
  { id: 'S', x: 70, y: 240, gen: 0, cluster: 0, kind: 'source', pr: 1.0 },
  { id: 'a1', x: 185, y: 118, gen: 1, cluster: 1, pr: 0.72 },
  { id: 'a2', x: 195, y: 244, gen: 1, cluster: 2, pr: 0.81 },
  { id: 'a3', x: 182, y: 368, gen: 1, cluster: 3, pr: 0.65 },
  { id: 'b1', x: 312, y: 66, gen: 2, cluster: 1, pr: 0.41 },
  { id: 'b2', x: 322, y: 152, gen: 2, cluster: 1, pr: 0.52 },
  { id: 'b3', x: 318, y: 226, gen: 2, cluster: 2, pr: 0.58 },
  { id: 'b4', x: 328, y: 300, gen: 2, cluster: 2, pr: 0.36 },
  { id: 'b5', x: 310, y: 386, gen: 2, cluster: 3, pr: 0.44 },
  { id: 'b6', x: 320, y: 448, gen: 2, cluster: 3, pr: 0.29 },
  { id: 'c1', x: 452, y: 44, gen: 3, cluster: 1, pr: 0.22 },
  { id: 'c2', x: 462, y: 116, gen: 3, cluster: 1, pr: 0.31 },
  { id: 'c3', x: 448, y: 190, gen: 3, cluster: 2, pr: 0.27 },
  { id: 'c4', x: 466, y: 258, gen: 3, cluster: 2, pr: 0.34 },
  { id: 'c5', x: 450, y: 330, gen: 3, cluster: 2, pr: 0.19 },
  { id: 'c6', x: 462, y: 404, gen: 3, cluster: 3, pr: 0.25 },
  { id: 'c7', x: 446, y: 462, gen: 3, cluster: 3, pr: 0.16 },
  { id: 'd1', x: 596, y: 88, gen: 4, cluster: 1, pr: 0.12 },
  { id: 'd2', x: 604, y: 168, gen: 4, cluster: 1, pr: 0.14 },
  { id: 'd3', x: 590, y: 248, gen: 4, cluster: 2, pr: 0.17 },
  { id: 'd4', x: 606, y: 330, gen: 4, cluster: 2, pr: 0.11 },
  { id: 'd5', x: 594, y: 424, gen: 4, cluster: 3, pr: 0.13 },
  { id: 'e1', x: 726, y: 140, gen: 5, cluster: 1, pr: 0.06 },
  { id: 'e2', x: 734, y: 262, gen: 5, cluster: 2, pr: 0.07 },
  { id: 'e3', x: 722, y: 378, gen: 5, cluster: 3, pr: 0.05 },
]

const EDGES = [
  ['S', 'a1'], ['S', 'a2'], ['S', 'a3'],
  ['a1', 'b1'], ['a1', 'b2'], ['a2', 'b3'], ['a2', 'b4'], ['a3', 'b5'], ['a3', 'b6'],
  ['b1', 'c1'], ['b2', 'c2'], ['b3', 'c3'], ['b3', 'c4'], ['b4', 'c5'], ['b5', 'c6'], ['b6', 'c7'],
  ['c1', 'd1'], ['c2', 'd2'], ['c3', 'd3'], ['c4', 'd3'], ['c5', 'd4'], ['c6', 'd5'],
  ['d1', 'e1'], ['d2', 'e1'], ['d3', 'e2'], ['d4', 'e2'], ['d5', 'e3'],
  ['b2', 'c3'], ['c4', 'd4'],
]

const CLUSTER_VAR = ['--c-accent', '--c-accent3', '--c-accent2', '--c-accent3']

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

/* ── Signature: the propagation network ── */
function PropagationGraph() {
  const [sel, setSel] = useState('S')
  const node = NODES.find((n) => n.id === sel)
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))
  const downstream = EDGES.filter(([f]) => f === sel).map(([, t]) => t)
  const upstream = EDGES.filter(([, t]) => t === sel).map(([f]) => f)

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
      <div className="overflow-hidden rounded-2xl border border-rule bg-bg2">
        <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
          <span className="t-mono text-ink3">graph/campaign/0x8F2</span>
          <span className="t-mono text-accent2">{NODES.length} nodes · {EDGES.length} edges</span>
        </div>
        <svg viewBox="0 0 800 500" className="w-full" role="img" aria-label="Scam propagation network with the source node identified">
          {EDGES.map(([f, t]) => {
            const a = byId[f], b = byId[t]
            const hot = f === sel || t === sel
            return (
              <line
                key={`${f}-${t}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={hot ? 'var(--c-accent)' : 'var(--c-rule2)'}
                strokeWidth={hot ? 1.8 : 1}
                opacity={hot ? 0.9 : 0.45}
              />
            )
          })}
          {NODES.map((n) => {
            const on = n.id === sel
            const isSource = n.kind === 'source'
            const r = isSource ? 15 : 5 + n.pr * 8
            return (
              <g key={n.id} onClick={() => setSel(n.id)} className="cursor-pointer">
                {isSource && (
                  <circle
                    cx={n.x} cy={n.y} r={r + 9}
                    fill="none" stroke="var(--c-accent)" strokeWidth="1" opacity="0.5"
                    style={{ animation: 'pulse-signal 2.6s ease-in-out infinite' }}
                  />
                )}
                <circle
                  cx={n.x} cy={n.y} r={r}
                  fill={isSource ? 'var(--c-accent)' : `var(${CLUSTER_VAR[n.cluster]})`}
                  opacity={on ? 1 : isSource ? 1 : 0.55}
                  stroke={on ? 'var(--c-ink)' : 'transparent'}
                  strokeWidth="2"
                />
              </g>
            )
          })}
          <text x={70} y={205} textAnchor="middle" style={{ font: '600 12px var(--f-mono)' }} fill="var(--c-accent)">
            SOURCE
          </text>
        </svg>
      </div>

      {/* inspector */}
      <div className="rounded-2xl border border-rule bg-bg2 p-6">
        <p className="t-label mb-4">Node inspector</p>
        <p className="font-mono text-2xl font-semibold text-ink">
          {node.kind === 'source' ? 'node_origin' : `node_${node.id}`}
        </p>

        <dl className="mt-6 space-y-3 border-t border-rule pt-4">
          {[
            ['Role', node.kind === 'source' ? 'Campaign origin' : 'Relay'],
            ['Hop distance', `${node.gen} from source`],
            ['PageRank', node.pr.toFixed(2)],
            ['Cluster', `community_${node.cluster}`],
            ['Forwards to', downstream.length ? `${downstream.length} node(s)` : 'terminal'],
            ['Received from', upstream.length ? upstream.join(', ') : '— origin'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="t-mono text-ink3">{k}</dt>
              <dd className="t-mono text-right text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 border-t border-rule pt-4 text-[14px] leading-relaxed text-ink2">
          {node.kind === 'source'
            ? 'Betweenness centrality identifies this node as an origin rather than a relay — the thing a classifier can never tell you, because it only ever sees one message at a time.'
            : 'A relay. Blocking it removes one copy; the campaign continues from the origin upstream.'}
        </p>
      </div>
    </div>
  )
}

/* ── Weighted risk score ── */
function ScoreBreakdown() {
  const final = SCORE.reduce((a, s) => a + (s.weight / 100) * s.value, 0)
  const band = final > 0.8 ? 'CRITICAL' : final > 0.6 ? 'HIGH' : final > 0.4 ? 'MEDIUM' : 'LOW'

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-rule bg-bg2">
      <div className="border-b border-rule p-6">
        <p className="t-mono text-ink3">
          0.55 × Text + 0.35 × URL + 0.10 × Metadata
        </p>
        <div className="mt-5 flex flex-wrap items-baseline gap-4">
          <span className="font-display text-5xl font-bold text-accent">{final.toFixed(2)}</span>
          <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[12px] tracking-[0.14em] text-accent">
            {band}
          </span>
        </div>
      </div>
      <ul className="divide-y divide-rule">
        {SCORE.map((s) => (
          <li key={s.label} className="grid gap-x-6 gap-y-2 p-5 sm:grid-cols-[110px_1fr_60px] sm:items-center">
            <div>
              <p className="font-display text-[15px] font-semibold text-ink">{s.label}</p>
              <p className="t-mono text-ink3">weight {s.weight}%</p>
            </div>
            <div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-bg3">
                <div
                  className="h-full rounded-full bg-accent2"
                  style={{ width: `${s.value * 100}%` }}
                />
              </div>
              <p className="t-mono mt-2 text-ink3">{s.of}</p>
            </div>
            <span className="t-mono text-right tabular-nums text-ink">{s.value.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function VigilantBhai() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="vigilant-bhai" />

      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[75vh]"
          style={{
            background:
              'radial-gradient(44% 40% at 66% 26%, color-mix(in oklab, var(--c-accent) 18%, transparent), transparent 70%),' +
              'radial-gradient(34% 34% at 20% 14%, color-mix(in oklab, var(--c-accent2) 12%, transparent), transparent 70%)',
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
              AI / ML
            </span>
            <span className="t-mono text-ink3">2026 · Solo build</span>
          </div>

          <h1 className="t-hero mt-7 text-ink" aria-label="Blocking one copy does nothing">
            Blocking one copy
            <br />
            <span className="text-accent">does nothing.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            Every spam filter answers one question: is this message fraud? That is the least useful
            thing you can ask about a scam already in circulation. By the time a filter flags a
            copy, it has been forwarded through hundreds of groups.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            Vigilant-Bhai treats a scam as a{' '}
            <span className="font-semibold text-accent2">network event</span>, not a string. It
            traces where a campaign started, how it is moving, and where it surfaces next.
          </p>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent3/40 bg-accent3/10 px-4 py-2 font-mono text-[12px] text-accent3">
            ★ Finalist · Techkriti Innovation Challenge ’26, IIT Kanpur
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="https://github.com/priyanshu-1006/Vigilant-Bhai"
              target="_blank"
              rel="noreferrer noopener"
              className="pill pill-solid"
            >
              Source on GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="mt-14">
            <MacBook src="/Vigilant-bhai-1.png" alt="Vigilant-Bhai dashboard" eager />
          </div>
        </div>
      </header>

      {/* ══ FIVE QUESTIONS ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>The gap</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">One question asked. Four ignored.</h2>
        <ul className="mt-10 divide-y divide-rule border-y border-rule">
          {QUESTIONS.map((q) => (
            <li key={q.q} className="grid gap-x-6 gap-y-2 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-baseline">
              <span
                className={`t-mono ${q.asked ? 'text-ink3' : 'text-accent'}`}
                aria-hidden="true"
              >
                {q.asked ? '□' : '▣'}
              </span>
              <div>
                <p className="t-h3 text-ink">{q.q}</p>
                <p className="mt-1 text-[14.5px] text-ink2">{q.note}</p>
              </div>
              <span className="t-mono text-ink3">{q.by}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 t-mono text-accent">
          ▣ = what a classifier alone cannot answer
        </p>
      </Band>

      {/* ══ SCORING ══ */}
      <Band>
        <Eyebrow>Detection</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Three layers, one decision.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Text and URL are scored independently — a transformer cannot see WHOIS domain age, and a
          blacklist cannot read intent — then combined into one weighted risk band rather than three
          numbers a user has to reconcile.
        </p>
        <ScoreBreakdown />
      </Band>

      {/* ══ PROPAGATION — signature ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Propagation</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Find the origin, not the copy.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Forwarding events become edges in a NetworkX graph. Betweenness centrality separates
          origins from relays, PageRank ranks influence, and Louvain community detection pulls
          concurrent campaigns apart. Click any node.
        </p>
        <PropagationGraph />
      </Band>

      {/* ══ ARCHITECTURE ══ */}
      <Band>
        <Eyebrow>Architecture</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">How it fits together.</h2>
        <div className="mt-8">
          <ArchitectureImage src={project.architectureImage} alt="Vigilant-Bhai system architecture" />
        </div>
        <p className="t-label mb-3 mt-10">As drawn in the repo</p>
        <div className="overflow-hidden rounded-2xl border border-rule bg-bg2 p-4 sm:p-6">
          <pre className="ascii">{project.architecture}</pre>
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
                <span className="mt-0.5 shrink-0 font-mono text-[12px] text-accent">✕</span>
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
          <Gallery items={project.gallery} title="Vigilant-Bhai" />
        </div>
      </Band>

      {/* ══ RETROSPECT ══ */}
      <Band className="border-t border-rule">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Eyebrow>Retrospect</Eyebrow>
            <h2 className="t-h1 text-ink">The honest caveat.</h2>
          </div>
          <div>
            <p className="text-[1.0625rem] leading-[1.72] text-ink2">
              The graph engine is what made this project worth doing, and it is also the part I could
              only validate against synthetic data — the platforms that hold real forwarding graphs
              do not share them. I built a simulated network of roughly 500 nodes and 2,000 edges
              with planted sources, and the algorithms recover the sources I planted.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-[1.72] text-ink">
              That is a weaker claim than it looks, and I would rather state it plainly than let a
              demo imply otherwise. A small amount of real forwarding data would be worth more than
              the entire simulation.
            </p>
          </div>
        </div>
      </Band>

      {/* ══ NEXT ══ */}
      <div className="shell pb-10">
        <Link
          to="/projects/fracturevision-ai"
          className="group block rounded-2xl border border-rule bg-bg2 p-7 transition-colors hover:border-accent/50"
        >
          <span className="t-label">Next project</span>
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="t-h2 text-ink transition-colors group-hover:text-accent">
              FractureVision AI
            </span>
            <span
              className="shrink-0 text-xl text-ink3 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </div>
          <p className="mt-2 max-w-xl text-[15px] text-ink2">
            99.01% binary accuracy, ten-class detection, and a negative result I kept.
          </p>
        </Link>
      </div>
    </article>
  )
}
