import { useLayoutEffect } from 'react'
import { base, getProjectTheme } from '../data/projectThemes'
import { useTheme } from '../lib/themeContext'

/**
 * Applies the shared reading palette with project-specific accent colours,
 * then restores the shell when leaving the page.
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
    // Brand accents belong to the project; paper, type and chrome belong to the portfolio.
    const accents = Object.fromEntries(
      Object.entries(theme[mode] || {}).filter(([key]) => key.startsWith('accent')),
    )
    const vars = { ...base[mode], ...accents }
    const previous = {}

    for (const [key, value] of Object.entries(vars)) {
      const name = `--c-${key}`
      previous[name] = root.style.getPropertyValue(name)
      root.style.setProperty(name, value)
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
