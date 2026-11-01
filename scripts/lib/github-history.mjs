export function normalizeCommitHistory(items = []) {
  const commits = new Map()
  for (const item of items) {
    const repository = item.repository?.full_name
    const sha = item.sha
    const authoredAt = item.commit?.author?.date
    if (
      !repository ||
      !/^[a-f\d]{40}$/i.test(sha || '') ||
      !Number.isFinite(Date.parse(authoredAt))
    )
      continue
    const message = String(item.commit?.message || 'Commit')
      .split(/\r?\n/)[0]
      .slice(0, 240)
    commits.set(`${repository}:${sha}`, {
      sha,
      shortSha: sha.slice(0, 7),
      repository,
      repoName: item.repository.name || repository.split('/').at(-1),
      message,
      authoredAt,
      committedAt: item.commit?.committer?.date || authoredAt,
      url: `https://github.com/${repository}/commit/${sha}`,
      automated: /^chore: refresh GitHub activity\b/i.test(message),
    })
  }
  return [...commits.values()].sort(
    (a, b) => Date.parse(b.authoredAt) - Date.parse(a.authoredAt),
  )
}
