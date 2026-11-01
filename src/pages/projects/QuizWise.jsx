import ProjectTheme from '../../components/ProjectTheme'
import { Band, Eyebrow, BackLink, Meta, NextProject, Retrospect } from '../../components/project/Scaffold'

/* The pipeline that replaced the form. */
const STAGES = [
  { n: '01', t: 'Ingest', d: 'A topic string, or a chapter uploaded as PDF — parsed and chunked into passages small enough to prompt against without losing the thread of the text.' },
  { n: '02', t: 'Generate', d: 'Each chunk drives a generation call: a question, three plausible distractors, one marked answer, constrained to a requested difficulty and count.' },
  { n: '03', t: 'Assemble', d: 'Results are de-duplicated and composed into a paper. Every question stays individually editable, reorderable and regenerable.' },
  { n: '04', t: 'Deliver', d: 'Google OAuth, so a teacher signs in with the account she already has. Students attempt; scoring and achievements close the loop.' },
]

const HARD = [
  { t: 'The form was the bug', d: 'The hardest part was admitting the first version was worthless. It worked, it looked fine, and it saved nobody a single minute. Deleting working code because the premise is wrong is a different skill from debugging it.' },
  { t: 'Models write bad distractors', d: 'Wrong options that are obviously wrong make a useless question. Getting distractors that are plausible — same category, same register, same length as the answer — took more prompt iteration than the rest of the pipeline combined.' },
  { t: 'PDFs are not text', d: 'Chapter scans, two-column layouts and diagrams sitting mid-paragraph all break naive extraction. Chunking had to be forgiving of the mess and still carry enough surrounding context for a question to make sense.' },
]

const OPTIONS = [
  { k: 'A', v: 'It converts light energy into chemical energy', right: true },
  { k: 'B', v: 'It converts chemical energy into light energy', right: false },
  { k: 'C', v: 'It converts heat energy into chemical energy', right: false },
  { k: 'D', v: 'It converts light energy into thermal energy', right: false },
]

/* The artifact this whole system exists to produce. Rendered, not screenshotted. */
function QuestionCard() {
  return (
    <div className="rounded-2xl border border-rule bg-bg2 p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-4 border-b border-rule pb-4">
        <span className="t-mono text-accent3">Q 07 / 20</span>
        <span className="t-mono text-ink3">Class VIII · Photosynthesis · Medium</span>
      </div>

      <p className="mt-6 text-[1.0625rem] leading-[1.6] text-ink">
        In the light-dependent reaction, what is the primary role of chlorophyll?
      </p>

      <ul className="mt-6 space-y-2.5">
        {OPTIONS.map((o) => (
          <li
            key={o.k}
            className="flex gap-3 rounded-xl border px-4 py-3 text-[15px] leading-snug"
            style={{
              borderColor: o.right ? 'var(--c-accent2)' : 'var(--c-rule)',
              background: o.right ? 'color-mix(in oklab, var(--c-accent2) 10%, transparent)' : 'transparent',
              color: o.right ? 'var(--c-ink)' : 'var(--c-ink2)',
            }}
          >
            <span
              className="t-mono shrink-0 pt-0.5"
              style={{ color: o.right ? 'var(--c-accent2)' : 'var(--c-ink3)' }}
            >
              {o.k}
            </span>
            <span>{o.v}</span>
            {o.right && (
              <svg
                viewBox="0 0 16 16"
                width="15"
                height="15"
                className="ml-auto shrink-0 self-center"
                fill="none"
                stroke="var(--c-accent2)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 8.5l3.2 3.2L13 4.8" />
              </svg>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-6 border-t border-rule pt-4 text-[13.5px] leading-relaxed text-ink3">
        Generated from the uploaded chapter. The teacher edits, reorders or regenerates any single
        question — she never faces a blank field.
      </p>
    </div>
  )
}

export default function QuizWise() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="quizwise-ai" />

      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[58vh]"
          style={{ background: 'radial-gradient(40% 36% at 30% 20%, color-mix(in oklab, var(--c-accent) 16%, transparent), transparent 70%)' }}
        />
        <div className="shell relative">
          <BackLink />
          <Meta category="AI Platform">2025 · Solo · built for my mother</Meta>

          <h1 className="t-hero mt-7 text-ink" aria-label="She was still typing">
            She was
            <br />
            <span className="text-accent">still typing.</span>
          </h1>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="t-lead">
                My mother is a school teacher. For as long as I can remember, her evenings went into
                drafting question papers by hand — every question, every option, every answer key,
                for every class, every term.
              </p>
              <p className="mt-6 text-[1.0625rem] leading-[1.72] text-ink">
                The work is skilled for the first twenty minutes and mechanical for the next four
                hours. I wanted to give those four hours back. That was the entire brief.
              </p>
              <p className="mt-6 text-[1.0625rem] leading-[1.72] text-ink2">
                QuizWise is not the most complex thing I have built. It is the most important, because
                it is where I stopped building screens and started building systems.
              </p>
            </div>

            <div className="lg:pt-2">
              <QuestionCard />
            </div>
          </div>
        </div>
      </header>

      {/* ── The turn ── */}
      <Band className="mt-4 border-y border-rule bg-bg2/40">
        <Eyebrow>The wall</Eyebrow>
        <h2 className="t-h1 max-w-3xl text-ink">
          I had not removed the four hours. I had moved them into a form.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-rule p-7">
            <p className="t-mono" style={{ color: 'var(--c-accent)' }}>Version one</p>
            <h3 className="t-h3 mt-3 text-ink">A quiz platform</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink2">
              Teacher logs in. Teacher creates a quiz. Students take it, scores come back. Everything
              a tutorial tells you to build, and it worked exactly as designed.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink">
              To create the quiz, she still typed in every question and every option by hand. I had
              built a digital version of precisely the same broken system.
            </p>
          </div>

          <div
            className="rounded-2xl border p-7"
            style={{ borderColor: 'var(--c-accent2)', background: 'color-mix(in oklab, var(--c-accent2) 7%, transparent)' }}
          >
            <p className="t-mono" style={{ color: 'var(--c-accent2)' }}>Version two</p>
            <h3 className="t-h3 mt-3 text-ink">A generation pipeline</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink2">
              The interface was never the product. The generation was. Give it a topic, or upload the
              chapter as a PDF, and the system produces the paper.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink">
              She edits rather than authors. The blank field — the thing that cost her the evening —
              is gone from the flow entirely.
            </p>
          </div>
        </div>
      </Band>

      {/* ── Pipeline ── */}
      <Band>
        <Eyebrow>How it works</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Topic or PDF in, paper out.</h2>
        <ol className="mt-10 divide-y divide-rule border-y border-rule">
          {STAGES.map((s) => (
            <li key={s.n} className="grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[70px_180px_1fr]">
              <span className="t-mono pt-1 text-accent">{s.n}</span>
              <h3 className="t-h3 text-ink">{s.t}</h3>
              <p className="text-[14.5px] leading-relaxed text-ink2">{s.d}</p>
            </li>
          ))}
        </ol>
      </Band>

      {/* ── Hard parts ── */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow tone="accent3">What was hard</Eyebrow>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {HARD.map((h) => (
            <div key={h.t} className="rounded-2xl border border-rule bg-bg p-6">
              <h3 className="t-h3 text-ink">{h.t}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink2">{h.d}</p>
            </div>
          ))}
        </div>
      </Band>

      <Retrospect heading="The question changed here.">
        <p className="text-[1.0625rem] leading-[1.72] text-ink2">
          I stopped asking <em>what screens does this need</em> and started asking{' '}
          <em>what work is the human still doing that the system should be doing.</em> That is a
          smaller sentence than it sounds like, and it reorganised everything after it.
        </p>
        <p className="text-[1.0625rem] leading-[1.72] text-ink">
          Every project since is the same question asked about a bigger problem. A teacher typing a
          question paper and a department head hand-drafting a timetable for forty-one courses are
          the same person, doing the same avoidable work.
        </p>
      </Retrospect>

      <NextProject slug="quizwise-ai" />
    </article>
  )
}
