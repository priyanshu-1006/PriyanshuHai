import { useLayoutEffect } from 'react'
import { base } from '../data/projectThemes'
import { useTheme } from '../lib/themeContext'

/**
 * Applies the shared light or dark reading palette,
 * then restores the shell when leaving the page.
 *
 * Variables go on <html> rather than a wrapper because `body` owns the page
 * background — scoping to a wrapper would leave the surrounding canvas in the
 * shell palette while the content changed underneath it.
 */
export default function ProjectTheme({ slug }) {
  const { mode } = useTheme()
  useLayoutEffect(() => {
    const root = document.documentElement
    const vars = base[mode]
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
