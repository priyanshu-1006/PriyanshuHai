import { techGroups, marqueeIcons, iconUrl } from '../../data/techStack'
import { useReveal } from '../../lib/useReveal'

/** Monogram fallback so a tool with no SVG still sits correctly in the grid. */
function Monogram({ name }) {
  return (
    <span className="grid h-full w-full place-items-center rounded-lg bg-accent/12 font-display text-[13px] font-bold text-accent">
      {name.slice(0, 2)}
    </span>
  )
}

function TechChip({ item }) {
  const url = iconUrl(item.icon)
  return (
    <li
      className="group flex items-center gap-2.5 rounded-xl border border-rule bg-bg2 px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-rule2 hover:shadow-lg"
      style={{ transitionTimingFunction: 'var(--ease)' }}
    >
      <span className="h-6 w-6 shrink-0">
        {url ? (
          <img
            src={url}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <Monogram name={item.name} />
        )}
      </span>
      <span className="truncate text-[13.5px] font-medium text-ink2 transition-colors group-hover:text-ink">
        {item.name}
      </span>
    </li>
  )
}

/** Edge-to-edge ticker. Duplicated once so the -50% translate loops seamlessly. */
function Marquee() {
  const row = [...marqueeIcons, ...marqueeIcons]
  return (
    <div
      className="relative overflow-hidden py-6"
      style={{
        maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
      }}
      aria-hidden="true"
    >
      <div
        className="flex w-max items-center gap-12"
        style={{ animation: 'marquee-x 38s linear infinite' }}
      >
        {row.map((icon, i) => (
          <img
            key={`${icon}-${i}`}
            src={iconUrl(icon)}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-8 w-8 shrink-0 object-contain opacity-45 transition-opacity duration-300 hover:opacity-100"
          />
        ))}
      </div>
    </div>
  )
}

export default function TechStack() {
  const ref = useReveal()

  return (
    <section id="stack" className="scroll-mt-24 py-20 md:py-24">
      <div className="shell">
        <div ref={ref} className="reveal">
          <p className="t-label mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-7 bg-accent" />
            Stack
          </p>
          <h2 className="t-h1 max-w-2xl text-ink">
            What I reach <span className="t-accent text-accent">for</span>.
          </h2>
          <p className="t-lead mt-5 max-w-2xl">
            Grouped by layer, because that&apos;s how I think about a system before I think about a
            language.
          </p>
        </div>

        <Marquee />

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {techGroups.map((g) => (
            <StackGroup key={g.group} group={g} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StackGroup({ group }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="reveal">
      <h3 className="t-label mb-4 border-b border-rule pb-2.5">{group.group}</h3>
      <ul className="grid grid-cols-2 gap-2">
        {group.items.map((item) => (
          <TechChip key={item.name} item={item} />
        ))}
      </ul>
    </div>
  )
}
