import { useId } from 'react'
import { projectLogos, projectMarks } from '../data/projectIdentity'

const SYMBOLS = {
  standards: (
    <>
      <path d="M11 12h12l4 4h10v25H11z" />
      <path d="M23 12v8h14M16 25h9m-9 5h6" />
      <path d="m24 34 4 4 9-10" />
    </>
  ),
  identity: (
    <>
      <rect x="7" y="12" width="34" height="25" rx="4" />
      <circle cx="17" cy="22" r="4" />
      <path d="M11 32c1-6 11-6 12 0m5-12h7m-7 5h7m-7 5h4" />
      <path d="m34 35 3 3 6-7" />
    </>
  ),
  attendance: (
    <>
      <rect x="9" y="9" width="27" height="31" rx="3" />
      <path d="M15 6v8m15-8v8M9 18h27M15 23h4v4h-4zm9 0h5m-14 8h5" />
      <circle cx="34" cy="34" r="8" />
      <path d="M34 29v5l3 2" />
    </>
  ),
  learning: (
    <>
      <path d="m5 20 19-10 19 10-19 10zM13 25v9c7 6 15 6 22 0v-9m8-5v14" />
      <path d="M18 14v-4m6 1V6m6 8v-4" />
    </>
  ),
  shield: (
    <>
      <path d="m24 6 15 6v12c0 10-15 18-15 18S9 34 9 24V12z" />
      <path d="m15 24 6 6 12-13" />
      <circle cx="15" cy="13" r="1" />
      <circle cx="33" cy="13" r="1" />
    </>
  ),
  bone: (
    <>
      <path d="M12 17c-8-2-4-11 1-8 4-5 11 1 7 5l14 16c6-3 12 4 7 8 3 6-7 10-9 2L17 23c-5 4-11-3-5-6z" />
      <path d="m23 21-3 7 6-1-2 6" />
    </>
  ),
  water: (
    <>
      <path d="M24 6S10 23 10 30a14 14 0 0 0 28 0C38 23 24 6 24 6z" />
      <path d="M15 32c0 5 4 8 8 8m-8-14 9-12" />
    </>
  ),
  aurora: (
    <>
      <path d="M5 35c9-10 13-3 20-15s12-8 18-17M7 26c7-10 13-4 20-14M9 44l10-12 8 8 6-5 9 9" />
      <circle cx="36" cy="19" r="1.5" />
      <path d="M12 7v5m-2-2h5m26 17v5m-3-3h6" />
    </>
  ),
  compass: (
    <>
      <circle cx="24" cy="25" r="17" />
      <path d="m31 17-4 12-12 4 5-12zM24 4v5m0 32v4M3 25h5m32 0h5" />
      <circle cx="24" cy="25" r="2" />
    </>
  ),
  finance: (
    <>
      <path d="M8 39V13h24v26M4 40h39M14 20h4m-4 6h4m-4 6h4m5-12h4m-4 6h4" />
      <circle cx="34" cy="29" r="9" />
      <path d="m30 30 3-3 2 1 4-5" />
    </>
  ),
  medical: (
    <>
      <path d="M18 7h12v11h11v12H30v11H18V30H7V18h11z" />
      <path d="m15 25 5-5 5 9 5-5h8" />
    </>
  ),
  quiz: (
    <>
      <rect x="9" y="7" width="27" height="35" rx="3" />
      <path d="M15 15h13M15 23h5m-5 8h5m3-9 3 3 6-7m-9 12 3 3 6-7M14 4v6m17-6v6" />
    </>
  ),
  calendar: (
    <>
      <rect x="7" y="11" width="34" height="31" rx="4" />
      <path d="M7 21h34M15 6v10M33 6v10m-18 9h4v4h-4zm13 0h4v4h-4z" />
      <path d="m20 35 4 4 9-10" />
    </>
  ),
}

export default function ProjectIcon({ slug, className = '' }) {
  const id = useId().replaceAll(':', '')
  const asset = projectLogos[slug]
  if (asset)
    return (
      <span className={`project-brand-icon ${className}`} data-project={slug} aria-hidden="true">
        <img src={asset} alt="" />
      </span>
    )
  const mark = projectMarks[slug] || { kind: 'standards', color: '#526b51' }
  return (
    <svg
      className={`project-brand-icon project-drawn-icon ${className}`}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`${id}-paper`}
          x1="5"
          y1="2"
          x2="43"
          y2="47"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffdf1" />
          <stop offset="1" stopColor="#d8dfc8" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="11"
        fill={`url(#${id}-paper)`}
        stroke="#c0c9b3"
      />
      <g
        transform="translate(5 5) scale(.8)"
        stroke={mark.color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {SYMBOLS[mark.kind]}
      </g>
    </svg>
  )
}
