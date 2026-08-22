import { profile } from '../data/profile'
import { useReveal } from '../lib/useReveal'

export default function Contact() {
  const ref = useReveal()
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="relative scroll-mt-24 overflow-hidden pt-20 md:pt-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh]"
        style={{
          background:
            'radial-gradient(55% 60% at 50% 100%, color-mix(in oklab, var(--c-accent) 20%, transparent), transparent 70%)',
        }}
      />

      <div className="shell relative">
        <div ref={ref} className="reveal text-center">
          <p className="t-label mb-5 flex items-center justify-center gap-3">
            <span className="inline-block h-px w-7 bg-accent" />
            Contact
          </p>

          <h2 className="t-h1 mx-auto max-w-3xl text-ink">
            Building something that has to actually hold up?
          </h2>

          <p className="t-lead mx-auto mt-5 max-w-xl">
            {profile.availability}. Email is fastest — I answer.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href={`mailto:${profile.email}`} className="pill pill-solid !px-6 !py-3.5">
              {profile.email}
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={profile.resumeUrl}
              className="pill pill-ghost !px-6 !py-3.5"
              target="_blank"
              rel="noreferrer noopener"
            >
              Résumé
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full border border-rule px-4 py-2 text-sm text-ink2 transition-colors hover:border-accent hover:text-accent"
            >
              GitHub ↗
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full border border-rule px-4 py-2 text-sm text-ink2 transition-colors hover:border-accent hover:text-accent"
            >
              LinkedIn ↗
            </a>
            <span className="rounded-full border border-rule px-4 py-2 text-sm text-ink3">
              {profile.location}
            </span>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-rule py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-mono text-ink3">
            © {year} {profile.name}
          </p>
          <p className="t-mono text-ink3">Built with React, Vite and Tailwind.</p>
        </div>
      </div>
    </footer>
  )
}
