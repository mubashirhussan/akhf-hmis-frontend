'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavIcon from '@/components/icons/NavIcon';
import { getBreadcrumbs } from '@/lib/navigation-utils';

function formatDate(date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function AppHeader() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex min-h-[76px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-[var(--hmis-header-bg)] px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-3">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <span key={crumb.href} className="flex items-center gap-3">
              {index > 0 && (
                <span className="header-breadcrumb-separator text-slate-400" aria-hidden>
                  ›
                </span>
              )}
              {isLast ? (
                <span className="header-breadcrumb text-slate-800">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="header-breadcrumb text-[var(--hmis-primary)] hover:underline"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <div className="header-datetime flex items-center gap-3 border border-slate-200/80 px-4 py-1.5">
          <span className="flex items-center gap-1.5">
            <NavIcon name="calendar" className="header-datetime-icon" strokeWidth={1.5} />
            <span className="header-datetime-text">{formatDate(now)}</span>
          </span>
          <span className="h-4 w-px bg-slate-200" aria-hidden />
          <span className="flex items-center gap-1.5">
            <NavIcon name="clock" className="header-datetime-icon" strokeWidth={1.5} />
            <span className="header-datetime-text">{formatTime(now)}</span>
          </span>
        </div>

        <span className="h-6 w-px bg-slate-200" aria-hidden />

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
          aria-label="Notifications"
        >
          <NavIcon name="bell" className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
}
