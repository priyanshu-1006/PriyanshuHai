/**
 * Resolves a project's tech string to an SVG in /public/svg.
 *
 * Three passes: an explicit alias for names that differ from the filename,
 * then a set of normalisations, then give up. Giving up is fine and expected —
 * models and techniques (ViT-Base/16, Grad-CAM, FedAvg) have no logo, and the
 * UI renders those as text chips instead of inventing an icon for them.
 */

// Names whose file differs from the label — including two typos in the icon set.
const ALIAS = {
  'PostgreSQL': 'PostgresSQL',
  'NestJS': 'Nest.js',
  'Nest.js': 'Nest.js',
  'Socket.IO': 'Socket.io',
  'Playwright': 'Playwrite',
  'TensorFlow.js': 'TensorFlow',
  'HTML': 'HTML5',
  'CSS': 'CSS3',
  'C++': 'C',
  'Tailwind CSS': 'Tailwind-CSS',
  'React Native': 'React',
  'React Native / Expo': 'React',
  'React Router': 'React-Router',
  'Next.js 15': 'Next.js',
  'Node.js': 'Node.js',
  'Google Gemini': null,
  'Gemini 1.5 Pro': null,
  'GPT-4o': null,
  'Vis.js': null,
}

const NORMALISE = (t) => [
  t,
  t.replace(/\s+/g, '-'),
  t.replace(/\s+/g, ''),
  t.replace(/\./g, ''),
  t.split(' ')[0],
  t.split('/')[0].trim(),
]

/**
 * Set of available icon stems. Kept as a literal rather than read from disk so
 * it works in the browser bundle; regenerate if the icon set changes.
 */
const AVAILABLE = new Set([
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C', 'Node.js',
  'Express', 'Nest.js', 'FastAPI', 'Flask', 'PostgresSQL', 'MongoDB', 'Redis',
  'MySQL', 'Firebase', 'Tailwind-CSS', 'Vite', 'Flutter', 'Dart', 'PyTorch',
  'TensorFlow', 'OpenCV', 'Pandas', 'NumPy', 'Docker', 'Kubernetes', 'Git',
  'GitHub', 'Linux', 'Figma', 'Socket.io', 'GraphQL', 'Vercel', 'Postman',
  'Redux', 'Bootstrap', 'HTML5', 'CSS3', 'Sass', 'Jest', 'Playwrite', 'Solidity',
  'Arduino', 'Android', 'Swagger', 'Nginx', 'React-Router',
])

const cache = new Map()

/** Returns a `/svg/...` path, or null when no icon legitimately exists. */
export function techIcon(name) {
  if (cache.has(name)) return cache.get(name)

  let stem = null
  if (name in ALIAS) {
    stem = ALIAS[name]
  } else {
    stem = NORMALISE(name).find((c) => AVAILABLE.has(c)) ?? null
  }

  const url = stem && AVAILABLE.has(stem) ? `/svg/${encodeURIComponent(stem)}.svg` : null
  cache.set(name, url)
  return url
}

/** Splits a tech list into the ones that have icons and the ones that don't. */
export function splitTech(tech = []) {
  const withIcon = []
  const textOnly = []
  for (const t of tech) {
    const url = techIcon(t)
    if (url) withIcon.push({ name: t, url })
    else textOnly.push(t)
  }
  return { withIcon, textOnly }
}
