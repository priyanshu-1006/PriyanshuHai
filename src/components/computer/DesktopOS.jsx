import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import DesktopIcon from './DesktopIcon'
import DesktopApps, { APPS, getApp } from './DesktopApps'
import { useExperience } from '../../lib/experienceContext'
import SystemIcon from './SystemIcon'
import ClockCalendar from './ClockCalendar'

function initialWallpaper() {
  try {
    const value = localStorage.getItem('priyanshu-os:wallpaper:v2')
    return ['forest', 'blue', 'sand', 'bliss', 'personal'].includes(value)
      ? value
      : 'bliss'
  } catch {
    return 'bliss'
  }
}

export default function DesktopOS({ active, onExit }) {
  const {
    desktopCommands,
    setDesktopActive,
    launchRequest,
    setLaunchRequest,
    openContextMenu,
    setSettingsPanel,
    toggleSound,
    preferences,
    playSound,
  } = useExperience()
  const [windows, setWindows] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [startOpen, setStartOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [wallpaper, setWallpaper] = useState(initialWallpaper)
  const workspace = useRef(null)
  const zIndex = useRef(10)
  const started = useRef(false)
  const desktop = useRef(null)
  const search = useRef(null)
  const desktopSnapshot = useRef(null)

  const openApp = useCallback(
    (id) => {
      const app = getApp(id)
      if (!app) return
      playSound('open')
      desktopSnapshot.current = null
      const order = ++zIndex.current
      setWindows((current) => {
        const existing = current.find((w) => w.id === id)
        if (existing)
          return current.map((w) =>
            w.id === id ? { ...w, minimized: false, z: order } : w,
          )
        const area = workspace.current
        const width = area?.clientWidth || window.innerWidth
        const height = area?.clientHeight || window.innerHeight - 80
        const narrow = width < 640
        const w = Math.min(850, width - 48)
        const h = Math.min(590, height - 55)
        const cascade = (current.length % 4) * 20
        return [
          ...current,
          {
            ...app,
            z: order,
            x: Math.min(
              Math.max(20, (width - w) / 2 + cascade),
              width - w - 12,
            ),
            y: Math.min(28 + cascade, Math.max(12, height - h - 12)),
            width: w,
            height: h,
            maximized: narrow,
            minimized: false,
          },
        ]
      })
      setActiveId(id)
      setStartOpen(false)
      setQuery('')
    },
    [playSound],
  )

  useEffect(() => {
    if (active && !started.current) {
      started.current = true
      openApp('welcome')
    }
    if (active) desktop.current?.focus({ preventScroll: true })
  }, [active, openApp])
  useEffect(() => {
    setDesktopActive(active)
    return () => setDesktopActive(false)
  }, [active, setDesktopActive])
  useEffect(() => {
    if (active && launchRequest) {
      openApp(launchRequest.id)
      setLaunchRequest(null)
    }
  }, [active, launchRequest, openApp, setLaunchRequest])
  useEffect(() => {
    if (startOpen) search.current?.focus()
  }, [startOpen])
  useEffect(() => {
    const resize = () => {
      const width = workspace.current?.clientWidth || window.innerWidth
      const height = workspace.current?.clientHeight || window.innerHeight
      setWindows((current) =>
        current.map((w) => ({
          ...w,
          width: Math.min(w.width, width - 24),
          height: Math.min(w.height, height - 24),
          x: Math.max(
            8,
            Math.min(w.x, width - Math.min(w.width, width - 24) - 8),
          ),
          y: Math.max(8, Math.min(w.y, height - 60)),
          maximized: width < 640 ? true : w.maximized,
        })),
      )
    }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const focus = (id) => {
    const order = ++zIndex.current
    setActiveId(id)
    setWindows((current) =>
      current.map((w) =>
        w.id === id ? { ...w, z: order, minimized: false } : w,
      ),
    )
  }
  const close = (id) => {
    playSound('close')
    setWindows((current) => current.filter((w) => w.id !== id))
    if (activeId === id)
      setActiveId(
        windows
          .filter((w) => w.id !== id && !w.minimized)
          .sort((a, b) => b.z - a.z)[0]?.id || null,
      )
  }
  const minimize = (id) => {
    setWindows((current) =>
      current.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    )
    if (activeId === id)
      setActiveId(
        windows
          .filter((w) => w.id !== id && !w.minimized)
          .sort((a, b) => b.z - a.z)[0]?.id || null,
      )
  }
  const maximize = (id) => {
    focus(id)
    setWindows((current) =>
      current.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    )
  }
  const updatePosition = (id, x, y) =>
    setWindows((current) =>
      current.map((w) => (w.id === id ? { ...w, x, y } : w)),
    )
  const showDesktop = () => {
    const visible = windows.filter((w) => !w.minimized)
    if (visible.length) {
      desktopSnapshot.current = visible.map((w) => w.id)
      setWindows((current) => current.map((w) => ({ ...w, minimized: true })))
      setActiveId(null)
      desktop.current?.focus({ preventScroll: true })
    } else {
      const ids = desktopSnapshot.current
      const restored = windows
        .filter((w) => !ids || ids.includes(w.id))
        .sort((a, b) => b.z - a.z)
      setWindows((current) =>
        current.map((w) => ({
          ...w,
          minimized: ids ? !ids.includes(w.id) : false,
        })),
      )
      setActiveId(restored[0]?.id || null)
      desktopSnapshot.current = null
    }
  }
  useEffect(() => {
    const api = {
      active,
      openApp,
      exit: onExit,
      showDesktop,
      minimizeActive: () => activeId && minimize(activeId),
    }
    desktopCommands.current = api
    return () => {
      if (desktopCommands.current === api) desktopCommands.current = null
    }
  })
  const setAppearance = (value) => {
    setWallpaper(value)
    try {
      localStorage.setItem('priyanshu-os:wallpaper:v2', value)
    } catch {
      /* Appearance remains usable without storage. */
    }
  }
  const filteredApps = APPS.filter((app) =>
    `${app.title} ${app.subtitle}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div
      ref={desktop}
      className={`os-desktop wallpaper-${wallpaper} ${active ? 'is-open' : ''}`}
      inert={!active}
      aria-hidden={!active}
      tabIndex={-1}
      aria-label="Priyanshu OS desktop"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !event.defaultPrevented) {
          if (startOpen) setStartOpen(false)
          else onExit()
        }
      }}
    >
      <header className="os-menu-bar">
        <button className="os-brand-button" onClick={() => openApp('credits')}>
          <img src="/computer/os-logo.webp" alt="" />
          Priyanshu OS <small>26.11</small>
        </button>
        <span className="os-menu-status">
          <i />A personal corner of the internet
        </span>
        <div>
          <Link to="/overview">Quick overview ↗</Link>
          <button onClick={onExit} aria-label="Power off computer">
            Power off <span aria-hidden="true">⏻</span>
          </button>
        </div>
      </header>
      <div
        className="os-workspace"
        ref={workspace}
        onContextMenu={(event) => {
          if (event.target.closest('.os-window,input,textarea,a')) return
          openContextMenu(
            event,
            event.target.closest('[data-app-id]')?.dataset.appId,
          )
        }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setStartOpen(false)
        }}
      >
        <div className="os-wallpaper-art" aria-hidden="true">
          <div className="os-orbit orbit-one" />
          <div className="os-orbit orbit-two" />
          <div className="os-orbit orbit-three" />
          <span>Priyanshu</span>
          <p>
            Stay curious.
            <br />
            <em>Keep building.</em>
          </p>
          <small>PRIYANSHU CHAURASIA / PERSONAL COMPUTER</small>
        </div>
        <div className="os-desktop-icons" aria-label="Desktop applications">
          {APPS.filter(
            (app) => !['welcome', 'settings', 'credits'].includes(app.id),
          ).map((app) => (
            <button
              key={app.id}
              data-app-id={app.id}
              className="os-shortcut"
              onClick={() => openApp(app.id)}
              title={app.subtitle}
            >
              <DesktopIcon
                kind={app.icon}
                asset={app.asset}
                project={app.projectSlug}
              />
              <span>{app.title}</span>
            </button>
          ))}
        </div>
        {!windows.some((w) => !w.minimized) && (
          <button
            className="os-welcome-note"
            onClick={() => openApp('welcome')}
          >
            <span>hello.txt</span>
            <strong>
              Make yourself
              <br />
              at home.
            </strong>
            <small>Click any icon to start exploring. ↗</small>
          </button>
        )}
        {windows.map((w) => (
          <DesktopWindow
            key={w.id}
            window={w}
            active={activeId === w.id}
            onFocus={() => focus(w.id)}
            onClose={() => close(w.id)}
            onMinimize={() => minimize(w.id)}
            onMaximize={() => maximize(w.id)}
            onMove={(x, y) => updatePosition(w.id, x, y)}
            workspace={workspace}
          >
            <DesktopApps
              id={w.id}
              onOpen={openApp}
              wallpaper={wallpaper}
              onWallpaper={setAppearance}
            />
          </DesktopWindow>
        ))}
      </div>
      {startOpen && (
        <>
          <button
            className="os-start-dismiss"
            aria-label="Close start menu"
            onClick={() => setStartOpen(false)}
          />
          <div className="os-start-menu" aria-label="Start menu">
            <div className="os-start-profile">
              <span className="os-start-logo">
                <img src="/computer/os-logo.webp" alt="Priyanshu OS" />
              </span>
              <div>
                <strong>Priyanshu Chaurasia</strong>
                <small>Engineer / Founder / Builder</small>
              </div>
            </div>
            <label className="os-start-search">
              <span aria-hidden="true">⌕</span>
              <input
                ref={search}
                aria-label="Search applications"
                placeholder="Find something to open…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <div className="os-start-apps">
              {filteredApps.map((app) => (
                <button key={app.id} onClick={() => openApp(app.id)}>
                  <DesktopIcon
                    kind={app.icon}
                    asset={app.asset}
                    project={app.projectSlug}
                    small
                  />
                  <span>
                    <strong>{app.title}</strong>
                    <small>{app.subtitle}</small>
                  </span>
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
              {!filteredApps.length && <p>No applications found.</p>}
            </div>
            <div className="os-start-footer">
              <span>Made with curiosity.</span>
              <button onClick={onExit}>⏻ Power off</button>
            </div>
          </div>
        </>
      )}
      <footer className="os-taskbar">
        <button
          className={`os-start-button ${startOpen ? 'pressed' : ''}`}
          onClick={() => setStartOpen((value) => !value)}
          aria-expanded={startOpen}
          aria-label="Start menu"
        >
          <img src="/computer/os-logo.webp" alt="" />
          <strong>start</strong>
        </button>
        <div className="os-running-apps" aria-label="Open applications">
          {windows.map((w) => (
            <button
              key={w.id}
              className={activeId === w.id && !w.minimized ? 'active' : ''}
              onClick={() => {
                if (activeId === w.id && !w.minimized) minimize(w.id)
                else focus(w.id)
              }}
              aria-label={`${w.minimized ? 'Restore' : 'Switch to'} ${w.title}`}
            >
              <DesktopIcon
                kind={w.icon}
                asset={w.asset}
                project={w.projectSlug}
                small
              />
              <span>{w.title}</span>
            </button>
          ))}
        </div>
        <div className="os-clock">
          <button
            className="os-quick-control"
            aria-label="Open accessibility controls"
            title="Display & accessibility · Alt Shift A"
            onClick={() => setSettingsPanel('accessibility')}
          >
            <SystemIcon name="access" />
          </button>
          <button
            className="os-quick-control"
            aria-label={
              preferences.sound
                ? 'Mute desktop sounds'
                : 'Enable desktop sounds'
            }
            aria-pressed={preferences.sound}
            onClick={toggleSound}
            data-ui-sound="none"
          >
            <SystemIcon name={preferences.sound ? 'sound' : 'mute'} />
          </button>
          <span
            className="os-network-indicator"
            aria-label="Portfolio is local to your browser"
          >
            ◦
          </span>
          {active && <ClockCalendar />}
        </div>
      </footer>
    </div>
  )
}

function DesktopWindow({
  window: w,
  active,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  workspace,
  children,
}) {
  const drag = useRef(null)
  const element = useRef(null)
  useEffect(() => {
    if (
      active &&
      !w.minimized &&
      !element.current?.contains(document.activeElement)
    )
      element.current?.focus({ preventScroll: true })
  }, [active, w.minimized])
  const down = (event) => {
    if (event.target.closest('button') || w.maximized || event.button !== 0)
      return
    onFocus()
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      initialX: w.x,
      initialY: w.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const move = (event) => {
    if (!drag.current) return
    const width = workspace.current?.clientWidth || window.innerWidth
    const height = workspace.current?.clientHeight || window.innerHeight
    const x = Math.max(
      0,
      Math.min(
        width - w.width,
        drag.current.initialX + event.clientX - drag.current.x,
      ),
    )
    const y = Math.max(
      0,
      Math.min(
        height - 45,
        drag.current.initialY + event.clientY - drag.current.y,
      ),
    )
    onMove(x, y)
  }
  return (
    <section
      ref={element}
      className={`os-window ${active ? 'os-window-active' : ''} ${w.maximized ? 'os-window-maximized' : ''} ${w.id === 'terminal' ? 'os-window-terminal' : ''} ${w.id === 'browser' ? 'os-window-browser' : ''}`}
      style={{
        left: w.maximized ? 8 : w.x,
        top: w.maximized ? 8 : w.y,
        width: w.maximized ? 'calc(100% - 16px)' : w.width,
        height: w.maximized ? 'calc(100% - 16px)' : w.height,
        zIndex: w.z,
        display: w.minimized ? 'none' : undefined,
      }}
      onPointerDown={onFocus}
      onFocusCapture={() => {
        if (!active) onFocus()
      }}
      tabIndex={-1}
      role="dialog"
      aria-label={w.title}
      aria-modal="false"
    >
      <div
        className="os-window-titlebar"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={() => {
          drag.current = null
        }}
        onPointerCancel={() => {
          drag.current = null
        }}
        onDoubleClick={(e) => {
          if (!e.target.closest('button')) onMaximize()
        }}
      >
        <div className="os-window-title">
          <DesktopIcon
            kind={w.icon}
            asset={w.asset}
            project={w.projectSlug}
            small
          />
          <span>{w.title}</span>
        </div>
        <div className="os-window-controls">
          <button aria-label={`Minimize ${w.title}`} onClick={onMinimize}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 11h8" />
            </svg>
          </button>
          <button
            aria-label={`${w.maximized ? 'Restore' : 'Maximize'} ${w.title}`}
            onClick={onMaximize}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              {w.maximized ? (
                <>
                  <path d="M6 3h7v7" />
                  <rect x="3" y="6" width="7" height="7" rx="1" />
                </>
              ) : (
                <rect x="4" y="4" width="8" height="8" rx="1" />
              )}
            </svg>
          </button>
          <button aria-label={`Close ${w.title}`} onClick={onClose}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m5 5 6 6m0-6-6 6" />
            </svg>
          </button>
        </div>
      </div>
      <div className="os-window-content">{children}</div>
      <div className="os-window-status">
        <span>
          {w.id.startsWith('project:')
            ? 'Project notes / ready to explore'
            : `${w.title.toLowerCase()}.exe`}
        </span>
        <span>
          Priyanshu OS <span aria-hidden="true">⌟</span>
        </span>
      </div>
    </section>
  )
}
