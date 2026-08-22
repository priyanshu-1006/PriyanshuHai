import ProjectTheme from '../../components/ProjectTheme'
import BrandMark from '../../components/BrandMark'
import { Gallery } from '../../components/Media'
import { Band, Eyebrow, BackLink, Stats, NextProject, Retrospect } from '../../components/project/Scaffold'
import { getProject } from '../../data/projects'

const project = getProject('gryork-techpreneur')

const SYLLABUS = [
  { wk: 'Week 1', t: 'Agentic AI', d: 'What an agent actually is, where the loop lives, and why most "AI features" are not agents.' },
  { wk: 'Week 2', t: 'Full-stack foundations', d: 'The parts of a modern stack that matter, built rather than described.' },
  { wk: 'Week 3', t: 'Agentic coding', d: 'Working with coding agents as a collaborator — scoping, reviewing, and knowing when to stop trusting them.' },
  { wk: 'Week 4', t: 'AI tool workflows', d: 'Assembling tools into workflows that survive contact with a real task.' },
]

export default function TechPreneur() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="gryork-techpreneur" />

      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[58vh]"
          style={{ background: 'radial-gradient(40% 36% at 68% 24%, color-mix(in oklab, var(--c-accent) 18%, transparent), transparent 70%)' }}
        />
        <div className="shell relative">
          <BackLink />

          <div className="mt-8 flex items-center gap-4">
            <BrandMark brand="gryork" size={56} />
            <div>
              <p className="t-mono text-ink3">Gryork Techpreneur 2026</p>
              <p className="t-mono text-ink3">May 2026 · platform build &amp; instruction</p>
            </div>
          </div>

          <h1 className="t-hero mt-8 text-ink" aria-label="Eighty-five people who will ask why">
            85 people who
            <br />
            <span className="text-accent">will ask why.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            Third-year B.Tech students are told to learn agentic AI and modern full-stack
            development, and are then handed a reading list. There was no structured, paid programme
            locally that took them from nothing to shipping — and no platform to run one on.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            I built both halves. The registration and delivery platform at{' '}
            <a href="https://training.gryork.com" target="_blank" rel="noreferrer noopener" className="link-a">
              training.gryork.com
            </a>
            , and the four weeks of teaching that ran on it.
          </p>
        </div>
      </header>

      <Band>
        <Stats
          items={[
            ['85+', 'Third-year B.Tech students taught'],
            ['4 weeks', 'Programme duration'],
            ['₹1,200', 'Per registration'],
            ['Revenue', 'A real line, not a free workshop'],
          ]}
        />
      </Band>

      {/* ── Syllabus ── */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>What I taught</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Four weeks, built not described.</h2>
        <ul className="mt-10 divide-y divide-rule border-y border-rule">
          {SYLLABUS.map((s) => (
            <li key={s.wk} className="grid gap-x-8 gap-y-2 py-5 sm:grid-cols-[110px_220px_1fr]">
              <span className="t-mono pt-1 text-accent">{s.wk}</span>
              <h3 className="t-h3 text-ink">{s.t}</h3>
              <p className="text-[14.5px] leading-relaxed text-ink2">{s.d}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* ── The room ── */}
      <Band>
        <Eyebrow>The room</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Four weeks of sessions.</h2>
        <div className="mt-10">
          <Gallery items={project.gallery} title="Gryork Techpreneur 2026" />
        </div>
      </Band>

      <Retrospect heading="Teaching is the fastest debugger for your own understanding.">
        <p className="text-[1.0625rem] leading-[1.72] text-ink2">
          Explaining agentic coding workflows to eighty-five people who will immediately ask
          &ldquo;but why does it do that?&rdquo; forces a level of precision that building alone
          never did. Every hand-wave I had been getting away with privately got caught in public.
        </p>
        <p className="text-[1.0625rem] leading-[1.72] text-ink">
          Charging for it mattered too. A free workshop tolerates a vague week; a paid programme
          does not, and that constraint improved the material more than any amount of preparation
          would have.
        </p>
      </Retrospect>

      <NextProject
        to="/projects/gdg-mmmut"
        title="GDG on Campus — MMMUT"
        blurb="An induction system that processed 250+ applicants end to end."
      />
    </article>
  )
}
