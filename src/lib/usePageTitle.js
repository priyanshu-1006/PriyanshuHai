import { useEffect } from 'react'

export function usePageTitle(title, description) {
  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content')
    document.title = `${title} — Priyanshu Chaurasia`
    if (description) meta?.setAttribute('content', description)
    return () => {
      document.title = previousTitle
      if (previousDescription != null) meta?.setAttribute('content', previousDescription)
    }
  }, [title, description])
}
