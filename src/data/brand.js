/**
 * Organisation brand marks.
 *
 * `light` / `dark` name the *background* the asset is meant to sit on, not the
 * colour of the artwork — washtro.png is dark-green ink for light backgrounds,
 * washtro-dark.png is cream ink for dark ones.
 *
 * `wordmark: true` means the asset already contains the name, so it should not
 * be paired with a text label.
 */
export const brands = {
  nexsus: {
    name: 'Nexsus',
    src: { light: '/logo_nexsus.webp', dark: '/logo_nexsus.webp' },
    wordmark: false,
    href: 'https://mmmut.app',
  },
  gryork: {
    name: 'Gryork',
    src: { light: '/logo.png', dark: '/logo.png' },
    wordmark: false,
    href: 'https://www.gryork.com',
  },
  washtro: {
    name: 'Washtro',
    src: { light: '/washtro.png', dark: '/washtro-dark.png' },
    wordmark: true,
    href: 'https://www.washtro.com',
  },
  'washing-bro': {
    name: 'Washing Bro',
    src: { light: '/WashingBro.png', dark: '/WashingBro.png' },
    wordmark: false,
  },
  gdg: {
    name: 'GDG on Campus MMMUT',
    src: { light: '/gdg_logo.svg', dark: '/gdg_logo.svg' },
    wordmark: false,
    href: 'https://gdg.mmmut.app',
  },
  mmmut: {
    name: 'MMMUT',
    src: { light: '/logo1.png', dark: '/logo1.png' },
    wordmark: false,
    href: 'https://mmmut.ac.in',
  },
}

/** Maps an experience entry's org string to a brand key. */
export const orgBrand = (org = '') => {
  const o = org.toLowerCase()
  if (o.includes('nexsus')) return 'nexsus'
  if (o.includes('gryork')) return 'gryork'
  if (o.includes('washtro')) return 'washtro'
  if (o.includes('google developer')) return 'gdg'
  if (o.includes('mmmut') || o.includes('visvesvaraya')) return 'mmmut'
  return null
}

export const getBrand = (key) => brands[key] || null
