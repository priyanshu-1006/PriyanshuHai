import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useExperience } from '../../lib/experienceContext'
import { containTab } from '../../lib/dialogFocus'
import { projects } from '../../data/projects'
import { guideAnswers } from '../../data/assistantKnowledge'
import SystemIcon from './SystemIcon'

export function shouldShowBoot() {
  try {
    return !sessionStorage.getItem('priyanshu-os:booted:v1')
  } catch {
    return true
  }
}
export function rememberBoot() {
  try {
    sessionStorage.setItem('priyanshu-os:booted:v1', '1')
  } catch {
    /* Still works without storage. */
  }
}

export default function BootSequence({ ready, loading, onDone }) {
  const {
    preferences,
    updatePreferences,
    reducedMotion,
    playSound,
    setSettingsPanel,
    settingsPanel,
  } = useExperience()
  const [phase, setPhase] = useState('welcome')
  const [stage, setStage] = useState(0)
  const began = useRef(0)
  const panel = useRef(null)
  const done = useRef(onDone)
  done.current = onDone
  useEffect(() => {
    const previous = document.activeElement
    panel.current?.querySelector('button')?.focus({ preventScroll: true })
    return () => {
      if (previous?.isConnected && previous !== document.body)
        previous.focus({ preventScroll: true })
    }
  }, [])
  useEffect(() => {
    if (phase !== 'starting') return
    const update = () => {
      const elapsed = performance.now() - began.current
      setStage(reducedMotion ? 3 : Math.min(3, Math.floor(elapsed / 520)))
      if (
        (ready && elapsed >= (reducedMotion ? 100 : 2200)) ||
        elapsed >= 10000
      )
        done.current()
    }
    const timer = setInterval(update, 100)
    update()
    return () => clearInterval(timer)
  }, [phase, ready, reducedMotion])
  const start = (sound) => {
    updatePreferences({
      sound,
      ...(sound && preferences.volume === 0 ? { volume: 30 } : {}),
    })
    if (sound) playSound('startup')
    began.current = performance.now()
    setPhase('starting')
  }
  const labels = [
    'Waking a little world.',
    'A place for things I’ve built.',
    'A few answers, if you’re curious.',
    'Make yourself at home.',
  ]
  return createPortal(
    <div
      className={`os-boot-screen boot-phase-${phase}`}
      inert={!!settingsPanel}
      aria-hidden={!!settingsPanel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="boot-title"
      ref={panel}
      tabIndex={-1}
      onKeyDown={(event) => {
        containTab(event, panel.current)
        if (event.key === 'Escape') {
          event.preventDefault()
          event.stopPropagation()
          onDone()
        }
      }}
    >
      <div className="os-boot-ambient" aria-hidden="true" />
      <header>
        <span>
          <i /> PRIYANSHU OS
        </span>
        <span>PERSONAL COMPUTER / 26.11</span>
      </header>
      <div
        className={`os-boot-centre ${phase === 'starting' ? 'is-starting' : ''}`}
      >
        <div className="os-boot-emblem">
          <span aria-hidden="true" />
          <img
            src="/computer/os-logo.webp"
            alt="Priyanshu OS orbital glass logo"
          />
        </div>
        <p className="os-boot-eyebrow">
          PERSONAL COMPUTER · PROFESSIONAL CURIOSITY
        </p>
        <h1 id="boot-title">
          Priyanshu <em>OS</em>
          <sup>xp</sup>
        </h1>
        <p className="os-boot-subtitle" role="status">
          {phase === 'welcome'
            ? 'Good to have you here. Let’s start something.'
            : labels[stage]}
        </p>
        {phase === 'welcome' ? (
          <div className="os-boot-actions">
            <button
              className="os-boot-primary"
              onClick={() => start(true)}
              data-ui-sound="none"
            >
              <SystemIcon name="power" />
              Start with sound
              <SystemIcon name="arrow" />
            </button>
            <button
              className="os-boot-quiet"
              onClick={() => start(false)}
              data-ui-sound="none"
            >
              <SystemIcon name="mute" />
              Start quietly
            </button>
          </div>
        ) : (
          <div className="os-boot-starting">
            <div className="os-boot-loader" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="os-boot-services">
              {[
                [
                  ready ? 'Display ready' : 'Loading the display',
                  ready ? 'ready' : `${loading.value}%`,
                ],
                ['Project directory', `${projects.length} projects`],
                ['Portfolio guide', `${guideAnswers.length} saved answers`],
                ['Desktop session', 'ready when you are'],
              ].map(([label, value], index) => (
                <div key={index} className={stage >= index ? 'is-ready' : ''}>
                  <span>
                    <i />
                    {label}
                  </span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <footer>
        <button onClick={() => setSettingsPanel('accessibility')}>
          <SystemIcon name="access" />
          Accessibility
        </button>
        <div className="os-boot-display-status">
          <span>{ready ? 'DISPLAY READY' : loading.label}</span>
          {!ready && (
            <progress
              max="100"
              value={loading.value}
              aria-label="Loading the 3D display"
            />
          )}
        </div>
        <div>
          <Link to="/overview" onClick={onDone}>
            Quick overview ↗
          </Link>
          <button onClick={onDone}>
            Skip intro <kbd>Esc</kbd>
          </button>
        </div>
      </footer>
      <span className="os-boot-sound-note">
        {phase === 'welcome'
          ? 'Choose how you arrive. Sound is always optional.'
          : preferences.sound
            ? 'Original startup chime · sound controls available on the desktop'
            : 'Quiet mode · sounds are muted'}
      </span>
    </div>,
    document.body,
  )
}
