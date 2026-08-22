import { useEffect, useRef } from 'react'

/**
 * Drifting particle field on a 2D canvas. No libraries.
 *
 * Depth is faked with three bands — far particles are smaller, dimmer and
 * slower — which reads as atmosphere rather than as decoration. There are no
 * connecting lines: the constellation effect is a 2014 look and it competes
 * with type for attention.
 *
 * Pauses when the tab is hidden or the canvas scrolls out of view, draws a
 * single static frame under prefers-reduced-motion, and paints once
 * synchronously so the canvas is never blank while waiting for a frame.
 */

const BANDS = [
  { count: 0.55, r: [0.5, 1.1], speed: [2, 6], alpha: [0.10, 0.26] },
  { count: 0.32, r: [1.0, 1.9], speed: [5, 12], alpha: [0.20, 0.42] },
  { count: 0.13, r: [1.6, 2.8], speed: [10, 22], alpha: [0.34, 0.62] },
]

const rand = (a, b) => a + Math.random() * (b - a)

export default function ParticleField({
  className = '',
  style,
  density = 0.00011,
  color = '233, 160, 59', // amber, as rgb triplet
  drift = -0.55,          // radians; up-and-right
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    let particles = []

    const build = () => {
      const target = Math.round(w * h * density)
      const n = Math.max(24, Math.min(target, 260))
      particles = []
      for (const band of BANDS) {
        for (let i = 0; i < Math.round(n * band.count); i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: rand(band.r[0], band.r[1]),
            v: rand(band.speed[0], band.speed[1]),
            a: rand(band.alpha[0], band.alpha[1]),
            // slight per-particle angle spread so it does not look like rain
            ang: drift + rand(-0.22, 0.22),
            tw: Math.random() * Math.PI * 2,
          })
        }
      }
    }

    const resize = () => {
      const cssW = Math.max(1, canvas.clientWidth)
      const cssH = Math.max(1, canvas.clientHeight)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const nw = Math.round(cssW * dpr)
      const nh = Math.round(cssH * dpr)
      if (nw === w && nh === h) return false
      w = nw
      h = nh
      canvas.width = w
      canvas.height = h
      build()
      return true
    }
    resize()

    let settleTimer = 0

    let last = performance.now()

    /** Renders one frame. Assumes the canvas is already correctly sized. */
    const render = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.x += Math.cos(p.ang) * p.v * dpr * dt
        p.y += Math.sin(p.ang) * p.v * dpr * dt
        p.tw += dt * 0.8

        // wrap rather than respawn, so density stays constant
        const pad = p.r * 2
        if (p.x < -pad) p.x = w + pad
        else if (p.x > w + pad) p.x = -pad
        if (p.y < -pad) p.y = h + pad
        else if (p.y > h + pad) p.y = -pad

        const twinkle = 0.82 + Math.sin(p.tw) * 0.18
        ctx.globalAlpha = p.a * twinkle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * dpr, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    /**
     * Size, then paint. Setting canvas.width clears the bitmap and resets the
     * 2D context, so anything that resizes must repaint in the same turn — the
     * rAF loop cannot be relied on to do it (hidden tab, reduced motion).
     */
    const frame = (now) => {
      if (resize()) ctx.fillStyle = `rgb(${color})`
      render(now)
    }

    ctx.fillStyle = `rgb(${color})`

    // The effect can run before layout; retry until a real size appears.
    // Declared after frame() because it calls it — `const` is in the temporal
    // dead zone until initialised. setTimeout keeps working when rAF does not.
    let tries = 0
    const settle = () => {
      tries += 1
      frame(performance.now())
      if ((canvas.clientWidth <= 1 || canvas.clientHeight <= 1) && tries < 30) {
        settleTimer = setTimeout(settle, 50)
      }
    }
    if (canvas.clientWidth <= 1 || canvas.clientHeight <= 1) settle()

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let visible = !document.hidden
    let onScreen = true

    const loop = (now) => {
      frame(now)
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }
    const play = () => {
      if (raf || !visible || !onScreen) return
      if (reduced.matches) {
        frame(performance.now())
        return
      }
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting
        if (onScreen) play()
        else stop()
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    let ro = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => frame(performance.now()))
      ro.observe(canvas)
    }
    const onWindowResize = () => frame(performance.now())
    window.addEventListener('resize', onWindowResize)

    const onVisibility = () => {
      visible = !document.hidden
      if (visible) play()
      else stop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    frame(performance.now())
    play()

    return () => {
      stop()
      if (settleTimer) clearTimeout(settleTimer)
      io.disconnect()
      if (ro) ro.disconnect()
      window.removeEventListener('resize', onWindowResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [density, color, drift])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={style}
    />
  )
}
