// One editorial order for the showcase, desktop, terminal and related-project views.
export const PROJECT_PRIORITY = [
  'little-code',
  'little-terminal',
  'nexsus-universe',
  'cognito-learning-hub',
  'fracturevision-ai',
  'nexsus-assist',
  'haazir',
  'washtro',
  'washing-bro',
  'aurorahai',
]
export function orderProjects(items) {
  const rank = new Map(PROJECT_PRIORITY.map((slug, index) => [slug, index]))
  return [...items].sort(
    (a, b) =>
      (rank.get(a.slug) ?? PROJECT_PRIORITY.length) -
      (rank.get(b.slug) ?? PROJECT_PRIORITY.length),
  )
}
