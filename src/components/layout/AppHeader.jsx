'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppIcon from '@/components/icons/AppIcon';
import { getBreadcrumbs } from '@/lib/navigation-utils';

function formatDate(date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateCompact(date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
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
  const searchParams = useSearchParams();
  const breadcrumbs = getBreadcrumbs(pathname, searchParams);
  const [now, setNow] = useState(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="app-header">
      <nav aria-label="Breadcrumb" className="app-header-breadcrumb-nav">
        <ol className="app-header-breadcrumb-list">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li
                key={`${crumb.href}-${crumb.label}`}
                className="app-header-breadcrumb-item"
              >
                {index > 0 ? (
                  <AppIcon
                    icon="mdi:chevron-right"
                    className="header-breadcrumb-separator"
                    aria-hidden
                  />
                ) : null}
                {isLast ? (
                  <span className="header-breadcrumb" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="header-breadcrumb">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="app-header-actions">
        <div className="header-datetime" aria-live="polite">
          <span className="header-datetime__text header-datetime__text--date header-datetime__text--date-full">
            {now ? formatDate(now) : '\u00A0'}
          </span>
          <span className="header-datetime__text header-datetime__text--date header-datetime__text--date-compact">
            {now ? formatDateCompact(now) : '\u00A0'}
          </span>
          <span className="header-datetime__divider" aria-hidden />
          <span className="header-datetime__text header-datetime__text--time">
            {now ? formatTime(now) : '\u00A0'}
          </span>
        </div>

        <span className="app-header-actions-divider" aria-hidden />

        <button
          type="button"
          className="app-header-notifications-btn"
          aria-label="Notifications"
        >
          <AppIcon icon="mdi:bell-outline" className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
}
