import { useState } from 'react'
import { posts, linkedinProfile } from '../../data/linkedin'
import { useReveal } from '../../lib/useReveal'

/**
 * Recent LinkedIn posts, via LinkedIn's official embed.
 *
 * Not fetched — it cannot be. LinkedIn exposes no public API for a member's
 * posts, and the embed iframe is the only sanctioned way to surface them
 * elsewhere. Post URLs are added by hand in src/data/linkedin.js.
 *
 * One embed is mounted at a time rather than all of them. Each LinkedIn iframe
 * pulls its own copy of their embed bundle, so four of them on one page is four
 * third-party loads for content only one of which is being read. The list on
 * the left is the real navigation; the iframe is just the viewer.
 *
 * Renders nothing at all when the list is empty, so there is never an empty
 * shell waiting to be filled.
 */

const fmt = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export default function LinkedIn() {
  const [active, setActive] = useState(0)
  const ref = useReveal()

  if (!posts.length) return null
  const post = posts[active]

  return (
    <section id="linkedin" className="scroll-mt-24 py-20 md:py-24">
      <div className="shell">
        <div ref={ref} className="reveal">
          <p className="t-label mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-7 bg-accent2" />
            LinkedIn
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="t-h1 max-w-2xl text-ink">Posted recently.</h2>
            <a
              href={linkedinProfile}
              target="_blank"
              rel="noreferrer noopener"
              className="pill pill-ghost"
            >
              Follow on LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-12">
          {/* ── Index ── */}
          <ol className="border-t border-rule" role="tablist" aria-label="Choose a post">
            {posts.map((p, i) => {
              const on = i === active
              return (
                <li key={p.embed}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="linkedin-embed"
                    onClick={() => setActive(i)}
                    className="group w-full border-b border-rule py-5 text-left transition-colors hover:bg-bg2/60"
                  >
                    <div className="flex items-baseline gap-3">
                      <span
                        className="t-mono shrink-0"
                        style={{ color: on ? 'var(--c-accent2)' : 'var(--c-ink3)' }}
                      >
                        {fmt(p.date)}
                      </span>
                      {on && (
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: 'var(--c-accent2)' }}
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <h3
                      className="mt-1.5 font-display text-[15.5px] font-bold leading-snug transition-colors"
                      style={{ color: on ? 'var(--c-ink)' : 'var(--c-ink2)' }}
                    >
                      {p.title}
                    </h3>

                    {p.tags?.length > 0 && (
                      <p className="t-mono mt-2 text-ink3">
                        {p.tags.map((t) => `#${t}`).join('  ')}
                      </p>
                    )}
                  </button>
                </li>
              )
            })}
          </ol>

          {/* ── Viewer ──
              Full-bleed on phones: LinkedIn's embed wants at least ~350px and
              the shell's own inline padding takes a 375px screen below that. */}
          <div className="-mx-5 overflow-hidden border-y border-rule bg-bg2 sm:mx-0 sm:rounded-3xl sm:border">
            <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3">
              <p className="t-mono truncate text-ink3">linkedin.com</p>
              <a
                href={post.url}
                target="_blank"
                rel="noreferrer noopener"
                className="t-mono shrink-0 text-ink3 transition-colors hover:text-accent2"
              >
                Open on LinkedIn ↗
              </a>
            </div>

            {/* key forces a fresh iframe per post rather than mutating src. */}
            <iframe
              id="linkedin-embed"
              key={post.embed}
              src={post.embed}
              title={post.title}
              className="block w-full border-0"
              height="620"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
