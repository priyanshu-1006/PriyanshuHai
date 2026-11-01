import { useEffect, useState } from 'react'
import { useExperience } from '../../lib/experienceContext'
const lines = ['hello, world.', 'ideas → reality.', 'always building.']
export default function HeroTypewriter() {
  const { reducedMotion } = useExperience()
  const [text, setText] = useState(lines[0])
  useEffect(() => {
    if (reducedMotion) return
    let index = 0,
      count = lines[0].length,
      deleting = true,
      timer
    const tick = () => {
      count += deleting ? -1 : 1
      setText(lines[index].slice(0, count))
      let delay = deleting ? 45 : 95
      if (count === 0) {
        deleting = false
        index = (index + 1) % lines.length
        delay = 300
      }
      if (!deleting && count === lines[index].length) {
        deleting = true
        delay = 2600
      }
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, 3000)
    return () => clearTimeout(timer)
  }, [reducedMotion])
  return (
    <>
      <span className="hero-typed">
        {reducedMotion ? lines[0] : text}
        <i />
      </span>
    </>
  )
}
