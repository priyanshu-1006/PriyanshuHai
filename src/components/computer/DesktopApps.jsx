import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { profile } from '../../data/profile'
import { projects } from '../../data/projects'
import { publishedPosts } from '../../data/posts'
import DesktopIcon from './DesktopIcon'
import ProjectIcon from '../ProjectIcon'
import ConnectionsBrowser from './ConnectionsBrowser'
import RoomThemePicker from './RoomThemePicker'
import SystemInfo from './SystemInfo'
import ProjectStory from './ProjectStory'
import { useExperience } from '../../lib/experienceContext'

export const APPS = [
  {
    id: 'system',
    title: 'This PC',
    icon: 'computer',
    asset: '/computer/icons/this-pc.svg',
    subtitle: 'System information & my engineering toolkit',
  },
  {
    id: 'browser',
    title: 'Chrome',
    icon: 'browser',
    asset: '/svg/Chrome.svg',
    subtitle: 'Find me on the internet',
  },
  {
    id: 'welcome',
    title: 'Welcome',
    icon: 'person',
    asset: '/Me-light.png',
    subtitle: 'Start here',
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: 'folder',
    subtitle: `${projects.length} things built`,
  },
  {
    id: 'project:little-code',
    projectSlug: 'little-code',
    title: 'Little Code',
    icon: 'code',
    asset: '/computer/icons/little-code.png',
    subtitle: 'AI coding companion',
  },
  {
    id: 'project:little-terminal',
    projectSlug: 'little-terminal',
    title: 'Little Terminal',
    icon: 'terminal',
    subtitle: 'Native Rust terminal',
    asset: '/computer/icons/little-terminal.png',
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: 'terminal',
    asset: '/computer/icons/little-terminal.png',
    subtitle: 'Explore by command',
  },
  {
    id: 'experience',
    title: 'Experience',
    icon: 'case',
    subtitle: 'Building & leading',
  },
  ...['nexsus-universe', 'washtro', 'gryork', 'gdg-mmmut'].map((slug) => {
    const project = projects.find((p) => p.slug === slug)
    return {
      id: `project:${slug}`,
      projectSlug: slug,
      title: slug === 'gdg-mmmut' ? 'GDG on Campus' : project.title,
      icon: 'folder',
      subtitle: project.role,
    }
  }),
  {
    id: 'writing',
    title: 'Writing',
    icon: 'note',
    subtitle: 'Notes from the work',
  },
  {
    id: 'resume',
    title: 'Résumé',
    icon: 'document',
    subtitle: 'The one-page version',
  },
  { id: 'contact', title: 'Contact', icon: 'mail', subtitle: 'Say hello' },
  {
    id: 'settings',
    title: 'Appearance',
    icon: 'settings',
    subtitle: 'Make yourself at home',
  },
  {
    id: 'credits',
    title: 'About this computer',
    icon: 'info',
    asset: '/computer/os-logo.webp',
    subtitle: 'Made with care',
  },
]

export function getApp(id) {
  const known = APPS.find((app) => app.id === id)
  if (known) return known
  if (id.startsWith('project:')) {
    const p = projects.find((project) => project.slug === id.slice(8))
    if (p)
      return {
        id,
        projectSlug: p.slug,
        title: p.title,
        icon: 'folder',
        subtitle: p.category,
      }
  }
  return null
}

export default function DesktopApps({ id, onOpen, wallpaper, onWallpaper }) {
  if (id.startsWith('project:'))
    return <ProjectReader slug={id.slice(8)} onOpen={onOpen} />
  switch (id) {
    case 'system':
      return <SystemInfo onOpen={onOpen} />
    case 'browser':
      return <ConnectionsBrowser />
    case 'welcome':
      return <Welcome onOpen={onOpen} />
    case 'projects':
      return <ProjectExplorer onOpen={onOpen} />
    case 'terminal':
      return <Terminal onOpen={onOpen} />
    case 'experience':
      return <Experience />
    case 'writing':
      return <Writing />
    case 'resume':
      return <Resume />
    case 'contact':
      return <Contact />
    case 'settings':
      return <Appearance wallpaper={wallpaper} onWallpaper={onWallpaper} />
    case 'credits':
      return <Credits />
    default:
      return null
  }
}

function Welcome({ onOpen }) {
  return (
    <div className="os-welcome">
      <div className="os-welcome-photo">
        <img
          src="/Me-light.png"
          alt="Priyanshu illustrated at his desk"
          width="340"
          height="420"
        />
        <span>Gorakhpur, India · CSE ’28</span>
      </div>
      <div className="os-welcome-copy">
        <p className="os-eyebrow">A note from the person behind the screen</p>
        <h1>
          Hey, I’m
          <br />
          <em>Priyanshu.</em>
        </h1>
        <p>I build software, start things, and keep asking “what if?”</p>
        <p>
          I’m a third-year CSE student at MMMUT, CTO at Gryork and Washtro,
          Founder & President of Nexsus, and GDGoC Organiser & Campus Lead.
        </p>
        <p>
          This little computer is a way into my work. Open a folder, try the
          terminal, or just have a look around.
        </p>
        <div className="os-button-row">
          <button
            className="os-button os-button-primary"
            onClick={() => onOpen('projects')}
          >
            Explore my projects ↗
          </button>
          <button className="os-button" onClick={() => onOpen('resume')}>
            View résumé
          </button>
        </div>
        <span className="os-availability">
          <i />
          Open to internships & SDE roles
        </span>
      </div>
    </div>
  )
}

function ProjectExplorer({ onOpen }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const categories = ['All', ...new Set(projects.map((p) => p.category))]
  const filtered = projects.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      `${p.title} ${p.blurb} ${p.tech.join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  return (
    <div className="os-explorer">
      <div className="os-explorer-toolbar">
        <label>
          <span className="sr-only">Search projects</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, stack, ideas…"
            type="search"
          />
        </label>
        <label>
          <span className="sr-only">Project category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="os-explorer-meta">
        <span>C:\Priyanshu\Projects</span>
        <Link to="/projects">Open full showcase ↗</Link>
        <span>{filtered.length} items</span>
      </div>
      <div className="os-project-grid">
        {filtered.map((p) => (
          <button
            key={p.slug}
            className="os-project-card"
            onClick={() => onOpen(`project:${p.slug}`)}
          >
            <div>
              {p.cover ? (
                <img src={p.cover} alt="" loading="lazy" />
              ) : (
                <DesktopIcon kind="folder" />
              )}
            </div>
            <span className="os-project-card-name">
              <ProjectIcon slug={p.slug} />
              <strong>{p.title}</strong>
            </span>
            <span>
              {p.category} · {p.year}
            </span>
            <span className="os-project-card-description">{p.blurb}</span>
            <span className="os-project-card-status">
              {p.status} <span>Explore project ↗</span>
            </span>
          </button>
        ))}
      </div>
      {!filtered.length && (
        <div className="os-empty">
          No projects match that search. Try another name or technology.
        </div>
      )}
    </div>
  )
}

function ProjectReader({ slug, onOpen }) {
  const p = projects.find((project) => project.slug === slug)
  if (!p) return <p className="os-app-padding">Project not found.</p>
  return (
    <div className="os-project-reader">
      <div className="os-reader-cover">
        {p.cover && <img src={p.cover} alt={`${p.title} interface`} />}
      </div>
      <div className="os-reader-copy">
        <p className="os-eyebrow">
          {p.category} / {p.status}
        </p>
        <div className="os-reader-project-title">
          <ProjectIcon slug={p.slug} />
          <h2>{p.title}</h2>
        </div>
        <p className="os-reader-intro">{p.intro || p.blurb}</p>
        <dl className="os-reader-facts">
          <div>
            <dt>My role</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>{p.year}</dd>
          </div>
        </dl>
        <div className="os-tag-list">
          {p.tech.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        {p.results?.length > 0 && (
          <div className="os-reader-results">
            {p.results.slice(0, 3).map((r) => (
              <div key={r.label}>
                <strong>{r.metric}</strong>
                <span>{r.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className="os-button-row">
          <Link
            className="os-button os-button-primary"
            to={`/projects/${p.slug}`}
          >
            Read the full case study ↗
          </Link>
          {p.links?.live && (
            <a
              className="os-button"
              href={p.links.live}
              target="_blank"
              rel="noreferrer noopener"
            >
              Visit website ↗
            </a>
          )}
          {p.links?.github && (
            <a
              className="os-button"
              href={p.links.github}
              target="_blank"
              rel="noreferrer noopener"
            >
              View source ↗
            </a>
          )}
          <button className="os-text-button" onClick={() => onOpen('projects')}>
            All projects
          </button>
        </div>
        <ProjectStory project={p} />
      </div>
    </div>
  )
}

function ExperienceLogo({ org }) {
  const slug = org.includes('Nexsus')
    ? 'nexsus-universe'
    : org.includes('Washtro')
      ? 'washtro'
      : org.includes('Gryork')
        ? 'gryork'
        : org.includes('Google')
          ? 'gdg-mmmut'
          : org.includes('MMMUT')
            ? 'mmmut-fdp'
            : null
  return slug ? <ProjectIcon slug={slug} /> : <DesktopIcon kind="case" />
}

function Experience() {
  return (
    <div className="os-app-padding">
      <p className="os-eyebrow">The places I build & the people I build with</p>
      <h2 className="os-app-title">Work, with responsibility.</h2>
      <div className="os-experience-list">
        {profile.experience.map((job) => (
          <details key={job.org} open={job.org.includes('Google')}>
            <summary>
              <ExperienceLogo org={job.org} />
              <span>
                <strong>{job.role}</strong>
                <span>{job.org}</span>
              </span>
              <small>{job.period}</small>
            </summary>
            <ul>
              {job.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            {job.link && (
              <a href={job.link} target="_blank" rel="noreferrer noopener">
                Visit organisation ↗
              </a>
            )}
          </details>
        ))}
      </div>
    </div>
  )
}

function Writing() {
  return (
    <div className="os-app-padding">
      <p className="os-eyebrow">Notes from building things</p>
      <h2 className="os-app-title">A few things I’ve learned.</h2>
      <div className="os-writing-list">
        {publishedPosts.map((post) => (
          <Link to={`/blog/${post.slug}`} key={post.slug}>
            <span>
              {post.date} · {post.minutes} min read
            </span>
            <h3>{post.title}</h3>
            <p>{post.dek}</p>
            <span className="os-writing-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function Resume() {
  return (
    <div className="os-resume">
      <div className="os-document-toolbar">
        <span>Priyanshu-Chaurasia-Resume.pdf</span>
        <a
          className="os-button"
          href={profile.resumeUrl}
          download="Priyanshu-Chaurasia-Resume.pdf"
        >
          Download PDF ↓
        </a>
        <a href={profile.resumeUrl} target="_blank" rel="noreferrer noopener">
          Open ↗
        </a>
      </div>
      <object
        data={profile.resumeUrl}
        type="application/pdf"
        title="Priyanshu Chaurasia resume"
      >
        <p>
          Your browser can open the{' '}
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer noopener">
            resume PDF here
          </a>
          .
        </p>
      </object>
    </div>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopyError(true)
    }
  }
  return (
    <div className="os-contact os-app-padding">
      <DesktopIcon kind="mail" />
      <p className="os-eyebrow">
        Good things usually start with a conversation
      </p>
      <h2>
        Got something
        <br />
        <em>in mind?</em>
      </h2>
      <p>
        Open to internships, SDE roles, collaborations, and interesting
        problems.
      </p>
      <a className="os-email" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <div className="os-button-row">
        <a
          className="os-button os-button-primary"
          href={`mailto:${profile.email}`}
        >
          Write an email ↗
        </a>
        <button className="os-button" onClick={copy}>
          {copied ? 'Copied ✓' : 'Copy address'}
        </button>
      </div>
      <p role="status" className="os-copy-status">
        {copyError
          ? 'Copy is unavailable here. You can select the address above.'
          : copied
            ? 'Email address copied to clipboard.'
            : ''}
      </p>
      <div className="os-socials">
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub ↗
        </a>
        <a
          href={profile.socials.linkedin}
          target="_blank"
          rel="noreferrer noopener"
        >
          LinkedIn ↗
        </a>
        <span>Gorakhpur · Varanasi, India</span>
      </div>
    </div>
  )
}

function Appearance({ wallpaper, onWallpaper }) {
  const { setSettingsPanel } = useExperience()
  return (
    <div className="os-app-padding">
      <p className="os-eyebrow">Your desktop, your mood</p>
      <h2 className="os-app-title">Make yourself at home.</h2>
      <RoomThemePicker />
      <div className="os-wallpaper-options">
        {[
          ['forest', 'After hours', 'A quiet, green workspace.'],
          ['blue', 'Blue hour', 'A little more midnight.'],
          ['sand', 'Sunday morning', 'Warm paper and daylight.'],
          ['bliss', 'Classic desktop', 'Your supplied Windows XP wallpaper.'],
          [
            'personal',
            'Builder’s evening',
            'A personal riverfront workspace, inspired by Varanasi.',
          ],
        ].map(([id, title, description]) => (
          <button
            key={id}
            aria-pressed={wallpaper === id}
            onClick={() => onWallpaper(id)}
          >
            <span className={`os-wallpaper-sample wallpaper-${id}`} />
            <strong>{title}</strong>
            <small>{description}</small>
            {wallpaper === id && (
              <span className="os-wallpaper-selected">Selected ✓</span>
            )}
          </button>
        ))}
      </div>
      <p className="os-settings-note">
        Your wallpaper choice stays in this browser. Sound, contrast, text size
        and motion are available in the comfort controls.
      </p>
      <button
        className="os-button"
        onClick={() => setSettingsPanel('accessibility')}
      >
        Display & accessibility ↗
      </button>
    </div>
  )
}

function Credits() {
  return (
    <div className="os-app-padding os-credits">
      <img
        className="os-credits-logo"
        src="/computer/os-logo.webp"
        alt="Priyanshu OS orbital glass logo"
      />
      <p className="os-eyebrow">Priyanshu OS / edition 26.11</p>
      <h2 className="os-app-title">
        A personal computer.
        <br />
        In every sense.
      </h2>
      <p>
        Designed and built as a home for Priyanshu Chaurasia’s projects, writing
        and work. The desktop is a custom web interface; its terminal explores
        this portfolio.
      </p>
      <dl>
        <div>
          <dt>Computer model</dt>
          <dd>
            <a
              href="https://sketchfab.com/3d-models/retro-computer-setup-free-82eaf2047e0447a1bfea22482f1d1404"
              target="_blank"
              rel="noreferrer noopener"
            >
              Retro Computer Setup (FREE) ↗
            </a>
            <span>
              Brandon Westlake · supplied GLB · Sketchfab Standard License
            </span>
          </dd>
        </div>
        <div>
          <dt>Experience reference</dt>
          <dd>
            <a
              href="https://henryheffernan.com/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Henry Heffernan’s computer portfolio ↗
            </a>
            <span>
              Concept inspiration. This desktop and implementation are custom.
            </span>
          </dd>
        </div>
        <div>
          <dt>Built with</dt>
          <dd>React · Three.js · a lot of curiosity</dd>
        </div>
      </dl>
    </div>
  )
}

const TERMINAL_HELP = [
  ['about', 'A quick introduction'],
  ['projects', 'Explore the project directory'],
  ['open <name>', 'Open an application or project'],
  ['experience', 'Where I build and lead'],
  ['skills', 'The technologies I work with'],
  ['contact', 'Email and public profiles'],
  ['whoami', 'The person at this keyboard'],
  ['date', 'Current date and time in India'],
  ['dir / ls', 'Applications on this desktop'],
  ['cls / clear', 'Clear this terminal'],
]

function TerminalOutput({ entry, onOpen }) {
  if (entry.format === 'help')
    return (
      <>
        <p className="os-terminal-section-title">Command reference</p>
        <dl className="os-terminal-help">
          {TERMINAL_HELP.map(([command, description]) => (
            <div key={command}>
              <dt>{command}</dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
        <p className="os-terminal-tip">
          Try <code>open nexsus-universe</code> or <code>open little-code</code>
          .
        </p>
      </>
    )
  if (entry.format === 'projects')
    return (
      <>
        <p className="os-terminal-section-title">
          Project directory / {projects.length} entries
        </p>
        <div className="os-terminal-projects">
          {projects.map((p) => (
            <button key={p.slug} onClick={() => onOpen(`project:${p.slug}`)}>
              <ProjectIcon slug={p.slug} />
              <code>{p.slug}</code>
              <span>{p.title}</span>
            </button>
          ))}
        </div>
        <p className="os-terminal-tip">
          Select a project or use <code>open &lt;slug&gt;</code>.
        </p>
      </>
    )
  if (entry.format === 'skills')
    return (
      <dl className="os-terminal-skills">
        {profile.skills.map((group) => (
          <div key={group.group}>
            <dt>{group.group}</dt>
            <dd>
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    )
  if (entry.format === 'contact')
    return (
      <dl className="os-terminal-contact">
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </dd>
        </div>
        <div>
          <dt>GitHub</dt>
          <dd>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer noopener"
            >
              github.com/priyanshu-1006 ↗
            </a>
          </dd>
        </div>
        <div>
          <dt>LinkedIn</dt>
          <dd>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer noopener"
            >
              Priyanshu Chaurasia ↗
            </a>
          </dd>
        </div>
      </dl>
    )
  return <pre>{entry.output}</pre>
}

function Terminal({ onOpen }) {
  const [history, setHistory] = useState([
    {
      output:
        'Priyanshu OS [Version 26.11]\nPortfolio Command Interpreter\n\nType HELP for the command reference.\n',
    },
  ])
  const [command, setCommand] = useState('')
  const [past, setPast] = useState([])
  const [pastIndex, setPastIndex] = useState(-1)
  const end = useRef(null)
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' })
  }, [history])
  const submit = (event) => {
    event.preventDefault()
    const raw = command.trim()
    if (!raw) return
    const [name, ...args] = raw.toLowerCase().split(/\s+/)
    let output = ''
    let format = 'text'
    if (name === 'clear' || name === 'cls') {
      setHistory([])
      setCommand('')
      return
    }
    if (name === 'help') format = 'help'
    else if (name === 'whoami')
      output =
        'Priyanshu Chaurasia\nFull-stack engineer · CSE, MMMUT (2024–2028)\nCTO × 2 · Founder & President, Nexsus · GDGoC Organiser & Campus Lead'
    else if (name === 'about') {
      output = 'Opening a note from Priyanshu…'
      onOpen('welcome')
    } else if (name === 'projects') format = 'projects'
    else if (name === 'experience') {
      output = 'Opening Experience…'
      onOpen('experience')
    } else if (name === 'skills') format = 'skills'
    else if (name === 'contact') {
      format = 'contact'
    } else if (name === 'date')
      output =
        new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'full',
          timeStyle: 'short',
        }) + ' IST'
    else if (name === 'ls' || name === 'dir')
      output =
        ' Directory of C:\\Priyanshu\\Desktop\n\n' +
        APPS.map((a) => ` <APP>  ${a.id.padEnd(26)} ${a.title}`).join('\n') +
        `\n\n ${APPS.length} application(s)`
    else if (name === 'open') {
      const target = args.join(' ')
      const aliases = {
        about: 'welcome',
        email: 'contact',
        'little-code': 'project:little-code',
        'little-terminal': 'project:little-terminal',
      }
      const project = projects.find(
        (p) => p.slug === target || p.title.toLowerCase() === target,
      )
      const appId =
        aliases[target] || (project ? `project:${project.slug}` : target)
      if (getApp(appId)) {
        onOpen(appId)
        output = `Opening ${getApp(appId).title}…`
      } else
        output = `No application or project named “${target}”. Type ls or projects to see the directory.`
    } else
      output = `Command not found: ${name}. Type help for portfolio commands.`
    setHistory((h) => [
      ...h.slice(-79),
      { command: raw.slice(0, 300), output, format },
    ])
    setPast((p) => [...p.slice(-39), raw])
    setPastIndex(-1)
    setCommand('')
  }
  const keyDown = (event) => {
    if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    const next =
      event.key === 'ArrowUp'
        ? Math.min(pastIndex + 1, past.length - 1)
        : Math.max(pastIndex - 1, -1)
    setPastIndex(next)
    setCommand(next < 0 ? '' : past[past.length - 1 - next] || '')
  }
  return (
    <div className="os-terminal">
      <div className="os-terminal-history" aria-live="polite">
        {history.map((entry, i) => (
          <div key={i}>
            {entry.command && (
              <p>
                <span>C:\Priyanshu&gt;</span> {entry.command}
              </p>
            )}
            <TerminalOutput entry={entry} onOpen={onOpen} />
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={submit}>
        <label htmlFor="portfolio-command">C:\Priyanshu&gt;</label>
        <input
          id="portfolio-command"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={keyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          maxLength={300}
          placeholder="help"
        />
      </form>
    </div>
  )
}
