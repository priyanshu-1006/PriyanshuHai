function Paragraphs({ text }) {
  return String(text)
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph, index) => <p key={index}>{paragraph}</p>)
}

// The desktop preview shares the evidence already used by the full case studies.
export default function ProjectStory({ project: p }) {
  const features =
    p.features?.map(([title, text]) => ({ title, text })) ||
    p.howItWorks?.map((item) => ({ title: item.step, text: item.detail })) ||
    []
  const screenshots = (p.gallery || [])
    .filter((item) => item.src !== p.cover)
    .slice(0, 4)
  return (
    <div className="os-reader-story">
      {p.problem && (
        <section>
          <p className="os-eyebrow">01 / The problem</p>
          <h3>Why this needed to exist.</h3>
          <Paragraphs text={p.problem} />
        </section>
      )}
      {p.approach && (
        <section>
          <p className="os-eyebrow">02 / My approach</p>
          <h3>The decisions behind the product.</h3>
          <Paragraphs text={p.approach} />
        </section>
      )}
      {features.length > 0 && (
        <section>
          <p className="os-eyebrow">Inside the system</p>
          <h3>How it works.</h3>
          <ol className="os-reader-feature-list">
            {features.map((feature, index) => (
              <li key={feature.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{feature.title}</h4>
                  <p>{feature.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
      {p.challenges?.length > 0 && (
        <section>
          <p className="os-eyebrow">Engineering tradeoffs</p>
          <h3>What made it difficult.</h3>
          {p.challenges.map((item, index) => (
            <div className="os-reader-challenge" key={index}>
              <p>
                <strong>The challenge.</strong> {item.challenge}
              </p>
              <p>
                <strong>The decision.</strong> {item.solution}
              </p>
            </div>
          ))}
        </section>
      )}
      {(p.architectureImage || p.architecture) && (
        <details className="os-reader-architecture">
          <summary>
            Explore the system architecture <span>↓</span>
          </summary>
          {p.architectureImage ? (
            <img
              src={p.architectureImage}
              alt={`${p.title} system architecture`}
              loading="lazy"
            />
          ) : Array.isArray(p.architecture) ? (
            <ol>
              {p.architecture.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          ) : (
            <pre>{p.architecture}</pre>
          )}
        </details>
      )}
      {screenshots.length > 0 && (
        <section>
          <p className="os-eyebrow">Product captures</p>
          <h3>A closer look.</h3>
          <div className="os-reader-gallery">
            {screenshots.map((item) => (
              <figure key={item.src}>
                <img
                  src={item.src}
                  alt={item.caption || `${p.title} product screen`}
                  loading="lazy"
                />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      {p.boundary && (
        <section className="os-reader-boundary">
          <h3>Current status</h3>
          <p>{p.boundary}</p>
        </section>
      )}
    </div>
  )
}
