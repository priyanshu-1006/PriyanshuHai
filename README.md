# Portfolio - Priyanshu Chaurasia

React + Vite + Tailwind v4 + React Router. Deploys to Vercel as-is.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle into dist/
npm run lint
node --test tests/*.test.mjs
```

## Where the content lives

Core profile and project content is data-driven. The desktop applications and page layouts live in components.

| File | What it holds |
|---|---|
| `src/data/profile.js` | Name, bio, contact, skills, education, experience and achievements |
| `src/data/projects.js` | Every project and its full case study |
| `src/data/recentProjects.js` | Five recent products, their evidence boundaries and screenshot galleries |
| `docs/project-readmes/` | Source READMEs the case studies were written from |

### Adding a project

Copy any existing object in `src/data/projects.js` and edit it. Only `slug`, `title`,
`blurb`, `tech`, `year`, `role`, `category` and `status` are required - every other
field is optional and its section simply will not render if you leave it out.

- `slug` becomes the URL: `/projects/your-slug`
- `featured: true` puts it under "Principal work" instead of "Also built"
- `architecture` is a plain string - paste an ASCII diagram straight in, it is
  rendered in monospace and scrolls horizontally on small screens

### Media fields

| Field | Shape | Notes |
|---|---|---|
| `cover` | `"/image.png"` | Full-width hero on the case-study page |
| `gallery` | `[{ src, caption }]` | Grid with a keyboard-navigable lightbox, lazy-loaded |
| `videos` | `[{ id, label }]` | YouTube **video ID only**, not the full URL |
| `embed` | `{ url, height }` | Click-to-load iframe of the deployed app |

For `videos`, take just the ID: `https://youtu.be/kM7VeWXM6iA` becomes
`{ id: "kM7VeWXM6iA", label: "Walkthrough" }`. Videos load a cheap poster frame
first and only pull the YouTube iframe if someone clicks play.

Images go in `public/` and are referenced from the site root - `public/foo.png`
is `"/foo.png"`. **Avoid spaces in filenames.**

### Adding your resume

Drop `resume.pdf` into `public/` and it is served at `/resume.pdf`.

### Screenshots

Put images in `public/projects/<slug>/` and reference them as
`/projects/<slug>/name.png`.

## Design system

Two fully-designed themes (not an inversion) that follow the visitor's OS by
default, with a toggle that persists. An inline script in `index.html` resolves
the theme before first paint, so there is no flash.

**Tokens** live at the top of `src/index.css`:

- `:root` / `[data-theme="light"]` and `[data-theme="dark"]` define `--c-*` colours
- `@theme` maps them to Tailwind utilities (`bg-bg2`, `text-ink2`, `border-rule`, `text-accent`)
- A fluid type scale (`--fs-*`), tracking (`--tr-*`) and leading (`--lh-*`) drive
  the `.t-display` / `.t-h1` / `.t-h2` / `.t-h3` / `.t-lead` / `.t-label` roles

**Typography**: Instrument Sans for display and reading, Instrument Serif for expressive accents,
and IBM Plex Mono for labels and terminal content. Fonts are hosted locally, with licenses in
`public/fonts`. Headings use restrained weights and accessible entrance animations.

Shared text and control tokens support clear contrast in both themes.

### Per-project themes

`src/data/projectThemes.js` supplies product accents. `<ProjectTheme slug={slug} />` applies
those accents inside the shared paper/forest reading palette and restores the shell on unmount.
Typography stays consistent throughout the portfolio.

To retheme a project, edit its accent entries. Shared reading surfaces remain consistent.

## Components

| Component | Purpose |
|---|---|
| `components/Device.jsx` | `MacBook`, `Phone`, `DevicePair` frames. Hold a screenshot, or a live site rendered at desktop width and CSS-scaled to fit |
| `components/Carousel.jsx` | Auto-advancing slide track. Every slide stays mounted, so a loaded iframe survives sliding away. Pauses on hover, focus and hidden tabs; disabled under reduced motion |
| `components/Media.jsx` | `Gallery` (lightbox, keyboard-navigable) and `VideoEmbed` (poster first, iframe only on click) |
| `components/ProjectTheme.jsx` | Applies product accents inside the shared reading palette |

## Bespoke project pages

Each project can have its own page with its own layout, not just its own colours.

1. Create `src/pages/projects/YourProject.jsx` — a self-contained component
2. Register it in `src/pages/projects/index.jsx`

```jsx
const PAGES = {
  'nexsus-universe': <NexsusUniverse />,
  'your-slug': <YourProject />,
}
```

Anything not registered falls back to the generic case-study template in
`ProjectDetail.jsx`, so the site is never broken mid-migration.

**All 25 projects have one.** The larger case studies define their own layout primitives; lighter ones share `src/components/project/Scaffold.jsx`. The five recent additions use `src/components/project/CaseStudy.jsx` with individual product sections and per-project themes. Case studies load on demand.

The homepage uses the supplied 3D computer as the entrance to Priyanshu OS. Scroll into the
monitor or use Enter computer, then explore desktop applications and project windows.
`/projects` is the dedicated screenshot showcase and searchable archive; `/overview` is the
direct reading route. See `docs/computer-experience.md` for controls, assets and validation.

The first homepage visit includes a replayable startup with optional original sounds. Right-click
the scene or desktop for display, accessibility and shortcut controls. The floating portfolio
guide is a local expert system with 22 saved answers and connected questions. Its editable input/output
library is `src/data/assistantKnowledge.js`; the contract is in `docs/expert-guide-contract.md`.

## Images

- Device frames `contain` rather than crop, because the screenshots are ~2.2:1
  browser captures and the MacBook screen is 16:10. The letterbox is black so it
  reads as bezel. Pass `fit="cover"` or `aspect="..."` to override.
- A project with `shot: null` renders a "screenshot pending" panel instead of
  framing an unsuitable image.
- Tech icons live in `public/svg/` and are mapped in `src/data/techStack.js`.
  An entry with `icon: null` falls back to a monogram tile.

## Deploy

Push to GitHub, import the repo on Vercel, accept the detected Vite settings.
`vercel.json` already rewrites all routes to `index.html` so deep links to
`/projects/<slug>` work on refresh.
