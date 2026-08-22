// Every project. `slug` drives the URL: /projects/<slug>
// Optional fields simply don't render when omitted — nothing breaks.
//
// Media:
//   cover   — hero image on the case-study page
//   gallery — [{ src, caption }] screenshot grid, lazy-loaded
//   videos  — [{ id, label }] YouTube IDs, embedded privacy-mode
//   embed   — { url, height } click-to-load live iframe of the deployed app

export const projects = [
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'nexsus-universe',
    title: 'Nexsus',
    tagline: 'Innovation Continuum',
    blurb: 'A unified digital ecosystem for the MMMUT campus — five portals, two mobile apps and five RAG-backed assistants on one backend. The CSE department now runs its live timetable on it.',
    year: '2025 — Present',
    role: 'Founder, President & Architect',
    category: 'Platform',
    featured: true,
    status: 'Live',
    tech: ['React', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL', 'pgvector', 'React Native', 'Expo', 'LangChain', 'LangGraph', 'Redis', 'Playwright'],
    links: {
      live: 'https://mmmut.app',
      tools: 'https://nexsus-tools-frontend.vercel.app/',
    },
    embed: { url: 'https://mmmut.app', height: 620 },
    cover: '/Nexsus-dark.png',
    architectureImage: '/Architectures/Nexsus-Architecture.png',
    gallery: [
      { src: '/Nexsus-dark.png', caption: 'Main client — dark theme' },
      { src: '/Nexsus-light.png', caption: 'Main client — light theme' },
      { src: '/Nexsus-admin.png', caption: 'Super admin portal' },
      { src: '/Nexsus-haazir.png', caption: 'Haazir attendance portal' },
      { src: '/Nexsus_club.png', caption: 'Societies and clubs portal' },
    ],

    problem: `At MMMUT — and at most Indian colleges — students run their entire academic life across
ten or more disconnected platforms. Critical notices drown in WhatsApp groups. There is no trusted
way to buy or sell anything on campus. PYQs, timetables, attendance, club information and mess menus
each live on a different site, or on no site at all. Freshers have essentially zero structured
guidance. Attendance is still roll-call on paper, and proxy attendance is routine.`,

    approach: `Rather than build another single-purpose tool to add to the pile, I designed one
backend with many faces. A single Express + Prisma API — 70+ models across a 2,240-line schema —
serves five distinct web portals and two native Android apps, each scoped to a different audience
and permission set. The AI layer is retrieval-augmented rather than generative-only: a pgvector
store over a scraped and indexed knowledge base of the college itself, so the bots answer with
facts about MMMUT instead of hallucinating them.

The bet was that consolidation is the product. Any one module here exists elsewhere; having all of
them behind one identity, one permission model and one notification system is what makes it worth
using. The traffic suggests the bet paid off.`,

    architecture: `                     ┌─────────────────────────────────────────────┐
                     │          BACKEND (Express + Prisma)         │
                     │             Port 5000 · REST API            │
                     │                                             │
                     │  ┌─────────┐ ┌──────────┐ ┌─────────────┐   │
                     │  │  Auth   │ │  RAG AI  │ │  Attendance │   │
                     │  │ (JWT +  │ │(LangChain│ │  (QR/Face/  │   │
                     │  │  RBAC)  │ │ +Gemini) │ │  Geofence)  │   │
                     │  └─────────┘ └──────────┘ └─────────────┘   │
                     │  ┌─────────┐ ┌──────────┐ ┌─────────────┐   │
                     │  │ Scraper │ │  Email   │ │  Cloudinary │   │
                     │  │(Playwrt)│ │(Resend + │ │  (Uploads)  │   │
                     │  │         │ │Nodemailer│ │             │   │
                     │  └─────────┘ └──────────┘ └─────────────┘   │
                     │                                             │
                     │     Supabase PostgreSQL · pgvector · Redis  │
                     └──────────────────┬──────────────────────────┘
                                        │ REST API
      ┌──────────────┬───────────────┬──┴────┬───────────────┬──────────────┐
      │              │               │       │               │              │
┌─────┴─────┐  ┌─────┴─────┐  ┌──────┴────┐  │  ┌────────────┴─┐  ┌─────────┴─────┐
│  Main     │  │  Admin    │  │  Society  │  │  │  Haazir      │  │  Tools        │
│  Client   │  │  Portal   │  │  Portal   │  │  │  Portal      │  │  (Deployed)   │
│  (Public) │  │  (Super   │  │  (Club    │  │  │  (Attendance │  │  20+ Utils    │
│           │  │   Admin)  │  │   Admins) │  │  │   System)    │  │               │
└───────────┘  └───────────┘  └───────────┘  │  └──────────────┘  └───────────────┘
                                             │
                                ┌────────────┴────────────┐
                           ┌────┴────┐             ┌──────┴──────┐
                           │ Nexsus  │             │  Haazir     │
                           │ Mobile  │             │  Mobile     │
                           │ (Expo)  │             │  (Expo)     │
                           └─────────┘             └─────────────┘`,

    howItWorks: [
      { step: 'One identity, five portals', detail: 'Main client for students, Admin portal for super admins, Society portal for club committees, Haazir portal for attendance, and an independently deployed tools site. All authenticate against the same JWT + RBAC layer.' },
      { step: 'RAG over the college itself', detail: 'Playwright scrapes the college portal and public sources; content is embedded into pgvector. Five specialised bots — Super Bot, PYQ Expert, Career Guide, Wellness Bot, Code Assistant — query that store through LangChain and LangGraph, with LangFuse for observability and multi-provider key rotation across Gemini, Groq, OpenAI and Anthropic.' },
      { step: 'Attendance that resists proxies', detail: 'Haazir runs three verification modes — QR only, face only, or both — with 512-dimensional face embeddings, OTP-verified enrolment, and geofencing. A teacher can also upload a single class photo and have the system mark the register by face matching.' },
      { step: 'Exams and seating', detail: 'Semester-aware exam scheduling with a visual seating planner that places students bench by bench, enforces strict branch separation on adjacent and neighbouring benches, and filters out fee-defaulting roll numbers during generation.' },
      { step: 'Everything else students actually asked for', detail: 'OCR-extracted PYQ archive via Tesseract, Malviya Market peer-to-peer marketplace with admin verification, virtual labs, lost & found, hostel and mess management, and a hackathon aggregator scraping Devpost, Unstop, HackEarth and Hack2Skill.' },
    ],

    challenges: [
      {
        challenge: 'Seventy models in one schema is where data integrity goes to die. Attendance, exams, societies, marketplace and academics all reference students, but each needs different guarantees.',
        solution: 'I kept a single Prisma schema as the source of truth rather than splitting into services, and pushed correctness into the database — foreign keys, unique constraints and enums instead of application-level checks. Zod validates at the boundary so bad shapes never reach the ORM.',
      },
      {
        challenge: 'A campus chatbot that invents facts about the college is worse than no chatbot.',
        solution: 'Nothing is answered from the model’s own weights. Every response is retrieval-grounded against the pgvector index built from scraped college content, and LangFuse traces let me see exactly which chunks produced which answer when something looks wrong.',
      },
      {
        challenge: 'Exam seating has a hard combinatorial constraint — no two students of the same branch adjacent or on neighbouring benches — and a naive filler deadlocks on dense rooms.',
        solution: 'The planner treats blocked benches as first-class and deliberately leaves constrained seats vacant rather than failing, so a valid plan always exists even when the room cannot be filled completely.',
      },
    ],

    results: [
      { metric: '41', label: 'Courses on the live CSE timetable' },
      { metric: '31', label: 'Faculty allocated, conflict-free' },
      { metric: '1,955', label: 'Weekly contact hours balanced (L 1,009 · T 206 · P 740)' },
      { metric: '33k', label: 'Page views in the last month' },
      { metric: '5 + 2', label: 'Web portals and native Android apps' },
      { metric: '70+', label: 'Prisma models, 2,240-line schema' },
      { metric: '5', label: 'RAG-backed AI assistants' },
      { metric: '20+', label: 'Student utilities, independently deployed' },
      { metric: '37', label: 'People on the team I lead' },
    ],

    learnings: `Consolidation is a political problem before it is a technical one. The hard part was
never the schema — it was getting societies, faculty and the administration to agree to route
through one system. Registering Nexsus as an official university society in April 2026 was what
made adoption possible; the code had been ready months earlier.`,

    nextSteps: [
      'iOS builds for both Expo apps',
      'Open the platform to other universities as a multi-tenant deployment',
    ],
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'nexsus-counselling',
    title: 'Nexsus Counselling Support',
    blurb: 'Admission counselling for UP state engineering aspirants. 900 students used it, 450 took mentorship, 200+ got into MMMUT.',
    year: '2026',
    role: 'Built and ran it under Nexsus',
    category: 'Platform',
    featured: false,
    status: 'Live',
    award: '200+ students placed into MMMUT',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Prisma'],
    links: { live: 'https://counselling.mmmut.app' },
    embed: { url: 'https://counselling.mmmut.app', height: 620 },
    cover: '/Counselling-Support-1.png',
    gallery: [
      { src: '/Counselling-Support-1.png', caption: 'Counselling platform' },
      { src: '/counselling-support-2.png', caption: 'Guidance and mentorship flow' },
      { src: '/counselling-poster.png', caption: 'Outreach poster' },
    ],

    problem: `Engineering admission counselling in Uttar Pradesh is opaque in a way that costs
students real outcomes. Choice-filling is a high-stakes, time-boxed decision made mostly on rumour:
which branch, which college, in what order, against a cutoff nobody publishes clearly. Students with
a well-connected senior get good advice. Everybody else guesses, and a bad list means a worse seat
than their rank actually earned them.

The information exists. It is simply held by people who have already been through it, and there was
no structured way for those two groups to find each other.`,

    approach: `I built the platform and Nexsus supplied the thing that actually made it work — the
seniors. The site carries the information layer: college and branch guidance, the mechanics of the
counselling rounds, and what a given rank realistically converts to. Behind it, a mentorship
pipeline connects an aspirant to a current student who has already made the same decision.

The design principle was that the content had to be useful on its own, without signing up. Anyone
could read the guidance; mentorship was the deeper tier for those who wanted a person rather than a
page. That is why the funnel holds up — of 900 students who came through, half went on to take
one-to-one mentorship, which is an unusually high conversion for something free and optional.`,

    howItWorks: [
      { step: 'Open information layer', detail: 'Branch and college guidance, counselling round mechanics, and rank-to-seat expectations — readable without an account, because a login wall on admission advice defeats the point.' },
      { step: 'Mentorship matching', detail: 'Aspirants are connected to current MMMUT students who went through the same counselling process, so the advice comes from someone one or two years ahead rather than from a coaching brochure.' },
      { step: 'Run during the counselling window', detail: 'The platform is time-sensitive by nature — traffic concentrates entirely into the weeks when choice-filling is actually open, which shaped everything about how it was built and promoted.' },
    ],

    challenges: [
      {
        challenge: 'All the traffic arrives in a narrow window. There is no ramp — the counselling rounds open and the load appears at once, and a slow page during choice-filling is a page nobody comes back to.',
        solution: 'Content-first architecture: the guidance layer is largely static and cacheable, so the expensive, personalised parts are the only things that touch the database. The heavy read traffic never became a scaling problem because most of it never reached the app server.',
      },
      {
        challenge: 'Mentorship only works if mentors actually respond. A matching system that produces silence is worse than no matching system.',
        solution: 'Mentors were drawn from the Nexsus team and the wider student body I already had a relationship with as society president, so there was real accountability behind a match rather than an anonymous volunteer list.',
      },
    ],

    results: [
      { metric: '25k+', label: 'Page views' },
      { metric: '900', label: 'Students who used the platform' },
      { metric: '450', label: 'Took one-to-one mentorship — 50% conversion' },
      { metric: '200+', label: 'Secured admission into MMMUT' },
    ],

    learnings: `This is the project with the clearest human outcome attached to it, and it is worth
being precise about the causal claim: 200+ students who used this platform got into MMMUT. The
platform did not get them their ranks. What it changed was whether a given rank turned into the
best seat it could have. That is a narrower claim than "we placed 200 students", and it is the
honest one.`,
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'cognito-learning-hub',
    title: 'Cognito Learning Hub',
    blurb: 'A twelve-service AI learning platform with live multiplayer quizzes — national winner at IIT Bombay Techfest ’25.',
    year: '2025',
    role: 'Team — OPTIMISTIC MUTANT CODERS',
    category: 'Platform',
    featured: true,
    status: 'Live',
    award: 'National Winner · IIT Bombay Techfest ’25',
    tech: ['React', 'Node.js', 'Express', 'MongoDB Atlas', 'Redis', 'Socket.IO', 'Bull', 'MediaSoup', 'WebRTC', 'Google Gemini', 'Vite', 'Tailwind CSS'],
    links: {
      live: 'https://cognito-learning-hub.vercel.app',
      api: 'https://cognito-api.onrender.com',
      github: 'https://github.com/amitesh-7/Cognito_Learning_Hub',
    },
    embed: { url: 'https://cognito-learning-hub.vercel.app', height: 620 },
    cover: '/Cognito-Learning-hub-home.png',
    gallery: [
      { src: '/Cognito-Learning-hub-home.png', caption: 'Landing' },
      { src: '/Cognito-learning-hub-dashboard.jpeg', caption: 'Student dashboard' },
    ],
    architectureImage: '/Architectures/Cognito_Architecture.png',
    videos: [
      { id: 'kM7VeWXM6iA', label: 'Platform walkthrough' },
      { id: 'W8nbupPq7ew', label: 'The Techfest win, as a story' },
    ],

    problem: `Online learning platforms are either content libraries or quiz tools, and almost none
of them are social. The engagement problem is structural: studying alone against static material has
no feedback loop. We wanted to find out whether real-time competition between students — live
sessions, one-versus-one duels, video rooms — could be built on the same infrastructure as ordinary
coursework without the whole thing collapsing under load.`,

    approach: `We went microservices rather than a monolith, which for a hackathon is an unusual and
mostly indefensible choice — except that the workloads genuinely differ. Quiz generation is
CPU-and-API bound, live sessions are socket-bound and stateful, gamification is write-heavy and
eventually consistent, and video is a completely separate transport problem. Splitting them meant
each could scale and fail independently.

Nine services sit behind an Express API gateway that handles routing, rate limiting, CORS and
authentication centrally. MongoDB Atlas and Redis Cloud are shared; Bull queues absorb the work
that does not need to happen inside a request — achievement checks, stats reconciliation.`,

    architecture: `┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│                    Port: 5173 (Vite)                        │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (Express)                     │
│                      Port: 3000                             │
│  • Request routing & proxying                               │
│  • Rate limiting & CORS                                     │
│  • Authentication middleware                                │
└───┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬───────────────┘
    ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼
┌───────┐┌───────┐┌───────┐┌───────┐┌───────┐┌───────┐┌───────┐
│ Auth  ││ Quiz  ││Result ││ Live  ││Meeting││Social ││ Gamif │
│ 3001  ││ 3002  ││ 3003  ││ 3004  ││ 3009  ││ 3006  ││ 3007  │
└───┬───┘└───┬───┘└───┬───┘└───┬───┘└───┬───┘└───┬───┘└───┬───┘
    └────────┴────────┴────────┴────────┴────────┴────────┘
                              │
                   ┌──────────┴──────────┐
              ┌────▼─────┐         ┌────▼─────┐
              │ MongoDB  │         │  Redis   │
              │  Atlas   │         │  Cloud   │
              └──────────┘         └──────────┘`,

    howItWorks: [
      { step: 'Gateway', detail: 'A single Express entry point proxies to nine services, and owns rate limiting, CORS and JWT verification so no downstream service has to.' },
      { step: 'AI quiz generation', detail: 'Google Gemini generates quizzes from a topic or from an uploaded PDF, TXT or DOCX, with configurable difficulty and question count. A separate AI tutor answers questions in context.' },
      { step: 'Live and duel modes', detail: 'Socket.IO drives synchronised multiplayer sessions with live leaderboards, plus one-versus-one duels with quick matchmaking and real-time scoring.' },
      { step: 'Video rooms', detail: 'A MediaSoup SFU handles multi-participant WebRTC video with screen sharing, isolated in its own service so a video failure cannot take down quizzes.' },
      { step: 'Gamification off the request path', detail: 'XP, 50+ levels, 15+ achievements, streaks and quests are computed by Bull workers rather than synchronously, so taking a quiz never blocks on badge logic.' },
    ],

    challenges: [
      {
        challenge: 'Nine services, one hackathon deadline. Cross-service auth and consistent error handling normally eat the entire budget.',
        solution: 'Authentication was centralised at the gateway and never re-implemented downstream — services trust a verified header. A shared package held common utilities so nine codebases did not drift into nine conventions.',
      },
      {
        challenge: 'Live quiz sessions have to stay synchronised across clients with wildly different latency, or the leaderboard becomes a lie.',
        solution: 'Question timing is server-authoritative and broadcast, not client-computed. Clients render a countdown from a server timestamp rather than starting their own timer, so a slow client loses no time it did not actually lose.',
      },
    ],

    results: [
      { metric: 'National Winner', label: 'IIT Bombay Techfest ’25' },
      { metric: '12', label: 'Microservices in the final architecture' },
      { metric: '2–3 months', label: 'Build time before the finals' },
      { metric: '4', label: 'Distinct user roles — student, teacher, moderator, admin' },
    ],

    learnings: `Microservices bought us real isolation and cost us real velocity. I would make the
same call again for the video and live services, and I would keep auth, quiz and result as one
service — they were split for symmetry rather than for any load or failure reason, and every
cross-service call between them was pure overhead.`,
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'gryork',
    title: 'Gryork',
    blurb: 'A bill-discounting marketplace giving infrastructure sub-contractors liquidity on unpaid receivables. The architecture won a ₹2.5 lakh grant.',
    year: '2025 — Present',
    role: 'CTO — architecture from idea to execution',
    category: 'Fintech',
    featured: true,
    status: 'Live',
    award: '₹2.5L grant · DPIIT-registered · IIIT Allahabad incubated',
    tech: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST'],
    links: { live: 'https://www.gryork.com' },
    cover: '/Gryork-v4.png',
    architectureImage: '/Architectures/Gryork-Architecture.png',
    clips: [
      {
        src: '/Gryork-Admin-Dashboard.mp4',
        poster: '/Gryork-Admin-Dashboard.jpg',
        label: 'Admin dashboard — walkthrough',
      },
    ],
    gallery: [
      { src: '/Gryork-Admin-Dashboard.jpg', caption: 'Admin dashboard' },
      { src: '/Gryork-admin-company.jpg', caption: 'Company management' },
      { src: '/Gryork-admin-users.jpg', caption: 'User and role management' },
      { src: '/Gryork-admin-audit.jpg', caption: 'Audit trail' },
      { src: '/Gryork-v4.png', caption: 'Public platform — current' },
      { src: '/Gryork-v3.png', caption: 'Earlier iteration' },
      { src: '/Gryork-v2.png', caption: 'Earlier iteration' },
      { src: '/gryork-v1.png', caption: 'First version' },
    ],

    problem: `Sub-contractors in Indian infrastructure do the work, raise the bill, and then wait —
often ninety days or more — for the EPC above them to pay. Meanwhile payroll and materials for the
next site are due now. The money exists and the receivable is real; it is simply illiquid. NBFCs
would lend against these receivables, but they cannot cheaply verify that a given bill is genuine,
approved, and not already financed elsewhere.`,

    approach: `The platform is a three-sided marketplace, and the entire design problem is trust
between parties who do not trust each other. A sub-contractor submits bills and requests working
capital; the EPC above them validates that the sub-contractor and the work are real; an internal
risk team assesses; NBFCs then bid to fund. Each transition is a state change with a named actor,
because in lending the audit trail is the product.

I designed the whole thing — the marketplace flows, the role model, the internal ops and risk
tooling, and GryLink, the sales-side surface for onboarding EPCs. It went from an idea to a
demonstrable architecture, and that architecture is what won the ₹2.5 lakh grant from IIIT
Allahabad.`,

    architecture: `┌─────────────────────────────────────────────────────────────────────────┐
│                           GRYORK ECOSYSTEM                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐    GryLink     ┌─────────────┐                        │
│   │    Sales    │ ─────────────► │     EPC     │                        │
│   │    Team     │                │   (Buyer)   │                        │
│   └─────────────┘                └──────┬──────┘                        │
│                                         │ Validates                     │
│   ┌─────────────┐                ┌──────▼───────┐                       │
│   │     Ops     │ ◄───────────── │Sub-Contractor│                       │
│   │    Team     │   Verifies     │   (Seller)   │                       │
│   └─────────────┘                └──────┬───────┘                       │
│                                         │ Submits Bills                 │
│   ┌─────────────┐                ┌──────▼──────┐                        │
│   │     RMT     │ ─────────────► │     CWC     │                        │
│   │    Team     │   Assesses     │   Request   │                        │
│   └─────────────┘                └──────┬──────┘                        │
│                                         │ Bids / Funds                  │
│                                  ┌──────▼──────┐                        │
│                                  │    NBFC     │                        │
│                                  │  (Funder)   │                        │
│                                  └─────────────┘                        │
└─────────────────────────────────────────────────────────────────────────┘`,

    howItWorks: [
      { step: 'Onboarding via GryLink', detail: 'The sales team brings EPCs onto the platform through a dedicated surface, because the EPC is the trust anchor — nothing below them can be verified without them.' },
      { step: 'Bill submission', detail: 'Sub-contractors submit receivables and raise a working-capital request against them.' },
      { step: 'Two-stage verification', detail: 'The EPC validates the sub-contractor and the work; the internal ops team independently verifies the documentation. Neither alone is sufficient.' },
      { step: 'Risk assessment', detail: 'The risk management team scores the request before it is exposed to funders.' },
      { step: 'Funding', detail: 'NBFCs see assessed requests and bid to fund them.' },
    ],

    results: [
      { metric: '₹2.5 Lakh', label: 'Grant from IIIT Allahabad, awarded on the architecture' },
      { metric: 'DPIIT', label: 'Registered startup, GSTIN-holding' },
      { metric: '9–10', label: 'Engineers on the team I lead' },
    ],

    learnings: `In lending, the schema is the risk policy. Every field I made nullable early on
became a place where an unverified bill could slip through, and every state I allowed to be set
without an actor became a gap in the audit trail. I now design the state machine and the actor
model before anything else.`,
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'washtro',
    title: 'Washtro',
    blurb: 'Garment-level chain of custody for a laundry chain — every individual item tracked, timestamped and provable.',
    year: '2026 — Present',
    role: 'CTO — complete technical architecture',
    category: 'Platform',
    featured: true,
    status: 'Live',
    tech: ['NestJS', 'TypeScript', 'Prisma', 'PostgreSQL', 'Redis', 'Next.js', 'PWA', 'IndexedDB', 'Turborepo', 'pnpm', 'Razorpay'],
    links: { live: 'https://www.washtro.com' },
    cover: '/Washtro-home.png',
    gallery: [
      { src: '/Washtro-home.png', caption: 'Customer home' },
      { src: '/Washtro-login.png', caption: 'Authentication' },
      { src: '/Washtro-delivery-agent.png', caption: 'Delivery agent PWA' },
      { src: '/Washtro-owner-wc.png', caption: 'Washing centre owner view' },
      { src: '/washtro-ops.png', caption: 'Ops pipeline' },
      { src: '/Washtro-admin.png', caption: 'Admin dashboard' },
    ],

    problem: `Quick-laundry competitors track the order. Washtro tracks the garment. That distinction
sounds academic until a customer says a shirt came back stained, or never came back at all — and
the only record anyone has is that an order of eleven items was collected and eleven items were
returned. Custody disputes, stain billing and delivery-window promises are all unprovable at order
granularity. They become provable at garment granularity.`,

    approach: `Every garment gets a unique, HMAC-signed "Washtro ID" on a QR tag and walks a single
no-skip status pipeline. Every transition in that pipeline goes through one guarded applyEvent()
function, and every call appends an immutable record carrying the actor, their role, and the
timestamp. There are no status writes anywhere else in the codebase. That single constraint is what
makes custody, billing and delivery windows provable instead of guessed.

The rest of the design follows from field reality. Delivery agents lose signal, so the agent surface
is an offline-first PWA with a durable IndexedDB outbox; every field action carries a
client-generated UUIDv7 and a database unique constraint makes replays idempotent no-ops. Money is
integer paise throughout — no float ever touches a rupee.`,

    architecture: `Order Placed → Picked Up → At Center (Queued) → Stain Check → In Wash →
Ironing → Scanned & Billed → Packed → Hold / Staged → Loaded →
Out for Delivery → Delivered

        every arrow passes through applyEvent()
        every arrow appends { actorId, actorRole, timestamp, from → to }
        the log is append-only — never updated, never deleted`,

    howItWorks: [
      { step: 'Serviceability gate', detail: 'An order can only be placed against a pincode on the admin allow-list. It fails closed: an unlisted pin shows "coming soon" and routes into a waitlist rather than checkout. An address with no matching row is never treated as "unknown and therefore allowed".' },
      { step: 'Customer surface', detail: 'A two-step order builder, live garment-level tracking, saved addresses with a serviceability check before checkout, COD or Razorpay, and email-OTP-verified signup.' },
      { step: 'Agent surface', detail: 'An installable offline-first PWA for the pickup and delivery custody loop, backed by an IndexedDB outbox that replays idempotently once back online.' },
      { step: 'Washing centre surface', detail: 'Intake and stain-check scanning, plus a post-iron keyboard-wedge scanner flow built for a physical barcode gun rather than a touchscreen.' },
      { step: 'Ops admin', detail: 'Live pipeline and capacity gauges, priority-breach alerts, a live agent map, and garment-level dispute lookup that returns the full custody chain for any Washtro ID.' },
    ],

    challenges: [
      {
        challenge: 'Delivery agents work in basements and stairwells. A dropped request that silently loses a custody event destroys the entire audit guarantee.',
        solution: 'Every field action is written to a durable IndexedDB outbox first and synced second. Each carries a client-generated UUIDv7; a unique constraint in the database turns any replay into a no-op. The agent app is correct whether or not the network is.',
      },
      {
        challenge: 'Capacity checks on the request path are a COUNT(*) waiting to become a table scan under load.',
        solution: 'Capacity is a Redis counter, never a count query. Vehicle loading locks at capacity, and the delivery window is enforced at two independent checkpoints — packing and loading — so a breach cannot slip through a single missed guard.',
      },
      {
        challenge: 'A signed garment ID is useless if the signing secret has to reach the browser to validate it.',
        solution: 'Clients validate only the ID format locally; the HMAC itself is verified server-side and the signing secret never ships to any client.',
      },
    ],

    results: [
      { metric: '12', label: 'No-skip stages in the custody pipeline' },
      { metric: '1', label: 'Function through which every state change passes' },
      { metric: '5', label: 'Distinct app surfaces — customer, agent, centre, admin, marketing' },
      { metric: '0', label: 'Floats anywhere near money' },
    ],

    learnings: `Writing the invariants down as a numbered list before writing the code was the single
highest-leverage thing I did on this project. Ten sentences that are never violated turned out to
constrain the design more usefully than any amount of upfront schema work.`,
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'washing-bro',
    title: 'Washing Bro',
    blurb: 'Laundry-as-a-service for the MMMUT campus — four web surfaces, a Flutter app, subscriptions and a referral wallet.',
    year: '2026',
    role: 'Solo — my own product',
    category: 'Platform',
    featured: false,
    status: 'Live',
    tech: ['Express', 'TypeScript', 'Prisma', 'PostgreSQL', 'Supabase', 'React', 'Vite', 'Tailwind CSS', 'Zustand', 'Flutter', 'Riverpod', 'Razorpay', 'OneSignal', 'Turborepo', 'pnpm'],
    links: {},
    cover: '/WashingBro-home.png',
    gallery: [
      { src: '/WashingBro-home.png', caption: 'Customer home' },
      { src: '/WashingBro-login.png', caption: 'Authentication' },
    ],

    problem: `Hostel laundry at MMMUT runs on WhatsApp messages, paper slips and
memory. You hand over a bag, you get told a day, and there is no record of what
went in, what it costs, or where it is. For a few thousand students that is not a
minor annoyance — it is a service everybody uses weekly with no system behind it.`,

    approach: `Built as a proper multi-tenant operation rather than an order form.
Four separate web apps — customer, admin, delivery agent, washing centre — plus a
Flutter mobile app, all over one Express + Prisma API in a pnpm/Turborepo
monorepo with shared types, UI and pricing utilities.

Two decisions do the real work. First, subscriptions rather than per-order
billing: students think in semesters, so the plans do too — BASIC through ANNUAL,
with a trial. Second, WashCash, a wallet with a FIFO ledger that makes referral
credits actually spendable and correctly ordered, so the oldest credit is
consumed first and the balance is always defensible.`,

    howItWorks: [
      { step: 'Order and pickup', detail: 'Students schedule a pickup, select garments and place the order from web or the Flutter app.' },
      { step: 'Subscription plans', detail: 'BASIC, MONTHLY, QUARTERLY, SEMESTER, ANNUAL and TRIAL variants — priced around the academic calendar rather than the billing month.' },
      { step: 'WashCash wallet', detail: 'Referral rewards and credits held in a FIFO ledger, so credits are consumed oldest-first and the balance can always be reconstructed from the entries.' },
      { step: 'Custody and tracking', detail: 'QR and barcode bag-tag scanning for lookup, live GPS tracking of the delivery agent on an OpenStreetMap/Leaflet map, and OneSignal push on every status change.' },
      { step: 'Four operator surfaces', detail: 'Customer, admin, delivery agent and washing centre each get their own app against the same API, because their jobs share almost no screens.' },
    ],

    challenges: [
      {
        challenge: 'A wallet that mixes referral credits, promotional credit and real money becomes unauditable the moment someone disputes a balance.',
        solution: 'WashCash is a FIFO ledger, not a running integer. Every credit is an entry with an origin and an order of consumption, so any balance can be rebuilt from history and a disputed charge traced to the exact credits it consumed.',
      },
      {
        challenge: 'Every third-party integration — payments, SMS, email, push — is a place where local development stops working because a key is missing.',
        solution: 'Razorpay, MSG91, Resend and OneSignal are all optional. Without keys the app logs to console and mock-checkouts instead of failing, so the whole stack runs end to end on a laptop with nothing but a database URL.',
      },
    ],

    results: [
      { metric: '4 + 1', label: 'Web apps plus a Flutter mobile app' },
      { metric: '6', label: 'Subscription tiers, priced to the academic year' },
      { metric: 'FIFO', label: 'Wallet ledger — every balance reconstructible' },
      { metric: '0 errors', label: 'Enforced typecheck and flutter analyze gate' },
    ],

    learnings: `Making every integration optional was the decision that kept this
project moving. Being able to run the entire stack — four web apps, an API and a
Flutter client — with no third-party keys at all meant development never blocked
on somebody else's dashboard.`,
  },

  {
    slug: 'vigilant-bhai',
    title: 'Vigilant-Bhai',
    blurb: 'Fraud detection that does not stop at "is this a scam" — it traces where the scam started and predicts where it spreads next.',
    year: '2026',
    role: 'Solo build',
    category: 'AI / ML',
    featured: false,
    status: 'Complete',
    award: 'Finalist · Techkriti Innovation Challenge ’26, IIT Kanpur',
    tech: ['Python', 'FastAPI', 'PyTorch', 'HuggingFace', 'DistilBERT', 'XLM-RoBERTa', 'NetworkX', 'Node.js', 'Express', 'MongoDB', 'Redis', 'React', 'Vis.js'],
    links: { github: 'https://github.com/priyanshu-1006/Vigilant-Bhai' },
    architectureImage: '/Architectures/Vigilant-bhai-architecture.png',
    cover: '/Vigilant-bhai-1.png',
    gallery: [
      { src: '/Vigilant-bhai-1.png', caption: 'Message analysis and risk scoring' },
      { src: '/Vigilant-bhai-2.png', caption: 'Propagation network' },
    ],

    problem: `Every spam filter answers one question: is this message fraud? That is the least useful
question you can ask about a scam that is already circulating. By the time a filter flags a message,
it has been forwarded through hundreds of groups, and blocking one copy does nothing about the
source or the next hundred copies.

The questions nobody was answering: where did this start, how is it moving, and where will it
surface next.`,

    approach: `I built it as three detection layers plus a graph engine, because a scam is both a
piece of text and a network event.

The text layer fine-tunes a transformer for scam classification. The URL layer scores links
independently on multiple signals — domain similarity to known brands via Levenshtein distance,
domain age through WHOIS, SSL validity, blacklist membership. A weighted scoring engine combines
them into one risk level rather than reporting two disconnected numbers.

The differentiator is the graph engine. Forwarding events become edges in a NetworkX graph, and
standard network analysis then answers the questions a classifier cannot: betweenness centrality
identifies likely source nodes, PageRank ranks influence, Louvain community detection finds campaign
clusters, and propagation statistics give reach, speed and depth.

Multilingual matters in the Indian context, so the classifier moved from DistilBERT to XLM-RoBERTa
with Hindi and Hinglish scam examples and transliteration handling.`,

    architecture: `                    ┌──────────────────────────────┐
                    │   React Dashboard (Vite)     │
                    │  Analyze · Graph · Trends    │
                    └───────────────┬──────────────┘
                                    │ REST
                    ┌───────────────┴──────────────┐
                    │  Node + Express API          │
                    │  proxy · persist · aggregate │
                    └───────────────┬──────────────┘
                                    │
                    ┌───────────────┴──────────────┐
                    │   Python AI Engine (FastAPI) │
                    │                              │
                    │  ┌────────────┐  ┌─────────┐ │
                    │  │ NLP Model  │  │   URL   │ │
                    │  │ XLM-RoBERTa│  │ Analyzer│ │
                    │  └─────┬──────┘  └────┬────┘ │
                    │        └──────┬───────┘      │
                    │        ┌──────▼───────┐      │
                    │        │   Scoring    │      │
                    │        │   Engine     │      │
                    │        └──────────────┘      │
                    │  ┌─────────────────────────┐ │
                    │  │  Graph Engine (NetworkX)│ │
                    │  │  source · spread · pred │ │
                    │  └─────────────────────────┘ │
                    └──────────────────────────────┘

  Final risk = 0.55 × TextScore + 0.35 × URLScore + 0.10 × MetadataScore
             → CRITICAL / HIGH / MEDIUM / LOW / SAFE`,

    howItWorks: [
      { step: 'Text classification', detail: 'A fine-tuned transformer classifies the message and returns fraud probability, category and confidence. Preprocessing handles Unicode normalisation, URL and phone extraction, and language detection before tokenisation.' },
      { step: 'URL analysis', detail: 'Links are scored separately on domain similarity to known brands, WHOIS domain age, SSL certificate validity and blacklist membership — signals a text model cannot see.' },
      { step: 'Weighted scoring', detail: 'Text, URL and metadata scores combine into a single weighted risk level, so the output is one decision rather than three numbers a user has to reconcile.' },
      { step: 'Source identification', detail: 'Betweenness centrality over the forwarding graph identifies which nodes are acting as origins rather than just relays.' },
      { step: 'Spread analysis and prediction', detail: 'PageRank ranks influence, Louvain community detection separates concurrent campaigns, and propagation statistics quantify reach, speed and depth to project where a campaign moves next.' },
    ],

    challenges: [
      {
        challenge: 'Indian scam messages are rarely clean English. They are Hindi, Hinglish, and transliterated Devanagari, often in the same sentence — which is exactly where an English-trained classifier falls apart.',
        solution: 'Swapped DistilBERT for XLM-RoBERTa, added Hindi scam examples to the training set, and handled Hinglish transliteration explicitly rather than hoping the tokeniser would cope.',
      },
      {
        challenge: 'Real forwarding graphs are not obtainable — the platforms that hold that data do not share it.',
        solution: 'I built a realistic simulated propagation network of roughly 500 nodes and 2,000 edges with multiple concurrent campaigns and known source nodes, which let me validate that the graph algorithms actually recover the sources I planted.',
      },
    ],

    results: [
      { metric: 'Finalist', label: 'Techkriti Innovation Challenge ’26, IIT Kanpur' },
      { metric: '5', label: 'Questions answered — fraud, link, source, spread, prediction' },
      { metric: '3', label: 'Detection layers combined into one risk score' },
      { metric: 'Solo', label: 'Built end to end by one person' },
    ],

    learnings: `The graph engine is what made this project worth doing, and it is also the part I
could only validate against synthetic data. I would rather have had a small amount of real
forwarding data than a large simulated network — the algorithms provably recover sources I planted
myself, which is a weaker claim than it looks.`,
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'haazir',
    title: 'Haazir',
    blurb: 'Attendance that survives contact with students — cryptographic QR, ArcFace biometrics and geo-fencing — plus the CSP solver that now timetables an entire department.',
    year: '2025 — 2026',
    role: 'Backend & AI — team project',
    category: 'AI Systems',
    featured: true,
    status: 'Live',
    award: 'Finalist · Hackatron ’25, IIIT Gwalior',
    tech: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Supabase', 'ArcFace', 'RetinaFace', 'ResNet-50', 'React Native', 'Expo'],
    links: {
      live: 'https://haazir-six.vercel.app',
      github: 'https://github.com/priyanshu-1006/Haazir-Smart-Attendence-Management-System',
    },
    embed: { url: 'https://haazir-six.vercel.app', height: 620 },
    cover: '/haazir.png',
    gallery: [
      { src: '/haazir.png', caption: 'Attendance dashboard' },
      { src: '/Nexsus-haazir.png', caption: 'Haazir portal inside Nexsus' },
    ],

    problem: `Two problems that look unrelated and are not. Manual attendance is slow and trivially
gamed — one student scans for six friends. And building a conflict-free timetable by hand takes a
department weeks, because every fix creates a new clash somewhere else. Both are constraint problems
disguised as administrative ones.`,

    approach: `For attendance, no single signal is trustworthy, so we require three. The teacher
generates a time-bound QR valid for ninety seconds; the student scans it, then passes live facial
recognition against embeddings they enrolled earlier; then GPS confirms they are physically near the
room. Defeating one is easy, defeating all three at once is not worth the effort. Raw face images
are never stored — only 512-dimensional ArcFace embeddings.

For timetabling, I modelled the whole thing as a Constraint Satisfaction Problem. Hard constraints
must hold — no teacher, room or section double-booked, capacity respected. Soft constraints are
scored rather than enforced: minimise teacher idle gaps, balance daily load, keep multi-hour labs
consecutive, protect the lunch break. The solver produces three to five valid timetables and scores
each, so a coordinator chooses between real options instead of accepting the only one that fit.`,

    architecture: `Student Attendance Flow
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  1. Scan QR     │──▶ │  2. Face Verify │──▶ │  3. Geo-fence   │
│  signed, rotates│    │  RetinaFace →   │    │  Haversine      │
│  90s lifetime   │    │  ArcFace 512-D  │    │  100 m radius   │
│                 │    │  cos ≥ 0.50     │    │  per session    │
└─────────────────┘    └─────────────────┘    └─────────────────┘

Timetable Generation
   constraints ──▶ CSP solver ──▶ 3–5 solutions ──▶ scored ──▶ deploy
                   backtracking      hard: must hold
                   + heuristics      soft: optimised`,

    howItWorks: [
      { step: 'Enrolment', detail: 'A student captures at least three face samples from different angles. The system validates quality and stores only the descriptor vectors.' },
      { step: 'Session', detail: 'A teacher starts a session; a QR code is generated with a ninety-second lifetime, which prevents the code being shared onward in any useful way.' },
      { step: 'Triple verification', detail: 'Scan, then face match at 416px detection resolution, then GPS distance validation — roughly 300ms for detection end to end.' },
      { step: 'Fallbacks that respect reality', detail: 'Manual roll-call and bulk photo attendance, where a teacher uploads one class photo and the system matches every face in it, both exist because the smart path will sometimes fail.' },
      { step: 'Timetable solving', detail: 'The CSP solver backtracks with heuristic variable ordering over hard constraints, then scores candidate solutions against soft constraints and presents the best few.' },
    ],

    challenges: [
      {
        challenge: 'Face recognition in a lecture hall is a lighting problem more than a model problem — backlit windows destroy accuracy.',
        solution: 'Multi-angle enrolment with a minimum of three samples, quality validation at capture time, and a tuned 416px detection resolution that traded a little speed for a meaningful accuracy gain in poor light.',
      },
      {
        challenge: 'A ninety-second window is tight for a class of sixty, but lengthening it re-opens the code-sharing hole it was closing.',
        solution: 'We kept the window short and made the failure path cheap instead — manual and photo-based marking cover anyone who misses it, so the strict path never has to be relaxed.',
      },
      {
        challenge: 'A CSP over a full department can take a very long time to prove there is no solution.',
        solution: 'Heuristic variable ordering — most-constrained-first — plus early constraint checking during backtracking brought realistic generation down to roughly ten to thirty seconds, and the solver returns partial best-effort results rather than hanging.',
      },
    ],

    results: [
      { metric: '512-D', label: 'ArcFace embedding per enrolled face' },
      { metric: '0.50', label: 'Cosine similarity threshold for a match' },
      { metric: '100 m', label: 'Haversine geo-fence radius, per session' },
      { metric: '41', label: 'Courses timetabled across B.Tech, M.Tech and M.Sc' },
    ],

    learnings: `Building the "dumb" fallbacks first would have been the right order. We built the
smart path first and the manual path last, which meant every early demo was one bad camera away from
failure. A system that replaces a manual process needs the manual process available from day one.`,
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'fracturevision-ai',
    title: 'FractureVision AI',
    blurb: 'Three complementary models for bone fracture diagnosis — 99.01% binary accuracy, plus ten-class detection with explainability.',
    year: '2026',
    role: 'ML engineering',
    category: 'AI / ML',
    featured: true,
    status: 'Complete',
    award: '5th place & Special Mention · Xpecto ’26, IIT Mandi',
    tech: ['PyTorch', 'timm', 'Ultralytics', 'ViT-Base/16', 'YOLOv10n', 'Grad-CAM', 'FastAPI', 'React', 'Tailwind CSS'],
    links: {},
    cover: '/Fracture-Vision-AI.png',
    gallery: [
      { src: '/Fracture-Vision-AI.png', caption: 'Clinical dashboard' },
      { src: '/Fracture-Vision-AI-2.png', caption: 'Prediction with confidence' },
      { src: '/Fracture-Vision-AI-3.png', caption: 'Grad-CAM explainability overlay' },
    ],
    videos: [{ id: 'Lj5IIcqqlZU', label: 'Model and dashboard demo' }],

    problem: `Fractures are among the most common injuries in any emergency department, and roughly
3.5% are missed on the initial read. Interpretation is subjective and time-pressured. But a model
that simply outputs "fractured" with 99% confidence is not usable in a clinical setting — a
radiologist cannot act on a number they cannot interrogate.`,

    approach: `I built three models rather than one, because screening and typing are different
questions. A ViT-Base/16 answers "is there a fracture at all" as binary classification. A YOLOv10n
detector answers "what kind, and where" across ten fracture types. A third variant adds Coordinate
Attention to that detector to test whether direction-aware spatial focus helps on oriented fracture
lines.

Every model ships with explainability attached. Grad-CAM and attention rollout show which region
drove the prediction, which matters most precisely when the model is wrong.`,

    howItWorks: [
      { step: 'Model 1 — ViT-Base/16, binary screening', detail: 'ImageNet-21k pretrained, Focal Loss with label smoothing, AdamW with layer-wise learning-rate decay and cosine annealing, Mixup and CutMix augmentation, AMP FP16. 99.01% accuracy, 0.9990 AUC-ROC on 506 unseen test images.' },
      { step: 'Model 2 — YOLOv10n, ten-class detection', detail: 'The best performer: mAP@0.5 of 0.933, precision 0.969, recall 0.900, at 2.27M parameters and 5.51MB. 18.8ms per image on GPU.' },
      { step: 'Model 3 — YOLOv10n + Coordinate Attention', detail: 'CoordAtt injected at backbone P3/P4/P5 via a gated residual with the gate initialised to zero, so at epoch zero it is byte-identical to the baseline. Adds only 57,984 parameters.' },
      { step: 'Serving', detail: 'FastAPI with JWT auth, role-based access, rate limiting and batch prediction, returning base64 Grad-CAM overlays alongside the clinical JSON payload.' },
      { step: 'Clinical dashboard', detail: 'A React and Tailwind interface with drag-and-drop upload, confidence bars, and a Grad-CAM toggle that overlays the heatmap on the original scan.' },
    ],

    challenges: [
      {
        challenge: 'The ten-class detection dataset is severely imbalanced — 65 Transverse Displaced instances against a single Linear instance in validation, a 65:1 ratio.',
        solution: 'Recall-focused training over a full 200-epoch schedule rather than aggressive resampling. Six of ten classes still reached 0.995 mAP@0.5, no class collapsed to zero, and eight of ten exceeded F1 0.87 — on roughly 1,300 training images and a Kaggle T4 at batch size 6.',
      },
      {
        challenge: 'The attention-enhanced model was the architecturally interesting one, and it lost.',
        solution: 'I reported it as a loss rather than burying it. CoordAtt trailed the plain detector on every primary metric — mAP, precision, recall, F1, macro F1 — because re-initialised attention weights introduced a distribution shift the gated residual could soften but not eliminate. The honest finding is that the simpler model won.',
      },
      {
        challenge: 'At 99.01% accuracy the failure cases are the only interesting ones, and they are easy to hide.',
        solution: 'I documented a specific known false negative and used it as the demonstration. Grad-CAM shows the model fixating on a smooth, healthy joint curve while missing a hairline fracture just adjacent — which is exactly the argument for keeping a human in the loop, made visible.',
      },
    ],

    results: [
      { metric: '99.01%', label: 'ViT binary accuracy — 5 errors in 506 images' },
      { metric: '0.9990', label: 'AUC-ROC, near-perfect class separation' },
      { metric: '0.933', label: 'YOLOv10n mAP@0.5 across ten fracture classes' },
      { metric: '18.8ms', label: 'Detection inference per image on GPU' },
      { metric: '5.51MB', label: 'Detector size — deployable to edge devices' },
    ],

    learnings: `The result I am most glad I kept is the negative one. The Coordinate Attention model
was the novel contribution and it underperformed a plain YOLOv10n; reporting that clearly, with the
comparison table, was more valuable than quietly dropping it. A portfolio of only successful
experiments is not a record of research.`,
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'anand-pumps',
    title: 'Anand Pumps',
    blurb: 'A commercial e-commerce storefront for an ISI-certified water pump manufacturer — catalogue, cart and quote flow.',
    year: '2026',
    role: 'Client build',
    category: 'E-commerce',
    featured: false,
    status: 'Live',
    tech: ['React', 'Tailwind CSS', 'Node.js'],
    links: {},
    cover: '/Anand-Pumps.png',
    gallery: [
      { src: '/Anand-Pumps.png', caption: 'Storefront landing' },
      { src: '/anand-pumps-products.png', caption: 'Catalogue by pump family' },
      { src: '/anand-pumps-product.png', caption: 'Product detail' },
      { src: '/anandpumps-login.png', caption: 'Customer account' },
    ],

    problem: `Kumars Anand manufactures water pumps — submersible, self-priming, centrifugal and
shallow-well pumpsets from 0.033 HP to 5 HP — and sells wholesale and retail across domestic,
agricultural and industrial buyers. The catalogue is genuinely complex: buyers need to match a pump
type and horsepower rating to an application, and a phone call was the only way to do that.`,

    approach: `A storefront built around the way this catalogue is actually shopped. Products are
organised by pump family rather than by a flat SKU list, because a buyer arrives knowing their
application, not a part number.

Two conversion paths run in parallel rather than one, because this business has two kinds of buyer.
Retail customers get a normal cart and checkout. Wholesale and bulk buyers get a "Get Quote" path,
since their price is negotiated, not listed — forcing them through a retail cart would have lost
exactly the highest-value enquiries. Trust signals that matter in this category — ISI certification,
borewell servicing, direct phone contact — sit above the fold rather than buried in an About page.`,

    howItWorks: [
      { step: 'Catalogue by application', detail: 'Products grouped into submersible, self-priming (ASP), centrifugal (ADM) and shallow-well pumpsets, spanning 0.033 HP to 5 HP.' },
      { step: 'Dual conversion paths', detail: 'A standard cart and checkout for retail buyers, and a separate quote-request flow for wholesale and bulk enquiries where pricing is negotiated.' },
      { step: 'Accounts', detail: 'Customer login so repeat and trade buyers keep order history rather than re-entering details every time.' },
      { step: 'Supporting content', detail: 'Gallery, blogs and contact surfaces, plus RO and spare-parts lines alongside the main pump catalogue.' },
    ],

    results: [
      { metric: 'Live', label: 'Shipped for a real manufacturer' },
      { metric: '4', label: 'Pump families in the catalogue' },
      { metric: '2', label: 'Conversion paths — retail cart and wholesale quote' },
    ],

    learnings: `The commercially important decision here was refusing to make wholesale buyers use the
retail cart. It would have been less work to ship one flow, and it would have quietly lost the
largest orders — the buyers who most needed a quote were the ones a checkout button would have
turned away.`,
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'aurorahai',
    title: 'AuroraHai',
    blurb: 'Hyper-local aurora forecasting — space weather telemetry joined to local sky conditions, for photographers.',
    year: '2026',
    role: 'Full stack',
    category: 'Data',
    featured: true,
    status: 'Complete',
    award: 'Built for Orion Astrathon, IIT Mandi',
    tech: ['Python', 'FastAPI', 'Pydantic V2', 'React', 'TypeScript', 'Vite', 'MapLibre GL', 'Zustand', 'Recharts', 'WebSocket'],
    links: {},
    cover: '/Aurora/Dashboard.jpeg',
    architectureImage: '/Architectures/Aurora-Architecture.png',
    videos: [{ id: '5hM1HlytzB8', label: 'Platform demo' }],
    gallery: [
      { src: '/Aurora/Dashboard.jpeg', caption: 'Visibility dashboard' },
      { src: '/Aurora/Aurora-2d-map.jpeg', caption: 'OVATION probability map' },
      { src: '/Aurora/Aurora-Map-3d.jpeg', caption: '3D aurora oval' },
      { src: '/Aurora/Solar-wind.jpeg', caption: 'Solar wind telemetry' },
      { src: '/Aurora/Astrophotography.jpeg', caption: 'Photography advisor' },
    ],

    problem: `Aurora forecasts tell you the planetary Kp index. That is a global number, and it
cannot answer the only question a photographer actually has: can I see aurora from where I am
standing, right now, and what should I do about it? A high Kp is worthless under cloud, under a full
moon, or in a city.`,

    approach: `The insight is that aurora visibility is a join, not a lookup. I combined NOAA's
OVATION aurora probability at the user's exact coordinates with sky darkness — Bortle class, moon
interference, solar terminator — and cloud clarity from Open-Meteo, weighted into a single 0–100
score with every sub-component exposed rather than hidden.

Weights are 50% aurora probability, 30% darkness, 20% sky clarity, and the breakdown is always
visible so a user can see whether a low score is the sun's fault or the sky's.`,

    architecture: `┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│  Dashboard │ Aurora Map │ Solar Wind │ Photography │ Community│
└─────────────────────────┬───────────────────────────────────┘
                          │  REST + WebSocket
┌─────────────────────────┴───────────────────────────────────┐
│                   Backend (FastAPI)                         │
│  /api/solar-wind  /api/aurora  /api/visibility  /api/weather│
│  /api/alerts      /api/sightings          /ws/live          │
└────────┬────────────────┬───────────────────────────────────┘
┌────────┴────────┐ ┌─────┴──────────────────────────────────┐
│   AI Engine     │ │       Data Pipeline                    │
│  Visibility     │ │  NOAA Solar Wind (1 min)               │
│  Substorm       │ │  NOAA OVATION   (30 min)               │
│  Classifier     │ │  NOAA Kp Index  (3 hr)                 │
│  Route Opt.     │ │  Open-Meteo     (15 min cache)         │
│  Photo Advisor  │ │  Light Pollution (heuristic)           │
└─────────────────┘ └────────────────────────────────────────┘`,

    howItWorks: [
      { step: 'Four concurrent polling loops', detail: 'Solar wind every minute, OVATION every thirty, Kp every three hours, weather on demand with a fifteen-minute cache — with DSCOVR to ACE failover, schema validation, gap detection and exponential backoff.' },
      { step: 'Visibility score', detail: 'Aurora probability interpolated to the user’s coordinates, combined with a darkness composite and an effective cloud figure weighted across low, mid and high cloud layers.' },
      { step: 'Substorm early warning', detail: 'Monitors the rate of change of Bz to detect substorm onset five to fifteen minutes before peak — the difference between catching it and reading about it.' },
      { step: 'Route optimiser', detail: 'Searches concentric rings from 10 to 200km for the five best nearby spots that are simultaneously dark, clear and aurora-active.' },
      { step: 'Photography advisor', detail: 'Recommends ISO, aperture and shutter speed from the current aurora intensity classification.' },
    ],

    results: [
      { metric: '21', label: 'REST endpoints plus a live WebSocket stream' },
      { metric: '5', label: 'Live data sources with automatic failover' },
      { metric: '360×181', label: 'OVATION probability grid interpolated per query' },
    ],

    learnings: `Every external data source will change its schema or go down, usually during a demo.
Building failover, schema-change detection and gap detection into the collectors from the start was
what let the live dashboard keep working when DSCOVR dropped out.`,
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'pathfinder-ai',
    title: 'PathFinder AI',
    blurb: 'A career and skills advisor that turns a student profile into a concrete, trackable learning roadmap for the Indian job market.',
    year: '2025',
    role: 'Full stack',
    category: 'AI Systems',
    featured: false,
    status: 'Complete',
    tech: ['React', 'Vite', 'Material UI', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'Google Gemini'],
    links: {},
    cover: '/pathfinder.png',
    gallery: [{ src: '/pathfinder.png', caption: 'Roadmap view' }],
    videos: [{ id: '-HzUL_A39l4', label: 'Walkthrough' }],

    problem: `Career advice given to Indian engineering students is either uselessly generic — "learn
DSA, do projects" — or written for a job market that is not theirs, with salary bands and company
names from somewhere else entirely. And even good advice usually stops at the recommendation. It
tells you to become a data engineer without telling you what the next twelve weeks look like.`,

    approach: `The output is a roadmap, not a recommendation. A multi-step profile wizard captures
interests, existing skills, aptitudes and education, and a carefully engineered Gemini prompt turns
that into structured JSON — career paths with salary ranges, relevant companies and, critically, an
ordered sequence of learning steps.

Two constraints shaped the prompt. It is anchored explicitly to the Indian job market, so the
companies and salary bands mean something to the person reading them. And it must return structured
JSON rather than prose, because the steps have to become trackable objects the student ticks off,
not a paragraph they read once and close.`,

    howItWorks: [
      { step: 'Profile capture', detail: 'A multi-step wizard collects interests, current skills, aptitudes and education rather than asking for everything on one intimidating form.' },
      { step: 'AI recommendation', detail: 'The profile is sent to Gemini through a structured prompt that returns career paths as JSON — each with salary range, relevant Indian companies and an ordered learning sequence.' },
      { step: 'Roadmap exploration', detail: 'Each career expands into a timeline-based view of learning steps, presented as an accordion so a long roadmap stays navigable.' },
      { step: 'Progress tracking', detail: 'Steps are marked complete as the student works through them, so the roadmap is a living document rather than a one-time output.' },
    ],

    challenges: [
      {
        challenge: 'An LLM asked for career advice returns beautifully written prose, which is exactly the wrong format — you cannot track progress against a paragraph.',
        solution: 'The prompt is engineered to return structured JSON with a fixed schema, so every learning step arrives as a discrete object the app can render as a checkbox and persist against the user.',
      },
    ],

    results: [
      { metric: 'Structured', label: 'JSON output — steps are trackable objects, not prose' },
      { metric: 'India-first', label: 'Salary bands and companies anchored to the local market' },
    ],

    learnings: `Prompt engineering here was really schema design. Once I stopped asking the model for
advice and started asking it to fill a structure, the whole product became buildable — the model's
job shrank to populating fields, and everything downstream could rely on the shape.`,
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'nexsus-assist',
    title: 'Nexsus Assist',
    blurb: 'Fifty-five file and developer utilities behind a chat interface that routes your request to the right one.',
    year: '2025',
    role: 'Full stack',
    category: 'AI Systems',
    featured: true,
    status: 'Live',
    tech: ['Next.js 15', 'TypeScript', 'FastAPI', 'Python', 'Groq', 'Claude', 'Tailwind CSS', 'shadcn/ui', 'Docker'],
    links: {},
    cover: '/Nexsus-assist-hero-dark.png',
    gallery: [
      { src: '/Nexsus-assist-hero-dark.png', caption: 'Landing — dark' },
      { src: '/Nexsus-assist-hero-light.png', caption: 'Landing — light' },
      { src: '/Nexsus-assist-workspace.png', caption: 'Workspace' },
      { src: '/Nexsus-assist-tools.png', caption: 'Tool catalogue' },
      { src: '/Nexsus-assist-workflow.png', caption: 'Routing workflow' },
    ],

    problem: `Everyone has a bookmark folder of single-purpose utility sites — one to merge PDFs,
another to convert images, a third to format JSON. Each has a different interface, most are
ad-choked, and you have to know which one you need before you can start looking.`,

    approach: `Invert it: the user describes what they want in plain language and uploads a file, and
an LLM routes the request to one of fifty-five tools. "Merge these two PDFs" resolves to pdf_merge
without the user ever seeing a tool list. The tools themselves are ordinary deterministic Python —
the model only chooses, it never processes.`,

    howItWorks: [
      { step: 'Natural language routing', detail: 'Groq or Claude classifies intent and selects the tool plus its parameters from the request text and the uploaded file type.' },
      { step: 'Deterministic execution', detail: 'The selected tool runs as plain Python. No model touches the file contents, so results are reproducible and a bad completion cannot corrupt output.' },
      { step: 'Fifty-five tools across five families', detail: 'Ten PDF operations, seventeen image operations, eight text tools, three media converters and seventeen developer utilities.' },
      { step: 'Power-user surface', detail: 'Keyboard shortcuts throughout, tool history, favourites, and export/import of preferences.' },
    ],

    results: [
      { metric: '55', label: 'Tools across PDF, image, text, media and dev' },
      { metric: '2', label: 'AI providers for routing — Groq and Claude' },
      { metric: '60/min', label: 'Rate limit, with file-signature validation on upload' },
    ],

    learnings: `Letting the model choose but never execute was the right split. Early on I let it
generate parameters more freely and got silently wrong crops and rotations; constraining it to a
fixed tool signature made failures loud instead of subtle.`,
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'finagent-ai',
    title: 'FinAgent',
    blurb: 'An agent that executes financial tasks by driving a real browser — and stops to ask before it commits anything.',
    year: '2025',
    role: 'Full stack',
    category: 'AI Systems',
    featured: false,
    status: 'Complete',
    award: 'Built for a Google Developer Groups event',
    tech: ['Python', 'FastAPI', 'Playwright', 'React', 'Vite', 'GPT-4o', 'Gemini 1.5 Pro', 'WebSocket'],
    links: {},
    architectureImage: '/Architectures/FinAgent-Architecture.png',
    videos: [{ id: 'TI47hwK8kPU', label: 'Conscious Pause in action' }],

    problem: `An AI agent with access to your bank account is a genuinely bad idea executed
carelessly. But the underlying task — "pay my electricity bill of ₹1,500" — is exactly the kind of
tedious, well-specified work an agent should handle. The question is not whether the agent can do
it. It is what happens in the moment before it does.`,

    approach: `The whole design is built around a mechanism I called Conscious Pause. The agent
parses intent, plans the task and drives the browser through Playwright — but any action classified
as high-risk halts before execution and surfaces a full preview: the exact action, the amount, the
recipient. It requires explicit human approval and auto-cancels on a sixty-second timeout, so the
default outcome of an unattended agent is that nothing happens.

Bill payments, fund transfers, gold purchases and profile updates are all protected. Everything runs
against a purpose-built dummy bank, never a real institution.`,

    architecture: `┌─────────────────────────────────────────────────────────────┐
│                    USER DASHBOARD                           │
│    Command Input  │  Live Preview  │  Approval Interface    │
└─────────┬──────────────────────────────────────┬────────────┘
          ▼                                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    FINAGENT CORE                            │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐     │
│  │   Intent     │──▶│    Task      │──▶│  Conscious   │     │
│  │   Parser     │   │ Orchestrator │   │    Pause     │     │
│  └──────────────┘   └──────┬───────┘   └──────────────┘     │
│                            ▼                                │
│                   ┌──────────────┐                          │
│                   │   Browser    │                          │
│                   │   Control    │                          │
│                   └──────┬───────┘                          │
└──────────────────────────┼──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    DUMMY BANK (React)                       │
│   Login  │  Pay  │  Transfer  │  Gold  │  Profile           │
└─────────────────────────────────────────────────────────────┘`,

    results: [
      { metric: '60s', label: 'Approval timeout — unattended agents do nothing' },
      { metric: '4', label: 'Action classes requiring explicit human approval' },
      { metric: '0', label: 'Real financial institutions touched — sandbox only' },
    ],

    learnings: `Making the safe path the default rather than an option is the entire lesson. An
approval prompt that times out into "approved" is theatre; timing out into "cancelled" is a
guarantee.`,
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'medichain-ai',
    title: 'MediChain AI',
    blurb: 'Federated learning across hospitals with blockchain-verified model provenance — patient data never leaves the building.',
    year: '2026',
    role: 'Architecture & build',
    category: 'AI / ML',
    featured: false,
    status: 'In progress',
    tech: ['PyTorch', 'Flower', 'ResNet-50', 'Solidity', 'Hardhat', 'Polygon', 'IPFS', 'Pinata', 'Next.js', 'Viem', 'FastAPI'],
    links: {},
    architectureImage: '/Architectures/Medichain-AI-architecture.png',

    problem: `Medical imaging models need data from many hospitals to generalise, and no hospital can
legally or ethically hand over raw patient scans. The standard workaround — anonymise and pool —
still moves the data, still creates a breach surface, and still gives the contributing hospital no
way to verify what was done with it.`,

    approach: `Federated learning solves the data movement problem: hospitals train locally and share
only gradients, so raw scans never cross the firewall. But federated learning has a trust problem of
its own — no participant can independently verify which hospitals contributed to which model
version, or that the aggregator behaved honestly.

So the coordination layer is on-chain. Model weights live on IPFS; the content identifier is logged
to a smart contract. Hospitals submit gradient CIDs as blockchain transactions; the aggregator
listens for those events, pulls from IPFS, runs FedAvg, publishes the new global model and updates
the contract. The result is a complete, publicly auditable trail of who contributed to which model
version and when — with an ERC-20 incentive minted per verified contribution.`,

    howItWorks: [
      { step: 'Initialisation', detail: 'A baseline ResNet-50 is stored on IPFS and its CID logged on-chain as the current global model.' },
      { step: 'Local training', detail: 'Hospitals pull the baseline via IPFS and train on private data. Raw scans never leave the hospital firewall.' },
      { step: 'Gradient submission', detail: 'Each hospital extracts gradients, uploads them to IPFS via Pinata, and submits the resulting CID in a blockchain transaction.' },
      { step: 'Aggregation', detail: 'A Flower-based server watches the chain, pulls submitted gradients once quorum is reached, and runs FedAvg to produce a new global model.' },
      { step: 'Provenance and incentive', detail: 'The new model is pinned, the contract updated, and contributing hospitals receive ERC-20 tokens. Role-based access control on-chain means only whitelisted addresses can submit.' },
    ],

    results: [
      { metric: 'Zero', label: 'Raw patient records leaving any hospital' },
      { metric: 'On-chain', label: 'Audit trail of every contribution and model version' },
    ],

    learnings: `Still in progress — the AI and contract layers exist independently and integration is
the current work. The architectural bet is that verifiability, not privacy, is federated learning's
real blocker: privacy is already solved by not moving the data, but trust in the aggregator is not.`,

    nextSteps: [
      'Complete integration between the Flower clients and the on-chain submission step',
      'Build the Next.js dashboard for training rounds and accuracy over time',
    ],
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'gryork-techpreneur',
    title: 'Gryork Techpreneur 2026',
    blurb: 'A four-week industrial programme I built the platform for and taught — 85+ students, at ₹1,200 a seat.',
    year: '2026',
    role: 'Platform build & instruction',
    category: 'Platform',
    featured: false,
    status: 'Delivered',
    tech: ['React', 'Node.js', 'Payment integration'],
    links: { live: 'https://training.gryork.com' },
    gallery: [
      { src: '/TechPreneur/meet-1.png', caption: 'Programme session' },
      { src: '/TechPreneur/meet-2.png', caption: 'Programme session' },
      { src: '/TechPreneur/meet-3.png', caption: 'Programme session' },
      { src: '/TechPreneur/meet-4.png', caption: 'Programme session' },
      { src: '/TechPreneur/meet-5.png', caption: 'Programme session' },
      { src: '/TechPreneur/meet-6.png', caption: 'Programme session' },
      { src: '/TechPreneur/meet-7.png', caption: 'Programme session' },
      { src: '/TechPreneur/meet-8.png', caption: 'Programme session' },
      { src: '/TechPreneur/meet-9.png', caption: 'Programme session' },
      { src: '/TechPreneur/meet-10.png', caption: 'Programme session' },
      { src: '/TechPreneur/meet-11.png', caption: 'Programme session' },
      { src: '/TechPreneur/meet-12.png', caption: 'Programme session' },
      { src: '/TechPreneur/meet-13.png', caption: 'Programme session' },
    ],

    problem: `Third-year B.Tech students are told to learn agentic AI and modern full-stack
development, and are then handed a reading list. There was no structured, paid programme locally
that took them from nothing to shipping with current tooling — and no platform to run one on.`,

    approach: `I built both halves. The registration and delivery platform at training.gryork.com
handled enrolment and payment, and I taught the programme itself over four weeks in May 2026 —
agentic AI, full-stack development, agentic coding, and AI tool workflows.

It ran as a real commercial programme rather than a free workshop, at ₹1,200 per registration, and
became a significant revenue line for Gryork.`,

    results: [
      { metric: '85+', label: 'Third-year B.Tech students taught' },
      { metric: '4 weeks', label: 'Programme duration' },
      { metric: '₹1,200', label: 'Per registration — a real revenue line' },
    ],

    learnings: `Teaching a subject is the fastest way to find the holes in your own understanding of
it. Explaining agentic coding workflows to eighty-five people who will immediately ask why forced a
level of precision that building alone never did.`,
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'gdg-mmmut',
    title: 'GDG on Campus — MMMUT',
    blurb: 'The chapter’s web presence, plus an induction system that processed 250+ applicants end to end.',
    year: '2025',
    role: 'Tech lead & builder',
    category: 'Platform',
    featured: false,
    status: 'Live',
    tech: ['React', 'Node.js', 'Automated email', 'RBAC'],
    links: { live: 'https://gdg.mmmut.app' },
    cover: '/GDG-home.png',
    gallery: [{ src: '/GDG-home.png', caption: 'Chapter site' }],

    problem: `Running an induction drive on Google Forms means a spreadsheet, a manual shortlist,
and someone individually emailing two hundred and fifty people. It does not scale past the first
round, and applicants hear nothing for weeks.`,

    approach: `I built the chapter site and the induction system behind it: registration, a
structured evaluation workflow for reviewers, automated mailing at each stage, and multiple roles so
core team, reviewers and applicants each saw only what they should. Over 250 students went through
it.`,

    results: [
      { metric: '250+', label: 'Students registered through the induction drive' },
      { metric: 'Automated', label: 'Stage-based mailing, no manual sends' },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'mmmut-fdp',
    title: 'MMMUT Faculty Development Programme',
    blurb: 'Pages on the university’s official website — my code running on mmmut.ac.in.',
    year: '2025',
    role: 'Contributor',
    category: 'Web App',
    featured: false,
    status: 'Live',
    tech: ['HTML', 'CSS', 'JavaScript'],
    links: { live: 'https://mmmut.ac.in/primeai' },
    cover: '/FDP-primeai.png',
    gallery: [{ src: '/FDP-primeai.png', caption: 'PrimeAI FDP page on mmmut.ac.in' }],

    problem: `The university needed pages for its Faculty Development Programme on the official
mmmut.ac.in domain — an institutional site with its own constraints, conventions and review process
rather than a greenfield build.`,

    approach: `Built the FDP pages to fit the existing university site rather than imposing a new
design on it. Small in scope, but it is my code on the official domain of the university, which is a
different kind of constraint from anything self-hosted — you inherit the stack you are given.`,

    results: [{ metric: 'mmmut.ac.in', label: 'Live on the official university domain' }],
  },

  // ────────────────────────────────────────────────────────────────
  {
    slug: 'quizwise-ai',
    title: 'QuizWise AI',
    tagline: 'Give the teacher her evenings back',
    blurb: 'An AI quiz platform built for my mother, a school teacher. Point it at a topic or a PDF and it writes the paper. The project where I stopped building screens and started building systems.',
    year: '2025',
    role: 'Solo — design, backend, AI pipeline',
    category: 'AI Platform',
    featured: false,
    status: 'Built',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini', 'Google OAuth'],
    links: {},
    cover: '/quizwise.png',
    gallery: [{ src: '/quizwise.png', caption: 'Generated paper, ready to edit' }],

    problem: `My mother is a school teacher. For as long as I can remember, I watched her spend
her evenings drafting question papers by hand — typing out every question, every option,
every answer key, for every class, every term. The work was skilled at the start and mechanical
for the remaining four hours.

I wanted to give those hours back to her. That was the whole brief.`,

    approach: `I started where every beginner starts: a quiz platform. Teacher logs in, teacher
creates a quiz, students take it, scores come back.

Then I hit the wall that changed how I think about software. To create a quiz, the teacher still
had to type in every question and every option by hand. I had not removed the four hours — I had
moved them into a form. I had built a digital version of exactly the same broken system.

That was the moment the project turned. The interface was never the product. The generation was.
I rebuilt it around a pipeline: give it a topic, or upload the chapter as a PDF, and the system
extracts, chunks, prompts and assembles a full paper — questions, options, answer key — that a
teacher edits rather than authors.`,

    howItWorks: [
      { step: 'Ingest', detail: 'A topic string, or a PDF chapter parsed and chunked into passages small enough to prompt against without losing context.' },
      { step: 'Generate', detail: 'Each chunk drives a generation call producing questions with distractors and a marked answer, constrained to a requested difficulty and count.' },
      { step: 'Assemble', detail: 'Results are de-duplicated and composed into a paper. The teacher edits, reorders or regenerates any single question rather than starting from a blank page.' },
      { step: 'Deliver', detail: 'Google OAuth for sign-in, so a teacher uses the account they already have. Students attempt the paper; scoring and an achievement system close the loop.' },
    ],

    challenges: [
      { title: 'The form was the bug', detail: 'The hardest part was admitting the first version was worthless. It worked, it looked fine, and it saved nobody any time. Deleting working code because the premise is wrong is a different skill from debugging it.' },
      { title: 'Models write bad distractors', detail: 'Wrong options that are obviously wrong make a useless question. Constraining generation so the distractors are plausible — same category, same register, same length — took more prompt iteration than the rest of the pipeline combined.' },
      { title: 'PDFs are not text', detail: 'Chapter scans, two-column layouts and inline diagrams all break naive extraction. Chunking had to be forgiving of the mess and still keep enough surrounding context for a question to make sense.' },
    ],

    results: [
      { metric: 'Hours → minutes', label: 'Drafting a paper, for the one user who mattered' },
      { metric: 'Topic or PDF', label: 'Two ways in — neither of them a blank form' },
      { metric: 'The turning point', label: 'Where I started thinking like a systems architect' },
    ],

    learnings: `QuizWise is not my most complex project and it is not my most decorated one. It is
the most important, because it is where the question changed. I stopped asking “what screens does
this need” and started asking “what work is the human still doing that the system should be doing.”

Every project after this one — Haazir, Nexsus, the timetable solver — is that same question asked
about a bigger problem. A teacher typing a question paper and a department head hand-drafting a
timetable are the same person, doing the same avoidable work.`,
  },
  {
    slug: 'bookease',
    title: 'BookEase',
    blurb: 'A MERN appointment booking system, built and shipped during a four-week internship.',
    year: '2025',
    role: 'Full stack — internship project',
    category: 'Web App',
    featured: false,
    status: 'Live',
    tech: ['MongoDB', 'Express', 'React', 'Node.js'],
    links: { live: 'https://bookease-client.vercel.app/' },
    embed: { url: 'https://bookease-client.vercel.app/', height: 560 },
    cover: '/bookease.png',
    gallery: [{ src: '/bookease.png', caption: 'Booking flow' }],

    problem: `The brief for my internship at Bharat Interns: build a working appointment booking
system on the MERN stack, deployed, in four weeks.`,

    approach: `A straightforward, complete implementation — booking flow, scheduling, and persistence
— taken all the way to a live deployment rather than left on localhost. It was my first project
shipped to a real URL under someone else's deadline, and the discipline of that is why it is here.`,

    results: [
      { metric: '4 weeks', label: 'Brief to deployed' },
      { metric: 'Live', label: 'Shipped and reachable, not a localhost demo' },
    ],
  },
]

export const getProject = (slug) => projects.find((p) => p.slug === slug)
export const featuredProjects = projects.filter((p) => p.featured)
