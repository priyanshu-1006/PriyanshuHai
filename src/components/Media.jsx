import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Click-to-load YouTube. The poster frame is a cheap image; the iframe (and
 * everything YouTube ships with it) only loads if someone actually wants to watch.
 */
export function VideoEmbed({ id, label }) {
  const [playing, setPlaying] = useState(false)

  return (
    <figure className="border border-rule bg-bg2">
      <div className="relative aspect-video bg-bg">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={label || 'Project video'}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer"
            aria-label={`Play video: ${label || id}`}
          >
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-70 transition-opacity duration-300 group-hover:opacity-90"
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center border border-accent bg-bg/85 transition-colors group-hover:bg-accent">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path
                    d="M8 5v14l11-7z"
                    className="fill-accent transition-colors group-hover:fill-bg"
                  />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      {label && (
        <figcaption className="border-t border-rule px-4 py-2.5 font-mono text-[11px] text-ink3">
          {label}
        </figcaption>
      )}
    </figure>
  )
}

/** Screenshot grid with a keyboard-navigable lightbox. */
export function Gallery({ items, title }) {
  const [open, setOpen] = useState(null)
  const dialog = useRef(null)

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (delta) => setOpen((i) => (i === null ? null : (i + delta + items.length) % items.length)),
    [items.length],
  )

  useEffect(() => {
    if (open === null) return
    const previousFocus = document.activeElement
    dialog.current?.querySelector('button')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'Tab') {
        const buttons = [...(dialog.current?.querySelectorAll('button') || [])]
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      previousFocus?.focus?.()
    }
  }, [open, close, step])

  if (!items?.length) return null

  return (
    <>
      <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.src} className="bg-bg">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full cursor-pointer text-left"
              aria-label={`Open image: ${item.caption || item.src}`}
            >
              <span className="block overflow-hidden bg-bg2">
                <img
                  src={item.src}
                  alt={item.caption || ''}
                  loading="lazy"
                  decoding="async"
                  className="h-48 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </span>
              {item.caption && (
                <span className="block px-3.5 py-2.5 font-mono text-[11px] text-ink3 transition-colors group-hover:text-accent2">
                  {item.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          ref={dialog}
          className="fixed inset-0 z-[100] flex flex-col bg-bg/97 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Image viewer'}
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-rule px-5 py-3">
            <span className="truncate font-mono text-[11px] text-ink3">
              {open + 1} / {items.length}
              {items[open].caption ? ` · ${items[open].caption}` : ''}
            </span>
            <button
              type="button"
              onClick={close}
              className="shrink-0 border border-rule px-3 py-1.5 font-mono text-[11px] text-ink2 transition-colors hover:border-accent hover:text-accent"
            >
              CLOSE ✕
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8">
            <img
              src={items[open].src}
              alt={items[open].caption || ''}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {items.length > 1 && (
            <div className="flex shrink-0 items-center justify-center gap-3 border-t border-rule px-5 py-3">
              <button
                type="button"
                onClick={() => step(-1)}
                className="border border-rule px-4 py-1.5 font-mono text-[11px] text-ink2 transition-colors hover:border-accent2 hover:text-accent2"
              >
                ← PREV
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="border border-rule px-4 py-1.5 font-mono text-[11px] text-ink2 transition-colors hover:border-accent2 hover:text-accent2"
              >
                NEXT →
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

/**
 * Self-hosted screen recording. The poster is a cheap JPEG and the video is
 * `preload="none"`, so a multi-megabyte capture is only fetched if someone
 * actually presses play.
 */
export function LocalVideo({ src, poster, label }) {
  const [playing, setPlaying] = useState(false)

  return (
    <figure className="overflow-hidden rounded-2xl border border-rule bg-bg2">
      <div className="relative aspect-[16/9] bg-black">
        {playing ? (
          <video
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer"
            aria-label={`Play video: ${label || 'screen recording'}`}
          >
            {poster && (
              <img
                src={poster}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain opacity-75 transition-opacity duration-300 group-hover:opacity-95"
              />
            )}
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-accent bg-bg/80 transition-colors group-hover:bg-accent">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M8 5v14l11-7z" className="fill-accent transition-colors group-hover:fill-onaccent" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      {label && (
        <figcaption className="border-t border-rule px-4 py-2.5 font-mono text-[11px] text-ink3">
          {label}
        </figcaption>
      )}
    </figure>
  )
}

/** A real architecture diagram, shown full-width and openable in the lightbox. */
export function ArchitectureImage({ src, alt }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-rule bg-bg2">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full object-contain"
      />
    </figure>
  )
}
