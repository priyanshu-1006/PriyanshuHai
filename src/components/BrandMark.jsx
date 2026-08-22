import { getBrand } from '../data/brand'
import { useTheme } from '../lib/themeContext'

/**
 * Renders an organisation's logo, picking the variant made for the current
 * background. Square marks sit in a tile; wordmarks run full-width and are
 * never paired with a text label, since they already carry the name.
 */
export default function BrandMark({ brand, size = 40, className = '', tile = true }) {
  const { mode } = useTheme()
  const b = getBrand(brand)
  if (!b) return null

  const src = b.src[mode] || b.src.light

  if (b.wordmark) {
    return (
      <img
        src={src}
        alt={b.name}
        loading="lazy"
        decoding="async"
        className={`w-auto object-contain ${className}`}
        style={{ height: size * 0.62 }}
      />
    )
  }

  return (
    <span
      className={`inline-grid shrink-0 place-items-center overflow-hidden ${
        tile ? 'rounded-xl border border-rule bg-bg2' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={b.name}
        loading="lazy"
        decoding="async"
        className="h-[72%] w-[72%] object-contain"
      />
    </span>
  )
}
