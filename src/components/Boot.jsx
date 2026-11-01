import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Boot sequence, staged as a training run.
 *
 * The conceit is the site's own thesis: the person is the model, and the years
 * of quiet work are the training. So the loader is not a spinner — it is a run
 * log with a real loss curve descending behind it, and a stack that lights up
 * layer by layer as the run progresses.
 *
 * Rules it obeys, because loaders are where sites break:
 *   · once per session, never on every navigation
 *   · skippable by click, tap or any key
 *   · hard-capped — the site is revealed even if an asset hangs
 *   · prefers-reduced-motion skips it entirely
 *   · no scroll lock left behind if it unmounts early
 */

const SEEN_KEY = 'boot:seen'

/* Loss decays from 2.41 to 0.04. Deterministic, so the curve is the same
   shape every time and can be reasoned about rather than re-rolled. */
const CURVE = Array.from({ length: 26 }, (_, i) => {
  const wobble = Math.sin(i * 2.1) * 0.06 * Math.exp(-i / 6)
  return Math.max(0.04, 0.04 + 2.37 * Math.exp(-i / 4.1) + wobble)
})

const W = 340
const H = 96
const PATH = CURVE.map((v, i) => {
  const x = (i / (CURVE.length - 1)) * W
  const y = H - 8 - (v / 2.45) * (H - 18)
  return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
}).join(' ')

/* Each stage names what it is doing and which part of the stack it brings up. */
const STAGES = [
  {
    key: 'ingest',
    label: 'preprocessing',
    line: 'ingesting systems · tools · campus infrastructure',
    tech: ['Python', 'Pandas', 'NumPy'],
    ms: 900,
  },
  {
    key: 'train',
    label: 'training',
    line: 'epoch 1/5 — loss 2.41',
    tech: ['PyTorch', 'Jupyter'],
    ms: 820,
  },
  {
    key: 'epochs',
    label: 'training',
    line: 'epoch 4/5 — loss 0.31',
    tech: ['TensorFlow', 'OpenCV'],
    ms: 820,
  },
  {
    key: 'converge',
    label: 'converged',
    line: 'val_loss 0.041 — checkpoint written',
    tech: ['Docker', 'Git'],
    ms: 780,
  },
  {
    key: 'build',
    label: 'building',
    line: 'full-stack developer',
    tech: ['React', 'TypeScript', 'Node.js', 'PostgresSQL', 'Tailwind-CSS', 'Vite'],
    ms: 1250,
  },
]

const TOTAL = STAGES.reduce((a, s) => a + s.ms, 0)

/* Icons in the order they light up. */
const CHIPS = STAGES.flatMap((s) => s.tech.map((t) => ({ t, stage: s.key })))

function shouldBoot() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  // ?boot replays the sequence on demand, without clearing site data.
  if (new URLSearchParams(window.location.search).has('boot')) return true
  try {
    return !sessionStorage.getItem(SEEN_KEY)
  } catch {
    return true // private mode: show it, do not crash
  }
}

export default function Boot() {
  const [on, setOn] = useState(shouldBoot)
  const [step, setStep] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    if (!on) return

    // One place to end it, so every exit path behaves the same. A local flag
    // rather than the `leaving` state, so the guard is correct on the very
    // first call instead of one render behind.
    let done = false
    const finish = () => {
      if (done) return
      done = true
      setLeaving(true)
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch {
        /* private mode — the loader simply shows again next session */
      }
      timers.current.push(setTimeout(() => setOn(false), 520))
    }

    // Advance through the stages.
    let elapsed = 0
    STAGES.forEach((s, i) => {
      elapsed += s.ms
      timers.current.push(setTimeout(() => setStep(i + 1), elapsed))
    })
    timers.current.push(setTimeout(finish, TOTAL + 240))

    // Hard cap. If anything above is starved — a background tab throttling
    // timers, say — the site still appears.
    timers.current.push(setTimeout(finish, 6000))

    const skip = () => finish()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
      document.body.style.overflow = overflow
    }
  }, [on])

  const pct = useMemo(() => {
    const done = STAGES.slice(0, step).reduce((a, s) => a + s.ms, 0)
    return Math.min(100, (done / TOTAL) * 100)
  }, [step])

  if (!on) return null

  const stage = STAGES[Math.min(step, STAGES.length - 1)]
  const litUntil = STAGES.slice(0, step).flatMap((s) => s.tech).length

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-bg transition-opacity duration-500"
      style={{ opacity: leaving ? 0 : 1, transitionTimingFunction: 'var(--ease)' }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="w-full max-w-[420px] px-6">
        {/* ── Header ── */}
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono text-[12px] tracking-tight text-ink2">
            <span className="text-ink3">model</span>
            <span className="text-ink3">.</span>
            <span className="text-accent">fit</span>
            <span className="text-ink3">()</span>
          </p>
          <p className="font-mono text-[11px] tabular-nums text-ink3">
            {String(Math.round(pct)).padStart(3, ' ')}%
          </p>
        </div>

        {/* ── Loss curve ── */}
        <div className="relative mt-5 overflow-hidden rounded-xl border border-rule bg-bg2 px-4 pb-3 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink3">loss</p>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mt-1 block w-full"
            fill="none"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            {[0.25, 0.5, 0.75].map((g) => (
              <line
                key={g}
                x1="0"
                x2={W}
                y1={H * g}
                y2={H * g}
                stroke="var(--c-rule)"
                strokeWidth="1"
                strokeDasharray="2 5"
              />
            ))}
            <path
              d={PATH}
              stroke="var(--c-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{
                strokeDasharray: 1200,
                strokeDashoffset: 1200,
                animation: `boot-draw ${TOTAL}ms linear forwards`,
              }}
            />
          </svg>
          <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums text-ink3">
            <span>2.41</span>
            <span style={{ color: step >= 4 ? 'var(--c-accent2)' : undefined }}>0.041</span>
          </div>
        </div>

        {/* ── Run log ── */}
        <div className="mt-5 min-h-[42px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {stage.label}
            <span className="ml-1.5 inline-block w-[1ch] animate-[pulse-signal_1s_ease-in-out_infinite]">
              _
            </span>
          </p>
          <p className="mt-1.5 font-mono text-[12.5px] leading-snug text-ink">{stage.line}</p>
        </div>

        {/* ── Stack coming up ── */}
        <ul className="mt-6 flex flex-wrap gap-2">
          {CHIPS.map((c, i) => {
            const lit = i < litUntil
            return (
              <li
                key={c.t + i}
                className="grid h-8 w-8 place-items-center rounded-lg border transition-all duration-500"
                style={{
                  borderColor: lit ? 'var(--c-rule2)' : 'var(--c-rule)',
                  background: lit ? 'var(--c-bg2)' : 'transparent',
                  opacity: lit ? 1 : 0.22,
                  transform: lit ? 'none' : 'scale(0.9)',
                  transitionTimingFunction: 'var(--ease)',
                }}
              >
                <img
                  src={`/svg/${c.t}.svg`}
                  alt=""
                  width="17"
                  height="17"
                  aria-hidden="true"
                  className="h-[17px] w-[17px] object-contain"
                  style={{ filter: lit ? 'none' : 'grayscale(1)' }}
                />
              </li>
            )
          })}
        </ul>

        {/* ── Progress ── */}
        <div className="mt-7 h-px w-full overflow-hidden bg-rule">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: 'var(--c-accent)',
              transitionTimingFunction: 'var(--ease)',
            }}
          />
        </div>

        <p className="mt-3 text-right font-mono text-[10px] uppercase tracking-[0.12em] text-ink3">
          press any key to skip
        </p>
      </div>
    </div>
  )
}
