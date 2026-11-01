/**
 * The record, as a dated sequence rather than a list of trophies.
 *
 * Ordered newest first. `kind` drives both the filter and the marker colour;
 * `pivot: true` marks the single entry that everything after it depends on —
 * the rail changes character there, because the story does.
 *
 * Dates are strings, not Date objects: several entries are honestly only
 * accurate to the month, and rendering "Oct 2025" is more truthful than
 * rendering a day I would have to invent.
 */

export const KINDS = {
  win: { label: 'Competitions', tone: 'accent' },
  ship: { label: 'Shipped', tone: 'accent2' },
  mark: { label: 'Milestones', tone: 'accent3' },
  role: { label: 'Roles', tone: 'ink2' },
}

export const timeline = [
  {
    year: '2026',
    when: 'Sep 2026',
    kind: 'role',
    title: 'Organiser & Campus Lead — GDGoC, MMMUT',
    detail: 'Stepped into the campus leadership role after serving as an Executive Member since July 2025.',
    href: '/projects/gdg-mmmut',
    weight: 'primary',
  },
  // ── 2026 ──────────────────────────────────────────────────────────────────
  {
    year: '2026',
    when: 'Aug 2026',
    kind: 'mark',
    title: 'Design patent in preparation',
    detail:
      'Covering the attendance verification method and the timetable generation design, drafted with the CSE department.',
  },
  {
    year: '2026',
    when: '2026',
    kind: 'ship',
    title: 'Nexsus runs the live CSE timetable',
    detail:
      '41 courses, 31 faculty and 1,955 weekly contact hours across all four B.Tech years, M.Tech and M.Sc — solved as one constraint problem, conflict-free.',
    weight: 'primary',
    href: '/projects/nexsus-universe',
  },
  {
    year: '2026',
    when: '19 Apr 2026',
    kind: 'mark',
    title: 'Institutional approval',
    detail:
      'Granted by Vice Chancellor Prof. Jay Prakash Saini, twelve days after registration. Nexsus became university infrastructure.',
  },
  {
    year: '2026',
    when: '7 Apr 2026',
    kind: 'mark',
    title: 'Nexsus registered as a departmental society',
    detail:
      'Three months of waiting outside the HOD’s office for a meeting that, when it finally came, lasted ten minutes.',
  },
  {
    year: '2026',
    when: '2026',
    kind: 'ship',
    title: '200+ students placed into MMMUT',
    detail:
      'Nexsus Counselling Support: 25k+ views, 900 students guided, 450 mentorship sessions during the admission window.',
    href: '/projects/nexsus-counselling',
  },
  {
    year: '2026',
    when: '2026',
    kind: 'win',
    title: '5th Place & Special Mention — Xpecto ’26',
    detail: 'IIT Mandi.',
  },
  {
    year: '2026',
    when: '2026',
    kind: 'win',
    title: 'Finalist — Techkriti Innovation Challenge ’26',
    detail: 'IIT Kanpur, with Vigilant Bhai.',
    href: '/projects/vigilant-bhai',
  },
  {
    year: '2026',
    when: '2026',
    kind: 'role',
    title: 'Chief Technology Officer — Washtro',
    detail: 'Laundry logistics, built for the campus it runs on.',
    href: '/projects/washtro',
  },

  // ── 2025 ──────────────────────────────────────────────────────────────────
  {
    year: '2025',
    when: '21 Dec 2025',
    kind: 'win',
    title: 'National Winner — Upskill India Challenge',
    detail:
      'One of three events we reached the finals of at IIT Bombay Techfest ’25, and the one we won. Fifty minutes of evaluation on Cognito Learning Hub, with zero sleep behind it — the first competition I walked out of certain.',
    weight: 'primary',
    href: '/projects/cognito-learning-hub',
  },
  {
    year: '2025',
    when: 'Dec 2025',
    kind: 'win',
    title: 'Finalist — AWS Impact Hackathon and Jio Finagent Hackathon',
    detail:
      'The other two of the three IIT Bombay Techfest ’25 events we reached the finals of. FinAgent came out of the Jio track.',
    href: '/projects/finagent-ai',
  },
  {
    year: '2025',
    when: '9 Nov 2025',
    kind: 'mark',
    title: 'Nexsus written down for the first time',
    detail:
      'One night, one sheet of paper, one question: why does campus life feel so digitally shattered? Not an app — a campus operating system.',
    href: '/projects/nexsus-universe',
  },
  {
    year: '2025',
    when: 'Oct 2025',
    kind: 'win',
    title: 'Top 50 of 1,300+ teams — Hackatron ’25',
    detail:
      'Infotsav, IIIT Gwalior. Thirty-six hours, on the rebuilt Haazir architecture that came out of losing at SIH.',
    weight: 'primary',
    href: '/projects/haazir',
  },
  {
    year: '2025',
    when: 'Sep 2025',
    kind: 'role',
    title: 'Chief Technology Officer — Gryork',
    detail: 'Founding member. DPIIT-recognised, and a ₹2.5 lakh grant from IIIT Allahabad.',
    href: '/projects/gryork',
  },
  {
    year: '2025',
    when: '2025',
    kind: 'win',
    title: '₹2.5 Lakh Grant — IIIT Allahabad',
    detail: 'Awarded to Gryork for infrastructure-finance workflow automation.',
  },
  {
    year: '2025',
    when: '2025',
    kind: 'win',
    title: 'Finalist — Ethos ’25 ML Hackathon',
    detail: 'IIT Guwahati.',
  },
  {
    year: '2025',
    when: '2025',
    kind: 'mark',
    title: 'Eliminated at the SIH internal round',
    detail:
      'The first version of Haazir did not get past our own college qualifiers. It was the most useful thing that happened to the project — we stopped defending the architecture and rebuilt it.',
    href: '/projects/haazir',
  },
  {
    year: '2025',
    when: 'Jul 2025',
    kind: 'role',
    title: 'Executive Member — GDG on Campus, MMMUT',
    detail: 'Built gdg.mmmut.app; 250+ registrations through it.',
    href: '/projects/gdg-mmmut',
  },
  {
    year: '2025',
    when: '2025',
    kind: 'ship',
    title: 'QuizWise AI',
    detail:
      'Built for my mother, a school teacher. The project where I stopped building screens and started building systems.',
    href: '/projects/quizwise-ai',
  },
  {
    year: '2025',
    when: 'Jun 2025',
    kind: 'ship',
    title: 'BookEase — first deployed project',
    detail: 'Five months after starting. Not revolutionary. Proof that I could actually build things.',
    href: '/projects/bookease',
  },
  {
    year: '2025',
    when: 'Jan 2025',
    kind: 'mark',
    title: 'The six-month pact',
    detail:
      'Give coding six honest months. If I found my footing, keep going. If not, drop it completely and prepare for GATE. Everything above this line is downstream of that sentence.',
    pivot: true,
    weight: 'primary',
    href: '/blog/the-architecture-of-an-idea',
  },

  // ── Before ────────────────────────────────────────────────────────────────
  {
    year: '2024',
    when: '2024 — 2025',
    kind: 'role',
    title: 'Mess Secretary — Visvesvaraya Hostel',
    detail: 'Ran the full mess operation for the hostel. My first year, and no code in it anywhere.',
  },
  {
    year: '2024',
    when: '2024',
    kind: 'mark',
    title: 'Qualified JEE Advanced — 113 marks',
    detail:
      'After a drop year. The rank was not enough for an IIT seat, which is how I ended up at MMMUT — and why everything on this page exists.',
  },
  {
    year: '2023',
    when: '2023',
    kind: 'mark',
    title: 'Class XII — 80%, then a drop year',
    detail: 'Sunbeam English School, Varanasi. Physics, Chemistry, Mathematics.',
  },
  {
    year: '2021',
    when: '2021',
    kind: 'win',
    title: 'NTSE — State Rank 17 (OBC)',
    detail: 'National Talent Search Examination, qualified in Class X alongside 93% in the boards.',
  },
]

/**
 * Certifications, awaiting source data.
 *
 * These cannot be pulled from LinkedIn — there is no public API for a member's
 * certifications, and scraping needs an authenticated session. Two ways to fill
 * this in: type them out, or export them from LinkedIn (Settings → Data privacy
 * → Get a copy of your data → Certifications), which produces a CSV with
 * exactly these columns.
 *
 * Certificate images go in public/Certificates/ and are referenced by `image`.
 *
 * {
 *   name: 'Machine Learning Specialization',
 *   issuer: 'DeepLearning.AI · Coursera',
 *   when: 'Mar 2026',
 *   credentialId: 'ABC123XYZ',        // optional
 *   href: 'https://coursera.org/...', // optional, makes the card a link
 *   image: '/Certificates/ml-spec.png', // optional
 * }
 */
export const certifications = []

export const timelineYears = [...new Set(timeline.map((t) => t.year))]
