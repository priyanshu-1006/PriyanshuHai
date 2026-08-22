import { useEffect, useRef, useState } from 'react'

/**
 * Device frames that hold either a screenshot or the real site.
 *
 * A live site is rendered at a desktop logical width and CSS-scaled down to fit
 * the frame, so it looks like a real screen rather than a squashed mobile view.
 * Once an iframe has loaded it is never unmounted by the carousel — that is the
 * caching: sliding away hides it, sliding back shows the already-loaded frame.
 */

function useFrameWidth() {
  const ref = useRef(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setW(entry.contentRect.width))
    ro.observe(el)
    setW(el.getBoundingClientRect().width)
    return () => ro.disconnect()
  }, [])

  return [ref, w]
}

/** Shared inner surface: screenshot, or live iframe scaled to fit. */
function Screen({ src, live, logicalWidth, logicalHeight, alt, eager, fit = 'contain' }) {
  const [ref, w] = useFrameWidth()
  const [loadLive, setLoadLive] = useState(false)
  const scale = w ? w / logicalWidth : 0

  if (!src && !live) {
    return (
      <div className="grid h-full w-full place-items-center bg-black px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/35">
          Screenshot pending
        </p>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden bg-black">
      {src && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={`h-full w-full ${
            fit === 'cover' ? 'object-cover object-top' : 'object-contain object-center'
          } transition-opacity duration-500 ${loadLive ? 'opacity-0' : 'opacity-100'}`}
        />
      )}

      {live && loadLive && scale > 0 && (
        <iframe
          src={live}
          title={alt}
          className="absolute left-0 top-0 border-0 bg-white"
          style={{
            width: logicalWidth,
            height: logicalHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
        />
      )}

      {live && !loadLive && (
        <button
          type="button"
          onClick={() => setLoadLive(true)}
          className="group absolute inset-0 grid place-items-end justify-center pb-4"
          aria-label={`Load the live site for ${alt}`}
        >
          <span className="pill pill-solid text-xs opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100">
            Load live site
          </span>
        </button>
      )}
    </div>
  )
}

/** MacBook-style lid + base. Screen area is 16:10. */
export function MacBook({
  src,
  live,
  alt = 'Desktop screenshot',
  eager = false,
  className = '',
  aspect = '16 / 10',
  fit = 'contain',
}) {
  return (
    <div className={`w-full select-none ${className}`}>
      {/* lid */}
      <div className="rounded-[14px] border border-rule2 bg-bg3 p-[10px] shadow-2xl sm:rounded-[18px] sm:p-[14px]">
        <div className="relative overflow-hidden rounded-[6px] bg-black sm:rounded-[8px]">
          {/* camera */}
          <span
            className="absolute left-1/2 top-[5px] z-10 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-ink3/70"
            aria-hidden="true"
          />
          <div className="w-full" style={{ aspectRatio: aspect }}>
            <Screen
              src={src}
              live={live}
              logicalWidth={1440}
              logicalHeight={900}
              alt={alt}
              eager={eager}
              fit={fit}
            />
          </div>
        </div>
      </div>

      {/* base */}
      <div className="relative mx-auto h-[10px] w-[112%] max-w-none -translate-x-[5.35%] rounded-b-[10px] border-x border-b border-rule2 bg-bg3 sm:h-[13px]">
        <span
          className="absolute left-1/2 top-0 h-[4px] w-[16%] -translate-x-1/2 rounded-b-[6px] bg-rule2"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

/** Phone frame with a dynamic-island cutout. Screen area is 9:19.5. */
export function Phone({ src, live, alt = 'Mobile screenshot', eager = false, className = '' }) {
  return (
    <div className={`select-none ${className}`}>
      <div className="rounded-[32px] border border-rule2 bg-bg3 p-[7px] shadow-2xl sm:rounded-[38px] sm:p-[9px]">
        <div className="relative overflow-hidden rounded-[26px] bg-black sm:rounded-[31px]">
          {/* dynamic island */}
          <span
            className="absolute left-1/2 top-[7px] z-10 h-[16px] w-[64px] -translate-x-1/2 rounded-full bg-black sm:h-[19px] sm:w-[74px]"
            aria-hidden="true"
          />
          <div className="aspect-[9/19.5] w-full">
            <Screen
              src={src}
              live={live}
              logicalWidth={430}
              logicalHeight={932}
              alt={alt}
              eager={eager}
              fit="cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/** MacBook with a phone overlapping its lower-right — the standard hero pairing. */
export function DevicePair({ desktop, mobile, live, alt, eager = false }) {
  return (
    <div className="relative w-full pb-8 pr-[16%] sm:pr-[14%]">
      <MacBook src={desktop} live={live} alt={`${alt} on desktop`} eager={eager} />
      {mobile && (
        <div className="absolute bottom-0 right-0 w-[24%] max-w-[132px]">
          <Phone src={mobile} alt={`${alt} on mobile`} eager={eager} />
        </div>
      )}
    </div>
  )
}

/**
 * Browser window frame. Sized to the capture's own aspect ratio rather than a
 * laptop's, so a 2.2:1 screenshot fills it edge to edge with no letterboxing —
 * the right choice when several screens sit together in a grid.
 */
export function BrowserFrame({ src, alt, label, aspect = '1900 / 862', className = '' }) {
  return (
    <figure className={`overflow-hidden rounded-xl border border-rule2 bg-bg3 ${className}`}>
      <div className="flex items-center gap-1.5 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-rule2" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-rule2" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-rule2" aria-hidden="true" />
        {label && (
          <span className="ml-2 truncate font-mono text-[10.5px] text-ink3">{label}</span>
        )}
      </div>
      <div className="bg-black" style={{ aspectRatio: aspect }}>
        {src ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/35">
              Screenshot pending
            </p>
          </div>
        )}
      </div>
    </figure>
  )
}
