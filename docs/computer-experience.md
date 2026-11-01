# Priyanshu OS portfolio

The homepage is a real Three.js scene using the supplied retro computer. Scroll to move into its monitor, click the monitor, or use Enter computer. The desktop opens after the camera transition. Power off or Escape shows the farewell and returns to the setup. Drag the scene to look around. On reload, the camera moves from a high, left-hand angle to the normal composition once the model is ready and the boot screen is dismissed. Reduced motion skips this entrance.

The outer room theme is adjustable using **Homepage theme** directly above Enter computer, in **Display & accessibility**, or in the desktop **Appearance** app. Blue hour, Warm studio and Slate evening persist locally without changing the desktop wallpaper. Their colour variables are grouped in `src/xp.css` under “User-facing outer-room controls”.

The desktop uses graphite XP title bars, Tahoma text, beveled controls, a green Start button and a black boot screen with animated three-block loading. `src/desktop-finish.css` follows the base XP styles; `src/showcase-finish.css` and `src/calendar.css` finish reading pages and taskbar details. The local Chrome recreation uses the supplied `public/svg` Chrome, Google, LinkedIn and GitHub marks plus an Instagram SVG added to that collection; the Google wordmark is stored locally from Google's official branding endpoint.

Typing in Chrome fills the full saved question without navigating. **Search now**, the search arrow or **Enter** submits it after typing completes. The Google home screen uses a flex layout within the window's available height; result lists and profile previews can scroll normally. Terminal commands include Windows-style `DIR` and `CLS` aliases alongside `ls` and `clear`.

The desktop has searchable applications, draggable windows, minimize/restore/maximize controls, project readers, a portfolio terminal, writing, experience, resume, contact and appearance settings. Terminal commands explore portfolio content; they do not execute shell commands. Wallpaper preference is stored locally. Windows stay open when leaving and re-entering during a visit.

## Startup, comfort and shortcuts

The first homepage visit in a tab opens a branded startup screen. Choose Start with sound, Start quietly, Skip intro, or the direct overview. Startup uses real display loading state, exposes the actual project/guide counts, and can continue with the 3D model loading in the background. Replay is available in the context menu and comfort controls.

Right-click the scene or empty desktop, or press Shift+F10, for desktop options. Text fields and project reading windows retain their normal browser copy menus. The taskbar and floating controls also expose accessibility without a right click.

Comfort controls include higher contrast, larger text, reduced animation, interface sounds, volume, desktop icon spacing and a keyboard reference. Preferences persist in the browser. Device reduced-motion settings always apply. Dialogs contain keyboard focus, make background controls inert, and restore the triggering control when dismissed.

| Shortcut | Action |
| --- | --- |
| Alt+Shift+P | Projects |
| Alt+Shift+T | Terminal |
| Alt+Shift+H | Portfolio guide |
| Alt+Shift+A | Display & accessibility |
| Alt+Shift+S | Mute / enable sound |
| Alt+Shift+K or ? | Shortcut reference |
| Alt+Shift+D | Show / restore desktop |
| Alt+Shift+M | Minimize active window |
| Escape | Close the top panel, then leave the computer |

Sounds are original Web Audio synthesis inspired by classic desktop interfaces; no Microsoft sound recording is bundled. Audio starts from an explicit visitor interaction, and unsupported audio leaves the site usable. Volume changes affect active output and zero volume schedules no sound.

## Portfolio expert guide

The floating guide uses 22 predefined answers with images, structured facts, links and connected follow-up questions. Question search filters that library locally. There is no LLM, model API or chat backend. Its loading, typing dots and screenshot scan/wipe are presentation animations over saved answers and real product captures.

The input/output contract was written first in `expert-guide-contract.md`; content lives in `src/data/assistantKnowledge.js`. The conversation preserves up to 12 answers during the visit and can be reset. Terminal help, project listings, skills and contact outputs are also structured rather than padded text dumps.

## Shared design

- Locally hosted Instrument Sans, Instrument Serif and IBM Plex Mono, with licenses in `public/fonts`.
- Warm paper, evergreen controls and copper accents; reading pages also have a forest dark mode.
- Project pages retain product accent colours within the shared typography and neutral palette.
- `/projects` is a dedicated showcase with five recent previews, a searchable 25-project collection, category filtering and individual case studies.
- `/overview` provides a direct reading route for biography, experience, skills and timeline.
- Motion respects reduced-motion preferences. WebGL failure leaves the DOM desktop available. The entry button works while the model loads.

## Assets

- `public/retro_computer_setup_free.glb`: user-supplied Retro Computer Setup (FREE) by Brandon Westlake, source recorded in the desktop credits, Sketchfab Standard License.
- `public/Windows-XP_wallpaper.jpg`: user-supplied original. Optimized derivative at `public/computer/bliss.webp`, used on the monitor and desktop.
- `public/Priyanshu OS Orbital Glass Logo.png`: user-supplied original. Optimized transparent derivative at `public/computer/os-logo.webp`, used in Start controls/menu, loading/opening, monitor taskbar, browser icon and credits.
- Little Code, Little Terminal, Nexsus, Gryork, GDG, MMMUT and Washing Bro use artwork from supplied assets and project folders. Washtro has an original folded-fabric icon using its green/gold brand palette. The remaining project identities are original vector illustrations. All 25 projects have a matching icon in project lists and readers.
- No generated replacement is needed for the supplied computer, wallpaper or logo.

Concept reference: [Henry Heffernan](https://henryheffernan.com/), selected by the user after portfolio research. All scene, interface and window behaviour here are custom implementation.

## Verification

- Production build; 25 unique project slugs; all referenced local covers and gallery files exist.
- Browser checks at desktop and 390px phone widths; all five recent project routes load their covers without horizontal overflow.
- Exercised scroll entry/return, Start search, project filters, terminal commands, project windows and navigation to full case studies.
- Screenshots in `docs/qa/` capture the homepage, desktop, showcase and shared case-study theme.
- Run `node --test tests/expert-guide.test.mjs tests/interface-sounds.test.mjs` for answer graph integrity, search, asset/route coverage, GDGoC dates, unsupported audio and mute/volume behaviour.

Run locally with `npm run dev`. No deployment was requested.
# Finishing: outer room and connections

The homepage has three selectable room palettes. The greeting cycles through three phrases and respects reduced motion. Power off displays a short farewell before returning to the room.

Chrome is a local portfolio application, not an embedded remote browser. Typing animates the fixed connection question, then waits for Search now or Enter before showing LinkedIn, GitHub and Instagram in that order. Each result opens a labelled local profile recreation with an explicit real-profile link. Instagram uses the supplied `_priyanshu.10_` URL; its preview gallery uses portfolio images rather than invented social posts. No credentials, follower counts or live-search claims are included. Profile navigation resets scroll position.

Project explorer cards show category, year, summary and status. Screenshot frames preserve image proportions with containment rather than cropping; project reader images likewise fit inside their frame.

## Graphite desktop and This PC

`src/desktop-finish.css` changes the window, titlebar and taskbar chrome to graphite while keeping the classic controls and light app surfaces. Inside the desktop, sound and accessibility appear in the taskbar only; the floating guide remains available.

This PC opens a system-properties view of the combined profile and technology toolkit. Its six-stage story is Speak → Shape → Connect → Remember → Reason → Ship. Visitors can filter a layer, search every declared technology, select an SVG tile and open projects that explicitly list that technology. Three build paths connect selected tools to Little Terminal, Nexsus and ManakMitra. The view does not assign unverified proficiency scores.

Brand marks use the supplied SVG folder, with missing available marks imported from Simple Icons (https://github.com/simple-icons/simple-icons, CC0) and the Zustand mark from Devicon (https://github.com/devicons/devicon). Protocols and model techniques without a supplied mark use original conceptual SVG symbols. SQL and IndexedDB have original database illustrations. The shared SkillIcon is also used in the reading-page toolkit.

Appearance adds Builder’s evening as an optional wallpaper alongside Bliss and all previous choices. The image, generation prompt and saved location are documented in `docs/personal-wallpaper.md`.

The taskbar clock opens an IST calendar with month navigation, Today, event markers,
and selectable dates to remember. The five birthdays recur annually; the Techfest
win is a fixed 21 December 2025 milestone. Escape closes the calendar without
exiting the computer. The tray's accessibility and sound icons use dark strokes
on silver buttons for visibility. The floating guide yields space while the calendar is open.

Project order is shared across the OS explorer, showcase, overview and case-study
navigation. Desktop readers show the full problem, approach, features, tradeoffs
and product captures from the existing case-study data.

Run `npm test` for the data, calendar, route, asset and audio regression checks.


Reading pages support neutral light and black dark modes. The navigation theme
toggle saves the choice across routes and reloads; it does not change the room
palette or desktop wallpaper.
