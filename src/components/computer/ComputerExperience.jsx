import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import DesktopOS from './DesktopOS'
import HeroTypewriter from './HeroTypewriter'
import RoomThemePicker from './RoomThemePicker'
import SystemIcon from './SystemIcon'
import { profile } from '../../data/profile'
import { useExperience } from '../../lib/experienceContext'
import BootSequence, { shouldShowBoot, rememberBoot } from './BootSequence'
import { lockBodyScroll } from '../../lib/scrollLock'
import '../../computer.css'
import '../../connections.css'

const ComputerScene = lazy(() => import('./ComputerScene'))

export default function ComputerExperience() {
  const {
    reducedMotion,
    openContextMenu,
    setBootVisible,
    bootRequest,
    setBootRequest,
    launchRequest,
    playSound,
  } = useExperience()
  const [showBoot, setShowBoot] = useState(
    () => shouldShowBoot() || bootRequest,
  )
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [focused, setFocused] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(false)
  const [poweringOff, setPoweringOff] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState({
    value: 0,
    label: 'Preparing the scene',
  })
  const transition = useRef(null)
  const entry = useRef(null)
  const scrollRegion = useRef(null)
  const journey = useRef({ entered: false, returning: false })
  const completeBoot = useCallback(() => {
    rememberBoot()
    setShowBoot(false)
    setBootRequest(false)
    requestAnimationFrame(() => entry.current?.focus({ preventScroll: true }))
  }, [setBootRequest])
  const enter = useCallback(() => {
    if (journey.current.entered || journey.current.returning) return
    journey.current.entered = true
    setFocused(true)
    clearTimeout(transition.current)
    playSound('open')
    transition.current = setTimeout(
      () => setDesktopOpen(true),
      reducedMotion || failed ? 0 : 1050,
    )
  }, [failed, reducedMotion, playSound])
  const exit = useCallback(() => {
    clearTimeout(transition.current)
    journey.current.entered = false
    journey.current.returning = window.scrollY > 5
    setDesktopOpen(false)
    setFocused(false)
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? 'instant' : 'smooth',
      })
      entry.current?.focus({ preventScroll: true })
    })
  }, [reducedMotion])
  useEffect(() => {
    if (!poweringOff) return
    const timer = setTimeout(
      () => {
        exit()
        setPoweringOff(false)
      },
      reducedMotion ? 100 : 1600,
    )
    return () => clearTimeout(timer)
  }, [poweringOff, reducedMotion, exit])
  const powerOff = useCallback(() => {
    playSound('close')
    setPoweringOff(true)
  }, [playSound])
  useEffect(() => {
    setBootVisible(showBoot)
    return () => setBootVisible(false)
  }, [showBoot, setBootVisible])
  useEffect(() => {
    if (bootRequest) setShowBoot(true)
  }, [bootRequest])
  useEffect(() => {
    if (launchRequest) {
      completeBoot()
      enter()
    }
  }, [launchRequest, completeBoot, enter])
  const loaded = useCallback(() => {
    setLoading({ value: 100, label: 'Your computer is ready' })
    setReady(true)
  }, [])
  const reportProgress = useCallback(
    (value, label) => setLoading({ value, label }),
    [],
  )
  const error = useCallback(() => {
    setFailed(true)
    setReady(true)
  }, [])
  useEffect(() => {
    if (!focused && !showBoot) return
    return lockBodyScroll()
  }, [focused, showBoot])
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const distance = Math.max(
        1,
        (scrollRegion.current?.offsetHeight ?? 0) - window.innerHeight,
      )
      const amount = Math.min(1, Math.max(0, window.scrollY / distance))
      setProgress(amount)
      if (amount < 0.08) journey.current.returning = false
      if (amount >= 0.96 && !journey.current.returning && !showBoot) enter()
    }
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', scroll)
    update()
    return () => {
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', scroll)
      cancelAnimationFrame(frame)
    }
  }, [enter, showBoot])
  useEffect(() => () => clearTimeout(transition.current), [])

  return (
    <div
      ref={scrollRegion}
      className={`computer-experience ${focused ? 'computer-focused' : ''}`}
      style={{ '--computer-progress': progress }}
    >
      <div
        className="computer-world"
        inert={desktopOpen}
        aria-hidden={desktopOpen}
        onContextMenu={(event) => {
          if (!event.target.closest('button,a,input,textarea'))
            openContextMenu(event)
        }}
      >
        <div className="computer-room-effects" aria-hidden="true">
          <i />
          <i />
        </div>
        <header className="computer-header">
          <Link to="/" className="computer-wordmark">
            <span className="computer-portrait">
              <img src="/Me-light.png" alt="" />
            </span>
            <span className="computer-identity">
              Priyanshu Chaurasia
              <small>Software engineer & incurable builder</small>
            </span>
          </Link>
          <div className="computer-header-links">
            <Link to="/projects">Project showcase ↗</Link>
            <Link to="/overview">Quick overview ↗</Link>
            <a
              href={profile.resumeUrl}
              download="Priyanshu-Chaurasia-Resume.pdf"
            >
              Résumé ↓
            </a>
          </div>
          <span className="computer-edition">
            PERSONAL COMPUTER
            <br />
            <strong>EDITION 26.11</strong>
          </span>
        </header>
        <div className="computer-backdrop" aria-hidden="true">
          <HeroTypewriter />
          <small>A LITTLE COMPUTER. A LOT TO EXPLORE.</small>
        </div>
        <Suspense fallback={null}>
          <ComputerScene
            arriving={!showBoot}
            focused={focused}
            reducedMotion={reducedMotion}
            progress={progress}
            onEnter={enter}
            onReady={loaded}
            onError={error}
            onProgress={reportProgress}
          />
        </Suspense>
        {!ready && !showBoot && (
          <div className="computer-load-card" role="status">
            <div className="computer-boot-brand">
              <img src="/computer/os-logo.webp" alt="Priyanshu OS" />
              <span>A little world, starting up.</span>
            </div>
            <div className="computer-load-header">
              <span className="computer-load-led" />
              <span>Starting your personal computer</span>
              <strong>{loading.value}%</strong>
            </div>
            <div
              className="computer-load-track"
              role="progressbar"
              aria-label="Loading computer"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={loading.value}
            >
              <span style={{ width: `${loading.value}%` }} />
            </div>
            <div className="computer-load-detail">
              <span>
                {loading.label}
                <span className="computer-load-caret">_</span>
              </span>
              <small>graphics · display · workspace</small>
            </div>
          </div>
        )}
        {focused && !desktopOpen && (
          <div className="computer-opening" role="status">
            <img src="/computer/os-logo.webp" alt="" />
            Opening your workspace<span className="computer-load-caret">_</span>
          </div>
        )}
        {failed && (
          <div className="computer-fallback">
            <p>
              The 3D view is unavailable here.
              <br />
              Your desktop is ready to explore.
            </p>
          </div>
        )}
        <div className="computer-bottom">
          <div className="computer-intro">
            <p className="computer-eyebrow">
              <i />A HUMAN BEHIND THE HARDWARE
            </p>
            <h1>
              <span>Engineer.</span>
              <span>Founder.</span>
              <em>Always building.</em>
            </h1>
            <p>
              CTO × 2. Nexsus founder.
              <br />
              GDGoC Organiser & Campus Lead.
            </p>
          </div>
          <div className="computer-entry">
            <RoomThemePicker />
            <button
              ref={entry}
              onClick={enter}
              disabled={focused}
              className="computer-enter"
            >
              <span className="computer-enter-symbol">
                <SystemIcon name="power" />
              </span>
              <span className="computer-enter-copy">
                <small>YOUR PERSONAL WORKSPACE</small>
                <strong>
                  {focused ? 'Opening desktop…' : 'Enter computer'}
                </strong>
              </span>
              <span className="computer-enter-arrow" aria-hidden="true">
                ↗
              </span>
            </button>
            <p>
              {ready
                ? 'Scroll down to step inside.'
                : 'You can enter the desktop while 3D loads.'}
              <br />
              <span>Or click the screen. Make yourself at home.</span>
            </p>
          </div>
        </div>
        <footer className="computer-footer">
          <span>Gorakhpur, India · CSE ’28</span>
          <span className="computer-scroll-hint">
            <span className="computer-scroll-mouse" aria-hidden="true">
              <i />
            </span>
            Scroll to step inside
          </span>
          <button onClick={enter}>
            Open the desktop <span aria-hidden="true">↗</span>
          </button>
        </footer>
        <div className="computer-journey-line" aria-hidden="true">
          <span style={{ transform: `scaleY(${progress})` }} />
        </div>
      </div>
      <DesktopOS active={desktopOpen} onExit={powerOff} />
      {poweringOff && (
        <div className="computer-poweroff" role="status">
          <img src="/computer/os-logo.webp" alt="" />
          <span className="os-eyebrow">PRIYANSHU OS</span>
          <h2>Until the next idea.</h2>
          <p>Powering off your workspace…</p>
          <div className="poweroff-line" />
        </div>
      )}
      {showBoot && (
        <BootSequence ready={ready} loading={loading} onDone={completeBoot} />
      )}
    </div>
  )
}
