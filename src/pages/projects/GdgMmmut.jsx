import ProjectTheme from '../../components/ProjectTheme'
import BrandMark from '../../components/BrandMark'
import { BrowserFrame } from '../../components/Device'
import { Band, Eyebrow, BackLink, NextProject, Retrospect } from '../../components/project/Scaffold'

/* The manual version of this process is a spreadsheet and someone's evening. */
const STAGES = [
  { stage: 'Registration', manual: 'Google Form → a spreadsheet nobody owns', built: 'Structured intake tied to a student record', mail: 'Confirmation, immediately' },
  { stage: 'Screening', manual: 'Sort the sheet by hand, argue in a group chat', built: 'Reviewer queue with scoped access', mail: 'Silence — deliberately' },
  { stage: 'Evaluation', manual: 'Scores in a second sheet, merged badly', built: 'Structured scoring against the record', mail: 'Shortlist or regret, automatically' },
  { stage: 'Result', manual: '250 emails, sent by one exhausted person', built: 'Stage-triggered mail, no manual sends', mail: 'Outcome + next steps' },
]

export default function GdgMmmut() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="gdg-mmmut" />

      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[58vh]"
          style={{
            background:
              'radial-gradient(38% 34% at 70% 22%, color-mix(in oklab, var(--c-accent) 16%, transparent), transparent 70%),' +
              'radial-gradient(30% 30% at 20% 14%, color-mix(in oklab, var(--c-accent3) 12%, transparent), transparent 70%)',
          }}
        />
        <div className="shell relative">
          <BackLink />

          <div className="mt-8 flex items-center gap-4">
            <BrandMark brand="gdg" size={56} />
            <div>
              <p className="t-mono text-ink3">Google Developer Groups on Campus, MMMUT</p>
              <p className="t-mono text-ink3">Organiser &amp; Campus Lead · September 2026 — Present</p>
              <p className="t-mono mt-1 text-ink3">Previously Executive Member · July 2025 — August 2026</p>
            </div>
          </div>

          <h1 className="t-hero mt-8 text-ink" aria-label="Two hundred and fifty people, one evening">
            250 applicants,
            <br />
            <span className="text-accent">one evening.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            That is what an induction drive costs when it runs on a Google Form. A spreadsheet, a
            manual shortlist, and one person individually emailing two hundred and fifty people —
            who until that moment have heard nothing for weeks.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            It does not scale past the first round, and the silence is the part applicants remember.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="https://gdg.mmmut.app" target="_blank" rel="noreferrer noopener" className="pill pill-solid">
              gdg.mmmut.app <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="mt-14">
            <BrowserFrame src="/GDG-home.png" alt="GDG on Campus MMMUT" label="gdg.mmmut.app" />
          </div>
        </div>
      </header>

      {/* ── The pipeline ── */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>The drive</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Four stages, and mail at every one.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          The system is not complicated. What it does is remove the point where a human has to
          remember to tell somebody what happened.
        </p>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-rule bg-bg">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="border-b border-rule">
                <th className="t-label p-4 font-normal">Stage</th>
                <th className="t-label p-4 font-normal">On a form</th>
                <th className="t-label p-4 font-normal">What I built</th>
                <th className="t-label p-4 font-normal">Applicant hears</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {STAGES.map((s) => (
                <tr key={s.stage}>
                  <td className="p-4 text-[14.5px] font-medium text-ink">{s.stage}</td>
                  <td className="p-4 text-[13.5px] text-ink3 line-through decoration-accent3/50">{s.manual}</td>
                  <td className="p-4 text-[13.5px] text-ink2">{s.built}</td>
                  <td className="p-4 font-mono text-[12.5px] text-accent2">{s.mail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-3">
          {[
            ['250+', 'Students registered through the drive'],
            ['4', 'Stages, each with automated mail'],
            ['3', 'Roles — applicant, reviewer, core team'],
          ].map(([v, l]) => (
            <div key={l} className="bg-bg2 p-5">
              <div className="font-display text-2xl font-bold tracking-tight text-accent">{v}</div>
              <p className="mt-2 text-[13.5px] leading-snug text-ink2">{l}</p>
            </div>
          ))}
        </div>
      </Band>

      <Retrospect heading="The mail was the feature.">
        <p className="text-[1.0625rem] leading-[1.72] text-ink2">
          Everything else here is ordinary CRUD. The part that changed the experience was that
          nobody had to remember to send anything — an applicant who was rejected in round one found
          out in round one, rather than inferring it from weeks of nothing.
        </p>
        <p className="text-[1.0625rem] leading-[1.72] text-ink">
          Role separation mattered for the same reason: reviewers saw applications, core team saw
          the pipeline, applicants saw their own status. Nobody had to be trusted with a spreadsheet
          containing everyone.
        </p>
      </Retrospect>

      <NextProject
        to="/projects/mmmut-fdp"
        title="MMMUT Faculty Development Programme"
        blurb="My code on the university's official domain."
      />
    </article>
  )
}
