import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { projectThemes, base } from '../data/projectThemes'
import { useTheme } from '../lib/themeContext'
import { TechRow } from './ProjectCard'

/**
 * Coverflow project showcase.
 *
 * Every project shows its screenshot — the whole point. Cards sit on a shared
 * 3D plane: the focused one is flat and full size, neighbours rotate away on Y
 * and recede. Only cards within RANGE of focus are rendered, so a long list
 * stays cheap.
 *
 * Deliberately not a library. The transform maths is ~10 lines and a library
 * would bring its own DOM structure, styles and accessibility opinions.
 */

const RANGE = 2 // how many cards either side stay mounted
const DWELL = 4200 // ms a card holds focus before autoplay advances

/**
 * Every screenshot in the set is a browser viewport at roughly 2.2:1. Framing
 * them at 16/10 made object-cover crop a quarter of the width off each one —
 * the sidebars and right rails were simply gone. The frame matches the source.
 */
const FRAME = '22 / 10'

export default function Coverflow({ items, ariaLabel = 'Project showcase' }) {
  const { mode } = useTheme()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const stageRef = useRef(null)
  const rootRef = useRef(null)
  const drag = useRef({ x: 0, active: false })

  const count = items.length
  const go = useCallback((i) => setIndex(Math.max(0, Math.min(count - 1, i))), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [next, prev])

  /**
   * Autoplay. Four gates, all of which must be open: not hovered or focused,
   * tab visible, carousel on screen, and motion not reduced. A carousel that
   * keeps advancing while the reader is hovering a card — or while nobody is
   * looking at it — is the reason people dislike carousels.
   */
  // Seeded rather than set inside the effect, so a reader with reduced motion
  // never sees a frame of autoplay before it is switched off. `document.hidden`
  // belongs in the seed too: visibilitychange only fires on a *change*, so a
  // page opened in a background tab would otherwise autoplay unwatched until
  // the reader first switched to it.
  const [live, setLive] = useState(
    () =>
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !document.hidden,
  )
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let onScreen = true
    let visible = !document.hidden
    const sync = () => setLive(!reduced.matches && onScreen && visible)

    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync() }, { threshold: 0.25 })
    io.observe(root)

    const onVis = () => { visible = !document.hidden; sync() }
    document.addEventListener('visibilitychange', onVis)
    reduced.addEventListener('change', sync)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      reduced.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (paused || !live || count < 2) return
    const t = setTimeout(next, DWELL)
    return () => clearTimeout(t)
    // `index` is a dependency so the dwell restarts from each new card,
    // including cards the reader selected by hand.
  }, [paused, live, count, next, index])

  const running = live && !paused && count > 1

  const active = items[index]
  const accent = projectThemes[active.slug]?.[mode]?.accent || base[mode].ink

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
      }}
    >
      {/* ── Stage ── */}
      <div
        ref={stageRef}
        tabIndex={0}
        className="relative h-[190px] select-none outline-none sm:h-[260px] lg:h-[330px]"
        style={{ perspective: '1600px' }}
        onPointerDown={(e) => { drag.current = { x: e.clientX, active: true } }}
        onPointerUp={(e) => {
          if (!drag.current.active) return
          const dx = e.clientX - drag.current.x
          drag.current.active = false
          if (Math.abs(dx) > 44) (dx < 0 ? next : prev)()
        }}
        onPointerCancel={() => { drag.current.active = false }}
      >
        {items.map((p, i) => {
          const offset = i - index
          if (Math.abs(offset) > RANGE) return null

          const abs = Math.abs(offset)
          const sign = Math.sign(offset)
          const isActive = offset === 0

          // Perspective foreshortens X for receded cards: a card at
          // translateZ(-260px) under perspective 1600px lands at ~0.86 of its
          // nominal offset. A linear X ramp therefore *bunches* the outer
          // cards. Widen the step and keep Z shallow so the gaps stay even.
          const x = sign * (32 + (abs - 1) * 30)
          const rotate = isActive ? 0 : -sign * 34
          const scale = isActive ? 1 : 1 - abs * 0.1
          const z = isActive ? 0 : -abs * 90
          const opacity = isActive ? 1 : Math.max(0.28, 0.66 - (abs - 1) * 0.24)

          const cardAccent = projectThemes[p.slug]?.[mode]?.accent || base[mode].ink

          return (
            <div
              key={p.slug}
              className="absolute left-1/2 top-1/2 w-[72%] max-w-[620px] sm:w-[56%]"
              style={{
                transform: `translate(-50%, -50%) translateX(${x}%) translateZ(${z}px) rotateY(${rotate}deg) scale(${scale})`,
                transformStyle: 'preserve-3d',
                zIndex: 20 - abs,
                opacity,
                transition: 'transform 620ms var(--ease), opacity 620ms var(--ease)',
                pointerEvents: abs > RANGE ? 'none' : 'auto',
              }}
              aria-hidden={!isActive}
            >
              <button
                type="button"
                onClick={() => go(i)}
                tabIndex={isActive ? -1 : 0}
                aria-label={isActive ? undefined : `Show ${p.title}`}
                className="block w-full cursor-pointer"
                style={{ cursor: isActive ? 'default' : 'pointer' }}
              >
                <span
                  className="block overflow-hidden rounded-2xl border bg-bg2 shadow-2xl"
                  style={{
                    borderColor: isActive ? cardAccent : 'var(--c-rule)',
                    boxShadow: isActive
                      ? `0 30px 80px -30px color-mix(in oklab, ${cardAccent} 55%, transparent)`
                      : '0 20px 50px -30px rgba(0,0,0,0.9)',
                  }}
                >
                  <span className="block w-full overflow-hidden bg-black" style={{ aspectRatio: FRAME }}>
                    {p.cover ? (
                      <img
                        src={p.cover}
                        alt={`${p.title} interface`}
                        loading={abs <= 1 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="h-full w-full object-cover object-top"
                        draggable="false"
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center font-mono text-[11px] uppercase tracking-[0.14em] text-white/35">
                        Screenshot pending
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </div>
          )
        })}
      </div>

      {/* ── Caption ── */}
      <div className="mt-8 text-center">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.16em]"
          style={{ color: accent }}
        >
          {active.category} · {active.year}
        </p>
        <h3 className="t-h2 mt-3 text-ink">{active.title}</h3>
        {active.tagline && (
          <p className="t-accent mt-1 text-xl" style={{ color: accent }}>{active.tagline}</p>
        )}
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink2">
          {active.blurb}
        </p>

        {active.award && (
          <p
            className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium"
            style={{ background: `color-mix(in oklab, ${accent} 14%, transparent)`, color: accent }}
          >
            <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor" aria-hidden="true">
              <path d="M6 0l1.6 3.6L11.5 4l-3 2.7.8 3.9L6 8.7 2.7 10.6l.8-3.9L.5 4l3.9-.4L6 0z" />
            </svg>
            {active.award}
          </p>
        )}

        <div className="mt-6 flex justify-center">
          <TechRow tech={active.tech} max={8} size={22} />
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={`/projects/${active.slug}`}
            className="pill"
            style={{ background: accent, color: base[mode].onaccent }}
          >
            View project
            <span aria-hidden="true">→</span>
          </Link>
          {active.links?.live && (
            <a
              href={active.links.live}
              target="_blank"
              rel="noreferrer noopener"
              className="pill pill-ghost"
            >
              Visit site ↗
            </a>
          )}
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="mt-9 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous project"
          className="grid h-11 w-11 place-items-center rounded-full border border-rule text-ink2 transition-colors hover:border-accent hover:text-accent"
        >
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Choose project">
          {items.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={p.title}
              onClick={() => go(i)}
              className="group py-2"
            >
              <span
                className="block h-[3px] overflow-hidden rounded-full transition-all duration-500"
                style={{
                  width: i === index ? 34 : 14,
                  background: i === index ? `color-mix(in oklab, ${accent} 28%, transparent)` : 'var(--c-rule2)',
                  transitionTimingFunction: 'var(--ease)',
                }}
              >
                {/* The active dot doubles as the autoplay dwell meter. */}
                <span
                  key={`${index}-${running}`}
                  className="block h-full rounded-full"
                  style={{
                    background: accent,
                    width: i === index ? '100%' : 0,
                    transformOrigin: 'left',
                    animation:
                      i === index && running ? `cf-dwell ${DWELL}ms linear forwards` : undefined,
                    transform: i === index && !running ? 'scaleX(1)' : undefined,
                  }}
                />
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next project"
          className="grid h-11 w-11 place-items-center rounded-full border border-rule text-ink2 transition-colors hover:border-accent hover:text-accent"
        >
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
