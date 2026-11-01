export default function AnimatedHeading({ text, accent, as: Tag = 'h1', className = '' }) {
  const accentStart = accent ? text.lastIndexOf(accent) : -1
  let offset = 0
  return (
    <Tag className={`animated-heading ${className}`} aria-label={text}>
      {text.split(' ').map((word, index) => {
        const accented = accentStart >= 0 && offset >= accentStart
        offset += word.length + 1
        return (
          <span key={`${word}-${index}`} className="type-word-space" aria-hidden="true">
            <span
              className={`type-word ${accented ? 'type-word-accent' : ''}`}
              style={{ '--word-delay': `${Math.min(index, 14) * 45}ms` }}
            >
              {word}
            </span>{' '}
          </span>
        )
      })}
    </Tag>
  )
}
