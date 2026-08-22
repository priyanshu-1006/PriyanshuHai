import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { profile } from '../data/profile'
import { ThemeToggle } from '../lib/theme'

const LINKS = [
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Writing' },
  { href: '#experience', label: 'Experience' },
  { href: '#record', label: 'Record' },
  { href: '#contact', label: 'Contact' },
]

function Icon({ path, size = 15 }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

const GITHUB =
  'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z'
const LINKEDIN =
  'M3.6 5.6H.9V15h2.7V5.6ZM2.25 1A1.6 1.6 0 1 0 2.25 4.2 1.6 1.6 0 0 0 2.25 1ZM15.1 9.6c0-2.6-1.4-3.8-3.24-3.8-1.5 0-2.16.82-2.53 1.4V5.6H6.63c.04.77 0 9.4 0 9.4h2.7V9.75c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V15h2.7l.01-5.4Z'

export default function Nav() {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 32,
  )
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const href = (h) => (onHome ? h : `/${h}`)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-5">
      <div className="shell">
        <nav
          className={`flex items-center justify-between gap-3 rounded-full border px-2.5 py-2 transition-all duration-500 ${
            scrolled || open
              ? 'border-rule bg-bg2/85 shadow-lg backdrop-blur-xl'
              : 'border-transparent bg-transparent'
          }`}
          style={{ transitionTimingFunction: 'var(--ease)' }}
        >
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="group flex shrink-0 items-center gap-2.5 pl-1.5"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-mono text-[11px] font-semibold text-onaccent">
              {profile.initials}
            </span>
            {/* Wordmark as a call site. The accent lands on the argument, which
                is the part that is actually his name. */}
            <span
              className="hidden font-mono text-[13px] tracking-tight text-ink3 sm:block"
              aria-label={profile.name}
            >
              <span className="text-ink2">model</span>
              <span className="text-ink3">.</span>
              <span className="text-ink2 transition-colors group-hover:text-accent">load</span>
              <span className="text-ink3">(&quot;</span>
              <span className="font-semibold text-ink">{profile.name.split(' ')[0]}</span>
              <span className="text-ink3">&quot;)</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) =>
              l.to ? (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-bg3 hover:text-ink ${
                      pathname.startsWith(l.to) ? 'text-ink' : 'text-ink2'
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ) : (
                <li key={l.href}>
                  <a
                    href={href(l.href)}
                    className="rounded-full px-4 py-2 text-sm font-medium text-ink2 transition-colors hover:bg-bg3 hover:text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ),
            )}
          </ul>

          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="hidden h-9 w-9 place-items-center rounded-full border border-rule text-ink2 transition-colors hover:border-accent hover:text-accent sm:grid"
            >
              <Icon path={GITHUB} />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="hidden h-9 w-9 place-items-center rounded-full border border-rule text-ink2 transition-colors hover:border-accent hover:text-accent sm:grid"
            >
              <Icon path={LINKEDIN} />
            </a>
            <ThemeToggle />

            <a href={href('#contact')} className="pill pill-solid ml-1 hidden !py-2 !text-sm lg:inline-flex">
              Let&apos;s talk
              <span aria-hidden="true">↗</span>
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-9 w-9 place-items-center rounded-full border border-rule text-ink2 transition-colors hover:border-accent hover:text-accent md:hidden"
            >
              <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                {open ? <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /> : <path d="M2 5h12M2 11h12" />}
              </svg>
            </button>
          </div>
        </nav>

        {open && (
          <div className="mt-2 overflow-hidden rounded-3xl border border-rule bg-bg2/95 p-2 shadow-xl backdrop-blur-xl md:hidden">
            {LINKS.map((l) =>
              l.to ? (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-ink2 transition-colors hover:bg-bg3 hover:text-ink"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={href(l.href)}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-ink2 transition-colors hover:bg-bg3 hover:text-ink"
                >
                  {l.label}
                </a>
              ),
            )}
          </div>
        )}
      </div>
    </header>
  )
}
