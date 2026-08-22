import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Boot from './components/Boot'
import Nav from './components/Nav'
import Contact from './components/Contact'
import Home from './pages/Home'
import ProjectsIndex from './pages/ProjectsIndex'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import ProjectDetail from './pages/ProjectDetail'

/**
 * Route changes go to the top; a hash goes to its anchor. Without this,
 * navigating from a case study back to /#projects lands mid-page.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Boot />
      <Nav />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsIndex />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Contact />
    </>
  )
}
