import { useState } from 'react'
import ProjectTheme from '../../components/ProjectTheme'
import { BrowserFrame } from '../../components/Device'
import { Gallery } from '../../components/Media'
import { Band, Eyebrow, BackLink, Meta, Stats, NextProject, Retrospect } from '../../components/project/Scaffold'
import { getProject } from '../../data/projects'

const project = getProject('anand-pumps')

const FAMILIES = [
  { code: 'ASP', name: 'Self-priming', use: 'Domestic supply, overhead tanks', hp: '0.5 – 2 HP' },
  { code: 'ADM', name: 'Centrifugal', use: 'Agriculture, irrigation lines', hp: '1 – 5 HP' },
  { code: 'SUB', name: 'Submersible', use: 'Borewells, deep extraction', hp: '0.5 – 5 HP' },
  { code: 'SHW', name: 'Shallow well', use: 'Low-lift domestic', hp: '0.033 – 1 HP' },
]

/* Two buyers, two conversions. Forcing the wholesale buyer through a retail
   cart is the quiet way to lose the largest orders. */
const PATHS = {
  retail: {
    who: 'Retail buyer',
    knows: 'Needs one pump, today, at the listed price.',
    steps: ['Browse by application', 'Product detail + HP rating', 'Add to cart', 'Checkout', 'Order history in account'],
    cta: 'Add to cart',
  },
  wholesale: {
    who: 'Wholesale / trade buyer',
    knows: 'Needs forty units, price is negotiated, not listed.',
    steps: ['Browse by application', 'Select family and rating', 'Request a quote', 'Direct contact from the company', 'Negotiated pricing'],
    cta: 'Get Quote',
  },
}

export default function AnandPumps() {
  const [path, setPath] = useState('wholesale')
  const p = PATHS[path]

  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="anand-pumps" />

      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[62vh]"
          style={{ background: 'radial-gradient(42% 38% at 68% 24%, color-mix(in oklab, var(--c-accent) 18%, transparent), transparent 70%)' }}
        />
        <div className="shell relative">
          <BackLink />
          <Meta category="E-commerce">2026 · Client build</Meta>

          <h1 className="t-hero mt-7 text-ink" aria-label="Two buyers, one catalogue">
            Two buyers,
            <br />
            <span className="text-accent">one catalogue.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            Kumars Anand manufactures water pumps — submersible, self-priming, centrifugal and
            shallow-well, from 0.033 HP to 5 HP — and sells to two completely different customers
            through the same storefront.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            A homeowner replacing one pump, and a dealer ordering forty. Same catalogue, entirely
            different transaction.
          </p>

          <div className="mt-14">
            <BrowserFrame src="/Anand-Pumps.png" alt="Anand Pumps storefront" label="anand pumps · storefront" />
          </div>
        </div>
      </header>

      {/* ── Dual conversion — signature ── */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>The decision</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Two conversion paths, deliberately.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          It would have been less work to ship one flow. It would also have quietly lost the largest
          orders — because the buyers who most need a quote are exactly the ones a checkout button
          turns away.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {Object.entries(PATHS).map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => setPath(k)}
              aria-pressed={path === k}
              className={`rounded-xl border px-5 py-3 text-left transition-colors ${
                path === k ? 'border-accent bg-accent/10' : 'border-rule bg-bg hover:border-rule2'
              }`}
            >
              <span className={`block text-[14.5px] font-semibold ${path === k ? 'text-accent' : 'text-ink'}`}>
                {v.who}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-rule bg-bg p-6">
          <p className="text-[15.5px] leading-relaxed text-ink">{p.knows}</p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-5">
            {p.steps.map((s, i) => (
              <li key={s}>
                <span className={`block h-[3px] rounded-full ${i === p.steps.length - 1 ? 'bg-accent2' : 'bg-accent'}`} />
                <span className="t-mono mt-2 block text-ink3">{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-1 block text-[13.5px] leading-snug text-ink2">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 border-t border-rule pt-4 font-mono text-[12.5px] text-accent2">
            ends at: {p.cta}
          </p>
        </div>
      </Band>

      {/* ── Catalogue ── */}
      <Band>
        <Eyebrow>The catalogue</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Organised by application, not part number.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          A buyer arrives knowing their problem — a borewell, a field, an overhead tank — not a SKU.
          So the catalogue is grouped the way the decision is actually made.
        </p>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-rule bg-bg2">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-rule">
                <th className="t-label p-4 font-normal">Code</th>
                <th className="t-label p-4 font-normal">Family</th>
                <th className="t-label p-4 font-normal">Typical use</th>
                <th className="t-label p-4 font-normal">Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {FAMILIES.map((f) => (
                <tr key={f.code}>
                  <td className="p-4 font-mono text-[13px] text-accent">{f.code}</td>
                  <td className="p-4 text-[14.5px] font-medium text-ink">{f.name}</td>
                  <td className="p-4 text-[14px] text-ink2">{f.use}</td>
                  <td className="p-4 font-mono text-[13px] text-ink2">{f.hp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <Stats
            items={[
              ['4', 'Pump families in the catalogue'],
              ['0.033 – 5 HP', 'Range covered'],
              ['2', 'Conversion paths'],
              ['ISI', 'Certified — surfaced above the fold'],
            ]}
          />
        </div>
      </Band>

      <Retrospect heading="Trust signals belong above the fold.">
        <p className="text-[1.0625rem] leading-[1.72] text-ink2">
          In this category the purchase decision runs on credibility more than on copy. ISI
          certification, borewell servicing and a phone number that a person answers are not
          About-page material — they are the reason someone buys from a manufacturer instead of a
          marketplace.
        </p>
        <p className="text-[1.0625rem] leading-[1.72] text-ink">
          So they sit in the header and the hero, where a hesitant buyer actually looks.
        </p>
      </Retrospect>

      <Band className="border-t border-rule">
        <Eyebrow>Screens</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">The storefront.</h2>
        <div className="mt-10">
          <Gallery items={project.gallery} title="Anand Pumps" />
        </div>
      </Band>

      <NextProject
        to="/projects/pathfinder-ai"
        title="PathFinder AI"
        blurb="Career advice that becomes a roadmap you can tick off, not a paragraph you close."
      />
    </article>
  )
}
