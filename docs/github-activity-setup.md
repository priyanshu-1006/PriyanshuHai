# Daily GitHub activity refresh

The portfolio uses a saved GitHub snapshot. Visitors do not call the GitHub API
and never receive an API token. The public calendar works without a personal
access token; the workflow's built-in GitHub token raises API request limits.

## Activate it once

1. Review and push these changes to the repository's default branch, `main`.
   The workflow is `.github/workflows/refresh-github.yml`.
2. Open [Actions](https://github.com/priyanshu-1006/PriyanshuHai/actions), enable
   workflows if prompted, choose **Refresh GitHub activity**, then **Run workflow**.
   A snapshot already refreshed that India calendar day is deliberately skipped.
3. In the Vercel project for `priyanshu-hai.vercel.app`, check **Settings → Git**:
   the connected repository should be `priyanshu-1006/PriyanshuHai`, with `main`
   as the production branch. Keep automatic Git deployments enabled.

No personal token is required for the public calendar. The job already requests
`contents: write` to commit its single generated file. Branch rules must permit
this automated push; a rejected push is reported as a failed Actions run.

## What happens every day

- Scheduled for **11:17 AM IST** (`47 5 * * *` in UTC).
- Checks whether a snapshot is already saved for the current India date.
- Refreshes the calendar, public repository contributions and recent activity.
- Runs tests, the release-file check and a production build.
- Commits only `src/data/github.json`, then pushes to the default branch.
- Uses `chore: refresh GitHub activity (YYYY-MM-DD)` as the commit message.

The workflow records a real data refresh, including when it was checked. It
does not create empty commits or rewrite older dates. Failed calendar fetches
retain the saved data and fail the scheduled job instead of making a commit.
Concurrent runs are serialised and the date guard skips a second same-day run.

The author is Priyanshu Chaurasia with
`220466360+priyanshu-1006@users.noreply.github.com`; the committer remains
`github-actions[bot]`, so the maintenance automation is visible in history.
Check your GitHub **Settings → Emails** if you use a different commit email.
To override it, add repository **Settings → Secrets and variables → Actions →
Variables → New repository variable** named `PORTFOLIO_GIT_EMAIL` with an email
associated with your account. Do not send a personal token through chat.

GitHub counts eligible commits on the default branch when their author email is
linked to your account and the repository is not a fork. A scheduled maintenance
commit can therefore contribute to the graph. The job runs before its own new
commit is indexed, so that commit normally appears in a later refresh.

Schedules can be delayed or dropped by GitHub and public-repository schedules
can be disabled after 60 days without repository activity. Daily runs cannot
guarantee an uninterrupted contribution streak. If a run fails, inspect its
Actions log and use **Run workflow** again after fixing the error.

## Keep the deployed data fresh

Vercel hosting serves the site independently of the refresh job. The scheduled
push supplies new snapshot data for the next deployment. Because GitHub does not
trigger another push workflow for commits made using `GITHUB_TOKEN`, this refresh
workflow performs its own tests and build before pushing.

Normally Vercel's Git integration deploys that push. If your Vercel project does
not redeploy an automated push, create a deploy hook in **Vercel → Project →
Settings → Git → Deploy Hooks**, targeting `main`. Store its URL as a GitHub
Actions **secret** called `VERCEL_DEPLOY_HOOK`. The prepared workflow calls it
after a successful push. Use the hook only if needed to avoid duplicate builds;
keep its URL private.

An optional `GITHUB_ACTIVITY_TOKEN` Actions secret can provide different API
access if the built-in token cannot return the desired GraphQL breakdown.
The public profile fallback already includes private contribution counts if
you have chosen to share those on your GitHub profile; private repository names
and source files are not fetched for this feature.

## Local refresh and checks

```sh
npm run sync:github -- --strict
npm test
npm run check:release
npm run build
```

The UI shows the calendar's own refresh date and marks an old calendar as a
saved snapshot. Unknown private/PR/commit breakdown values stay unknown rather
than appearing as zero. Hover or focus a day to inspect it; arrow keys navigate
the calendar. Streaks follow GitHub's UTC dates. The daily job guard follows IST.

References: [GitHub contribution criteria](https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference),
[GitHub scheduling](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule),
[workflow token triggers](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow),
[GitHub noreply email](https://docs.github.com/en/account-and-profile/reference/email-addresses-reference),
[Vercel Git deployments](https://vercel.com/docs/git/vercel-for-github),
[Vercel deploy hooks](https://vercel.com/docs/deploy-hooks).
