# Local daily GitHub refresh

The daily job now runs through a Codex automation on this computer. It does not
use GitHub Actions runners or GitHub Actions billing. The existing Actions
workflows have been removed from the source; push this change once to remove
them from the remote repository too.

## Schedule and requirements

Automation: **Refresh portfolio GitHub activity**.
Schedule: **11:17 AM IST every day**.
Status: **Active**, attached to this chat; notifications are for failed runs.

Keep the computer powered on, connected to the internet, with Codex running and
`P:/Portfolio_me` available. The job uses the existing Git login, which passed a
dry-run authentication check. No new GitHub token is required. A computer that
is off or an unavailable local project cannot run the scheduled job; this cannot
guarantee a perfect contribution streak.

The schedule is managed in the app's Scheduled view. The automation id is
`refresh-portfolio-github-activity`. It runs `npm run refresh:publish`.

## How it protects your work

`scripts/refresh-github-local.mjs` owns a separate clone at
`.automation/github-refresh`. Your normal portfolio checkout is never staged,
committed, reset, pulled or pushed by the job.

Each run:

1. Locks the job to prevent simultaneous refreshes and fetches remote `main`.
2. Checks whether the current India date already has an automation commit or
   a saved snapshot with commit history. A second daily commit is skipped.
3. Refreshes the real contribution calendar and up to 100 recent indexed public
   commits. API outages retain previous repository details with a saved-data flag.
4. Runs the published branch's tests, release-file check and production build.
5. Confirms that only `src/data/github.json` changed, commits that file and pushes
   it to `priyanshu-1006/PriyanshuHai` on `main`.

The commit uses your GitHub noreply author address:
`220466360+priyanshu-1006@users.noreply.github.com`. The committer is labelled
Priyanshu OS automation. Messages begin `chore: refresh GitHub activity`.

Failed fetches/validation stop the run. A failed push retains the validated data
commit in the separate clone for retry, without force pushing. An unrelated dirty
file or a diverged branch stops the job for inspection. Logs/status are in
`.automation/last-run.json`; this directory is ignored by Git.

A daily remote data commit can leave your ordinary checkout behind `main`.
Pull the remote changes before your next manual push, using your normal Git
workflow and preserving any work in progress.

## Manual commands

```sh
npm run refresh:local     # Fetch, test, build and check authentication; no commit/push
npm run refresh:publish   # Same checks, then publish the single data file if due
npm run sync:github -- --strict  # Refresh data in the current checkout only
```

The check command saves a review copy at `.automation/preview-github.json` and
restores the generated file in its private clone afterwards. The normal source
checkout is unchanged by that command.

## Deployment

For `priyanshu-hai.vercel.app`, keep the Vercel Git integration connected to
`priyanshu-1006/PriyanshuHai`, production branch `main`. These are ordinary Git
pushes using your existing login, so Vercel can deploy the refreshed snapshot.
The website stays hosted independently of the local job.

If you use a Vercel deploy hook, place it in the ignored `.env.local` file as
`VERCEL_DEPLOY_HOOK`. The optional hook is called only after a successful push.
Use one deployment trigger to avoid duplicate builds. Optional environment
settings are `GITHUB_ACTIVITY_TOKEN` for extra API capacity and
`PORTFOLIO_GIT_EMAIL` to override the author email with another GitHub-linked
address. Tokens and hook URLs stay outside committed files.

## Calendar inside the computer

Click the taskbar clock. Below the calendar, **The build log** shows the yearly
contribution graph, streaks and a commit-history table. Dates with indexed public
commits have a blue marker. Select a day to filter its rows or choose **Latest**
to browse the saved public history. Each row includes the time, message,
repository and a direct GitHub commit link.

Commit times/day filtering use IST. The yearly contribution graph uses GitHub's
UTC dates. The history is a recent public search sample, not the complete private
record. An empty history row does not imply no GitHub contributions on that date.
Existing birthdays and the dated IIT Bombay Techfest milestone remain available.

References: [Local scheduled tasks](https://learn.chatgpt.com/docs/automations?surface=app),
[GitHub contribution criteria](https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference),
[Vercel Git deployments](https://vercel.com/docs/git/vercel-for-github).
