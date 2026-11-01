import { useId } from 'react'
import ProjectIcon from '../ProjectIcon'

export default function DesktopIcon({ kind = 'folder', small = false, asset, project }) {
  const id = useId().replaceAll(':', '')
  const paint = (name) => `url(#${id}-${name})`
  if (project)
    return <ProjectIcon slug={project} className={`os-icon ${small ? 'os-icon-small' : ''}`} />
  if (asset)
    return (
      <span
        className={`os-icon os-icon-asset ${small ? 'os-icon-small' : ''} ${kind === 'person' ? 'os-icon-portrait' : ''}`}
        aria-hidden="true"
      >
        <img src={asset} alt="" />
      </span>
    )
  return (
    <svg
      className={`os-icon ${small ? 'os-icon-small' : ''}`}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`${id}-folder`}
          x1="10"
          y1="17"
          x2="35"
          y2="43"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffe8a2" />
          <stop offset=".5" stopColor="#edc465" />
          <stop offset="1" stopColor="#c59235" />
        </linearGradient>
        <linearGradient
          id={`${id}-paper`}
          x1="15"
          y1="5"
          x2="38"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffef5" />
          <stop offset="1" stopColor="#dedbc6" />
        </linearGradient>
        <linearGradient
          id={`${id}-blue`}
          x1="7"
          y1="10"
          x2="40"
          y2="39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#a5cbd9" />
          <stop offset="1" stopColor="#45778c" />
        </linearGradient>
        <linearGradient
          id={`${id}-envelope`}
          x1="12"
          y1="17"
          x2="30"
          y2="43"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff9e4" />
          <stop offset="1" stopColor="#c6c6a9" />
        </linearGradient>
      </defs>
      <ellipse cx="25" cy="44" rx="19" ry="2" fill="#233e3d" opacity=".17" />
      {kind === 'folder' && (
        <>
          <path
            d="M5 13a3 3 0 0 1 3-3h11l4 5h17a3 3 0 0 1 3 3v21H5z"
            fill="#c9943f"
            stroke="#987239"
          />
          <path d="m12 12 22-3 4 25-22 3z" fill={paint('paper')} stroke="#a6a58b" />
          <path d="m17 16 13-2m-12 6 13-2m-12 6 9-1" stroke="#adb8a7" strokeWidth="1.4" />
          <path d="m25 16 13-1 2 19-13 1z" fill={paint('blue')} stroke="#688d96" />
          <path
            d="m5 22 37-3a2 2 0 0 1 2 2l-3 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z"
            fill={paint('folder')}
            stroke="#a57b36"
          />
          <path d="m8 24 31-2" stroke="#fff1bb" strokeWidth="1.6" />
          <rect x="28" y="32" width="9" height="6" rx="1.5" fill="#fcf0c8" opacity=".8" />
        </>
      )}
      {kind === 'person' && (
        <>
          <path d="M9 6h30v37H9z" fill="#c8d5d0" stroke="#40594f" strokeWidth="2" />
          <path d="M16 34c0-9 16-9 16 0" fill="#4a786a" />
          <circle cx="24" cy="18" r="6" fill="#d4a581" stroke="#725540" strokeWidth="2" />
          <path d="M19 12h10l2 5-13-1z" fill="#3d3c38" />
          <path d="M17 39h14" stroke="#40594f" strokeWidth="2" />
        </>
      )}
      {kind === 'terminal' && (
        <>
          <rect
            x="5"
            y="8"
            width="38"
            height="31"
            rx="2"
            fill="#243f3a"
            stroke="#c3d2bc"
            strokeWidth="2"
          />
          <path d="M5 15h38" stroke="#c3d2bc" strokeWidth="2" />
          <path d="m12 22 5 4-5 4m10 0h9" stroke="#d4e6b8" strokeWidth="2.5" />
          <path d="M10 12h3m3 0h3" stroke="#dcc48a" strokeWidth="2" />
        </>
      )}
      {kind === 'code' && (
        <>
          <rect
            x="5"
            y="7"
            width="38"
            height="34"
            rx="3"
            fill="#d5c3ed"
            stroke="#68517e"
            strokeWidth="2"
          />
          <path d="M5 15h38M10 11h3m3 0h3" stroke="#68517e" strokeWidth="2" />
          <path d="m17 22-5 5 5 5m14-10 5 5-5 5m-5-12-4 15" stroke="#624386" strokeWidth="2.5" />
        </>
      )}
      {kind === 'case' && (
        <>
          <path d="M16 14V8h16v6" stroke="#77563a" strokeWidth="3" />
          <rect
            x="5"
            y="14"
            width="38"
            height="26"
            rx="2"
            fill="#bb8e69"
            stroke="#684e3b"
            strokeWidth="2"
          />
          <path d="M5 25h38" stroke="#684e3b" strokeWidth="2" />
          <path d="M20 23h8v6h-8z" fill="#e6ca87" stroke="#684e3b" strokeWidth="2" />
        </>
      )}
      {kind === 'note' && (
        <>
          <rect x="9" y="5" width="29" height="38" rx="3" fill="#688e88" stroke="#426962" />
          <path d="M14 7h21v33H14z" fill={paint('paper')} />
          <path d="M19 14h12m-12 5h12m-12 5h12m-12 5h8" stroke="#adb7a3" strokeWidth="1.2" />
          <path
            d="M6 11h7M6 19h7M6 27h7M6 35h7"
            stroke="#dce4d1"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="m40 19 4 2-9 19-5 3 1-6z" fill="#d69c58" stroke="#8f683e" />
          <path d="m31 37 4 3-5 3z" fill="#f6e8ba" />
          <path d="m30 43 2-1-1-1z" fill="#4d5246" />
          <path d="m39 21 2 1-8 16" stroke="#f4ce87" />
        </>
      )}
      {kind === 'mail' && (
        <>
          <path d="m5 18 19-13 19 13v22H5z" fill="#b9bba0" stroke="#81866a" />
          <path d="m12 9 25 2-2 24-25-2z" fill={paint('paper')} stroke="#a3aa90" />
          <path d="m17 16 14 1m-15 5 12 1" stroke="#b6bdad" strokeWidth="1.5" />
          <path
            d="M5 18h38v23a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"
            fill={paint('envelope')}
            stroke="#8b957c"
          />
          <path d="m6 19 18 13 18-13M6 41l13-14m23 14L29 27" stroke="#a4ac92" strokeWidth="1.3" />
          <rect
            x="32"
            y="8"
            width="10"
            height="13"
            rx="1"
            fill="#b87559"
            stroke="#f5e6cc"
            strokeWidth="1.8"
            strokeDasharray="1 1"
          />
          <path d="m34 18 3-6 3 6z" fill="#ead7a9" opacity=".9" />
          <circle cx="26" cy="16" r="5" stroke="#7c8a78" opacity=".5" />
          <path d="m22 13 8 6m-10-3 11 6" stroke="#7c8a78" opacity=".5" />
        </>
      )}
      {kind === 'document' && (
        <>
          <path d="m8 7 25-3 6 35-26 4z" fill="#b6c3b1" stroke="#899780" />
          <path d="M12 5h21l7 8v30H12z" fill={paint('paper')} stroke="#9fa58e" />
          <path d="M33 5v8h7" fill="#d3d8c5" stroke="#9fa58e" />
          <rect x="17" y="13" width="8" height="10" rx="1" fill={paint('blue')} />
          <circle cx="21" cy="16.5" r="2" fill="#e8c3a0" />
          <path d="M18 22c0-5 6-5 6 0" fill="#485c51" />
          <path d="M28 17h7m-7 4h6M17 28h17m-17 4h17m-17 4h10" stroke="#9aa68e" strokeWidth="1.3" />
          <path
            d="m32 35 4 2 6-8"
            stroke="#b27856"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {kind === 'settings' && (
        <>
          <rect x="5" y="8" width="35" height="29" rx="3" fill={paint('paper')} stroke="#8e9b86" />
          <rect x="9" y="12" width="27" height="20" rx="1" fill={paint('blue')} />
          <circle cx="29" cy="18" r="4" fill="#f4df9c" />
          <path d="m9 29 8-11 8 11 5-7 6 10H9z" fill="#849d69" />
          <path d="m9 31 12-8 15 9H9z" fill="#4a7757" />
          <path d="m26 39 13-21 4 2-12 22-6 2z" fill="#b98053" stroke="#815d40" />
          <path d="m37 21 4 2-3 5-4-2z" fill="#d6d8cc" />
          <path d="m26 39 5 3-6 2z" fill="#435f51" />
          <path d="m39 20 2 1" stroke="#ecc49a" />
        </>
      )}
      {kind === 'info' && (
        <>
          <path d="m7 10 27-3 5 4v24H7z" fill="#c7ccb9" stroke="#8b9782" />
          <rect x="6" y="11" width="30" height="25" rx="3" fill={paint('paper')} stroke="#8b9782" />
          <rect x="10" y="15" width="22" height="16" rx="2" fill={paint('blue')} stroke="#536e73" />
          <path d="m11 28 7-6 5 3 8-5v10H11z" fill="#73906a" />
          <path d="M18 36v4h8v-4m-11 5h14" stroke="#9ca68d" strokeWidth="2" strokeLinecap="round" />
          <circle cx="31" cy="34" r=".8" fill="#6c976b" />
          <path d="m34 37 9-2 2 6-9 2z" fill="#b4c6cb" stroke="#829a9e" />
        </>
      )}
    </svg>
  )
}
