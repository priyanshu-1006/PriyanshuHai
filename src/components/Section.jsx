import { useReveal } from '../lib/useReveal'

/**
 * Every section is a labelled block on the sheet: a monospace component
 * t-label, a hairline, then the content. The t-label is not decoration —
 * it is how the page names its own parts.
 */
export default function Section({ id, tag, title, lead, children, className = '' }) {
  const ref = useReveal()

  return (
    <section id={id} className={`scroll-mt-20 py-16 md:py-24 ${className}`}>
      <div className="shell">
        <div ref={ref} className="reveal">
          <div className="flex items-center gap-4">
            <span className="t-label whitespace-nowrap">[ {tag} ]</span>
            <span className="rule-h" />
          </div>

          {title && (
            <h2 className="mt-6 max-w-3xl font-display text-3xl font-black tracking-[-0.03em] text-ink sm:text-4xl md:text-[2.75rem]">
              {title}
            </h2>
          )}

          {lead && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink2 md:text-lg">
              {lead}
            </p>
          )}
        </div>

        <div className="mt-10 md:mt-12">{children}</div>
      </div>
    </section>
  )
}

/** Small reusable reveal wrapper for staggered children. */
export function Reveal({ children, delay = 0, className = '' }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
