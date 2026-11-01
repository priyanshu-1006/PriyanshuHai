const shot = (slug, name, caption) => ({ src: `/projects/${slug}/${name}.webp`, caption })

// Facts and release boundaries taken from the supplied project READMEs and evidence hub.
export const recentProjects = [
  {
    slug: 'little-code',
    title: 'Little Code',
    category: 'Developer tools',
    year: '2026',
    role: 'Creator & developer',
    status: 'Development preview',
    featured: true,
    blurb:
      'An AI coding companion built into its own Code-OSS desktop app. Ask, plan, review edits and run supervised agents without leaving the workspace.',
    headline: 'An editor with an agent.\nAnd a review button.',
    intro:
      'A standalone Electron / Code-OSS application that brings repository context, AI conversations, native diffs and project tools into one workspace. The central design decision: the host owns permissions, and every proposed edit is reviewable.',
    tech: ['TypeScript', 'Electron', 'Code-OSS', 'React', 'Groq', 'Ollama', 'MCP'],
    links: { github: 'https://github.com/priyanshu-1006/Little_Code' },
    cover: '/projects/little-code/workspace-home.webp',
    results: [
      { metric: '4', label: 'Modes: Ask, Plan, Edit, Agent' },
      { metric: '40', label: 'Template / language combinations' },
      { metric: '19', label: 'Single-file runner language entries' },
    ],
    problem:
      'A chat beside an editor is only useful when it understands the repository and gives the developer control over what changes. Little Code makes context, review, command consent and recovery part of the editor itself.',
    features: [
      [
        'Context before generation',
        'A local project-intelligence index selects fresh source snippets and shows why each file was included. Saved project memory stays scoped to the workspace.',
      ],
      [
        'Native review and recovery',
        'Edit proposals open in native diff editors. Accept or reject them, then restore accepted changes from private checkpoints. Later edits become conflicts rather than silent overwrites.',
      ],
      [
        'Build from the same workspace',
        'Framework starters, a managed source-file runner and Flutter preview controls use installed toolchains, with native confirmation for project creation and dependency steps.',
      ],
      [
        'Providers and integrations',
        'Groq streaming, a local Ollama connection, model discovery and approved loopback MCP tools share host validation and bounded runs.',
      ],
    ],
    architecture: [
      'Code-OSS / Electron shell',
      'Bundled Little extension + host permissions',
      'Repository tools · memory · checkpoints',
      'Groq / Ollama · approved MCP',
    ],
    gallery: [
      shot('little-code', 'workspace-home', 'Little Home and the integrated Agent panel'),
      shot('little-code', 'notebook-review', 'Notebook changes presented for native review'),
      shot('little-code', 'document-review', 'Document workflow in the editor'),
      shot('little-code', 'project-memory', 'Project-scoped memory'),
      shot('little-code', 'mcp-connection', 'MCP connection configuration'),
    ],
    boundary:
      'Version 0.3.0 is a development preview. Earlier 0.2 live-provider acceptance is historical; fresh 0.3 provider and installed-toolchain acceptance remain open. The repository index is lexical, and approved commands run with the user’s permissions.',
    sourceNote:
      'Little_Code/README.md · docs/build-tools.md · website assets · 0.3.0 development documentation',
  },
  {
    slug: 'little-terminal',
    title: 'Little Terminal',
    category: 'Developer tools',
    year: '2026',
    role: 'Creator & developer',
    status: 'Development preview',
    featured: false,
    blurb:
      'A native Rust terminal with GPU rendering, real ConPTY sessions, split workspaces, service orchestration and reviewed AI actions.',
    headline: 'The shell is real.\nSo is the control.',
    intro:
      'Built from a Rust terminal core up through a wgpu renderer and native window layer. Little Terminal brings command blocks, workspace services, Git inspection and explicit AI review into the same terminal.',
    tech: ['Rust', 'wgpu', 'winit', 'ConPTY', 'Tokio', 'SQLite', 'AccessKit'],
    links: { github: 'https://github.com/priyanshu-1006/Little_Terminal' },
    cover: '/projects/little-terminal/tabs.webp',
    results: [
      { metric: 'Rust', label: 'Native application foundation' },
      { metric: 'GPU', label: 'wgpu rendering' },
      { metric: 'preview.4', label: 'Current documented release' },
    ],
    problem:
      'A development workspace is more than a shell prompt: it is several processes, their working directories, their output and the next command. This project makes that context visible while keeping actual sessions under native terminal ownership.',
    features: [
      [
        'Sessions with ownership',
        'Real PowerShell, CMD and installed WSL launchers, with tabs, split panes, saved profiles and explicit shell restart. Pane ownership survives sibling output and resizing.',
      ],
      [
        'Workspaces that remember structure',
        'Save profiles, directories and split ratios. Restore shells first; saved services remain pending until their commands are reviewed.',
      ],
      [
        'Services in one view',
        'A workspace dashboard brings service dependencies, readiness and stop controls together with a process / Git inspector.',
      ],
      [
        'AI with a visible handoff',
        'Compose requests, inspect the exact context and review local tool results before sending them. Commands and retries have their own review steps.',
      ],
    ],
    architecture: [
      'winit window + AccessKit controls',
      'wgpu / glyphon GPU renderer',
      'Terminal core · config · workspace state',
      'Platform adapter → ConPTY → real shells',
    ],
    gallery: [
      shot('little-terminal', 'tabs', 'Native terminal sessions and tabs'),
      shot('little-terminal', 'workspace-dashboard', 'Workspace service dashboard'),
      shot('little-terminal', 'services-ready', 'Service readiness in the native app'),
      shot('little-terminal', 'ai-compose-review', 'AI request and context review'),
      shot('little-terminal', 'git-changes', 'Git changes inspector'),
      shot('little-terminal', 'hub', 'Native Tools hub'),
    ],
    boundary:
      'The current packages are unsigned development previews. Windows is the primary target; local Linux WSLg acceptance is recorded, while broad daily-use/public-beta acceptance and native macOS acceptance remain open. AI showcase captures use an owned local fixture.',
    sourceNote: 'Little_Terminal/README.md · docs/PRODUCT_FEATURES.md · showcase curated captures',
  },
  {
    slug: 'mmmut-notice',
    title: 'MMMUT Notice',
    category: 'Automation',
    year: '2026',
    role: 'Creator & developer',
    status: 'Local prototype',
    featured: false,
    blurb:
      'Official university notices turned into reviewed student updates: source monitoring, PDF/OCR extraction, AI drafting, email subscriptions and Nexsus sync.',
    headline: 'From an official PDF\nto a useful update.',
    intro:
      'A notice pipeline for Nexsus that watches official MMMUT pages, drafts readable updates and gives the team a review desk before anything reaches students. A changed attachment withdraws the previous public version and starts review again.',
    tech: ['Python', 'SQLite', 'Groq', 'pypdf', 'Tesseract', 'SMTP', 'HMAC'],
    links: {},
    cover: '/projects/mmmut-notice/review.webp',
    results: [
      { metric: 'Human', label: 'Approval before publication' },
      { metric: 'OCR', label: 'Scanned-document fallback' },
      { metric: 'Outbox', label: 'Retryable Nexsus delivery' },
    ],
    problem:
      'Important dates get buried in university PDFs and forwarded messages. Automatically summarising them is insufficient: dates need evidence, changed documents need another review, and every published copy needs a withdrawal path.',
    features: [
      [
        'Watch the source, including changes',
        'A worker polls official listings and downloads attachments, then rechecks recent files for byte changes. Initial baselines avoid flooding the review queue with old notices.',
      ],
      [
        'Dates backed by the document',
        'PDF extraction and OCR feed structured Groq drafts. A proposed date is accepted only when its source quote occurs on the claimed page.',
      ],
      [
        'A desk for the reviewer',
        'Compare the original, extracted text, structured fields and formatted post. Editing an approved draft returns it to pending approval; publishing remains an explicit admin action.',
      ],
      [
        'Publication that can be reversed',
        'Confirmed email subscriptions and an ordered change feed carry reviewed notices. A signed, retryable webhook sends publications and withdrawals to Nexsus. WhatsApp Channel sharing stays manual.',
      ],
    ],
    architecture: [
      'Official listings → attachment change detection',
      'PDF text / OCR → structured AI draft',
      'Review → approve → explicit publish',
      'Notice hub · email · signed Nexsus outbox',
    ],
    gallery: [
      shot(
        'mmmut-notice',
        'review',
        'Review dashboard — rendered from the original app with a synthetic test fixture',
      ),
      shot(
        'mmmut-notice',
        'hub',
        'Public notice hub — synthetic test fixture after review and publication',
      ),
    ],
    boundary:
      'A functional local prototype. Production deployment, customer isolation, billing and operational security work remain. WhatsApp Channel posting is manual. The screenshots show the original application rendered with its synthetic test fixture, not live university notices.',
    sourceNote: 'MMMUT_Notice/README.md · mmmut_notice workflow, web and integration modules',
  },
  {
    slug: 'manakmitra',
    title: 'ManakMitra',
    category: 'AI / ML',
    year: '2026',
    role: 'Team project · Optimistic Mutant Coders',
    status: 'SIH prototype',
    featured: true,
    blurb:
      'Evidence-grounded Indian Standards discovery: cited answers, deterministic certification checks, lab search and a traceable compliance workspace.',
    headline: 'A standard is a fact.\nTreat it like one.',
    intro:
      'An independent SIH26107 prototype for industries and consumers navigating Indian Standards and BIS services. Product descriptions become ranked standards, certification evidence, testing requirements and compliance tasks—with official sources attached.',
    tech: [
      'React',
      'TypeScript',
      'NestJS',
      'FastAPI',
      'LangGraph',
      'PostgreSQL',
      'pgvector',
      'Redis',
      'Drizzle',
    ],
    links: {
      live: 'https://manakmitra.me',
      github: 'https://github.com/ananya10kumari19-art/ManakMitra',
    },
    cover: '/projects/manakmitra/standards.webp',
    results: [
      { metric: '22,981', label: 'Standards in the documented register' },
      { metric: '431', label: 'Recognised laboratories indexed' },
      { metric: '500', label: 'Questions in the recorded benchmark' },
    ],
    problem:
      'A manufacturer needs more than an answer that sounds plausible. They need to know which standard applies, whether certification is mandatory, which tests are required and where the evidence came from.',
    features: [
      [
        'Retrieval with provenance',
        'Hybrid vector and lexical search, reranking and a LangGraph workflow assemble cited evidence. Source records retain official URLs, retrieval times and content hashes.',
      ],
      [
        'Certification decided by rules',
        'The engine resolves Quality Control Orders, sections, schemes and effective dates. The model explains the result; it does not decide whether certification is mandatory.',
      ],
      [
        'From answer to a working project',
        'Find recognised laboratories, collect process steps, create tasks and export a compliance pack. Dated Compliance Twin snapshots carry a SHA-256 fingerprint.',
      ],
      [
        'Resilience at the model boundary',
        'Personal identifiers are shielded before third-party calls. Provider failover and lexical retrieval fallback keep failures visible without inventing missing evidence.',
      ],
    ],
    architecture: [
      'React web → NestJS API / shared contracts',
      'FastAPI + LangGraph → domain engines',
      'Hybrid retrieval + reranking + evidence checks',
      'PostgreSQL / pgvector · Redis / BullMQ',
    ],
    gallery: [
      shot('manakmitra', 'standards', 'Find My Standard — product description and constraints'),
      shot('manakmitra', 'certification', 'Certification Advisor and roadmap'),
      shot('manakmitra', 'laboratories', 'Laboratory Finder — standard, place and test'),
      shot('manakmitra', 'hallmarking', 'Hallmarking guide and sourced questions'),
    ],
    boundary:
      'An independent prototype, not a BIS or Government of India service. Recorded 500-question results report 96.5% Recall@5 and 46s P95 latency; these are a dated evaluation, not a live guarantee. Product-label OCR is not proof of product authenticity. The evidence hub states that the scheduled watchlist sweep is disabled on the free-tier deployment.',
    sourceNote:
      'ManakMitra/README.md · docs/ARCHITECTURE.md · Evidence Hub, 29 September 2026. Screens are local renders from the evidence hub; they do not imply live API data.',
  },
  {
    slug: 'satyadwar',
    title: 'SatyaDwar',
    category: 'AI / ML',
    year: '2026',
    role: 'Team project',
    status: 'SIH prototype',
    featured: false,
    blurb:
      'An offline-first identity-document screening prototype with signed-QR verification, OCR comparisons, itemised evidence and an installable checkpoint node.',
    headline: 'Read the print.\nVerify the evidence.',
    intro:
      'Built for SIH26188: identity and document screening at border checkpoints. SatyaDwar compares printed fields against machine-readable evidence, exposes the reason for a flag and keeps the officer’s decision separate from the automated checks.',
    tech: [
      'Python',
      'FastAPI',
      'React',
      'TypeScript',
      'PostgreSQL',
      'Redis',
      'MinIO',
      'Flutter',
      'Docker',
    ],
    links: {},
    cover: '/projects/satyadwar/after2-officers-dashboard-1280.webp',
    results: [
      { metric: 'Offline', label: 'Installable Windows checkpoint node' },
      { metric: '7', label: 'ML service groups' },
      { metric: '3', label: 'Companion UI languages' },
    ],
    problem:
      'OCR alone can faithfully read a forged document. A useful screening tool needs an independent comparison, itemised reasons and a workflow that still functions when a checkpoint loses its connection.',
    features: [
      [
        'A pipeline of specific checks',
        'Quality gating, document localisation, classification, field detection and OCR feed document profiles and rules. Aadhaar Secure QR verification and MRZ checks provide machine-readable evidence.',
      ],
      [
        'Explain the mismatch',
        'Printed fields are compared against signed QR data. The result names the conflicting field and retains the evidence instead of collapsing everything into a single unexplained score.',
      ],
      [
        'A node at the checkpoint',
        'The Windows installer bundles runtime services, models, a staff workstation and PostgreSQL. Enrolment, signed heartbeats and an outbox support a centrally visible fleet.',
      ],
      [
        'Separate operational surfaces',
        'Staff roles have their own workspaces. Public uploads run as a separate write-only service. The Flutter companion supports connected screening in English, Hindi and Nepali.',
      ],
    ],
    architecture: [
      'Officer workstation / Flutter companion',
      'API gateway → screening orchestration',
      'OCR · document rules · QR crypto · ML checks',
      'Local evidence + audit chain → sync outbox',
    ],
    gallery: [
      shot('satyadwar', 'after2-officers-dashboard-1280', 'Officer workstation — shift overview'),
      shot('satyadwar', 'screening-capture', 'Guided document capture'),
      shot('satyadwar', 'screening-analysis', 'Screening analysis and evidence'),
      shot('satyadwar', 'after2-investigators-audit-trail-1280', 'Investigator audit trail'),
      shot(
        'satyadwar',
        'after2-admin-model-registry-1280',
        'Model registry in the admin workspace',
      ),
    ],
    boundary:
      'An SIH prototype for the stated checkpoint use case; no operational deployment by a government force is claimed. TruFor tamper localisation is advisory until validated on identity documents. The mobile milestone is connected screening; full offline on-device screening remains future work.',
    sourceNote:
      'SatyaDwar/README.md · Docs/SCOPE.md · checkpoint and mobile documentation · curated showcase product captures',
  },
]
