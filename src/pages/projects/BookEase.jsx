import ProjectTheme from '../../components/ProjectTheme'
import { BrowserFrame } from '../../components/Device'
import { Band, Eyebrow, BackLink, Meta, NextProject, Retrospect } from '../../components/project/Scaffold'

/* Four weeks, from a brief someone else wrote to a URL someone else could open. */
const WEEKS = [
  { wk: '01', t: 'The brief', d: 'Build a working appointment booking system on the MERN stack. Deployed. Four weeks.' },
  { wk: '02', t: 'The stack', d: 'MongoDB, Express, React, Node — chosen for me, which was its own useful lesson.' },
  { wk: '03', t: 'The flow', d: 'Booking, scheduling and persistence, taken to actually working rather than demo-working.' },
  { wk: '04', t: 'The URL', d: 'Deployed to Vercel. The difference between "it runs" and "someone else can open it".' },
]

export default function BookEase() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="bookease" />

      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[56vh]"
          style={{ background: 'radial-gradient(38% 34% at 68% 22%, color-mix(in oklab, var(--c-accent) 18%, transparent), transparent 70%)' }}
        />
        <div className="shell relative">
          <BackLink />
          <Meta category="Web App">2025 · Bharat Interns · four-week internship</Meta>

          <h1 className="t-hero mt-7 text-ink" aria-label="The first real URL">
            The first
            <br />
            <span className="text-accent">real URL.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            A MERN appointment booking system, built during a four-week internship at Bharat Interns.
            Technically the simplest thing in this portfolio, and the first one I shipped to a live
            address under a deadline somebody else set.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            That is why it is still here.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="https://bookease-client.vercel.app/" target="_blank" rel="noreferrer noopener" className="pill pill-solid">
              bookease-client.vercel.app <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="mt-14">
            <BrowserFrame src="/bookease.png" alt="BookEase booking flow" label="bookease-client.vercel.app" />
          </div>
        </div>
      </header>

      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Four weeks</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Brief to deployed.</h2>
        <ol className="mt-10 divide-y divide-rule border-y border-rule">
          {WEEKS.map((w) => (
            <li key={w.wk} className="grid gap-x-8 gap-y-2 py-5 sm:grid-cols-[70px_180px_1fr]">
              <span className="t-mono pt-1 text-accent">{w.wk}</span>
              <h3 className="t-h3 text-ink">{w.t}</h3>
              <p className="text-[14.5px] leading-relaxed text-ink2">{w.d}</p>
            </li>
          ))}
        </ol>
      </Band>

      <Retrospect heading="Deployed is a different thing from finished.">
        <p className="text-[1.0625rem] leading-[1.72] text-ink2">
          Everything that only ever ran on localhost had let me quietly avoid a whole category of
          problems — environment variables, build output, CORS, a database that is not on my
          machine. None of that is hard. It is just invisible until the first time you have to do it
          for real, with a date attached.
        </p>
        <p className="text-[1.0625rem] leading-[1.72] text-ink">
          Every project after this one started from the assumption that it would have to be
          deployed, which changed how they were built from day one.
        </p>
      </Retrospect>

      <NextProject
        to="/projects/nexsus-universe"
        title="Nexsus"
        blurb="Ten fragmented campus tools, replaced by one backend with many faces."
      />
    </article>
  )
}
