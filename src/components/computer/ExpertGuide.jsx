import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  guideAnswers,
  guideById,
  guideTopics,
  findGuideQuestions,
} from '../../data/assistantKnowledge'
import { useExperience } from '../../lib/experienceContext'
import SystemIcon from './SystemIcon'

function AnswerImage({ image }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  return (
    <figure
      className={`guide-image ${image.portrait ? 'guide-image-portrait' : ''} ${loaded ? 'is-revealed' : ''}`}
    >
      {!loaded && !failed && (
        <div className="guide-image-developing" aria-hidden="true">
          <div />
          <span>Revealing the project capture</span>
        </div>
      )}
      {!failed && (
        <img
          src={image.src}
          alt={image.alt}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true)
            setLoaded(true)
          }}
        />
      )}
      {failed && (
        <div className="guide-image-unavailable">
          The image couldn’t load. The full answer is below.
        </div>
      )}
      <figcaption>{image.caption}</figcaption>
    </figure>
  )
}

function SavedAnswer({ answer, onNavigate }) {
  const { launchApp } = useExperience()
  return (
    <article className="guide-answer">
      <div className="guide-answer-heading">
        <span>{answer.topic}</span>
        <h3>{answer.title}</h3>
      </div>
      <AnswerImage image={answer.image} />
      <div className="guide-answer-copy">
        {answer.paragraphs.map((text, index) => (
          <p key={text} style={{ '--answer-step': index }}>
            {text}
          </p>
        ))}
        {answer.bullets && (
          <ul>
            {answer.bullets.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        )}
        {answer.facts && (
          <dl>
            {answer.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="guide-answer-actions">
          {answer.actions.map((action) =>
            action.app ? (
              <button
                key={action.label}
                onClick={() => {
                  launchApp(action.app)
                  onNavigate()
                }}
              >
                {action.label}
                <SystemIcon name="arrow" />
              </button>
            ) : action.to ? (
              <Link key={action.label} to={action.to} onClick={onNavigate}>
                {action.label}
                <SystemIcon name="arrow" />
              </Link>
            ) : (
              <a
                key={action.label}
                href={action.href}
                target={action.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer noopener"
              >
                {action.label}
                <SystemIcon name="arrow" />
              </a>
            ),
          )}
        </div>
      </div>
    </article>
  )
}

export default function ExpertGuide() {
  const { guideOpen, setGuideOpen, reducedMotion, playSound } = useExperience()
  const [history, setHistory] = useState(['start'])
  const [pending, setPending] = useState(null)
  const [query, setQuery] = useState('')
  const timer = useRef(null)
  const scroller = useRef(null)
  const heading = useRef(null)
  const busy = pending !== null
  const latest = guideById[history[history.length - 1]]
  const matches = query.trim() ? findGuideQuestions(query).filter((a) => a.id !== 'start') : []
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (!guideOpen) return
    heading.current?.focus({ preventScroll: true })
  }, [guideOpen])
  useEffect(() => {
    if (!guideOpen || !scroller.current) return
    const container = scroller.current
    const last = [...container.querySelectorAll('.guide-exchange')].at(-1)
    const top =
      history.length === 1 && !pending
        ? 0
        : pending
          ? container.scrollHeight
          : last
            ? last.getBoundingClientRect().top -
              container.getBoundingClientRect().top +
              container.scrollTop -
              12
            : 0
    container.scrollTo({ top, behavior: reducedMotion ? 'instant' : 'smooth' })
  }, [history, pending, guideOpen, reducedMotion])
  const ask = (id) => {
    if (!guideById[id]) return
    clearTimeout(timer.current)
    setQuery('')
    setPending(id)
    playSound('open')
    timer.current = setTimeout(
      () => {
        setHistory((current) => [...current.slice(-11), id])
        setPending(null)
        playSound('notify')
      },
      reducedMotion ? 0 : 520,
    )
  }
  const reset = () => {
    clearTimeout(timer.current)
    setPending(null)
    setHistory(['start'])
    setQuery('')
  }
  if (!guideOpen) return null
  return (
    <aside
      className="portfolio-guide"
      role="dialog"
      aria-modal="false"
      aria-labelledby="guide-title"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation()
          setGuideOpen(false)
        }
      }}
    >
      <header className="guide-header">
        <img src="/computer/os-logo.webp" alt="" />
        <div>
          <p>PRIYANSHU OS / FIELD GUIDE</p>
          <h2 id="guide-title" ref={heading} tabIndex={-1}>
            A little direction.
          </h2>
          <span>
            <i />
            {guideAnswers.length} curated answers, connected.
          </span>
        </div>
        <div className="guide-header-controls">
          <button aria-label="Start a new guide conversation" title="Start over" onClick={reset}>
            <SystemIcon name="reset" />
          </button>
          <button aria-label="Close portfolio guide" onClick={() => setGuideOpen(false)}>
            <SystemIcon name="close" />
          </button>
        </div>
      </header>
      <div className="guide-conversation" ref={scroller} aria-label="Guide conversation">
        <p className="guide-introduction">
          Choose a question. Follow your curiosity.
          <br />
          Written answers, real projects, useful next steps.
        </p>
        {history.length === 1 && !busy && !query.trim() && (
          <div className="guide-topic-grid" aria-label="Choose a guide topic">
            {guideTopics.map((id) => (
              <button key={id} onClick={() => ask(id)}>
                <small>{guideById[id].topic}</small>
                <span>{guideById[id].question}</span>
                <SystemIcon name="arrow" />
              </button>
            ))}
          </div>
        )}
        {history.map((id, index) => (
          <div className="guide-exchange" key={`${index}-${id}`}>
            {index > 0 && (
              <div className="guide-user-question">
                <span>You asked</span>
                {guideById[id].question}
              </div>
            )}
            <SavedAnswer answer={guideById[id]} onNavigate={() => setGuideOpen(false)} />
          </div>
        ))}
        {busy && (
          <div className="guide-typing" role="status">
            <img src="/computer/os-logo.webp" alt="" />
            <div>
              <span>Opening the saved answer</span>
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
        {!busy && !query.trim() && history.length > 1 && (
          <div className="guide-follow-ups">
            <p>
              {history.length === 1
                ? 'A few good places to begin'
                : 'Where would you like to go next?'}
            </p>
            {(latest.followUps || guideTopics).map((id) => (
              <button key={id} onClick={() => ask(id)}>
                {guideById[id].question}
                <SystemIcon name="arrow" />
              </button>
            ))}
            {history.length > 1 && (
              <button className="guide-all-topics" onClick={() => ask('start')}>
                Back to the topic list
              </button>
            )}
          </div>
        )}
      </div>
      <div className="guide-search-area">
        {query.trim() && (
          <div className="guide-search-results" aria-label="Matching guide questions">
            <span>
              {matches.length} matching {matches.length === 1 ? 'question' : 'questions'}
            </span>
            {matches.map((answer) => (
              <button key={answer.id} onClick={() => ask(answer.id)}>
                <small>{answer.topic}</small>
                {answer.question}
                <SystemIcon name="arrow" />
              </button>
            ))}
            {!matches.length && (
              <p>That topic isn’t in the library yet. Try “projects”, “skills” or “contact”.</p>
            )}
          </div>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (matches.length === 1) ask(matches[0].id)
          }}
        >
          <SystemIcon name="search" />
          <input
            aria-label="Find a saved question"
            placeholder="Find a question or project…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={100}
            autoComplete="off"
          />
          <button
            type="button"
            aria-label={query ? 'Clear question search' : 'Show guide topics'}
            onClick={() => (query ? setQuery('') : ask('start'))}
          >
            <SystemIcon name={query ? 'close' : 'folder'} />
          </button>
        </form>
        <footer>
          <span>Expert guide · saved questions & answers</span>
          <span>Local to this portfolio</span>
        </footer>
      </div>
      <p className="sr-only" role="status">
        {busy ? `Opening: ${guideById[pending].question}` : `Answer ready: ${latest.title}`}
      </p>
    </aside>
  )
}
