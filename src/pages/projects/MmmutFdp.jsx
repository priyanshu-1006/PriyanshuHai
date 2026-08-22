import ProjectTheme from '../../components/ProjectTheme'
import BrandMark from '../../components/BrandMark'
import { BrowserFrame } from '../../components/Device'
import { Band, Eyebrow, BackLink, NextProject } from '../../components/project/Scaffold'

export default function MmmutFdp() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="mmmut-fdp" />

      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[56vh]"
          style={{ background: 'radial-gradient(38% 34% at 68% 22%, color-mix(in oklab, var(--c-accent) 16%, transparent), transparent 70%)' }}
        />
        <div className="shell relative">
          <BackLink />

          <div className="mt-8 flex items-center gap-4">
            <BrandMark brand="mmmut" size={52} />
            <div>
              <p className="t-mono text-ink3">Madan Mohan Malaviya University of Technology</p>
              <p className="t-mono text-ink3">2025 · Contributor</p>
            </div>
          </div>

          <h1 className="t-hero mt-8 text-ink" aria-label="Someone else's stack">
            Someone else&apos;s
            <br />
            <span className="text-accent">stack.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            The university needed pages for its Faculty Development Programme on the official
            mmmut.ac.in domain. Small in scope — and a completely different kind of constraint from
            anything self-hosted.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            You inherit the stack you are given, you match conventions that predate you, and you
            pass a review process that has nothing to do with code quality. No framework choice, no
            build pipeline, no opinions.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="https://mmmut.ac.in/primeai" target="_blank" rel="noreferrer noopener" className="pill pill-solid">
              mmmut.ac.in/primeai <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="mt-14">
            <BrowserFrame src="/FDP-primeai.png" alt="PrimeAI FDP pages on mmmut.ac.in" label="mmmut.ac.in/primeai" />
          </div>
        </div>
      </header>

      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Why it's here</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Fitting in is its own skill.</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <p className="text-[1.0625rem] leading-[1.72] text-ink2">
            Almost everything else in this portfolio is something I architected from nothing, where
            every decision was mine. This was the opposite: build pages that look like they were
            always part of the site, using what the site already uses, without leaving a signature.
          </p>
          <p className="text-[1.0625rem] leading-[1.72] text-ink">
            That is a real constraint and worth having practised. Most professional work is joining
            a codebase, not starting one — and the instinct to impose a new design on an
            institutional site is one worth learning to suppress early.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-3">
          {[
            ['mmmut.ac.in', 'Live on the official university domain'],
            ['FDP', 'Faculty Development Programme pages'],
            ['Inherited', 'Existing stack and conventions'],
          ].map(([v, l]) => (
            <div key={l} className="bg-bg2 p-5">
              <div className="font-display text-xl font-bold tracking-tight text-accent">{v}</div>
              <p className="mt-2 text-[13.5px] leading-snug text-ink2">{l}</p>
            </div>
          ))}
        </div>
      </Band>

      <NextProject
        to="/projects/bookease"
        title="BookEase"
        blurb="The first thing I ever shipped to a real URL under someone else's deadline."
      />
    </article>
  )
}
