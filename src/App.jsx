import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Contact from './components/Contact'
import Home from './pages/Home'
import ProjectsIndex from './pages/ProjectsIndex'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import ProjectDetail from './pages/ProjectDetail'
import Overview from './pages/Overview'
import ExperienceChrome from './components/computer/ExperienceChrome'
import { useExperience } from './lib/experienceContext'

/**
 * Route changes go to the top; a hash goes to its anchor. Without this,
 * navigation to a homepage section should land at that section.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  const { reducedMotion } = useExperience()
  const motion = useRef(reducedMotion)
  motion.current = reducedMotion

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({
          behavior: motion.current ? 'instant' : 'smooth',
          block: 'start',
        })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

export default function App() {
  const { pathname } = useLocation()
  const { settingsPanel, bootVisible } = useExperience()
  const onComputer = pathname === '/'
  return (
    <>
      <div
        className={
          onComputer
            ? 'computer-page'
            : `portfolio-pages ${pathname === '/projects' ? 'project-index-page' : ''}`
        }
        inert={!!settingsPanel || bootVisible}
      >
        <a
          className="portfolio-skip-link"
          href={onComputer ? '/overview' : '#main-content'}
        >
          Skip to reading content
        </a>
        <ScrollManager />
        {!onComputer && <Nav />}
        <main id="main-content" className="relative z-10" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/projects" element={<ProjectsIndex />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {!onComputer && <Contact />}
      </div>
      <ExperienceChrome />
    </>
  )
}
