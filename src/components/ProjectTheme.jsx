import { useLayoutEffect } from 'react'
import { base, getProjectTheme } from '../data/projectThemes'
import { useTheme } from '../lib/themeContext'

// Fonts are fetched once per family, the first time a page needs them.
const loaded = new Set()

function loadFont(css) {
  if (!css || loaded.has(css)) return
  loaded.add(css)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${css}&display=swap`
  document.head.appendChild(link)
}

/**
 * Applies a project's palette and display face for as long as its page is
 * mounted, then puts everything back.
 *
 * Variables go on <html> rather than a wrapper because `body` owns the page
 * background — scoping to a wrapper would leave the surrounding canvas in the
 * shell palette while the content changed underneath it.
 */
export default function ProjectTheme({ slug }) {
  const { mode } = useTheme()

  useLayoutEffect(() => {
    const theme = getProjectTheme(slug)
    if (!theme) return

    const root = document.documentElement
    const vars = { ...base[mode], ...(theme[mode] || {}) }
    const previous = {}

    for (const [key, value] of Object.entries(vars)) {
      const name = `--c-${key}`
      previous[name] = root.style.getPropertyValue(name)
      root.style.setProperty(name, value)
    }

    if (theme.display?.family) {
      loadFont(theme.display.css)
      previous['--f-display'] = root.style.getPropertyValue('--f-display')
      root.style.setProperty(
        '--f-display',
        `${theme.display.family}, ui-sans-serif, system-ui, sans-serif`,
      )
    }

    return () => {
      for (const [name, value] of Object.entries(previous)) {
        if (value) root.style.setProperty(name, value)
        else root.style.removeProperty(name)
      }
    }
  }, [slug, mode])

  return null
}
