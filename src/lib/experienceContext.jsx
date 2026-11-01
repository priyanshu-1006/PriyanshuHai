import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  playInterfaceSound,
  silenceInterface,
  setInterfaceVolume,
} from './interfaceSounds'

const ExperienceContext = createContext(null)
const DEFAULTS = {
  sound: false,
  volume: 30,
  highContrast: false,
  largeText: false,
  reduceMotion: false,
  shortcuts: true,
  iconSize: 'comfortable',
  roomTheme: 'blue',
}
function readPreferences() {
  try {
    const saved = JSON.parse(
      localStorage.getItem('priyanshu-os:preferences:v1') || '{}',
    )
    return {
      ...DEFAULTS,
      ...Object.fromEntries(
        Object.keys(DEFAULTS)
          .filter((key) => typeof saved[key] === typeof DEFAULTS[key])
          .map((key) => [key, saved[key]]),
      ),
      volume: Number.isFinite(saved.volume)
        ? Math.min(100, Math.max(0, saved.volume))
        : 30,
      iconSize: saved.iconSize === 'compact' ? 'compact' : 'comfortable',
      roomTheme: ['blue', 'cream', 'slate'].includes(saved.roomTheme)
        ? saved.roomTheme
        : 'blue',
    }
  } catch {
    return DEFAULTS
  }
}

export const SHORTCUTS = [
  { key: 'P', title: 'Open Projects', action: 'projects', scope: 'Anywhere' },
  { key: 'T', title: 'Open Terminal', action: 'terminal', scope: 'Anywhere' },
  {
    key: 'H',
    title: 'Open the portfolio guide',
    action: 'guide',
    scope: 'Anywhere',
  },
  {
    key: 'A',
    title: 'Display & accessibility',
    action: 'accessibility',
    scope: 'Anywhere',
  },
  {
    key: 'S',
    title: 'Mute / enable sounds',
    action: 'sound',
    scope: 'Anywhere',
  },
  {
    key: 'K',
    title: 'Keyboard shortcuts',
    action: 'shortcuts',
    scope: 'Anywhere',
  },
  {
    key: 'D',
    title: 'Show / restore desktop',
    action: 'showDesktop',
    scope: 'Inside the computer',
  },
  {
    key: 'M',
    title: 'Minimize the active window',
    action: 'minimizeActive',
    scope: 'Inside the computer',
  },
]

export function ExperienceProvider({ children }) {
  const [preferences, setPreferences] = useState(readPreferences)
  const preferenceRef = useRef(preferences)
  const [systemReduced, setSystemReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [settingsPanel, setSettingsPanelState] = useState(null)
  const [guideOpen, setGuideOpenState] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)
  const menuRef = useRef(null)
  menuRef.current = contextMenu
  const panelState = useRef(null)
  const guideState = useRef(false)
  const panelReturn = useRef(null)
  const guideReturn = useRef(null)
  const setSettingsPanel = useCallback((value) => {
    const wasOpen = !!panelState.current
    if (value && !panelState.current)
      panelReturn.current = menuRef.current?.anchor || document.activeElement
    panelState.current = value
    setSettingsPanelState(value)
    if (!value && wasOpen)
      requestAnimationFrame(() => {
        if (panelReturn.current?.isConnected)
          panelReturn.current.focus({ preventScroll: true })
      })
  }, [])
  const setGuideOpen = useCallback((next) => {
    const wasOpen = guideState.current
    const value = typeof next === 'function' ? next(guideState.current) : next
    if (value && !guideState.current)
      guideReturn.current = menuRef.current?.anchor || document.activeElement
    guideState.current = value
    setGuideOpenState(value)
    if (!value && wasOpen)
      requestAnimationFrame(() => {
        if (guideReturn.current?.isConnected)
          guideReturn.current.focus({ preventScroll: true })
      })
  }, [])
  const [desktopActive, setDesktopActive] = useState(false)
  const [bootVisible, setBootVisible] = useState(false)
  const [bootRequest, setBootRequest] = useState(false)
  const [launchRequest, setLaunchRequest] = useState(null)
  const desktopCommands = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const reducedMotion = preferences.reduceMotion || systemReduced
  const updatePreferences = useCallback((patch) => {
    const next = { ...preferenceRef.current, ...patch }
    preferenceRef.current = next
    setPreferences(next)
    if (!next.sound) silenceInterface()
    else if (patch.volume !== undefined) setInterfaceVolume(next.volume / 100)
  }, [])
  const playSound = useCallback((kind) => {
    const value = preferenceRef.current
    return value.sound ? playInterfaceSound(kind, value.volume / 100) : false
  }, [])
  const toggleSound = useCallback(() => {
    const sound = !preferenceRef.current.sound
    updatePreferences({ sound })
    if (sound) playInterfaceSound('notify', preferenceRef.current.volume / 100)
  }, [updatePreferences])
  const launchApp = useCallback(
    (id) => {
      setContextMenu(null)
      setSettingsPanel(null)
      if (desktopCommands.current?.active) desktopCommands.current.openApp(id)
      else {
        setLaunchRequest({ id, key: Date.now() })
        navigate('/')
      }
    },
    [navigate],
  )
  const replayBoot = useCallback(() => {
    setGuideOpen(false)
    setSettingsPanel(null)
    setContextMenu(null)
    desktopCommands.current?.exit?.()
    setBootRequest(true)
    navigate('/')
  }, [navigate])
  const openContextMenu = useCallback((event, appId = null) => {
    event.preventDefault()
    event.stopPropagation()
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      appId,
      anchor: document.activeElement,
    })
  }, [])
  const dismissContextMenu = useCallback((restore = true) => {
    const anchor = menuRef.current?.anchor
    setContextMenu(null)
    if (restore)
      requestAnimationFrame(() => {
        if (anchor?.isConnected) anchor.focus({ preventScroll: true })
      })
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(
        'priyanshu-os:preferences:v1',
        JSON.stringify(preferences),
      )
    } catch {
      /* Session-only fallback. */
    }
    const root = document.documentElement
    root.dataset.contrast = preferences.highContrast ? 'high' : 'standard'
    root.dataset.textSize = preferences.largeText ? 'large' : 'standard'
    root.dataset.motion = reducedMotion ? 'reduced' : 'full'
    root.dataset.iconSize = preferences.iconSize
    root.dataset.roomTheme = preferences.roomTheme
  }, [preferences, reducedMotion])
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const changed = () => setSystemReduced(query.matches)
    query.addEventListener('change', changed)
    return () => query.removeEventListener('change', changed)
  }, [])
  useEffect(() => {
    const clicked = (event) => {
      if (
        event.target.closest?.(
          'button,a,summary,select,input[type="checkbox"]',
        ) &&
        !event.target.closest('[data-ui-sound="none"]')
      )
        playSound('click')
    }
    document.addEventListener('click', clicked, true)
    return () => document.removeEventListener('click', clicked, true)
  }, [playSound])
  useEffect(() => {
    const keyDown = (event) => {
      if (event.key === 'Escape') {
        if (settingsPanel) setSettingsPanel(null)
        else if (contextMenu) dismissContextMenu()
        else if (guideOpen) setGuideOpen(false)
        else return
        event.preventDefault()
        event.stopPropagation()
        return
      }
      const editable = event.target.closest?.(
        'input,textarea,select,[contenteditable="true"]',
      )
      if (
        !editable &&
        !bootVisible &&
        (desktopActive || pathname === '/') &&
        (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10'))
      ) {
        event.preventDefault()
        const rect = document.activeElement?.getBoundingClientRect()
        setContextMenu({
          x: rect?.width ? rect.left + 20 : window.innerWidth / 2,
          y: rect?.height ? rect.bottom + 6 : window.innerHeight / 2,
          anchor: document.activeElement,
        })
        return
      }
      if (!preferences.shortcuts || event.repeat) return
      if (
        event.key === '?' &&
        !editable &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        event.preventDefault()
        setSettingsPanel('shortcuts')
        return
      }
      if (!event.altKey || !event.shiftKey || event.ctrlKey || event.metaKey)
        return
      const shortcut = SHORTCUTS.find(
        (item) => item.key.toLowerCase() === event.key.toLowerCase(),
      )
      if (!shortcut) return
      event.preventDefault()
      event.stopPropagation()
      if (shortcut.action === 'guide') setGuideOpen((value) => !value)
      else if (
        shortcut.action === 'accessibility' ||
        shortcut.action === 'shortcuts'
      )
        setSettingsPanel(shortcut.action)
      else if (shortcut.action === 'sound') toggleSound()
      else if (['projects', 'terminal'].includes(shortcut.action))
        launchApp(shortcut.action)
      else desktopCommands.current?.[shortcut.action]?.()
    }
    document.addEventListener('keydown', keyDown, true)
    return () => document.removeEventListener('keydown', keyDown, true)
  }, [
    preferences.shortcuts,
    settingsPanel,
    guideOpen,
    contextMenu,
    desktopActive,
    bootVisible,
    pathname,
    dismissContextMenu,
    launchApp,
    toggleSound,
  ])

  return (
    <ExperienceContext.Provider
      value={{
        preferences,
        updatePreferences,
        reducedMotion,
        playSound,
        toggleSound,
        settingsPanel,
        setSettingsPanel,
        guideOpen,
        setGuideOpen,
        contextMenu,
        setContextMenu,
        openContextMenu,
        dismissContextMenu,
        desktopActive,
        setDesktopActive,
        desktopCommands,
        launchRequest,
        setLaunchRequest,
        launchApp,
        bootVisible,
        setBootVisible,
        bootRequest,
        setBootRequest,
        replayBoot,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  )
}

export function useExperience() {
  const context = useContext(ExperienceContext)
  if (!context) throw new Error('ExperienceProvider is required')
  return context
}
