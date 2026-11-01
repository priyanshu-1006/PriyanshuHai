/**
 * Per-project visual identity. Each project page runs in its own colour world
 * and display typeface, scoped to that page only.
 *
 * A theme overrides as much or as little of `base` as it wants — omit a key and
 * the neutral shell value is used. `display.css` is the Google Fonts query
 * fragment; it is loaded lazily the first time that project page is opened.
 */

export const base = {
  light: {
    bg: '#e8e4db', bg2: '#f1eee5', bg3: '#dedfce',
    ink: '#29382e', ink2: '#53604f', ink3: '#5e6655',
    rule: '#d1cdbf', rule2: '#b4b8a2', onaccent: '#ffffff',
  },
  dark: {
    bg: '#171e1a', bg2: '#202a23', bg3: '#2b352c',
    ink: '#f0ede2', ink2: '#b7bfb0', ink3: '#a0ac98',
    rule: '#364334', rule2: '#50604a', onaccent: '#1c2a20',
  },
}

export const projectThemes = {
  'little-code': {
    light: { bg: '#faf8ff', bg2: '#f1edfa', rule: '#dfd7ee', accent: '#6841ba', accent2: '#4e6574', accent3: '#8c3983' },
    dark: { bg: '#0a0910', bg2: '#13101e', rule: '#30263e', accent: '#c4a4ff', accent2: '#9cc9e2', accent3: '#f0a6d4' },
  },
  'little-terminal': {
    light: { bg: '#f3f9fa', bg2: '#e7f1f3', rule: '#cbdfe3', accent: '#126276', accent2: '#4f5a95', accent3: '#ad4637' },
    dark: { bg: '#070d12', bg2: '#0d1822', rule: '#213342', accent: '#72d6e8', accent2: '#b7afff', accent3: '#f6aeb5' },
  },
  'mmmut-notice': {
    light: { bg: '#f5f8fc', bg2: '#eaf0fa', rule: '#cfdbeb', accent: '#2459a6', accent2: '#166958', accent3: '#995b11' },
    dark: { bg: '#080d18', bg2: '#0e192b', rule: '#243550', accent: '#9dbdff', accent2: '#95d7c2', accent3: '#efc888' },
  },
  manakmitra: {
    light: { bg: '#faf7f1', bg2: '#f1e9df', rule: '#dfd2c3', accent: '#7b2637', accent2: '#526344', accent3: '#90621e' },
    dark: { bg: '#130b0d', bg2: '#211316', rule: '#3e282c', accent: '#e9a0ae', accent2: '#b7ce9b', accent3: '#e7c28c' },
  },
  satyadwar: {
    light: { bg: '#f6f8fb', bg2: '#e9eef6', rule: '#cdd7e6', accent: '#214f91', accent2: '#58653a', accent3: '#8b5a15' },
    dark: { bg: '#080f1b', bg2: '#111e32', rule: '#283b54', accent: '#a5c6ff', accent2: '#c6d29e', accent3: '#eac88c' },
  },
  // Campus constellation — deep space blue, signal cyan, warm star amber.
  'nexsus-universe': {
    display: { family: "'Space Grotesk'", css: 'Space+Grotesk:wght@500;600;700' },
    light: { bg: '#f7f9fd', bg2: '#eef3fb', bg3: '#e0e9f7', rule: '#d3e0f2', rule2: '#b3c7e5',
             ink: '#0d1a2e', ink2: '#3d5372', accent: '#1d4ed8', accent2: '#0e7490', accent3: '#b45309' },
    dark: { bg: '#060b16', bg2: '#0c1424', bg3: '#131f36', rule: '#1c2b45', rule2: '#2c4266',
            ink: '#eaf2ff', ink2: '#93aacd', accent: '#5b8cff', accent2: '#3ddbe8', accent3: '#ffb547' },
  },

  // A teacher's desk: exercise-book cream, red marking pen, chalkboard green.
  // Fraunces is a schoolbook serif with a wobble in it — handwork, not systems.
  'quizwise-ai': {
    display: { family: "'Fraunces'", css: 'Fraunces:opsz,wght@9..144,500;9..144,700' },
    light: { bg: '#fdfbf5', bg2: '#f6f1e3', bg3: '#ece5d1', rule: '#e0d7bf', rule2: '#c2b795',
             ink: '#1c1a12', ink2: '#4f4a37', accent: '#b3271b', accent2: '#2c6448', accent3: '#8a5a06' },
    dark: { bg: '#080a08', bg2: '#101310', bg3: '#191e19', rule: '#252b25', rule2: '#3a433a',
            ink: '#f3f1e6', ink2: '#a8a795', accent: '#f2836f', accent2: '#79c9a1', accent3: '#e6b455' },
  },

  // Guidance — calm teal and warm sand. Trust, not excitement.
  'nexsus-counselling': {
    display: { family: "'Newsreader'", css: 'Newsreader:opsz,wght@6..72,400;6..72,600;6..72,700' },
    light: { bg: '#fcfbf7', bg2: '#f4f1e8', bg3: '#e9e4d5', rule: '#ded7c4', rule2: '#c4bba2',
             ink: '#1a2420', ink2: '#4c5a52', accent: '#0f766e', accent2: '#a16207', accent3: '#166534' },
    dark: { bg: '#0a1210', bg2: '#111c19', bg3: '#182824', rule: '#1f332e', rule2: '#2f4a43',
            ink: '#eef6f3', ink2: '#9ab5ad', accent: '#2dd4bf', accent2: '#fbbf24', accent3: '#4ade80' },
  },

  // Gamified learning — violet and electric lime. Competitive energy.
  'cognito-learning-hub': {
    display: { family: "'Bricolage Grotesque'", css: 'Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800' },
    light: { bg: '#fcfaff', bg2: '#f5efff', bg3: '#eae0fd', rule: '#ded1f7', rule2: '#c2ade8',
             ink: '#1b0f33', ink2: '#4d3a72', accent: '#7c3aed', accent2: '#3f7d0e', accent3: '#db2777' },
    dark: { bg: '#0d0620', bg2: '#160b32', bg3: '#211048', rule: '#2c1a5c', rule2: '#432a80',
            ink: '#f5efff', ink2: '#b6a2e0', accent: '#a78bfa', accent2: '#a3e635', accent3: '#f472b6' },
  },

  // Infrastructure finance — the logo's navy-to-teal gradient, with ledger gold.
  gryork: {
    display: { family: "'Instrument Serif'", css: 'Instrument+Serif:ital@0;1' },
    light: { bg: '#f9fbfd', bg2: '#eef3f9', bg3: '#dee7f2', rule: '#cddcea', rule2: '#a5bcd6',
             ink: '#0a1424', ink2: '#3a4d66', accent: '#1d4ed8', accent2: '#0d7c8a', accent3: '#a16207' },
    dark: { bg: '#050a13', bg2: '#0a1220', bg3: '#101d31', rule: '#17273f', rule2: '#243c5c',
            ink: '#e9f1fb', ink2: '#93a8c4', accent: '#5b9bff', accent2: '#3fd0c9', accent3: '#e8b53c' },
  },

  // Garment custody — taken straight off the wordmark: forest green ink on
  // cream, with the mark's gold swirl as the accent.
  washtro: {
    display: { family: "'Manrope'", css: 'Manrope:wght@500;700;800' },
    light: { bg: '#fbf8f2', bg2: '#f3ece0', bg3: '#e6dbc9', rule: '#dccfb8', rule2: '#bfae90',
             ink: '#132b1f', ink2: '#3f5c4b', accent: '#1c4633', accent2: '#8a6a1f', accent3: '#9a3412' },
    dark: { bg: '#070f0b', bg2: '#0c1912', bg3: '#12261b', rule: '#1b3626', rule2: '#2a5138',
            ink: '#f2e8d8', ink2: '#a8bfae', accent: '#7fc9a0', accent2: '#d9b46a', accent3: '#fb923c' },
  },

  // Campus laundry — fresh sky and mint. Friendly, not corporate.
  'washing-bro': {
    display: { family: "'Nunito'", css: 'Nunito:wght@600;700;900' },
    light: { bg: '#f8fcff', bg2: '#ecf6fe', bg3: '#d9ecfc', rule: '#c9e4fa', rule2: '#9ecbf0',
             ink: '#0b1c2b', ink2: '#37566e', accent: '#0284c7', accent2: '#059669', accent3: '#d97706' },
    dark: { bg: '#04101a', bg2: '#081a29', bg3: '#0d283d', rule: '#14344c', rule2: '#1e4d6e',
            ink: '#e6f4ff', ink2: '#8db4d0', accent: '#38bdf8', accent2: '#34d399', accent3: '#fbbf24' },
  },

  // Fraud intelligence — terminal black, alert red, toxic green.
  'vigilant-bhai': {
    display: { family: "'Chakra Petch'", css: 'Chakra+Petch:wght@500;600;700' },
    light: { bg: '#fafaf9', bg2: '#f1f1ef', bg3: '#e3e3e0', rule: '#d6d6d2', rule2: '#b4b4ae',
             ink: '#141413', ink2: '#45453f', accent: '#b91c1c', accent2: '#15803d', accent3: '#a16207' },
    dark: { bg: '#080809', bg2: '#0f1011', bg3: '#17191b', rule: '#232629', rule2: '#373b40',
            ink: '#eceef0', ink2: '#98a0a8', accent: '#ff4d4d', accent2: '#3ddc84', accent3: '#ffc63d' },
  },

  // Attendance — academic burgundy on cream. Institutional, warm.
  haazir: {
    display: { family: "'Zilla Slab'", css: 'Zilla+Slab:wght@500;600;700' },
    light: { bg: '#fdfbf9', bg2: '#f7efe9', bg3: '#eddfd5', rule: '#e2d1c4', rule2: '#c9ae9c',
             ink: '#231310', ink2: '#5c443c', accent: '#9f1239', accent2: '#b45309', accent3: '#155e75' },
    dark: { bg: '#14090a', bg2: '#1f0f11', bg3: '#2c171a', rule: '#3a2024', rule2: '#553135',
            ink: '#fbeeea', ink2: '#c2a099', accent: '#fb7185', accent2: '#fbbf24', accent3: '#67e8f9' },
  },

  // Medical imaging — X-ray greyscale, clinical teal, detection red.
  'fracturevision-ai': {
    display: { family: "'IBM Plex Sans'", css: 'IBM+Plex+Sans:wght@500;600;700' },
    light: { bg: '#fafcfc', bg2: '#eff5f6', bg3: '#dfeaec', rule: '#cfdee1', rule2: '#a9c2c7',
             ink: '#0c1618', ink2: '#3c5257', accent: '#0e7490', accent2: '#be123c', accent3: '#4d7c0f' },
    dark: { bg: '#05090a', bg2: '#0b1314', bg3: '#111e20', rule: '#182a2d', rule2: '#254045',
            ink: '#e9f4f5', ink2: '#8fb0b5', accent: '#22d3ee', accent2: '#fb7185', accent3: '#a3e635' },
  },

  // Industrial e-commerce — pump-house blue and safety orange.
  'anand-pumps': {
    display: { family: "'Archivo'", css: 'Archivo:wght@600;700;900' },
    light: { bg: '#fafbfd', bg2: '#eef2f8', bg3: '#dde5f0', rule: '#cdd9e8', rule2: '#a6b8d0',
             ink: '#0e1520', ink2: '#3f4d61', accent: '#1e40af', accent2: '#c2410c', accent3: '#047857' },
    dark: { bg: '#070a10', bg2: '#0d121b', bg3: '#141c29', rule: '#1d2839', rule2: '#2c3c55',
            ink: '#e9eff8', ink2: '#93a4bd', accent: '#60a5fa', accent2: '#fb923c', accent3: '#34d399' },
  },

  // Aurora — polar night, curtain green, magenta corona.
  aurorahai: {
    display: { family: "'Outfit'", css: 'Outfit:wght@400;600;800' },
    light: { bg: '#f8fbfc', bg2: '#ecf4f6', bg3: '#daeaef', rule: '#c9e0e6', rule2: '#9ec4cf',
             ink: '#08171c', ink2: '#345057', accent: '#0f766e', accent2: '#7e22ce', accent3: '#0369a1' },
    dark: { bg: '#02070f', bg2: '#061020', bg3: '#0a1a31', rule: '#102546', rule2: '#1a3a69',
            ink: '#e6f6f9', ink2: '#87aebd', accent: '#4ade80', accent2: '#e879f9', accent3: '#38bdf8' },
  },

  // Career roadmap — optimistic amber over deep blue.
  'pathfinder-ai': {
    display: { family: "'Plus Jakarta Sans'", css: 'Plus+Jakarta+Sans:wght@500;700;800' },
    light: { bg: '#fdfcf8', bg2: '#f7f1e6', bg3: '#eee2cd', rule: '#e3d5bd', rule2: '#c9b593',
             ink: '#1a1408', ink2: '#544a3c', accent: '#b45309', accent2: '#1d4ed8', accent3: '#15803d' },
    dark: { bg: '#100c04', bg2: '#1a1409', bg3: '#261d0f', rule: '#332915', rule2: '#4d3e22',
            ink: '#fdf6e8', ink2: '#c4ae87', accent: '#fbbf24', accent2: '#60a5fa', accent3: '#4ade80' },
  },

  // Utility belt — neutral shell, electric accent.
  'nexsus-assist': {
    display: { family: "'Space Grotesk'", css: 'Space+Grotesk:wght@500;600;700' },
    light: { accent: '#4f46e5', accent2: '#0891b2', accent3: '#c026d3' },
    dark: { accent: '#818cf8', accent2: '#22d3ee', accent3: '#e879f9' },
  },

  // Agent safety — approval amber against a dark cabin.
  'finagent-ai': {
    display: { family: "'Manrope'", css: 'Manrope:wght@500;700;800' },
    light: { bg: '#fdfcfa', bg2: '#f6f2ec', bg3: '#ebe3d7', rule: '#ded3c2', rule2: '#c2b39c',
             ink: '#181309', ink2: '#4f4436', accent: '#b45309', accent2: '#166534', accent3: '#b91c1c' },
    dark: { bg: '#0c0a06', bg2: '#15110b', bg3: '#1f1912', rule: '#2b2318', rule2: '#423625',
            ink: '#faf5eb', ink2: '#bfae92', accent: '#f59e0b', accent2: '#4ade80', accent3: '#f87171' },
  },

  // Federated medicine — chain violet with clinical white.
  'medichain-ai': {
    display: { family: "'IBM Plex Sans'", css: 'IBM+Plex+Sans:wght@500;600;700' },
    light: { bg: '#fcfaff', bg2: '#f4effb', bg3: '#e8dff5', rule: '#dbcfee', rule2: '#bda9dd',
             ink: '#150e21', ink2: '#493a5e', accent: '#6d28d9', accent2: '#0e7490', accent3: '#be123c' },
    dark: { bg: '#0a0614', bg2: '#120b22', bg3: '#1b1133', rule: '#271847', rule2: '#3c2868',
            ink: '#f3ecff', ink2: '#af9dd1', accent: '#a78bfa', accent2: '#22d3ee', accent3: '#fb7185' },
  },

  // Teaching programme — warm, energetic, classroom.
  'gryork-techpreneur': {
    display: { family: "'Archivo'", css: 'Archivo:wght@600;700;900' },
    light: { accent: '#c2410c', accent2: '#15803d', accent3: '#1d4ed8' },
    dark: { accent: '#fb923c', accent2: '#4ade80', accent3: '#60a5fa' },
  },

  // GDG — the four Google hues, used honestly as a palette.
  'gdg-mmmut': {
    display: { family: "'Plus Jakarta Sans'", css: 'Plus+Jakarta+Sans:wght@500;700;800' },
    light: { bg: '#fdfdfd', bg2: '#f3f5f8', bg3: '#e6eaf1', rule: '#dbe1ea', rule2: '#bcc6d6',
             ink: '#131417', ink2: '#464a52', accent: '#1a73e8', accent2: '#188038', accent3: '#d93025' },
    dark: { bg: '#0a0b0d', bg2: '#121417', bg3: '#1b1e23', rule: '#262a31', rule2: '#3a4049',
            ink: '#eef1f5', ink2: '#9aa3b0', accent: '#8ab4f8', accent2: '#81c995', accent3: '#f28b82' },
  },

  // University institutional — MMMUT navy and crest gold.
  'mmmut-fdp': {
    display: { family: "'Zilla Slab'", css: 'Zilla+Slab:wght@500;600;700' },
    light: { accent: '#1e3a8a', accent2: '#a16207', accent3: '#0f766e' },
    dark: { accent: '#93b4fc', accent2: '#fbbf24', accent3: '#5eead4' },
  },

  // Booking — plain, calm, first-shipped.
  bookease: {
    display: { family: "'Manrope'", css: 'Manrope:wght@500;700;800' },
    light: { accent: '#0d9488', accent2: '#4f46e5', accent3: '#c2410c' },
    dark: { accent: '#2dd4bf', accent2: '#818cf8', accent3: '#fb923c' },
  },
}

export const getProjectTheme = (slug) => projectThemes[slug] || null
