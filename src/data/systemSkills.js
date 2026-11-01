import { profile } from './profile.js'
import { techGroups } from './techStack.js'
import { projects } from './projects.js'

const overrides = {
  'C++': 'Cpp',
  SQL: 'SQL',
  Zustand: 'Zustand',
  'React Native / Expo': 'Expo',
  'Framer Motion': 'Framer-Motion',
  'Radix UI': 'Radix-UI',
  NestJS: 'Nest.js',
  Prisma: 'Prisma',
  Supabase: 'Supabase',
  LangChain: 'LangChain',
  LangGraph: 'LangGraph',
  Railway: 'Railway',
  Render: 'Render',
  Turborepo: 'Turborepo',
  pnpm: 'pnpm',
  Playwright: 'Playwrite',
  IndexedDB: 'IndexedDB',
  pgvector: 'PostgresSQL',
}
const records = new Map()
function add(name, group, icon) {
  const category = group === 'Mobile & Infra' ? 'Infra' : group
  if (records.has(name)) {
    const record = records.get(name)
    if (!record.groups.includes(category)) record.groups.push(category)
    if (icon && !record.icon) record.icon = icon
    return
  }
  records.set(name, {
    name,
    groups: [category],
    icon: overrides[name] || icon || null,
  })
}
const supplied = new Map(
  techGroups
    .flatMap((group) => group.items)
    .map((item) => [item.name, item.icon]),
)
for (const group of profile.skills)
  for (const entry of group.items)
    for (const name of entry.split(' · '))
      add(name, group.group, supplied.get(name))
for (const group of techGroups)
  for (const item of group.items) add(item.name, group.group, item.icon)
export const systemSkills = [...records.values()]
export const systemStages = [
  {
    id: 'Languages',
    title: 'Speak',
    subtitle: 'Languages',
    description:
      'Choose the language that fits the problem: TypeScript for platforms, Rust for native tools, Python for automation and model work.',
  },
  {
    id: 'Frontend',
    title: 'Shape',
    subtitle: 'Interfaces',
    description:
      'Turn the idea into a surface people can use, from web portals to mobile experiences.',
  },
  {
    id: 'Backend',
    title: 'Connect',
    subtitle: 'Services',
    description:
      'Give the interface useful behaviour: APIs, real-time communication and the rules behind each action.',
  },
  {
    id: 'Data',
    title: 'Remember',
    subtitle: 'Data',
    description:
      'Keep state coherent, searchable and reliable across the system.',
  },
  {
    id: 'AI / ML',
    title: 'Reason',
    subtitle: 'Intelligence',
    description:
      'Add retrieval, perception and model workflows where they solve a concrete problem.',
  },
  {
    id: 'Infra',
    title: 'Ship',
    subtitle: 'Delivery',
    description:
      'Package, test and deploy the work so it can leave the development machine.',
  },
]
const key = (value) => value.toLowerCase().replace(/[^a-z0-9+#]/g, '')
export function projectsForSkill(name) {
  const names =
    name === 'React Native / Expo' ? ['reactnative', 'expo'] : [key(name)]
  return projects.filter((project) =>
    project.tech.some((tech) => names.includes(key(tech))),
  )
}

export const systemBuildPaths = [
  {
    id: 'native',
    title: 'A tool for builders',
    text: 'Rust, a native window, a GPU renderer and real terminal sessions. Open the finished work to see how the pieces meet.',
    skills: ['Rust', 'SQLite'],
    project: 'little-terminal',
  },
  {
    id: 'campus',
    title: 'A campus that connects',
    text: 'A shared platform moves from interface to API to data. Nexsus brings those layers together for the campus.',
    skills: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'Prisma'],
    project: 'nexsus-universe',
  },
  {
    id: 'evidence',
    title: 'Answers with evidence',
    text: 'An interface, a backend and retrieval work together to make standards easier to navigate in ManakMitra.',
    skills: ['React', 'NestJS', 'FastAPI', 'LangGraph', 'pgvector'],
    project: 'manakmitra',
  },
]
