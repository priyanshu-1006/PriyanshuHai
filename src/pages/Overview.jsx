import { Link } from 'react-router-dom'
import Featured from '../components/home/Featured'
import Experience from '../components/home/Experience'
import TechStack from '../components/home/TechStack'
import GitHub from '../components/home/GitHub'
import Timeline from '../components/home/Timeline'
import { About } from '../components/home/Sections'
import { profile } from '../data/profile'
import AnimatedHeading from '../components/AnimatedHeading'
import { usePageTitle } from '../lib/usePageTitle'

export default function Overview() {
  usePageTitle('About & experience')
  return (
    <>
      <header className="shell overview-header pt-32 pb-12">
        <div className="page-eyebrow">
          <Link to="/">← Back to the computer</Link>
          <span>The quick introduction</span>
        </div>
        <AnimatedHeading text={profile.name} accent="Chaurasia" />
        <p className="t-lead mt-6 max-w-2xl">
          Full-stack engineer, third-year CSE student at MMMUT, CTO at Gryork and Washtro, Founder &
          President of Nexsus, and GDGoC Organiser & Campus Lead.
        </p>
        <div className="mt-7 flex gap-3">
          <a
            className="pill pill-solid"
            href={profile.resumeUrl}
            download="Priyanshu-Chaurasia-Resume.pdf"
          >
            Download résumé ↓
          </a>
          <a className="pill pill-ghost" href={`mailto:${profile.email}`}>
            Get in touch ↗
          </a>
        </div>
      </header>
      <Featured />
      <About />
      <Experience />
      <TechStack />
      <GitHub />
      <Timeline />
    </>
  )
}
