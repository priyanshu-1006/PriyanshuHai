import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useExperience, SHORTCUTS } from '../../lib/experienceContext'
import { containTab } from '../../lib/dialogFocus'
import { lockBodyScroll } from '../../lib/scrollLock'
import ExpertGuide from './ExpertGuide'
import SystemIcon from './SystemIcon'
import RoomThemePicker from './RoomThemePicker'
import '../../experience.css'

function Toggle({ title, description, checked, onChange }) {
  const id = title.toLowerCase().replaceAll(' ', '-')
  return (
    <div className="preference-row">
      <div>
        <strong id={`${id}-label`}>{title}</strong>
        <p id={`${id}-detail`}>{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-detail`}
        className="preference-switch"
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  )
}

function PreferenceDialog() {
  const [soundFeedback, setSoundFeedback] = useState('')
  const {
    preferences,
    updatePreferences,
    reducedMotion,
    settingsPanel,
    setSettingsPanel,
    toggleSound,
    playSound,
    replayBoot,
  } = useExperience()
  const dialog = useRef(null)
  useEffect(() => {
    dialog.current?.querySelector('button')?.focus({ preventScroll: true })
    return lockBodyScroll()
  }, [])
  const shortcuts = settingsPanel === 'shortcuts'
  return (
    <div
      className="experience-modal-backdrop"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) setSettingsPanel(null)
      }}
    >
      <section
        className="experience-preferences"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preferences-title"
        ref={dialog}
        tabIndex={-1}
        onKeyDown={(event) => containTab(event, dialog.current)}
      >
        <header>
          <div className="preferences-title-icon">
            <SystemIcon name={shortcuts ? 'keyboard' : 'access'} />
          </div>
          <div>
            <p>MAKE YOURSELF AT HOME</p>
            <h2 id="preferences-title">
              {shortcuts
                ? 'A few useful keys.'
                : 'Your comfort, your controls.'}
            </h2>
          </div>
          <button
            className="experience-icon-button"
            aria-label="Close accessibility settings"
            onClick={() => setSettingsPanel(null)}
          >
            <SystemIcon name="close" />
          </button>
        </header>
        <nav className="preferences-tabs" aria-label="Control panel sections">
          <button
            aria-pressed={!shortcuts}
            onClick={() => setSettingsPanel('accessibility')}
          >
            Display & sound
          </button>
          <button
            aria-pressed={shortcuts}
            onClick={() => setSettingsPanel('shortcuts')}
          >
            Keyboard shortcuts
          </button>
        </nav>
        <div className="preferences-content">
          {shortcuts ? (
            <>
              <p className="preferences-description">
                Small shortcuts for this little computer. Use them while the
                portfolio has focus.
              </p>
              <div className="shortcut-reference">
                {SHORTCUTS.map((item) => (
                  <div key={item.key}>
                    <span>
                      {item.title}
                      <small>{item.scope}</small>
                    </span>
                    <span>
                      <kbd>Alt</kbd>
                      <kbd>Shift</kbd>
                      <kbd>{item.key}</kbd>
                    </span>
                  </div>
                ))}
                <div>
                  <span>
                    Desktop context menu
                    <small>Home or desktop, outside text fields</small>
                  </span>
                  <span>
                    <kbd>Shift</kbd>
                    <kbd>F10</kbd>
                  </span>
                </div>
                <div>
                  <span>Close the top panel / leave computer</span>
                  <span>
                    <kbd>Esc</kbd>
                  </span>
                </div>
                <div>
                  <span>
                    Show this reference<small>Outside text fields</small>
                  </span>
                  <span>
                    <kbd>?</kbd>
                  </span>
                </div>
              </div>
              <Toggle
                title="Enable keyboard shortcuts"
                description="The buttons and menus remain available either way."
                checked={preferences.shortcuts}
                onChange={(shortcuts) => updatePreferences({ shortcuts })}
              />
            </>
          ) : (
            <>
              <p className="preferences-description">
                Adjust this portfolio to suit you. Your choices stay in this
                browser.
              </p>
              <Toggle
                title="Higher contrast"
                description="Stronger text, clearer borders and solid reading surfaces."
                checked={preferences.highContrast}
                onChange={(highContrast) => updatePreferences({ highContrast })}
              />
              <Toggle
                title="Larger text"
                description="A more comfortable reading size across the site and desktop."
                checked={preferences.largeText}
                onChange={(largeText) => updatePreferences({ largeText })}
              />
              <Toggle
                title="Reduce animation"
                description={
                  reducedMotion && !preferences.reduceMotion
                    ? 'Your device already requests reduced motion. We follow that preference.'
                    : 'Shorter transitions, no animated typing or camera travel.'
                }
                checked={preferences.reduceMotion}
                onChange={(reduceMotion) => updatePreferences({ reduceMotion })}
              />
              <Toggle
                title="Interface sounds"
                description="An original startup chime and quiet clicks, opens and notifications."
                checked={preferences.sound}
                onChange={toggleSound}
              />
              <label className="preference-volume">
                <span>
                  Sound volume <strong>{preferences.volume}%</strong>
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={preferences.volume}
                  onChange={(event) =>
                    updatePreferences({ volume: Number(event.target.value) })
                  }
                  aria-label="Interface sound volume"
                />
                <button
                  className="os-button"
                  disabled={!preferences.sound}
                  onClick={() =>
                    setSoundFeedback(
                      playSound('startup')
                        ? `Startup chime started at ${preferences.volume}%.`
                        : 'Sound output is unavailable in this browser.',
                    )
                  }
                  data-ui-sound="none"
                >
                  Test startup chime
                </button>
                <p className="preference-sound-feedback" role="status">
                  {soundFeedback}
                </p>
              </label>
              <RoomThemePicker />
              <label className="preference-icon-size">
                <span>Desktop icon spacing</span>
                <select
                  value={preferences.iconSize}
                  onChange={(event) =>
                    updatePreferences({ iconSize: event.target.value })
                  }
                >
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </select>
              </label>
              <div className="preferences-direct-links">
                <p>Prefer a direct route?</p>
                <Link to="/overview" onClick={() => setSettingsPanel(null)}>
                  Read the overview <SystemIcon name="arrow" />
                </Link>
                <Link to="/projects" onClick={() => setSettingsPanel(null)}>
                  Browse all projects <SystemIcon name="arrow" />
                </Link>
              </div>
            </>
          )}
        </div>
        <footer>
          <button onClick={replayBoot}>
            <SystemIcon name="power" />
            Replay startup
          </button>
          <button
            className="os-button os-button-primary"
            onClick={() => setSettingsPanel(null)}
          >
            All set <SystemIcon name="check" />
          </button>
        </footer>
      </section>
    </div>
  )
}

function DesktopContextMenu() {
  const {
    contextMenu,
    dismissContextMenu,
    setContextMenu,
    setSettingsPanel,
    setGuideOpen,
    launchApp,
    desktopCommands,
    desktopActive,
    toggleSound,
    preferences,
    replayBoot,
  } = useExperience()
  const menu = useRef(null)
  const [position, setPosition] = useState({
    x: contextMenu.x,
    y: contextMenu.y,
  })
  useLayoutEffect(() => {
    const box = menu.current.getBoundingClientRect()
    setPosition({
      x: Math.max(
        8,
        Math.min(contextMenu.x, window.innerWidth - box.width - 8),
      ),
      y: Math.max(
        8,
        Math.min(contextMenu.y, window.innerHeight - box.height - 8),
      ),
    })
    menu.current.querySelector('button')?.focus({ preventScroll: true })
  }, [contextMenu.x, contextMenu.y])
  useEffect(() => {
    const outside = (event) => {
      if (!menu.current?.contains(event.target)) dismissContextMenu(false)
    }
    const close = () => setContextMenu(null)
    const scrolled = (event) => {
      if (!menu.current?.contains(event.target)) close()
    }
    document.addEventListener('pointerdown', outside, true)
    window.addEventListener('resize', close)
    window.addEventListener('wheel', scrolled, { capture: true, passive: true })
    window.addEventListener('touchmove', scrolled, {
      capture: true,
      passive: true,
    })
    return () => {
      document.removeEventListener('pointerdown', outside, true)
      window.removeEventListener('resize', close)
      window.removeEventListener('wheel', scrolled, true)
      window.removeEventListener('touchmove', scrolled, true)
    }
  }, [dismissContextMenu, setContextMenu])
  const activate = (action) => {
    setContextMenu(null)
    action()
  }
  const items = [
    ...(contextMenu.appId
      ? [
          {
            title: contextMenu.appId.startsWith('project:')
              ? 'Open project'
              : 'Open application',
            icon: 'folder',
            action: () => launchApp(contextMenu.appId),
          },
        ]
      : []),
    {
      title: 'Explore projects',
      icon: 'folder',
      keys: 'P',
      action: () => launchApp('projects'),
    },
    {
      title: 'Ask the portfolio guide',
      icon: 'chat',
      keys: 'H',
      action: () => setGuideOpen(true),
    },
    { separator: true },
    {
      title: 'Display & accessibility…',
      icon: 'access',
      keys: 'A',
      action: () => setSettingsPanel('accessibility'),
    },
    {
      title: 'Keyboard shortcuts…',
      icon: 'keyboard',
      keys: 'K',
      action: () => setSettingsPanel('shortcuts'),
    },
    {
      title: preferences.sound
        ? 'Mute interface sounds'
        : 'Enable interface sounds',
      icon: preferences.sound ? 'sound' : 'mute',
      keys: 'S',
      action: toggleSound,
    },
    ...(desktopActive
      ? [
          {
            title: 'Change wallpaper…',
            icon: 'desktop',
            action: () => launchApp('settings'),
          },
          {
            title: 'Show / restore desktop',
            icon: 'desktop',
            keys: 'D',
            action: () => desktopCommands.current?.showDesktop?.(),
          },
        ]
      : []),
    { separator: true },
    { title: 'Replay startup', icon: 'power', action: replayBoot },
  ]
  return (
    <div
      className="desktop-context-menu"
      role="menu"
      aria-label="Desktop options"
      ref={menu}
      style={{ left: position.x, top: position.y }}
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        const buttons = [...menu.current.querySelectorAll('[role="menuitem"]')]
        const current = buttons.indexOf(document.activeElement)
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault()
          const index =
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? buttons.length - 1
                : (current +
                    (event.key === 'ArrowDown' ? 1 : -1) +
                    buttons.length) %
                  buttons.length
          buttons[index]?.focus()
        } else if (event.key === 'Tab') dismissContextMenu()
      }}
    >
      <div className="context-menu-caption">
        <img src="/computer/os-logo.webp" alt="" />
        <span>Make yourself at home</span>
      </div>
      {items.map((item, index) =>
        item.separator ? (
          <div role="separator" key={index} />
        ) : (
          <button
            role="menuitem"
            key={item.title}
            onClick={() => activate(item.action)}
          >
            <SystemIcon name={item.icon} />
            <span>{item.title}</span>
            {item.keys && <kbd>Alt ⇧ {item.keys}</kbd>}
          </button>
        ),
      )}
    </div>
  )
}

export default function ExperienceChrome() {
  const { pathname } = useLocation()
  const {
    bootVisible,
    desktopActive,
    settingsPanel,
    setSettingsPanel,
    guideOpen,
    setGuideOpen,
    contextMenu,
    preferences,
    toggleSound,
  } = useExperience()
  return (
    <>
      <div
        className={`experience-background-tools ${pathname === '/' && !desktopActive ? 'is-home' : ''}`}
        inert={!!settingsPanel || bootVisible}
      >
        {!bootVisible && (
          <div className="experience-utility-dock" aria-label="Portfolio tools">
            {!desktopActive && (
              <>
                <button
                  className="experience-sound-toggle"
                  aria-label={
                    preferences.sound
                      ? 'Mute interface sounds'
                      : 'Enable interface sounds'
                  }
                  title={
                    preferences.sound
                      ? 'Mute sounds · Alt Shift S'
                      : 'Enable sounds · Alt Shift S'
                  }
                  aria-pressed={preferences.sound}
                  onClick={toggleSound}
                  data-ui-sound="none"
                >
                  <SystemIcon name={preferences.sound ? 'sound' : 'mute'} />
                </button>
                <button
                  className="experience-accessibility-toggle"
                  aria-label="Open display and accessibility settings"
                  title="Display & accessibility · Alt Shift A"
                  onClick={() => setSettingsPanel('accessibility')}
                >
                  <SystemIcon name="access" />
                </button>
              </>
            )}
            <button
              className={`guide-launcher ${guideOpen ? 'is-open' : ''}`}
              aria-label={
                guideOpen ? 'Close portfolio guide' : 'Open portfolio guide'
              }
              aria-expanded={guideOpen}
              onClick={() => setGuideOpen(!guideOpen)}
            >
              <img src="/computer/os-logo.webp" alt="" />
              <span>Ask my guide</span>
              <i aria-hidden="true">{guideOpen ? '−' : '+'}</i>
            </button>
          </div>
        )}
        <ExpertGuide />
        {contextMenu && <DesktopContextMenu />}
      </div>
      {settingsPanel && <PreferenceDialog />}
    </>
  )
}
