'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppIcon from '@/components/icons/AppIcon';
import { findNavItemByHref, normalizePath } from '@/components/layout/sidebar-nav';
import {
  getWorklistRowById,
  MOCK_LABORATORY_WORKLIST_ROWS,
} from '@/features/laboratory/api/mock-laboratory-worklist';
import { resolveTestConductedRecord } from '@/features/laboratory/api/mock-test-conducted';
import { MOCK_SERVICES_BILLING_VISITS } from '@/features/billing/api/mock-services-billing';
import { buildBillingVisitHref, buildOpdPaymentHref } from '@/features/billing/utils/billing-navigation';
import {
  buildResultEntryHref,
  buildSampleCollectionHref,
  buildSampleReceivingHref,
  buildTestConductedHref,
  buildDeliveredReportHref,
  buildUndeliveredReportHref,
} from '@/features/laboratory/utils/laboratory-navigation';

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

function getBreadcrumbs(pathname, searchParams) {
  const item = findNavItemByHref(pathname);
  if (!item) {
    return [{ label: 'Home', href: '/' }];
  }

  const baseCrumb = { label: item.label, href: item.href };
  const path = normalizePath(pathname);
  const recordId = searchParams?.get?.('recordId');
  const visitId = searchParams?.get?.('visitId');

  if (path === '/laboratory/sample-collection' && recordId) {
    const record = MOCK_LABORATORY_WORKLIST_ROWS.find((row) => row.id === recordId);
    return [
      baseCrumb,
      {
        label: record ? `Lab #${record.labNo}` : 'Collect Sample',
        href: buildSampleCollectionHref(recordId),
      },
    ];
  }

  if (path === '/laboratory/sample-receiving' && recordId) {
    const record = MOCK_LABORATORY_WORKLIST_ROWS.find((row) => row.id === recordId);
    return [
      baseCrumb,
      {
        label: record ? `Lab #${record.labNo}` : 'Receive Sample',
        href: buildSampleReceivingHref(recordId),
      },
    ];
  }

  if (path === '/laboratory/result-entry' && recordId) {
    const record = MOCK_LABORATORY_WORKLIST_ROWS.find((row) => row.id === recordId);
    return [
      baseCrumb,
      {
        label: record ? `Lab #${record.labNo}` : 'Enter Result',
        href: buildResultEntryHref(recordId),
      },
    ];
  }

  if (path === '/laboratory/test-conducted' && recordId) {
    const row = getWorklistRowById(recordId);
    const record = row ? resolveTestConductedRecord(row) : null;
    return [
      baseCrumb,
      {
        label: record?.labNo ? `Lab #${record.labNo}` : 'Ready for Approval',
        href: buildTestConductedHref(recordId),
      },
    ];
  }

  if (path === '/laboratory/undelivered-reports' && recordId) {
    const record = getWorklistRowById(recordId);
    return [
      baseCrumb,
      {
        label: record?.labNo ? `Lab #${record.labNo}` : 'Report Delivery',
        href: buildUndeliveredReportHref(recordId),
      },
    ];
  }

  if (path === '/laboratory/delivered-reports' && recordId) {
    const record = getWorklistRowById(recordId);
    return [
      baseCrumb,
      {
        label: record?.labNo ? `Lab #${record.labNo}` : 'Report Delivery',
        href: buildDeliveredReportHref(recordId),
      },
    ];
  }

  if (path === '/opd/services-billing' && visitId) {
    const visit = MOCK_SERVICES_BILLING_VISITS.find((row) => row.id === visitId);
    return [
      baseCrumb,
      {
        label: visit ? `Visit #${visit.visitNo}` : 'Visit Services',
        href: buildBillingVisitHref(visitId),
      },
    ];
  }

  if (path === '/opd/payment' && visitId) {
    const visit = MOCK_SERVICES_BILLING_VISITS.find((row) => row.id === visitId);
    return [
      baseCrumb,
      {
        label: visit ? `Visit #${visit.visitNo}` : 'Visit Payment',
        href: buildOpdPaymentHref(visitId),
      },
    ];
  }

  return [baseCrumb];
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
