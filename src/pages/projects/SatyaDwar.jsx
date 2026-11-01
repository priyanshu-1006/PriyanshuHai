import CaseStudy, { StudySection } from '../../components/project/CaseStudy'

export default function SatyaDwar() {
  return (
    <CaseStudy slug="satyadwar">
      <StudySection title="Every flag needs a reason.">
        <ol className="screening-checks">
          {[
            [
              '01',
              'Read the printed document',
              'Locate fields and extract text. A successful OCR read proves what the print says, not whether it is authentic.',
            ],
            [
              '02',
              'Check the independent evidence',
              'Verify the Aadhaar Secure QR signature when available; apply machine-readable and document-profile checks.',
            ],
            [
              '03',
              'Compare and explain',
              'Name conflicting fields and retain itemised evidence. Missing evidence remains inconclusive.',
            ],
            [
              '04',
              'Record the officer’s decision',
              'The officer reviews the result. The decision joins the audit trail and waits in the outbox when disconnected.',
            ],
          ].map(([n, title, text]) => (
            <li key={n}>
              <span>{n}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </StudySection>
    </CaseStudy>
  )
}
