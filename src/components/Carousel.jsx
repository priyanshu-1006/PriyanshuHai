import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Slide track carousel.
 *
 * Every slide stays mounted and the track is translated, which is what makes the
 * caching work: an iframe a visitor loaded on slide 3 is still loaded when they
 * come back to it. Auto-advance pauses on hover, on focus, when the tab is
 * hidden, and entirely under prefers-reduced-motion.
 */
export default function Carousel({ items, renderItem, interval = 5200, ariaLabel = 'Carousel' }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef(null)
  const drag = useRef({ startX: 0, active: false })

  const count = items.length
  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count])
  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  useEffect(() => {
    if (paused || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => {
      if (document.hidden) return
      setIndex((i) => (i + 1) % count)
    }, interval)
    return () => clearInterval(id)
  }, [paused, count, interval])

  const onPointerDown = (e) => {
    drag.current = { startX: e.clientX, active: true }
    setPaused(true)
  }
  const onPointerUp = (e) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.startX
    drag.current.active = false
    setPaused(false)
    if (Math.abs(dx) > 48) (dx < 0 ? next : prev)()
  }

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); next() }
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      }}
    >
      <div
        className="overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { drag.current.active = false; setPaused(false) }}
      >
        <div
          ref={trackRef}
          className="flex transition-transform duration-[720ms]"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transitionTimingFunction: 'var(--ease)',
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.slug || i}
              className="w-full shrink-0 px-0.5"
              aria-hidden={i !== index}
              // Keeps focus out of off-screen slides without unmounting them.
              inert={i !== index || undefined}
            >
              {renderItem(item, i, i === index)}
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-7 flex items-center justify-between gap-5">
          {/* progress dots, sized by position */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
            {items.map((item, i) => (
              <button
                key={item.slug || i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={item.title || `Slide ${i + 1}`}
                onClick={() => go(i)}
                className="group py-2"
              >
                <span
                  className={`block h-[3px] rounded-full transition-all duration-500 ${
                    i === index
                      ? 'w-10 bg-accent'
                      : 'w-4 bg-rule2 group-hover:bg-ink3'
                  }`}
                  style={{ transitionTimingFunction: 'var(--ease)' }}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="t-mono mr-2 tabular-nums text-ink3">
              {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="grid h-10 w-10 place-items-center rounded-full border border-rule text-ink2 transition-colors hover:border-accent hover:text-accent"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="grid h-10 w-10 place-items-center rounded-full border border-rule text-ink2 transition-colors hover:border-accent hover:text-accent"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
