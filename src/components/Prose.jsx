/**
 * Long-form copy lives in the data files as template literals, which carry
 * source-wrapping newlines. Those must not become hard breaks in the layout:
 * a blank line is a paragraph, a single newline is just a space.
 */
function toParagraphs(text) {
  return String(text)
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
}

export default function Prose({ children, className = '', size = 'base' }) {
  const sizing =
    size === 'lg'
      ? 'text-[1.0625rem] leading-[1.75] md:text-lg'
      : 'text-[1.0625rem] leading-[1.75]'

  return (
    <div className={`max-w-3xl space-y-5 ${className}`}>
      {toParagraphs(children).map((p, i) => (
        <p key={i} className={`${sizing} text-ink2`}>
          {p}
        </p>
      ))}
    </div>
  )
}
