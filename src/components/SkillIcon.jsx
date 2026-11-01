import { useState } from 'react'
import { iconUrl } from '../data/techStack'

export default function SkillIcon({ skill, className = '' }) {
  const [failed, setFailed] = useState(false)
  if (skill.icon && !failed)
    return (
      <img
        className={`skill-icon ${className}`}
        src={iconUrl(skill.icon)}
        alt=""
        width="30"
        height="30"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    )
  const group = skill.groups?.[0] || 'Backend'
  return (
    <svg
      className={`skill-icon skill-symbol ${className}`}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      {group === 'Data' ? (
        <>
          <ellipse cx="16" cy="7" rx="10" ry="4" />
          <path d="M6 7v17c0 5 20 5 20 0V7M6 15c0 5 20 5 20 0" />
        </>
      ) : group === 'AI / ML' ? (
        <>
          <path d="M10 4H6v24h4m12-24h4v24h-4M10 16h12M16 10v12" />
          <circle cx="16" cy="16" r="9" />
          <circle cx="16" cy="16" r="3" />
        </>
      ) : group === 'Frontend' ? (
        <>
          <rect x="3" y="5" width="26" height="22" rx="2" />
          <path d="M3 11h26M8 17h7m-7 5h16" />
        </>
      ) : (
        <>
          <rect x="3" y="10" width="8" height="12" rx="2" />
          <rect x="21" y="3" width="8" height="8" rx="2" />
          <rect x="21" y="21" width="8" height="8" rx="2" />
          <path d="M11 16h5V7h5m-5 9v9h5" />
        </>
      )}
    </svg>
  )
}
