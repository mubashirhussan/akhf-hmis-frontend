const paths = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7h18v10H3z" />
      <path d="M16 12h4" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19V3" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.3 3.1-5 7-5s7 1.7 7 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 20c.5-2 2.2-3 4-3" />
    </>
  ),
  file: (
    <>
      <path d="M8 3h8l4 4v14H8z" />
      <path d="M16 3v5h5" />
    </>
  ),
  percent: (
    <>
      <circle cx="7" cy="7" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="m19 5-14 14" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a4 4 0 0 0 5.7.3l2-2a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 11a4 4 0 0 0-5.7-.3l-2 2a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0M8 19h2M12 19h2M16 19h0" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </>
  ),
  hospital: (
    <>
      <path d="M3 21V7l9-4 9 4v14" />
      <path d="M12 11v6M9 14h6" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M6 4v8a6 6 0 0 0 12 0V4" />
      <circle cx="20" cy="10" r="2" />
      <path d="M20 12v2a3 3 0 0 1-6 0" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4h6a2 2 0 0 1 0 4H9a2 2 0 0 1 0-4z" />
    </>
  ),
  box: (
    <>
      <path d="M12 3 21 7.5 12 12 3 7.5Z" />
      <path d="M3 7.5V16.5L12 21l9-4.5V7.5" />
    </>
  ),
  flask: (
    <>
      <path d="M10 3h4" />
      <path d="M9 3v6l-4 9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2l-4-9V3" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="4" cy="6" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="18" r="1" />
    </>
  ),
  droplet: (
    <path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z" />
  ),
  coins: (
    <>
      <circle cx="8" cy="8" r="5" />
      <path d="M13 13c3 0 6 1.5 6 4v2H8" />
    </>
  ),
  report: (
    <>
      <path d="M6 4h12v16H6z" />
      <path d="M9 9h6M9 13h6M9 17h4" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
    </>
  ),
  boxes: (
    <>
      <path d="M3 7h7v7H3zM14 7h7v7h-7zM8.5 14.5h7v7h-7z" />
    </>
  ),
  book: (
    <>
      <path d="M5 4h10a3 3 0 0 1 3 3v14H8a3 3 0 0 1-3-3z" />
      <path d="M8 4v17" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M7 14 5 21l7-3 7 3-2-7" />
    </>
  ),
  scan: (
    <>
      <path d="M4 7V5a1 1 0 0 1 1-1h2M20 7V5a1 1 0 0 0-1-1h-2M4 17v2a1 1 0 0 0 1 1h2M20 17v2a1 1 0 0 1-1 1h-2" />
      <path d="M7 12h10" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  refund: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 4.2 1.8c-.8.7-1.2 1.2-1.2 2.2" />
      <circle cx="12" cy="17" r=".8" fill="currentColor" stroke="none" />
    </>
  ),
  logout: (
    <>
      <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
      <path d="M14 12H8M18 8l4 4-4 4" />
    </>
  ),
  bell: (
    <>
      <path d="M12 3a5 5 0 0 0-5 5v4l-2 2h14l-2-2V8a5 5 0 0 0-5-5z" />
      <path d="M10 21h4" />
    </>
  ),
};

export default function NavIcon({ name, className = 'h-4 w-4 shrink-0', strokeWidth = 1.75 }) {
  const content = paths[name] ?? paths.file;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {content}
    </svg>
  );
}
