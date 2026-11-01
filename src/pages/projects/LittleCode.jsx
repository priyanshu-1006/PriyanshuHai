import { useState } from 'react'
import CaseStudy, { StudySection } from '../../components/project/CaseStudy'

const MODES = [
  {
    name: 'Ask',
    permission: 'Read and explain',
    text: 'Inspect repository files, follow references and answer with source context. Repository mutations and command execution are outside this mode.',
    steps: ['Read fresh context', 'Inspect the repository', 'Explain with evidence'],
  },
  {
    name: 'Plan',
    permission: 'Read and propose',
    text: 'Turn a request into a visible plan, using repository evidence. The plan is an inspectable step before any proposed implementation.',
    steps: ['Understand the request', 'Inspect dependencies', 'Publish a plan'],
  },
  {
    name: 'Edit',
    permission: 'Propose, then review',
    text: 'Stage bounded changes and open native diffs. Files change only after acceptance; private checkpoints retain originals for restoration.',
    steps: ['Read current files', 'Review native diffs', 'Accept or reject'],
  },
  {
    name: 'Agent',
    permission: 'Supervised execution',
    text: 'A bounded inspect, plan, edit, check and repair loop. Edits require review, commands require a fresh approval, and Stop cancels the run.',
    steps: ['Inspect and plan', 'Review edits / commands', 'Check and report'],
  },
]

export default function LittleCode() {
  const [active, setActive] = useState(0)
  const mode = MODES[active]
  return (
    <CaseStudy slug="little-code">
      <StudySection title="Four modes. Deliberate permissions.">
        <div className="mode-selector" role="group" aria-label="Explore Little Code modes">
          {MODES.map((m, i) => (
            <button
              key={m.name}
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              <span>0{i + 1}</span>
              {m.name}
            </button>
          ))}
        </div>
        <div className="mode-detail" aria-live="polite">
          <div>
            <p className="t-label">{mode.permission}</p>
            <h3>{mode.name}</h3>
            <p>{mode.text}</p>
          </div>
          <ol>
            {mode.steps.map((s) => (
              <li key={s}>
                <span aria-hidden="true">↳</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </StudySection>
    </CaseStudy>
  )
}
