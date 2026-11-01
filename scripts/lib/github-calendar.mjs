const attributes = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [
      match[1],
      match[2],
    ]),
  )

export function summarizeCalendar(days, metadata = {}) {
  const sorted = [...days].sort((a, b) => a.d.localeCompare(b.d))
  return {
    total: sorted.reduce((sum, day) => sum + day.c, 0),
    commits: null,
    pullRequests: null,
    issues: null,
    reviews: null,
    private: null,
    activeDays: sorted.filter((day) => day.c > 0).length,
    busiestDay: sorted.reduce(
      (best, day) =>
        !best || day.c > best.contributionCount
          ? { date: day.d, contributionCount: day.c }
          : best,
      null,
    ),
    days: sorted,
    ...metadata,
  }
}

// GitHub's own public calendar includes exact counts in accessible tooltips.
// Never estimate counts from intensity levels or replace missing days with zero.
export function parsePublicCalendar(
  html,
  { minimumDays = 300, fetchedAt = new Date().toISOString() } = {},
) {
  const dates = new Map()
  for (const match of html.matchAll(/<td\b[^>]*>/g)) {
    const attrs = attributes(match[0])
    if (/^\d{4}-\d{2}-\d{2}$/.test(attrs['data-date'] || '') && attrs.id)
      dates.set(attrs.id, attrs['data-date'])
  }
  const counts = new Map()
  for (const match of html.matchAll(
    /<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g,
  )) {
    const date = dates.get(attributes(match[1]).for)
    if (!date) continue
    const text = match[2].replace(/<[^>]+>/g, '').trim()
    const count = text.match(/^(No|[\d,]+) contributions?\b/i)
    if (!count)
      throw new Error(
        'GitHub calendar tooltip format changed; keeping the previous snapshot.',
      )
    counts.set(
      date,
      /^no$/i.test(count[1]) ? 0 : Number(count[1].replaceAll(',', '')),
    )
  }
  if (counts.size < minimumDays || counts.size !== dates.size)
    throw new Error(
      'GitHub returned an incomplete calendar; keeping the previous snapshot.',
    )
  const days = [...counts]
    .map(([d, c]) => ({ d, c }))
    .sort((a, b) => a.d.localeCompare(b.d))
  for (let index = 1; index < days.length; index++) {
    if (Date.parse(days[index].d) - Date.parse(days[index - 1].d) !== 86400000)
      throw new Error(
        'GitHub calendar has a date gap; keeping the previous snapshot.',
      )
  }
  return summarizeCalendar(days, { source: 'github-public-profile', fetchedAt })
}
