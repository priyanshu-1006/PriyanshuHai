import { useEffect, useRef } from 'react'

/**
 * Adds `is-in` to the element once it scrolls into view. Pair with `.reveal`.
 *
 * Fail-safe by design: the hidden state is gated behind a `js-reveal` class that
 * only JS can set (see main.jsx), and anything already on screen at mount is
 * revealed synchronously without waiting for the observer. If IntersectionObserver
 * is missing, throttled, or never fires, content ends up visible rather than
 * stranded at opacity 0 — never make a portfolio depend on an animation firing.
 */
export function useReveal({ threshold = 0.12, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => el.classList.add('is-in')

    if (typeof IntersectionObserver === 'undefined') {
      show()
      return
    }

    // Already on screen? Don't wait for a callback that may never arrive.
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < vh && rect.bottom > 0) {
      show()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show()
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return ref
}
