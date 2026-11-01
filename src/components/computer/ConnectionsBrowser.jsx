import { useEffect, useRef, useState } from 'react'
import { profile } from '../../data/profile'
import { projects } from '../../data/projects'
import { useExperience } from '../../lib/experienceContext'
import SystemIcon from './SystemIcon'

const question = 'Where can I find out Priyanshu Chaurasia?'
const destinations = [
  {
    id: 'linkedin',
    icon: '/svg/LinkedIn.svg',
    name: 'LinkedIn',
    url: profile.socials.linkedin,
    title: 'Priyanshu Chaurasia — Software Engineer & Founder',
    description:
      'CTO at Gryork & Washtro · Founder of Nexsus · GDGoC Organiser & Campus Lead at MMMUT.',
  },
  {
    id: 'github',
    icon: '/svg/GitHub.svg',
    name: 'GitHub',
    url: profile.socials.github,
    title: 'priyanshu-1006 (Priyanshu Chaurasia) · GitHub',
    description:
      'Explore the code behind the ideas. Developer tools, campus platforms and full-stack experiments.',
  },
  {
    id: 'instagram',
    icon: '/svg/Instagram.svg',
    name: 'Instagram',
    url: 'https://www.instagram.com/_priyanshu.10_/',
    title: 'Priyanshu Chaurasia (@_priyanshu.10_) · Instagram',
    description:
      'A more personal corner. Connect with the person behind the projects.',
  },
]
function GoogleWordmark() {
  return (
    <img
      className="connection-google"
      src="/computer/google-wordmark.png"
      alt="Google"
      width="272"
      height="92"
    />
  )
}
export default function ConnectionsBrowser() {
  const { reducedMotion } = useExperience()
  const [page, setPage] = useState('home')
  const [query, setQuery] = useState('')
  const [typing, setTyping] = useState(false)
  const [history, setHistory] = useState([])
  const timer = useRef(null)
  const content = useRef(null)
  useEffect(() => {
    if (content.current) content.current.scrollTop = 0
  }, [page])
  useEffect(() => () => clearTimeout(timer.current), [])
  function navigate(next) {
    setHistory((items) => [...items, page])
    setPage(next)
  }
  function typeQuestion() {
    if (typing) return
    if (reducedMotion) {
      setQuery(question)
      return
    }
    setTyping(true)
    let position = 0
    const tick = () => {
      position += 1
      setQuery(question.slice(0, position))
      if (position < question.length) timer.current = setTimeout(tick, 45)
      else {
        setTyping(false)
      }
    }
    tick()
  }
  function search(event) {
    event.preventDefault()
    if (typing) return
    setQuery(question)
    navigate('results')
  }
  const selected = destinations.find((item) => item.id === page)
  return (
    <div className={`connections-browser connection-view-${page}`}>
      <div className="connection-tab">
        <img src={selected?.icon || '/svg/Google.svg'} alt="" />
        {selected ? selected.name : 'Google'}
        <span>Local portfolio browser</span>
      </div>
      <div className="connection-menubar" aria-hidden="true">
        File <span>Edit</span>
        <span>View</span>
        <span>History</span>
        <span>Bookmarks</span>
        <span>Tools</span>
        <span>Help</span>
      </div>
      <div className="connection-toolbar">
        <button
          aria-label="Back"
          disabled={!history.length || typing}
          onClick={() => {
            setPage(history.at(-1))
            setHistory((items) => items.slice(0, -1))
          }}
        >
          ←
        </button>
        <button
          aria-label="Google home"
          disabled={typing}
          onClick={() => {
            navigate('home')
            setQuery('')
          }}
        >
          <SystemIcon name="home" />
        </button>
        <span className="connection-address">
          <img src={selected?.icon || '/svg/Google.svg'} alt="" />
          {selected
            ? new URL(selected.url).host + new URL(selected.url).pathname
            : page === 'results'
              ? 'google.com/search?q=Priyanshu+Chaurasia'
              : 'google.com'}
        </span>
      </div>
      <div className="connection-page" ref={content} aria-busy={typing}>
        {!selected ? (
          <>
            <div
              className={`connection-search ${page === 'home' ? 'is-home' : ''}`}
            >
              <GoogleWordmark />
              <form onSubmit={search}>
                <div className="connection-searchbox">
                  <SystemIcon name="search" />
                  <input
                    aria-label="Search connections"
                    placeholder="Search for anything. Find a connection."
                    value={query}
                    readOnly={typing}
                    onChange={(event) => {
                      if (event.target.value.trim()) typeQuestion()
                      else setQuery('')
                    }}
                  />
                  <button aria-label="Search" disabled={typing}>
                    <SystemIcon name="arrow" />
                  </button>
                </div>
                {page === 'home' && (
                  <div className="connection-search-actions">
                    <button disabled={typing}>
                      {typing ? 'Typing your search…' : 'Search now'}
                    </button>
                    <button type="button" disabled={typing} onClick={search}>
                      I'm Feeling Connected
                    </button>
                  </div>
                )}
              </form>
              {page === 'home' && (
                <p className="connection-hint">
                  {typing
                    ? 'A little curiosity, one letter at a time.'
                    : 'Press Enter or choose Search now to explore.'}
                </p>
              )}
            </div>
            {page === 'results' && (
              <div className="connection-results">
                <nav>
                  All <span>Profiles</span>
                  <span>People</span>
                  <span>Projects</span>
                </nav>
                <p className="connection-result-meta">
                  Three connections, one person.
                </p>
                {destinations.map((item) => (
                  <article key={item.id}>
                    <div className={`connection-result-brand ${item.id}`}>
                      <img src={item.icon} alt="" width="28" height="28" />
                      <span>
                        {item.name}
                        <small>
                          {new URL(item.url).host} ›{' '}
                          {item.id === 'github'
                            ? 'priyanshu-1006'
                            : item.id === 'instagram'
                              ? '_priyanshu.10_'
                              : 'in › priyanshu-chaurasia'}
                        </small>
                      </span>
                    </div>
                    <button
                      className="connection-result-title"
                      onClick={() => navigate(item.id)}
                    >
                      {item.title}
                    </button>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className={`connection-profile ${selected.id}`}>
            <header>
              <strong>
                <img src={selected.icon} alt="" width="28" height="28" />
                {selected.name}
              </strong>
              <span>
                {selected.id === 'github'
                  ? 'Overview / Repositories'
                  : selected.id === 'linkedin'
                    ? 'Home · My Network · Messaging'
                    : 'Profile · Posts'}
              </span>
            </header>
            <div className="connection-profile-banner" />
            <section className="connection-profile-intro">
              <img src="/Me-light.png" alt="Priyanshu Chaurasia" />
              <div>
                <h2>
                  {selected.id === 'instagram'
                    ? '_priyanshu.10_'
                    : 'Priyanshu Chaurasia'}
                </h2>
                <p>
                  {selected.id === 'github'
                    ? 'priyanshu-1006 · Software engineer & builder'
                    : profile.role}
                </p>
                <small>MMMUT · Gorakhpur, India</small>
              </div>
              <a href={selected.url} target="_blank" rel="noopener noreferrer">
                Open real profile ↗
              </a>
            </section>
            {selected.id === 'linkedin' ? (
              <section className="connection-profile-card">
                <h3>About</h3>
                <p>
                  I build the systems institutions run on. From developer tools
                  to campus platforms and the architecture behind two companies.
                </p>
                <h3>Experience</h3>
                {profile.experience.slice(0, 4).map((job) => (
                  <div className="connection-job" key={job.org}>
                    <strong>{job.role}</strong>
                    <span>{job.org}</span>
                    <small>{job.period}</small>
                  </div>
                ))}
              </section>
            ) : selected.id === 'github' ? (
              <section className="connection-profile-card">
                <h3>Hi, I'm Priyanshu.</h3>
                <p>Code. Create. Contribute.</p>
                <h3>Selected work</h3>
                <div className="connection-repositories">
                  {projects.slice(0, 6).map((project) => (
                    <a key={project.slug} href={`/projects/${project.slug}`}>
                      <strong>{project.title} ↗</strong>
                      <p>{project.blurb}</p>
                      <small>{project.tech.slice(0, 3).join(' · ')}</small>
                    </a>
                  ))}
                </div>
              </section>
            ) : (
              <section className="connection-profile-card">
                <p>
                  Building things. Meeting people. Keeping the curiosity alive.
                </p>
                <div className="connection-photo-grid">
                  {[
                    '/Me-light.png',
                    ...projects
                      .filter((project) => project.cover)
                      .slice(0, 5)
                      .map((project) => project.cover),
                  ].map((src, i) => (
                    <figure key={src}>
                      <img
                        src={src}
                        alt={
                          i === 0
                            ? 'Priyanshu at his desk'
                            : 'Project from the portfolio'
                        }
                      />
                      <figcaption>
                        {i === 0 ? 'Behind the screen' : 'Things I build'}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <small>
                  Portfolio gallery · these are project images, not Instagram
                  posts.
                </small>
              </section>
            )}
          </div>
        )}
        <footer className="connection-disclosure">
          Interactive portfolio recreation · local previews · no sign-in or live
          search
        </footer>
      </div>
    </div>
  )
}
