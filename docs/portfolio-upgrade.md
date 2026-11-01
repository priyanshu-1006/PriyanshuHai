# Portfolio upgrade — November 2026

## Direction

The final homepage direction is the user-selected 3D computer and desktop OS, inspired by Henry Heffernan. The supplied GLB, XP wallpaper and Priyanshu OS logo form the entrance. Warm paper, evergreen controls and shared locally hosted typography continue through the showcase, case studies, writing and overview. See `computer-experience.md` for the final interaction design.

Reference research: [Brittany Chiang](https://brittanychiang.com/) for a clear work/experience hierarchy, and [Adham Dannaway](https://www.adhamdannaway.com/) for a distinctive personal introduction and direct access to work. These inform the hierarchy; no template or source code was copied.

## Implemented plan

1. Inspect the five source repositories and their release/evidence documentation.
2. Import a curated set of original screenshots as optimised WebP assets.
3. Create individual routes with project-specific interactive or explanatory sections, architecture, screenshots, stack and honest release status.
4. Build the interactive computer entrance and desktop; keep the conventional reading sections at `/overview` and create a dedicated screenshot-led `/projects` showcase.
5. Add screenshot previews to the full project index and derive its count from data.
6. Update GDGoC leadership from September 2026, retaining the earlier Executive Member history.
7. Build and inspect the local result, including narrow-screen behaviour and both themes.

## Source mapping

- Little Code: `C:/Users/priya/OneDrive/Desktop/CODING/Projects/Little_Code`, README, build-tools docs and curated website captures.
- Little Terminal: sibling `Little_Terminal`, README, product-feature documentation and curated showcase captures. AI captures use the source project’s local fixture.
- MMMUT Notice: sibling `MMMUT_Notice`, README and workflow/integration modules. No image files were supplied; product captures are rendered from its own UI and synthetic test fixture, labelled accordingly.
- ManakMitra: `P:/SIH/ManakMitra`, README, architecture, dated Evidence Hub. UI images extracted from its Product Overview document are local renders with disconnected API, as the source states.
- SatyaDwar: `P:/SIH/SatyaDwar`, README, scope, desktop/mobile documentation and curated showcase captures. No identity-document specimen images are imported.

Only curated media and portfolio copy are copied into this repository. Local environment files, credentials, models, databases and installers are not needed by the portfolio.

## Validation

- Production build passes; case studies are split into on-demand bundles.
- 25 unique project slugs; every referenced cover and gallery asset exists.
- All five new routes loaded at a 390 px viewport with no horizontal overflow and a loaded cover image.
- Checked homepage at mobile and wide desktop breakpoints in light/dark themes; checked theme restoration after leaving a case study.
- Exercised computer entry and return, desktop controls, project search, Code modes, Terminal tour, Notice stages and gallery next/Escape behaviour. Gallery also traps focus and restores it on close.
- Updated the GDGoC entry in both resume sources and PDF copies; rendered and visually inspected the updated PDF.
- Temporary Notice fixture HTML and duplicate intermediate images removed before final build. No deployment was requested or performed.
