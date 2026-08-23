export const profile = {
  name: 'Priyanshu Chaurasia',
  initials: 'PC',
  tagline: 'I build the systems institutions run on.',
  role: 'CTO × 2 · Society founder · 3rd-year CSE',

  bio: `I'm a third-year Computer Science student at MMMUT, Gorakhpur, and I spend most of my
time architecting platforms that other people depend on — a bill-discounting marketplace
moving real money, a campus super-app replacing ten fragmented tools, a chain-of-custody
system tracking individual garments through a laundry chain. I tend to start at the
architecture diagram and work outward. Two of those systems now run companies; one runs a
society I founded and preside over.`,

  location: 'Gorakhpur · Varanasi, Uttar Pradesh',
  availability: 'Open to internships and SDE roles',

  email: 'priyanshuchaurasiadlw@gmail.com',
  resumeUrl: '/resume.pdf',

  socials: {
    github: 'https://github.com/priyanshu-1006',
    linkedin: 'https://www.linkedin.com/in/priyanshu-chaurasia-326979335/',
  },

  // Headline numbers. Each one is traceable to something else on this page.
  signals: [
    { value: '₹2.5L', label: 'Grant won on architecture I designed', ref: 'IIIT Allahabad' },
    { value: '200+', label: 'Students into MMMUT via my counselling platform', ref: 'counselling.mmmut.app' },
    { value: '33k', label: 'Page views across Nexsus last month', ref: 'mmmut.app' },
    { value: '10+', label: 'Hackathons — finalist in nearly all', ref: 'IITs & IIITs' },
  ],

  skills: [
    { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'SQL'] },
    { group: 'Frontend', items: ['React', 'Next.js', 'React Native / Expo', 'Tailwind CSS', 'Vite', 'Framer Motion', 'Zustand', 'Radix UI'] },
    { group: 'Backend', items: ['Node.js', 'Express', 'NestJS', 'FastAPI', 'Prisma', 'Sequelize', 'REST', 'WebSocket'] },
    { group: 'Data', items: ['PostgreSQL', 'MongoDB', 'Supabase', 'Redis', 'pgvector', 'IndexedDB'] },
    { group: 'AI / ML', items: ['PyTorch', 'LangChain', 'LangGraph', 'RAG', 'pgvector', 'ArcFace', 'RetinaFace', 'Vision Transformers', 'YOLOv10', 'Grad-CAM', 'Gemini · Groq · OpenAI'] },
    { group: 'Infra', items: ['Docker', 'Vercel', 'Railway', 'Render', 'Turborepo', 'pnpm', 'Playwright', 'Git'] },
  ],

  education: [
    {
      school: 'Madan Mohan Malaviya University of Technology',
      degree: 'B.Tech, Computer Science & Engineering',
      period: '2024 — 2028',
      detail: 'Gorakhpur, Uttar Pradesh · currently third year',
    },
    {
      school: 'Drop year — JEE preparation',
      degree: 'Qualified JEE Advanced',
      period: '2023 — 2024',
      detail: '113 marks · short of an IIT seat',
    },
    {
      school: 'Sunbeam English School, Bhagwanpur',
      degree: 'Class XII — Physics, Chemistry, Mathematics',
      period: '2023',
      detail: '80% · Varanasi',
    },
    {
      school: 'Sunbeam English School, Bhagwanpur',
      degree: 'Class X',
      period: '2021',
      detail: '93% · NTSE qualified, State Rank 17 (OBC)',
    },
  ],

  experience: [
    {
      role: 'Founder & President',
      org: 'Nexsus — MMMUT',
      period: 'Nov 2025 — Present',
      tag: 'LEAD',
      link: 'https://mmmut.app',
      points: [
        'Started building Nexsus in November 2025; the society was officially registered with the university in April 2026, making me one of very few students to found and hold office in a registered society during second year.',
        'Lead a team of 37 — 15 from the third year and 22 from the second.',
        'Architected and built the unified digital ecosystem behind it: five web portals, two React Native apps, five RAG-backed AI bots, and a 70+ model Prisma schema on a single backend. 33k page views last month.',
        'Nexsus now runs the CSE department’s live timetable. The CSP solver generated conflict-free schedules across all four B.Tech years, M.Tech and M.Sc — 41 courses, 31 faculty and 1,009 lecture hours of weekly load, plus 206 tutorial and 740 practical hours.',
        'Co-authoring a design patent on the attendance verification and timetable generation methods — currently in preparation.',
        'Built and ran the counselling support platform for engineering admission aspirants — 25k+ page views, 900 students, 450 mentorship sessions, and 200+ admissions into MMMUT.',
      ],
    },
    {
      role: 'Chief Technology Officer',
      org: 'Washtro',
      period: '2026 — Present',
      tag: 'BUILD',
      link: 'https://www.washtro.com',
      points: [
        'Designed the complete technical architecture for a quick-laundry chain built on garment-level chain of custody rather than order-level tracking.',
        'Specified the invariants the product rests on: a single guarded state machine for every transition, an append-only audit log, integer-paise money, and HMAC-signed garment IDs.',
      ],
    },
    {
      role: 'Chief Technology Officer',
      org: 'Gryork Consultants Pvt Ltd',
      period: 'Sep 2025 — Present',
      tag: 'BUILD',
      link: 'https://www.gryork.com',
      points: [
        'Joined as a founding member in August 2025; appointed CTO the following month.',
        'Designed the entire technical architecture from a standing start — idea to execution — for a bill-discounting marketplace connecting EPCs, sub-contractors and NBFCs. That architecture won the company a ₹2.5 lakh grant from IIIT Allahabad.',
        'The company is DPIIT-registered, GSTIN-holding, and incubated at IIIT Allahabad.',
        'Lead an engineering team of nine to ten.',
        'Ran Gryork Techpreneur 2026, a four-week summer industrial programme in May 2026: built the platform at training.gryork.com and taught 85+ third-year B.Tech students agentic AI, full-stack development, agentic coding and AI tool workflows. It became a significant revenue line at ₹1,200 per registration.',
      ],
    },
    {
      role: 'Executive Member',
      org: 'Google Developer Groups on Campus, MMMUT',
      period: 'Jul 2025 — Present',
      tag: 'LEAD',
      link: 'https://gdg.mmmut.app',
      points: [
        'Designed and built the chapter’s entire web presence at gdg.mmmut.app.',
        'Built the Induction Drive system end to end — registrations, evaluation workflow, automated mailing and multi-role access. Over 250 students registered through it.',
      ],
    },
    {
      role: 'Full Stack Developer Intern',
      org: 'Bharat Interns Pvt Ltd',
      period: 'Jun 2025 — Jul 2025',
      tag: 'SHIP',
      link: 'https://bookease-client.vercel.app/',
      points: [
        'Four-week internship. Designed and shipped BookEase, a MERN-stack appointment booking system, deployed and live.',
      ],
    },
    {
      role: 'Contributor',
      org: 'MMMUT Official Website',
      period: '2025',
      tag: 'SHIP',
      link: 'https://mmmut.ac.in/primeai',
      points: [
        'Built the Faculty Development Programme pages on the university’s official site, live at mmmut.ac.in/primeai.',
      ],
    },
    {
      role: 'Mess Secretary',
      org: 'Visvesvaraya Hostel, MMMUT',
      period: '2024 — 2025',
      tag: 'LEAD',
      points: [
        'Ran the full mess operation for a 300+ student hostel in my first year — vendor management, food quality, and budget.',
      ],
    },
  ],

  achievements: [
    {
      title: 'National Winner — Upskill India Challenge, IIT Bombay Techfest ’25',
      year: '2025',
      detail: 'Finalist in three separate hackathons at Techfest, and national winners in one of them. Cognito Learning Hub, the twelve-microservice platform we built, was two to three months of work.',
      weight: 'primary',
    },
    {
      title: '₹2.5 Lakh Grant — IIIT Allahabad',
      year: '2025',
      detail: 'Awarded to Gryork on the strength of the technical architecture I designed.',
      weight: 'primary',
    },
    {
      title: '200+ students placed into MMMUT',
      year: '2026',
      detail: 'The Nexsus counselling platform reached 25k+ page views and 900 students; 450 took one-to-one mentorship and over 200 secured admission. The single clearest human outcome attached to anything I have built.',
      weight: 'primary',
    },
    {
      title: '5th Place & Special Mention — Xpecto ’26, IIT Mandi',
      year: '2026',
      detail: 'Multi-class bone fracture classification. Finalist, placed fifth, and picked up a special mention.',
      weight: 'primary',
    },
    {
      title: 'Finalist — Techkriti Innovation Challenge ’26, IIT Kanpur',
      year: '2026',
      detail: 'Vigilant-Bhai, a fraud detection system that traces scam propagation networks rather than only classifying messages. Built solo.',
    },
    {
      title: 'Finalist — Hackatron ’25, Infotsav, IIIT Gwalior',
      year: '2025',
      detail: 'Built Haazir — smart attendance monitoring plus automated timetable generation.',
    },
    {
      title: 'Nexsus runs the department timetable',
      year: '2026',
      detail: 'The CSP solver I built generated the live, conflict-free CSE timetable across all four B.Tech years, M.Tech and M.Sc — 41 courses, 31 faculty, 1,009 weekly lecture hours. If it breaks, the department’s schedule breaks.',
      weight: 'primary',
    },
    {
      title: 'NTSE — State Rank 17 (OBC)',
      year: '2021',
      detail: 'National Talent Search Examination, qualified in Class X.',
    },
    {
      title: 'Qualified JEE Advanced',
      year: '2024',
      detail: '113 marks after a drop year. Not enough for an IIT seat — which is how I ended up at MMMUT, and why the rest of this list exists.',
    },
    {
      title: 'Finalist — Ethos ’25 ML Hackathon, IIT Guwahati',
      year: '2025',
      detail: 'Machine learning track finalist.',
    },
    {
      title: '10+ hackathons, finalist in nearly all',
      year: '2025 — 2026',
      detail: 'Across IITs and IIITs — Bombay, Kanpur, Mandi, Guwahati, Gwalior and others.',
    },
  ],
}
