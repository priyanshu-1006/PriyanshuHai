/**
 * Tech stack, mapped to the icon set in /public/svg.
 *
 * `icon` is the filename stem; a missing icon falls back to a monogram tile, so
 * adding a tool that has no SVG never breaks the grid.
 */

export const techGroups = [
  {
    group: 'Languages',
    items: [
      { name: 'TypeScript', icon: 'TypeScript' },
      { name: 'JavaScript', icon: 'JavaScript' },
      { name: 'Python', icon: 'Python' },
      { name: 'Java', icon: 'Java' },
      { name: 'C++', icon: 'C' },
      { name: 'Dart', icon: 'Dart' },
      { name: 'Solidity', icon: 'Solidity' },
    ],
  },
  {
    group: 'Frontend',
    items: [
      { name: 'React', icon: 'React' },
      { name: 'Next.js', icon: 'Next.js' },
      { name: 'Vite', icon: 'Vite' },
      { name: 'Tailwind CSS', icon: 'Tailwind-CSS' },
      { name: 'Redux', icon: 'Redux' },
      { name: 'HTML5', icon: 'HTML5' },
      { name: 'CSS3', icon: 'CSS3' },
    ],
  },
  {
    group: 'Backend',
    items: [
      { name: 'Node.js', icon: 'Node.js' },
      { name: 'Express', icon: 'Express' },
      { name: 'NestJS', icon: 'Nest.js' },
      { name: 'FastAPI', icon: 'FastAPI' },
      { name: 'Flask', icon: 'Flask' },
      { name: 'GraphQL', icon: 'GraphQL' },
      { name: 'Socket.IO', icon: 'Socket.io' },
    ],
  },
  {
    group: 'Data',
    items: [
      { name: 'PostgreSQL', icon: 'PostgresSQL' },
      { name: 'MongoDB', icon: 'MongoDB' },
      { name: 'Redis', icon: 'Redis' },
      { name: 'MySQL', icon: 'MySQL' },
      { name: 'Firebase', icon: 'Firebase' },
      { name: 'Prisma', icon: null },
      { name: 'Supabase', icon: null },
    ],
  },
  {
    group: 'AI / ML',
    items: [
      { name: 'PyTorch', icon: 'PyTorch' },
      { name: 'TensorFlow', icon: 'TensorFlow' },
      { name: 'OpenCV', icon: 'OpenCV' },
      { name: 'Pandas', icon: 'Pandas' },
      { name: 'NumPy', icon: 'NumPy' },
      { name: 'LangChain', icon: null },
    ],
  },
  {
    group: 'Mobile & Infra',
    items: [
      { name: 'Flutter', icon: 'Flutter' },
      { name: 'Android', icon: 'Android' },
      { name: 'Docker', icon: 'Docker' },
      { name: 'Kubernetes', icon: 'Kubernetes' },
      { name: 'Vercel', icon: 'Vercel' },
      { name: 'Linux', icon: 'Linux' },
      { name: 'Git', icon: 'Git' },
      { name: 'Figma', icon: 'Figma' },
    ],
  },
]

/** Flat marquee row — the most recognisable marks, for the ticker. */
export const marqueeIcons = [
  'React', 'TypeScript', 'Node.js', 'Next.js', 'Python', 'PostgresSQL',
  'MongoDB', 'Docker', 'Flutter', 'PyTorch', 'Redis', 'Tailwind-CSS',
  'Nest.js', 'GraphQL', 'Vercel', 'Figma', 'Git', 'Linux',
]

export const iconUrl = (icon) => (icon ? `/svg/${encodeURIComponent(icon)}.svg` : null)
