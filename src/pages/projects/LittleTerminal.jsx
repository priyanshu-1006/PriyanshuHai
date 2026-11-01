import { useState } from 'react'
import CaseStudy, { StudySection } from '../../components/project/CaseStudy'

const VIEWS = [
  ['Sessions', 'native-tools-and-theme', 'Native tools, shell output and theme controls.'],
  [
    'Services',
    'workspace-services-ready',
    'A workspace dashboard for managed services and their state.',
  ],
  ['AI review', 'ai-request-review', 'Inspect the request before context leaves the terminal.'],
]
export default function LittleTerminal() {
  const [active, setActive] = useState(0)
  const view = VIEWS[active]
  return (
    <CaseStudy slug="little-terminal">
      <StudySection title="One workspace, several perspectives.">
        <div className="terminal-tour">
          <div className="terminal-tour-rail" role="group" aria-label="Terminal product views">
            {VIEWS.map(([name, , text], i) => (
              <button
                key={name}
                type="button"
                aria-pressed={active === i}
                onClick={() => setActive(i)}
              >
                <span className="t-label">0{i + 1}</span>
                <strong>{name}</strong>
                <small>{text}</small>
              </button>
            ))}
          </div>
          <figure aria-live="polite">
            <img
              src={`/projects/little-terminal/${view[1]}.webp`}
              alt={view[2]}
              width="1600"
              height="1000"
              loading="lazy"
            />
            <figcaption>{view[2]}</figcaption>
          </figure>
        </div>
      </StudySection>
    </CaseStudy>
  )
}
