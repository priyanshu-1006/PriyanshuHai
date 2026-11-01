import { useState } from 'react'
import CaseStudy, { StudySection } from '../../components/project/CaseStudy'

const FLOW = [
  [
    'Monitor',
    'Watch official university pages and download new attachments. Recheck recent bytes to detect revised documents.',
  ],
  [
    'Extract',
    'Use native PDF text when available, with OCR for scanned notices. Keep page evidence for proposed dates.',
  ],
  [
    'Draft',
    'Groq returns a structured draft. Dates without a matching source quotation are discarded.',
  ],
  [
    'Review',
    'A team member compares the original and draft, edits the post and approves it. Nothing is public yet.',
  ],
  [
    'Publish',
    'An admin publishes. The hub, subscriber emails and Nexsus outbox receive the reviewed version.',
  ],
]
export default function MmmutNotice() {
  const [stage, setStage] = useState(0)
  return (
    <CaseStudy slug="mmmut-notice">
      <StudySection title="Automation up to the human decision.">
        <div className="notice-pipeline" role="group" aria-label="Notice publishing stages">
          {FLOW.map(([name], i) => (
            <button key={name} type="button" aria-pressed={stage === i} onClick={() => setStage(i)}>
              <span>0{i + 1}</span>
              {name}
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
        <div className="notice-explanation" aria-live="polite">
          <span className="case-number">0{stage + 1}</span>
          <div>
            <h3>{FLOW[stage][0]}</h3>
            <p>{FLOW[stage][1]}</p>
          </div>
        </div>
        <p className="notice-withdrawal">
          ↩ If an official attachment changes, withdraw the old public copy and return to review.
        </p>
      </StudySection>
    </CaseStudy>
  )
}
