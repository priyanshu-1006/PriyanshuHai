import Hero from '../components/home/Hero'
import Featured from '../components/home/Featured'
import Experience from '../components/home/Experience'
import TechStack from '../components/home/TechStack'
import GitHub from '../components/home/GitHub'
import LinkedIn from '../components/home/LinkedIn'
import Timeline from '../components/home/Timeline'
import { About } from '../components/home/Sections'

/**
 * Sections in the order a stranger needs them: who → the work → who I am →
 * where I have worked → what I use → the commit record that backs it up → the
 * dated track record.
 *
 * The full project index moved to /projects; it was the longest block on the
 * page and it buried everything under it. Stats are folded into the hero.
 * LinkedIn renders nothing until posts are added, so its slot costs nothing.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <About />
      <Experience />
      <TechStack />
      <GitHub />
      <LinkedIn />
      <Timeline />
    </>
  )
}
