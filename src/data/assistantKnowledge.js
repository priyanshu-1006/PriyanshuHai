import { profile } from './profile.js'
import { projects } from './projects.js'

const portrait = {
  src: '/Me-light.png',
  alt: 'Priyanshu illustrated at his desk',
  caption: 'Priyanshu Chaurasia · Gorakhpur, India',
  portrait: true,
}
const projectImage = (slug) => {
  const project = projects.find((p) => p.slug === slug)
  return {
    src: project.cover,
    alt: `${project.title} product interface`,
    caption: `${project.title} · original project capture`,
  }
}
const route = (label, to) => ({ label, to })
const app = (label, id) => ({ label, app: id })
const projectAnswer = (slug, question, followUps) => {
  const p = projects.find((item) => item.slug === slug)
  return {
    id: slug,
    question,
    topic: p.category,
    title: p.title,
    keywords: [p.title, ...p.tech],
    paragraphs: [
      ...(slug === 'gdg-mmmut'
        ? [
            'Priyanshu has served as GDGoC Organiser & Campus Lead at MMMUT since September 2026, following his Executive Member role from July 2025 to August 2026.',
          ]
        : []),
      p.blurb,
      ...(p.boundary ? [p.boundary] : []),
    ],
    image: projectImage(slug),
    facts: [
      { label: 'My role', value: p.role },
      { label: 'Status', value: p.status },
      { label: 'Built with', value: p.tech.slice(0, 6).join(' · ') },
    ],
    actions: [
      route('Read the case study', `/projects/${slug}`),
      app('Open on the desktop', `project:${slug}`),
    ],
    followUps,
  }
}

export const guideAnswers = [
  {
    id: 'start',
    question: 'Where should I start?',
    topic: 'Start here',
    title: 'A little direction.',
    keywords: ['help', 'home', 'guide'],
    paragraphs: [
      'Choose a question and I’ll take you into Priyanshu’s work. Every answer is written from this portfolio, with a real image and somewhere useful to go next.',
    ],
    image: projectImage('nexsus-universe'),
    facts: [
      { label: 'Explore', value: `${projects.length} projects` },
      { label: 'Currently', value: 'CSE at MMMUT · graduating 2028' },
    ],
    actions: [route('Visit the project showcase', '/projects')],
    followUps: ['about', 'work', 'startups', 'campus', 'skills', 'hiring'],
  },
  {
    id: 'about',
    question: 'Who is Priyanshu?',
    topic: 'The person',
    title: 'An engineer who keeps building.',
    keywords: ['bio', 'about', 'student', 'education', 'introduction'],
    paragraphs: [
      'Priyanshu Chaurasia is a third-year Computer Science student at MMMUT, Gorakhpur. He is CTO at Gryork and Washtro, Founder & President of Nexsus, and GDGoC Organiser & Campus Lead.',
      'His work spans developer tools, campus infrastructure, AI systems and products used by real organisations.',
    ],
    image: portrait,
    facts: [
      { label: 'Education', value: 'B.Tech CSE · MMMUT · 2024–2028' },
      { label: 'Based in', value: profile.location },
    ],
    actions: [route('Read the full overview', '/overview')],
    followUps: ['work', 'experience', 'campus', 'contact'],
  },
  {
    id: 'work',
    question: 'Which projects should I explore first?',
    topic: 'Selected work',
    title: 'Start with something that interests you.',
    keywords: ['best', 'projects', 'portfolio', 'work', 'featured'],
    paragraphs: [
      'Try Nexsus for a campus ecosystem, Little Code and Little Terminal for developer tools, Gryork and Washtro for startup infrastructure, or the two SIH prototypes for evidence-led AI workflows.',
    ],
    image: projectImage('little-code'),
    bullets: [
      'Developer tools: Little Code and Little Terminal.',
      'Campus: Nexsus, Haazir and MMMUT Notice.',
      'Startups: Gryork and Washtro.',
      'SIH prototypes: ManakMitra and SatyaDwar.',
    ],
    actions: [
      route(`Browse all ${projects.length} projects`, '/projects'),
      app('Open the project folder', 'projects'),
    ],
    followUps: ['developer-tools', 'nexsus-universe', 'startups', 'sih'],
  },
  {
    id: 'developer-tools',
    question: 'What developer tools have you built?',
    topic: 'Developer tools',
    title: 'Tools for the way developers actually work.',
    keywords: ['editor', 'terminal', 'rust', 'code', 'tools'],
    paragraphs: [
      'Little Code is an AI coding companion inside a Code-OSS desktop app. Little Terminal is a native Rust terminal with GPU rendering and real Windows ConPTY sessions. Both make supervision and review part of the workflow.',
    ],
    image: projectImage('little-terminal'),
    actions: [
      route('Explore Little Code', '/projects/little-code'),
      route('Explore Little Terminal', '/projects/little-terminal'),
    ],
    followUps: ['little-code', 'little-terminal', 'skills', 'work'],
  },
  {
    id: 'startups',
    question: 'What do you build as a CTO?',
    topic: 'Startup work',
    title: 'Architecture with operational consequences.',
    keywords: ['cto', 'startup', 'business', 'companies', 'leadership'],
    paragraphs: [
      'At Gryork, Priyanshu designs the technical architecture of a bill-discounting marketplace for infrastructure subcontractors. At Washtro, the focus is garment-level chain of custody, operational workflows and traceable hand-offs.',
    ],
    image: projectImage('gryork'),
    facts: [
      { label: 'Gryork', value: 'Bill discounting and receivables workflows' },
      { label: 'Washtro', value: 'Garment tracking and laundry operations' },
    ],
    actions: [route('View experience', '/overview#experience')],
    followUps: ['gryork', 'washtro', 'experience', 'skills'],
  },
  {
    id: 'campus',
    question: 'What have you built for your campus?',
    topic: 'Campus & community',
    title: 'A campus, connected.',
    keywords: ['college', 'mmmut', 'campus', 'nexsus', 'community'],
    paragraphs: [
      'Nexsus brings campus services into a shared ecosystem. Related work includes Haazir attendance and timetable generation, admission counselling, MMMUT Notice, and the GDG on Campus web presence and induction workflow.',
    ],
    image: projectImage('nexsus-universe'),
    actions: [route('Explore Nexsus', '/projects/nexsus-universe')],
    followUps: ['nexsus-universe', 'mmmut-notice', 'gdg-mmmut', 'achievements'],
  },
  {
    id: 'sih',
    question: 'What are ManakMitra and SatyaDwar?',
    topic: 'SIH prototypes',
    title: 'Two problems. Evidence at the centre.',
    keywords: ['sih', 'hackathon', 'standards', 'document', 'identity'],
    paragraphs: [
      'ManakMitra helps discover Indian Standards and reason through certification evidence. SatyaDwar explores identity-document screening with OCR, signed-QR checks, itemised evidence and checkpoint workflows.',
      'Both are team prototypes. Their case studies state the current scope and validation limits.',
    ],
    image: projectImage('manakmitra'),
    actions: [
      route('ManakMitra case study', '/projects/manakmitra'),
      route('SatyaDwar case study', '/projects/satyadwar'),
    ],
    followUps: ['manakmitra', 'satyadwar', 'skills', 'work'],
  },
  {
    id: 'skills',
    question: 'Which technologies do you work with?',
    topic: 'Engineering',
    title: 'A stack chosen around the problem.',
    keywords: ['skills', 'stack', 'technology', 'languages', 'backend', 'frontend', 'architecture'],
    paragraphs: [
      'The recurring stack includes TypeScript, React, Node.js, Python and PostgreSQL. Rust powers Little Terminal; AI work spans retrieval systems, computer vision and supervised agent workflows.',
    ],
    image: {
      src: '/Architectures/Nexsus-Architecture.png',
      alt: 'Nexsus platform architecture diagram',
      caption: 'Nexsus · platform architecture',
    },
    facts: profile.skills
      .filter((group) => ['Languages', 'Backend', 'Data', 'Infra'].includes(group.group))
      .map((group) => ({ label: group.group, value: group.items.slice(0, 6).join(' · ') })),
    actions: [route('Explore the full technical overview', '/overview')],
    followUps: ['developer-tools', 'startups', 'sih', 'hiring'],
  },
  {
    id: 'experience',
    question: 'What experience and leadership roles do you have?',
    topic: 'Experience',
    title: 'Building the platform. Owning the outcome.',
    keywords: ['experience', 'career', 'roles', 'leadership', 'internship'],
    paragraphs: [
      'Current roles include CTO at Gryork and Washtro, Founder & President of Nexsus, and GDGoC Organiser & Campus Lead from September 2026. Earlier work includes a full-stack internship and contributions to the official MMMUT website.',
    ],
    image: portrait,
    actions: [
      route('Read experience and timeline', '/overview#experience'),
      app('Open Experience', 'experience'),
    ],
    followUps: ['gryork', 'washtro', 'gdg-mmmut', 'resume'],
  },
  {
    id: 'achievements',
    question: 'Which achievements are you most proud of?',
    topic: 'Track record',
    title: 'A few outcomes that mattered.',
    keywords: ['awards', 'achievement', 'winner', 'grant', 'hackathon', 'results'],
    paragraphs: [
      'The portfolio records both competition results and the practical outcomes of the systems Priyanshu has built.',
    ],
    image: projectImage('cognito-learning-hub'),
    bullets: profile.achievements
      .filter((a) => a.weight === 'primary')
      .slice(0, 4)
      .map((a) => `${a.title} · ${a.year}`),
    actions: [route('See the full record', '/overview#record')],
    followUps: ['campus', 'startups', 'hiring', 'resume'],
  },
  {
    id: 'hiring',
    question: 'Are you open to internships or SDE roles?',
    topic: 'Work together',
    title: 'Yes. Let’s build something useful.',
    keywords: ['hire', 'hiring', 'recruiter', 'available', 'internship', 'job', 'sde'],
    paragraphs: [
      profile.availability + '.',
      'For a quick assessment, explore the project case studies, technical responsibilities and résumé. Email is the most direct way to get in touch.',
    ],
    image: portrait,
    facts: [
      { label: 'Graduation', value: 'B.Tech CSE · 2028' },
      {
        label: 'Current focus',
        value: 'Full-stack systems, developer tools and platform architecture',
      },
    ],
    actions: [
      { label: 'Email Priyanshu', href: `mailto:${profile.email}` },
      { label: 'Read the résumé', href: profile.resumeUrl },
    ],
    followUps: ['skills', 'experience', 'achievements', 'contact'],
  },
  {
    id: 'resume',
    question: 'Where can I read your résumé?',
    topic: 'Résumé',
    title: 'The one-page version.',
    keywords: ['cv', 'resume', 'résumé', 'download', 'pdf'],
    paragraphs: [
      'The résumé brings together education, experience, selected projects and achievements. You can read the PDF directly or open it inside the desktop.',
    ],
    image: portrait,
    actions: [
      { label: 'Open résumé PDF', href: profile.resumeUrl },
      app('Read on the desktop', 'resume'),
    ],
    followUps: ['experience', 'skills', 'hiring', 'contact'],
  },
  {
    id: 'contact',
    question: 'How can I contact you?',
    topic: 'Say hello',
    title: 'A conversation starts here.',
    keywords: ['contact', 'email', 'github', 'linkedin', 'social'],
    paragraphs: [
      'Email is the fastest way to reach Priyanshu. GitHub contains the public code, and LinkedIn has his professional profile.',
    ],
    image: portrait,
    facts: [
      { label: 'Email', value: profile.email },
      { label: 'Location', value: profile.location },
    ],
    actions: [
      { label: 'Write an email', href: `mailto:${profile.email}` },
      { label: 'GitHub', href: profile.socials.github },
      { label: 'LinkedIn', href: profile.socials.linkedin },
    ],
    followUps: ['hiring', 'resume', 'work', 'about'],
  },
  projectAnswer('little-code', 'How does Little Code work?', [
    'little-terminal',
    'developer-tools',
    'skills',
    'work',
  ]),
  projectAnswer('little-terminal', 'What makes Little Terminal different?', [
    'little-code',
    'skills',
    'developer-tools',
    'work',
  ]),
  projectAnswer('nexsus-universe', 'What is Nexsus?', [
    'mmmut-notice',
    'gdg-mmmut',
    'campus',
    'achievements',
  ]),
  projectAnswer('mmmut-notice', 'How does MMMUT Notice work?', [
    'nexsus-universe',
    'campus',
    'skills',
    'work',
  ]),
  projectAnswer('gryork', 'What is your role at Gryork?', [
    'washtro',
    'startups',
    'experience',
    'hiring',
  ]),
  projectAnswer('washtro', 'How does Washtro track garments?', [
    'gryork',
    'startups',
    'skills',
    'experience',
  ]),
  projectAnswer('gdg-mmmut', 'What do you do as GDGoC Campus Lead?', [
    'campus',
    'nexsus-universe',
    'experience',
    'contact',
  ]),
  projectAnswer('manakmitra', 'How does ManakMitra use evidence?', [
    'satyadwar',
    'sih',
    'skills',
    'work',
  ]),
  projectAnswer('satyadwar', 'What does SatyaDwar verify?', [
    'manakmitra',
    'sih',
    'skills',
    'work',
  ]),
]

export const guideById = Object.fromEntries(guideAnswers.map((answer) => [answer.id, answer]))
export const guideTopics = ['about', 'work', 'startups', 'campus', 'skills', 'hiring']
export function findGuideQuestions(query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return guideAnswers.filter((answer) =>
    terms.every((term) =>
      `${answer.question} ${answer.topic} ${(answer.keywords || []).join(' ')}`
        .toLowerCase()
        .includes(term),
    ),
  )
}
