import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectTheme from '../../components/ProjectTheme'
import { BrowserFrame } from '../../components/Device'
import { Gallery } from '../../components/Media'
import { useReveal } from '../../lib/useReveal'
import { getProject } from '../../data/projects'

const project = getProject('nexsus-assist')

/* Routing examples. The point of the demo is the split: the model picks a tool
   and its arguments, then hands off to deterministic Python that it never
   touches. Model output is a decision, never a file. */
const REQUESTS = [
  {
    said: 'Merge these two PDFs',
    file: 'report-a.pdf, report-b.pdf',
    intent: 'pdf.combine',
    tool: 'pdf_merge',
    args: '{ order: ["report-a.pdf", "report-b.pdf"] }',
    family: 'PDF',
    runtime: 'pypdf',
  },
  {
    said: 'Make this smaller, under 200kb',
    file: 'banner.png',
    intent: 'image.compress',
    tool: 'image_compress',
    args: '{ target_kb: 200, keep_format: true }',
    family: 'Image',
    runtime: 'Pillow',
  },
  {
    said: 'Get the text out of this scan',
    file: 'invoice.jpg',
    intent: 'image.ocr',
    tool: 'image_extract_text',
    args: '{ lang: "eng" }',
    family: 'Image',
    runtime: 'Tesseract',
  },
  {
    said: 'Turn this into a gif',
    file: 'clip.mp4',
    intent: 'media.convert',
    tool: 'video_to_gif',
    args: '{ fps: 12, width: 480 }',
    family: 'Media',
    runtime: 'ffmpeg',
  },
  {
    said: 'Is this JWT still valid?',
    file: '—',
    intent: 'dev.inspect',
    tool: 'jwt_decode',
    args: '{ verify_exp: true }',
    family: 'Dev',
    runtime: 'PyJWT',
  },
]

const FAMILIES = [
  { name: 'PDF', n: 10, items: 'Merge · Split · Compress · Extract text & images · Rotate · Watermark · Encrypt · Decrypt · Images to PDF' },
  { name: 'Image', n: 17, items: 'Convert · Resize · Crop · Rotate · Flip · Compress · Blur · Sharpen · Grayscale · Sepia · Invert · Edge detect · Emboss · Remove background · OCR · SVG to PNG · Watermark' },
  { name: 'Text', n: 8, items: 'Word count · Case convert · Find & replace · Strip whitespace · Summarise · Translate · Rewrite · Extract keywords' },
  { name: 'Media', n: 3, items: 'Video to audio · Video to GIF · Audio convert' },
  { name: 'Dev', n: 17, items: 'JSON format & minify · JSON ↔ YAML · Base64 · URL encode · Hash · UUID · QR · JWT decode · Regex tester · Cron parse · Colour convert · Lorem ipsum · Markdown to HTML' },
]

function Band({ children, className = '', id }) {
  const ref = useReveal()
  return (
    <section id={id} className={`scroll-mt-24 py-16 md:py-24 ${className}`}>
      <div ref={ref} className="reveal shell">{children}</div>
    </section>
  )
}

function Eyebrow({ children }) {
  return (
    <p className="t-label mb-4 flex items-center gap-3">
      <span className="inline-block h-px w-7 bg-accent" />
      {children}
    </p>
  )
}

/* ── Signature: the router ── */
function Router() {
  const [i, setI] = useState(0)
  const r = REQUESTS[i]

  return (
    <div className="mt-12">
      <p className="t-label mb-3">Try a request</p>
      <div className="flex flex-wrap gap-2">
        {REQUESTS.map((x, idx) => (
          <button
            key={x.tool}
            type="button"
            onClick={() => setI(idx)}
            aria-pressed={idx === i}
            className={`rounded-full border px-4 py-2 text-[13.5px] transition-colors ${
              idx === i
                ? 'border-accent bg-accent/12 text-accent'
                : 'border-rule bg-bg2 text-ink2 hover:border-rule2 hover:text-ink'
            }`}
          >
            &ldquo;{x.said}&rdquo;
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {/* 1 — what the user said */}
        <div className="rounded-2xl border border-rule bg-bg2 p-5">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-rule2 font-mono text-[11px] text-ink">1</span>
            <p className="t-label">Natural language</p>
          </div>
          <p className="mt-4 text-[15.5px] leading-relaxed text-ink">&ldquo;{r.said}&rdquo;</p>
          <p className="t-mono mt-3 text-ink3">attached: {r.file}</p>
        </div>

        {/* 2 — what the model decided */}
        <div className="rounded-2xl border border-accent/50 bg-accent/8 p-5">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-accent font-mono text-[11px] text-onaccent">2</span>
            <p className="t-label text-accent">Model decides</p>
          </div>
          <dl className="mt-4 space-y-2.5">
            {[['intent', r.intent], ['tool', r.tool], ['args', r.args]].map(([k, v]) => (
              <div key={k}>
                <dt className="t-mono text-ink3">{k}</dt>
                <dd className="font-mono text-[12.5px] break-words text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 border-t border-accent/25 pt-3 font-mono text-[11px] text-accent">
            output = a decision, not a file
          </p>
        </div>

        {/* 3 — what actually runs */}
        <div className="rounded-2xl border border-rule bg-bg2 p-5">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-accent2 font-mono text-[11px] text-onaccent">3</span>
            <p className="t-label">Deterministic run</p>
          </div>
          <p className="mt-4 font-mono text-[13px] text-ink">
            {r.tool}(<span className="text-ink3">file</span>, <span className="text-ink3">args</span>)
          </p>
          <dl className="mt-4 space-y-2.5">
            <div>
              <dt className="t-mono text-ink3">family</dt>
              <dd className="font-mono text-[12.5px] text-ink">{r.family}</dd>
            </div>
            <div>
              <dt className="t-mono text-ink3">runtime</dt>
              <dd className="font-mono text-[12.5px] text-ink">{r.runtime}</dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-rule pt-3 font-mono text-[11px] text-accent2">
            no model touches the bytes
          </p>
        </div>
      </div>
    </div>
  )
}

export default function NexsusAssist() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="nexsus-assist" />

      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[72vh]"
          style={{
            background:
              'radial-gradient(44% 40% at 70% 26%, color-mix(in oklab, var(--c-accent) 20%, transparent), transparent 70%),' +
              'radial-gradient(34% 34% at 18% 12%, color-mix(in oklab, var(--c-accent3) 12%, transparent), transparent 70%)',
          }}
        />
        <div className="shell relative">
          <Link to="/#projects" className="t-mono inline-flex items-center gap-2 text-ink3 transition-colors hover:text-accent">
            ← All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              AI Systems
            </span>
            <span className="t-mono text-ink3">2025 · Full stack</span>
          </div>

          <h1 className="t-hero mt-7 text-ink" aria-label="Fifty-five tools, no tool list">
            55 tools,
            <br />
            <span className="text-accent">no tool list.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            Everyone keeps a bookmark folder of single-purpose utility sites — one to merge PDFs,
            another to convert images, a third to format JSON. Each has a different interface, most
            are ad-choked, and you have to know which one you need before you can start looking.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            So invert it. Describe what you want, drop the file in, and the request routes itself.
          </p>

          <div className="mt-14">
            <BrowserFrame src="/Nexsus-assist-hero-dark.png" alt="Nexsus Assist" label="nexsus assist" />
          </div>
        </div>
      </header>

      {/* ══ ROUTER — signature ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>The split</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">The model chooses. It never executes.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          That division is the whole design. An LLM picks the tool and its arguments; from there it
          is ordinary deterministic Python, so results are reproducible and a bad completion can
          never corrupt a file.
        </p>
        <Router />
      </Band>

      {/* ══ WHY IT MATTERS ══ */}
      <Band>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Eyebrow>Why constrain it</Eyebrow>
            <h2 className="t-h1 text-ink">Loud failures beat silent ones.</h2>
          </div>
          <div>
            <p className="text-[1.0625rem] leading-[1.72] text-ink2">
              Early on I let the model generate parameters more freely, and it produced silently
              wrong crops and rotations — output that looked plausible, was not what anyone asked
              for, and gave no signal that anything had gone wrong. Nobody notices a photo cropped
              20px off.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-[1.72] text-ink">
              Constraining it to a fixed tool signature made failures loud instead of subtle. Either
              the model picks a valid tool with valid arguments, or it fails at the boundary where a
              user can see it and rephrase.
            </p>
          </div>
        </div>
      </Band>

      {/* ══ THE 55 ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>The catalogue</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Five families, fifty-five tools.</h2>
        <ul className="mt-10 divide-y divide-rule border-y border-rule">
          {FAMILIES.map((f) => (
            <li key={f.name} className="grid gap-x-8 gap-y-2 py-5 sm:grid-cols-[130px_1fr]">
              <div className="flex items-baseline gap-3">
                <h3 className="t-h3 text-ink">{f.name}</h3>
                <span className="font-mono text-[12px] text-accent">{f.n}</span>
              </div>
              <p className="text-[14px] leading-relaxed text-ink2">{f.items}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* ══ SURFACE ══ */}
      <Band>
        <Eyebrow>Built for repeat use</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">A power-user surface, not a landing page.</h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Keyboard first', 'Ctrl+K to search tools, Ctrl+Shift+U to upload, Ctrl+Enter to run, Ctrl+1–6 to jump between families.'],
            ['History & favourites', 'Recent executions and pinned tools, because utility use is repetitive by nature.'],
            ['Portable preferences', 'Export and import your settings rather than losing them with the browser profile.'],
            ['Guarded uploads', '60 requests/minute, 25 MB cap and file-signature validation — extension checks alone are not a check.'],
          ].map(([t, d]) => (
            <li key={t} className="rounded-2xl border border-rule bg-bg2 p-5">
              <h3 className="t-h3 text-ink">{t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink2">{d}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* ══ SCREENS ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Screens</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">What it looks like.</h2>
        <div className="mt-10">
          <Gallery items={project.gallery} title="Nexsus Assist" />
        </div>
      </Band>

      {/* ══ NEXT ══ */}
      <div className="shell pb-10 pt-16">
        <Link to="/projects/haazir" className="group block rounded-2xl border border-rule bg-bg2 p-7 transition-colors hover:border-accent/50">
          <span className="t-label">Next project</span>
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="t-h2 text-ink transition-colors group-hover:text-accent">Haazir</span>
            <span className="shrink-0 text-xl text-ink3 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </div>
          <p className="mt-2 max-w-xl text-[15px] text-ink2">
            Attendance that survives contact with students — three gates and a CSP solver.
          </p>
        </Link>
      </div>
    </article>
  )
}
