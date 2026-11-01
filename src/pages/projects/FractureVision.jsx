import ProjectNext from '../../components/project/ProjectNext'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectTheme from '../../components/ProjectTheme'
import { BrowserFrame } from '../../components/Device'
import { Gallery, VideoEmbed } from '../../components/Media'
import { useReveal } from '../../lib/useReveal'
import { getProject } from '../../data/projects'

const project = getProject('fracturevision-ai')

const MODELS = [
  {
    id: 'vit',
    name: 'ViT-Base/16',
    task: 'Binary screening',
    verdict: 'Is there a fracture at all?',
    best: false,
    headline: '99.01%',
    headlineLabel: 'Accuracy on 506 unseen scans',
    metrics: [
      ['Precision', '99.05%'], ['Recall', '98.97%'], ['F1', '99.01%'],
      ['AUC-ROC', '0.9990'], ['Inference', '~45 ms'], ['Parameters', '85.8M'],
    ],
    detail:
      'ImageNet-21k pretrained, Focal Loss with label smoothing, AdamW with layer-wise learning-rate decay and cosine annealing, Mixup and CutMix, AMP FP16. Five errors in 506 images and an AUC-ROC of 0.9990 — near-perfect class separation.',
    config: 'timm · 22 epochs · RTX 4050 · ~35 min',
  },
  {
    id: 'yolo',
    name: 'YOLOv10n',
    task: '10-class detection',
    verdict: 'Which kind, and where?',
    best: true,
    headline: '0.933',
    headlineLabel: 'mAP@0.5 across ten fracture classes',
    metrics: [
      ['Precision', '0.969'], ['Recall', '0.900'], ['F1', '0.933'],
      ['Macro F1', '0.926'], ['Inference', '18.8 ms'], ['Size', '5.51 MB'],
    ],
    detail:
      'The best performer, and the smallest: 2.27M parameters in 5.51 MB, deployable to an edge device. Trained recall-focused over a full 200-epoch schedule on a Kaggle T4 at batch size 6, on roughly 1,300 images covering ten classes.',
    config: 'ultralytics · 200 epochs · Kaggle T4 · ~2.5 h',
  },
  {
    id: 'coordatt',
    name: 'YOLOv10n + CoordAtt',
    task: 'Direction-aware detection',
    verdict: 'Does spatial attention help?',
    best: false,
    lost: true,
    headline: '0.928',
    headlineLabel: 'mAP@0.5 — below the plain detector',
    metrics: [
      ['Precision', '0.934'], ['Recall', '0.846'], ['F1', '0.888'],
      ['Macro F1', '0.873'], ['Added params', '+57,984'], ['GFLOPs', '6.6'],
    ],
    detail:
      'Coordinate Attention injected at backbone P3/P4/P5 through a gated residual with the gate initialised to zero, so at epoch zero it is byte-identical to the baseline. Architecturally the most interesting model here. It lost.',
    config: 'gated fine-tune · 80 epochs · Tesla P100 · ~1 h',
  },
]

/* Instance count does not predict performance — that is the finding. */
const CLASSES = [
  { name: 'Transverse Displaced', n: 65, map: 0.919, f1: 0.888 },
  { name: 'Oblique Displaced', n: 30, map: 0.963, f1: 0.947 },
  { name: 'Comminuted', n: 15, map: 0.838, f1: 0.872 },
  { name: 'Transverse', n: 14, map: 0.995, f1: 0.965 },
  { name: 'Greenstick', n: 10, map: 0.637, f1: 0.724 },
  { name: 'Healthy', n: 7, map: 0.995, f1: 0.979 },
  { name: 'Oblique', n: 7, map: 0.995, f1: 0.978 },
  { name: 'Spiral', n: 5, map: 0.995, f1: 0.967 },
  { name: 'Segmental', n: 3, map: 0.995, f1: 0.970 },
  { name: 'Linear', n: 1, map: 0.995, f1: 0.971 },
]

const DELTA = [
  ['mAP@0.5', '0.933', '0.928'],
  ['mAP@0.5:0.95', '0.521', '0.499'],
  ['Precision', '0.969', '0.934'],
  ['Recall', '0.900', '0.846'],
  ['F1', '0.933', '0.888'],
  ['Macro F1', '0.926', '0.873'],
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

/* ── Model switcher ── */
function ModelBoard() {
  const [id, setId] = useState('yolo')
  const m = MODELS.find((x) => x.id === id)

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-2">
        {MODELS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setId(x.id)}
            aria-pressed={x.id === id}
            className={`rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
              x.id === id ? 'border-accent bg-accent/10' : 'border-rule bg-bg2 hover:border-rule2'
            }`}
            style={{ transitionTimingFunction: 'var(--ease)' }}
          >
            <span className="block font-display text-[14.5px] font-semibold text-ink">
              {x.name}
            </span>
            <span className="mt-0.5 block font-mono text-[10.5px] text-ink3">{x.task}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-bg2">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-rule p-6">
          <div>
            <p className="t-mono text-ink3">{m.verdict}</p>
            <p className="mt-3 font-display text-5xl font-bold tracking-tight text-accent">
              {m.headline}
            </p>
            <p className="mt-2 text-sm text-ink2">{m.headlineLabel}</p>
          </div>
          {m.best && (
            <span className="rounded-full bg-accent3/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent3">
              ★ Best model
            </span>
          )}
          {m.lost && (
            <span className="rounded-full bg-accent2/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent2">
              Negative result
            </span>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-3 lg:grid-cols-6">
          {m.metrics.map(([k, v]) => (
            <div key={k} className="bg-bg2 p-4">
              <dt className="t-label mb-1.5">{k}</dt>
              <dd className="font-mono text-[15px] font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-rule p-6">
          <p className="max-w-3xl text-[15px] leading-relaxed text-ink2">{m.detail}</p>
          <p className="t-mono mt-4 text-ink3">{m.config}</p>
        </div>
      </div>
    </div>
  )
}

/* ── Class distribution: 65:1 imbalance vs actual performance ── */
function ClassChart() {
  const max = 65
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-rule bg-bg2">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule px-5 py-3">
        <span className="t-mono text-ink3">validation set · 128 images · 157 instances</span>
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 t-mono text-ink3">
            <span className="h-2 w-4 rounded-sm bg-rule2" /> instances
          </span>
          <span className="flex items-center gap-1.5 t-mono text-ink3">
            <span className="h-2 w-4 rounded-sm bg-accent" /> mAP@0.5
          </span>
        </span>
      </div>
      <ul className="divide-y divide-rule">
        {CLASSES.map((c) => (
          <li key={c.name} className="grid gap-x-5 gap-y-1.5 px-5 py-3 sm:grid-cols-[190px_1fr_58px] sm:items-center">
            <span className="text-[13.5px] text-ink">{c.name}</span>
            <span className="grid gap-1">
              <span className="flex items-center gap-2">
                <span className="h-1.5 rounded-full bg-rule2" style={{ width: `${(c.n / max) * 100}%`, minWidth: 4 }} />
                <span className="t-mono text-ink3">{c.n}</span>
              </span>
              <span
                className="h-1.5 rounded-full"
                style={{
                  width: `${c.map * 100}%`,
                  background: c.map < 0.7 ? 'var(--c-accent2)' : 'var(--c-accent)',
                }}
              />
            </span>
            <span
              className={`t-mono text-right tabular-nums ${
                c.map < 0.7 ? 'text-accent2' : 'text-ink'
              }`}
            >
              {c.map.toFixed(3)}
            </span>
          </li>
        ))}
      </ul>
      <p className="border-t border-rule p-5 text-[14.5px] leading-relaxed text-ink2">
        The finding is that instance count does <span className="text-ink">not</span> predict
        performance. Linear has a single validation instance and reaches 0.995. Greenstick has ten
        and is the worst class at 0.637 — because an incomplete fracture with cortical discontinuity
        on only one side is genuinely harder to see, not because there were fewer examples.
      </p>
    </div>
  )
}

export default function FractureVision() {
  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="fracturevision-ai" />

      {/* ══ HERO ══ */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[75vh]"
          style={{
            background:
              'radial-gradient(44% 40% at 68% 26%, color-mix(in oklab, var(--c-accent) 20%, transparent), transparent 70%),' +
              'radial-gradient(34% 34% at 18% 12%, color-mix(in oklab, var(--c-accent2) 12%, transparent), transparent 70%)',
          }}
        />
        <div className="shell relative">
          <Link
            to="/projects"
            className="t-mono inline-flex items-center gap-2 text-ink3 transition-colors hover:text-accent"
          >
            ← All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              AI / ML
            </span>
            <span className="t-mono text-ink3">2026 · ML engineering</span>
          </div>

          <h1 className="t-hero mt-7 text-ink" aria-label="Ninety-nine per cent is not the interesting number">
            99% isn&apos;t the
            <br />
            <span className="text-accent">interesting number.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            Roughly 3.5% of fractures are missed on the initial read in a busy emergency department.
            A model that reports &ldquo;fractured, 99% confident&rdquo; does not fix that — a
            radiologist cannot act on a number they have no way to interrogate.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            So this is three models with explainability attached to every one of them, and the most
            useful thing in the whole project is a case where the best model is{' '}
            <span className="font-semibold text-accent2">confidently wrong</span>.
          </p>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent3/40 bg-accent3/10 px-4 py-2 font-mono text-[12px] text-accent3">
            ★ 5th place &amp; Special Mention · Xpecto ’26, IIT Mandi
          </p>

          <div className="mt-14">
            <BrowserFrame
              src="/Fracture-Vision-AI.png"
              alt="FractureVision AI clinical dashboard"
              label="fracturevision · clinical dashboard"
            />
          </div>
        </div>
      </header>

      {/* ══ MODELS ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Three models</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Screening and typing are different questions.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          So they get different models. One answers whether a fracture exists at all; one answers
          which of ten kinds it is and where; the third tests whether direction-aware attention
          helps on oriented fracture lines.
        </p>
        <ModelBoard />
      </Band>

      {/* ══ THE FALSE NEGATIVE — signature ══ */}
      <Band>
        <Eyebrow>The case that matters</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">
          Confidently wrong, and you can see exactly why.
        </h2>
        <p className="t-lead mt-5 max-w-2xl">
          There is a known false negative in the test set. The model calls it{' '}
          <span className="text-ink">Not Fractured</span> at full confidence. Grad-CAM shows what
          convinced it.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
          <BrowserFrame
            src="/Fracture-Vision-AI-2.png"
            alt="FractureVision showing a false negative on scan 01.png with Grad-CAM overlay"
            label="01.png · known false negative"
          />

          <div>
            <dl className="space-y-4">
              {[
                ['Scan', '01.png — from the fractured test set'],
                ['Prediction', 'NOT FRACTURED'],
                ['Confidence', '100%'],
                ['Ground truth', 'Fractured — subtle hairline'],
              ].map(([k, v], i) => (
                <div key={k} className="border-b border-rule pb-3">
                  <dt className="t-label mb-1.5">{k}</dt>
                  <dd
                    className={`font-mono text-[15px] ${
                      i === 1 || i === 2 ? 'text-accent2' : 'text-ink'
                    }`}
                  >
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-7 text-[15.5px] leading-relaxed text-ink2">
              The heatmap sits on the smooth, unblemished curve of the main joint — the healthy
              geometry that persuaded the model nothing was wrong. The actual hairline fracture is
              just adjacent to it, and the model never looked there.
            </p>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink">
              A confidence score alone gives a clinician nothing to argue with. A heatmap showing
              the model fixated on the wrong region is immediately actionable: the doctor sees it
              looked in the wrong place and overrides it. That is the entire argument for
              assistance over autonomy, made visible in one image.
            </p>
          </div>
        </div>
      </Band>

      {/* ══ IMBALANCE ══ */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>The data</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">A 65-to-1 imbalance.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Sixty-five Transverse Displaced instances against a single Linear one. The usual reflex is
          aggressive resampling; instead the model trained recall-focused over a full schedule, and
          no class collapsed to zero.
        </p>
        <ClassChart />
      </Band>

      {/* ══ NEGATIVE RESULT ══ */}
      <Band>
        <Eyebrow>The result I kept</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">The novel model lost. Here is the table anyway.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Coordinate Attention was the architecturally interesting contribution — directional
          pooling that should help on oriented fracture lines. It trailed a plain YOLOv10n on every
          single primary metric.
        </p>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-rule bg-bg2">
          <table className="w-full min-w-[520px] text-left">
            <thead>
              <tr className="border-b border-rule">
                <th className="t-label p-4 font-normal">Metric</th>
                <th className="t-label p-4 font-normal">recall_focused</th>
                <th className="t-label p-4 font-normal">CoordAtt</th>
                <th className="t-label p-4 text-right font-normal">Δ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {DELTA.map(([k, a, b]) => {
                const d = (parseFloat(a) - parseFloat(b)).toFixed(3)
                return (
                  <tr key={k}>
                    <td className="p-4 text-[14.5px] text-ink2">{k}</td>
                    <td className="p-4 font-mono text-[14.5px] font-medium text-accent">{a}</td>
                    <td className="p-4 font-mono text-[14.5px] text-ink2">{b}</td>
                    <td className="p-4 text-right font-mono text-[13px] text-accent3">+{d}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-3xl text-[15.5px] leading-relaxed text-ink2">
          Re-initialised attention weights introduced a distribution shift the gated residual could
          soften but not eliminate. The simpler model won — with fewer parameters, no attention
          modules and a more robust training schedule. A portfolio of only successful experiments
          is not a record of research.
        </p>
      </Band>

      {/* ══ VIDEO ══ */}
      {project.videos?.length > 0 && (
        <Band className="border-y border-rule bg-bg2/40">
          <Eyebrow>Walkthrough</Eyebrow>
          <h2 className="t-h1 max-w-2xl text-ink">See it running.</h2>
          <div className="mt-10 max-w-3xl">
            {project.videos.map((v) => (
              <VideoEmbed key={v.id} id={v.id} label={v.label} />
            ))}
          </div>
        </Band>
      )}

      {/* ══ SCREENS ══ */}
      <Band>
        <Eyebrow>Screens</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">The clinical dashboard.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Drag-and-drop intake, batch analysis, per-class probabilities, and a Grad-CAM toggle on
          every result.
        </p>
        <div className="mt-10">
          <Gallery items={project.gallery} title="FractureVision AI" />
        </div>
      </Band>

      {/* ══ NEXT ══ */}
      <ProjectNext slug={project.slug} />
    </article>
  )
}
