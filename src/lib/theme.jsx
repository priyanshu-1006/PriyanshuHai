import { useCallback, useEffect, useState } from 'react'
import { ThemeContext, useTheme } from './themeContext'

const read = () => {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

export function ThemeProvider({ children }) {
  // The inline boot script in index.html already resolved this before paint;
  // read it back rather than recomputing and risking a mismatch.
  const [mode, setModeState] = useState(read)

  const setMode = useCallback((next) => {
    setModeState(next)
    document.documentElement.setAttribute('data-theme', next)
    document.documentElement.style.colorScheme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* private mode — the choice just won't persist */
    }
  }, [])

  const toggle = useCallback(
    () => setMode(read() === 'dark' ? 'light' : 'dark'),
    [setMode],
  )

  // Follow the OS until the visitor makes an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (e) => {
      let stored = null
      try {
        stored = localStorage.getItem('theme')
      } catch {
        /* ignore */
      }
      if (stored === 'light' || stored === 'dark') return
      const next = e.matches ? 'light' : 'dark'
      setModeState(next)
      document.documentElement.setAttribute('data-theme', next)
      document.documentElement.style.colorScheme = next
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggle }}>{children}</ThemeContext.Provider>
  )
}

export function ThemeToggle({ className = '' }) {
  const { mode, toggle } = useTheme()
  const isDark = mode === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`grid h-9 w-9 place-items-center rounded-full border border-rule text-ink2 transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7Z" />
        </svg>
      )}
    </button>
  )
}
