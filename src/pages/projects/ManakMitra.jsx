import CaseStudy, { StudySection } from '../../components/project/CaseStudy'

export default function ManakMitra() {
  return (
    <CaseStudy slug="manakmitra">
      <StudySection title="Two kinds of intelligence. One evidence trail.">
        <div className="evidence-split">
          <div>
            <p className="t-label">Deterministic engines</p>
            <h3>Decide from the records.</h3>
            <ul>
              <li>Resolve standards and exact sections</li>
              <li>Check QCO scope and effective dates</li>
              <li>Identify certification schemes</li>
              <li>Rank recognised laboratory scopes</li>
            </ul>
            <span className="evidence-stamp">Source-linked decision</span>
          </div>
          <div>
            <p className="t-label">Language model</p>
            <h3>Explain what was found.</h3>
            <ul>
              <li>Understand the product description</li>
              <li>Route the question to the right engine</li>
              <li>Synthesise the retrieved evidence</li>
              <li>Return citations or abstain</li>
            </ul>
            <span className="evidence-stamp">No official source → no guess</span>
          </div>
        </div>
        <p className="mt-5 text-sm text-ink2">
          The key architectural boundary: the language model explains certification; the QCO engine
          determines it.
        </p>
      </StudySection>
    </CaseStudy>
  )
}
