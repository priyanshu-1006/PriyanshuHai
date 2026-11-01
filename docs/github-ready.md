# GitHub preparation — 2 November 2026

Local work is ready for review. **Nothing has been pushed or deployed, and no
commit was created.** The changes remain in the working tree on `main`.

Remote: `https://github.com/priyanshu-1006/PriyanshuHai.git`.
Base commit: `fe324d5450b3b6e2e6c1334d19d908442f622273`.
The last read-only upstream check matched this commit.

## Project content and media

The canonical order is Little Code, Little Terminal, Nexsus, Cognito Learning Hub,
FractureVision AI, Nexsus Assist, Haazir, Washtro, Washing Bro, AuroraHai, then the
remaining projects in their existing order. `src/data/projectOrder.js` drives
the showcase, desktop, overview selections and next-project navigation.

| Project | Current hero and evidence |
| --- | --- |
| Little Code | Latest workspace-home capture from its supplied website assets; notebook, document, memory and MCP captures refreshed too. Public link: `https://little-code.vercel.app/`. |
| Little Terminal | Newly supplied product-overview hero and native tools, services, SSH, request review, local-result and private-pane captures. Public link: `https://little-terminal.vercel.app/`. |
| ManakMitra | Newly supplied hero and partner API demo, alongside the existing source-based product tour. |
| SatyaDwar | Newly supplied hero, retaining the curated checkpoint and product captures. |
| AuroraHai | `/Aurora/Aurora-Map-3d.jpeg` on the showcase and full page. |

`scripts/refresh-project-media.py` documents the optimised media import. Original
user assets remain intact. The public product links for Little Code and Little
Terminal returned HTTP 200 when checked.

The existing detailed pages and `docs/project-readmes/` supply the architecture,
engineering tradeoffs and product flows. Desktop readers now expose that same
content through `ProjectStory.jsx`; they retain the actual project release status
and evidence boundaries. Cognito's page distinguishes its final twelve-service
architecture from the nine selected boundaries illustrated in the interactive tour.

## Homepage, theme and calendar

- Larger desktop 3D framing, stronger floor/contact shadows, subtle moving room
  light, and portrait camera fitting checked at phone and tablet sizes.
- Larger homepage name; overview, showcase, case studies and blog retain both
  light and dark modes. Dark is black rather than green; light is neutral white.
  The toggle persists across routes and reloads.
- Taskbar sound/accessibility icons have dark strokes on silver controls.
- Taskbar clock opens a live IST calendar. Birthdays: 13 March (sister), 3 May
  (father), 10 June (Priyanshu), 8 August (mother), 17 October (Rakshita).
- IIT Bombay Techfest win is a one-time milestone on 21 December 2025. Future
  entries belong in `src/data/calendarEvents.js`.

## Validation

`npm test` passes the regression checks, including exact project priority, case-correct
local image paths, public links, recurring birthdays, the dated milestone and IST
date rollover. `npm run check:release` checks file size limits, environment-file
exclusion and common high-confidence secret patterns; it prints filenames rather
than secret values. `npm run build` produces the production bundle.

Browser checks cover the light/dark overview/showcase/case studies, refreshed hero
assets, public product links, full desktop project readers, calendar date jumps,
Escape behaviour, readable tray controls, phone/tablet layouts and absence of
horizontal page overflow. Screenshots are in `docs/qa/`.

The local Codex automation replaces the hosted Actions workflows. It refreshes
and validates the single generated data file in a separate clone before publishing.
See `github-activity-setup.md` for the current schedule and setup.
The build retains the existing warning about the large Three.js and main chunks;
the computer scene and individual case studies are loaded separately.

Before a later push, review the working tree and run:

```sh
npm test
npm run check:release
npm run build
git diff --check
git status --short
```

Staging, committing and pushing are left for the next explicit publishing step.
