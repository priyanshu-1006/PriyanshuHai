/** Neutral light and black dark reading palettes. Product images keep their colours. */
const darkPalette = {
  bg: '#000000',
  bg2: '#0b0b0e',
  bg3: '#16161c',
  ink: '#f4f4f7',
  ink2: '#b7b7c1',
  ink3: '#92929f',
  rule: '#292931',
  rule2: '#484854',
  onaccent: '#101014',
  accent: '#d2d8ef',
  accent2: '#b5b9cc',
  accent3: '#aaa9bb',
}

const lightPalette = {
  bg: '#fafafa',
  bg2: '#ffffff',
  bg3: '#ededf2',
  ink: '#19191f',
  ink2: '#53535f',
  ink3: '#6c6c79',
  rule: '#dcdce4',
  rule2: '#bcbcc9',
  onaccent: '#ffffff',
  accent: '#414663',
  accent2: '#5b607c',
  accent3: '#666174',
}

export const base = { light: lightPalette, dark: darkPalette }

export const projectThemes = {
  'little-code': {
    light: lightPalette,
    dark: darkPalette,
  },
  'little-terminal': {
    light: lightPalette,
    dark: darkPalette,
  },
  'mmmut-notice': {
    light: lightPalette,
    dark: darkPalette,
  },
  manakmitra: {
    light: lightPalette,
    dark: darkPalette,
  },
  satyadwar: {
    light: lightPalette,
    dark: darkPalette,
  },
  'nexsus-universe': {
    display: {
      family: "'Space Grotesk'",
      css: 'Space+Grotesk:wght@500;600;700',
    },
    light: lightPalette,
    dark: darkPalette,
  },

  'quizwise-ai': {
    display: {
      family: "'Fraunces'",
      css: 'Fraunces:opsz,wght@9..144,500;9..144,700',
    },
    light: lightPalette,
    dark: darkPalette,
  },

  'nexsus-counselling': {
    display: {
      family: "'Newsreader'",
      css: 'Newsreader:opsz,wght@6..72,400;6..72,600;6..72,700',
    },
    light: lightPalette,
    dark: darkPalette,
  },

  'cognito-learning-hub': {
    display: {
      family: "'Bricolage Grotesque'",
      css: 'Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800',
    },
    light: lightPalette,
    dark: darkPalette,
  },

  gryork: {
    display: { family: "'Instrument Serif'", css: 'Instrument+Serif:ital@0;1' },
    light: lightPalette,
    dark: darkPalette,
  },

  washtro: {
    display: { family: "'Manrope'", css: 'Manrope:wght@500;700;800' },
    light: lightPalette,
    dark: darkPalette,
  },

  'washing-bro': {
    display: { family: "'Nunito'", css: 'Nunito:wght@600;700;900' },
    light: lightPalette,
    dark: darkPalette,
  },

  'vigilant-bhai': {
    display: { family: "'Chakra Petch'", css: 'Chakra+Petch:wght@500;600;700' },
    light: lightPalette,
    dark: darkPalette,
  },

  haazir: {
    display: { family: "'Zilla Slab'", css: 'Zilla+Slab:wght@500;600;700' },
    light: lightPalette,
    dark: darkPalette,
  },

  'fracturevision-ai': {
    display: {
      family: "'IBM Plex Sans'",
      css: 'IBM+Plex+Sans:wght@500;600;700',
    },
    light: lightPalette,
    dark: darkPalette,
  },

  'anand-pumps': {
    display: { family: "'Archivo'", css: 'Archivo:wght@600;700;900' },
    light: lightPalette,
    dark: darkPalette,
  },

  aurorahai: {
    display: { family: "'Outfit'", css: 'Outfit:wght@400;600;800' },
    light: lightPalette,
    dark: darkPalette,
  },

  'pathfinder-ai': {
    display: {
      family: "'Plus Jakarta Sans'",
      css: 'Plus+Jakarta+Sans:wght@500;700;800',
    },
    light: lightPalette,
    dark: darkPalette,
  },

  'nexsus-assist': {
    display: {
      family: "'Space Grotesk'",
      css: 'Space+Grotesk:wght@500;600;700',
    },
    light: lightPalette,
    dark: darkPalette,
  },

  'finagent-ai': {
    display: { family: "'Manrope'", css: 'Manrope:wght@500;700;800' },
    light: lightPalette,
    dark: darkPalette,
  },

  'medichain-ai': {
    display: {
      family: "'IBM Plex Sans'",
      css: 'IBM+Plex+Sans:wght@500;600;700',
    },
    light: lightPalette,
    dark: darkPalette,
  },

  'gryork-techpreneur': {
    display: { family: "'Archivo'", css: 'Archivo:wght@600;700;900' },
    light: lightPalette,
    dark: darkPalette,
  },

  'gdg-mmmut': {
    display: {
      family: "'Plus Jakarta Sans'",
      css: 'Plus+Jakarta+Sans:wght@500;700;800',
    },
    light: lightPalette,
    dark: darkPalette,
  },

  'mmmut-fdp': {
    display: { family: "'Zilla Slab'", css: 'Zilla+Slab:wght@500;600;700' },
    light: lightPalette,
    dark: darkPalette,
  },

  bookease: {
    display: { family: "'Manrope'", css: 'Manrope:wght@500;700;800' },
    light: lightPalette,
    dark: darkPalette,
  },
}

export const getProjectTheme = (slug) => projectThemes[slug] || null
