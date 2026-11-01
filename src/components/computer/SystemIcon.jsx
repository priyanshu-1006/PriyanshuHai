export default function SystemIcon({ name, className = '' }) {
  const paths = {
    home: (
      <>
        <path d="m3 11 9-8 9 8M6 10v11h12V10M10 21v-7h4v7" />
      </>
    ),
    access: (
      <>
        <circle cx="12" cy="4.5" r="2" />
        <path d="M4 9h16m-8-1v7m0 0-5 6m5-6 5 6M8 9l1 5m7-5-1 5" />
      </>
    ),
    sound: (
      <>
        <path d="M4 9h4l5-4v14l-5-4H4zM17 8c3 2 3 6 0 8m2-11c5 4 5 10 0 14" />
      </>
    ),
    mute: (
      <>
        <path d="M4 9h4l5-4v14l-5-4H4zM17 9l5 6m0-6-5 6" />
      </>
    ),
    keyboard: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="3" />
        <path d="M7 10h1m3 0h1m3 0h1m-9 3h1m3 0h1m3 0h2M8 16h8" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="m15 15 5 5" />
      </>
    ),
    reset: (
      <>
        <path d="M5 8a8 8 0 1 1-1 8M5 3v5h5" />
      </>
    ),
    chat: (
      <>
        <path d="M5 4h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-8l-6 3v-3H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM7 9h10m-10 5h6" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    power: (
      <>
        <path d="M12 3v9M7 5a9 9 0 1 0 10 0" />
      </>
    ),
    folder: <path d="M3 6h7l3 3h8v11H3zM3 11h18" />,
    desktop: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M9 21h6m-3-4v4" />
      </>
    ),
    check: <path d="m5 12 5 5L20 7" />,
  }
  return (
    <svg
      className={`system-icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.desktop}
    </svg>
  )
}
