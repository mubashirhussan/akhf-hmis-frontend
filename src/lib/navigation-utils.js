import { footerLinks, navigation } from '@/config/navigation';
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
  buildUndeliveredReportHref,
} from '@/features/laboratory/utils/laboratory-navigation';

function flattenItems(items, parent = null) {
  const result = [];
  for (const item of items) {
    result.push({ ...item, parent });
    if (item.children?.length) {
      result.push(...flattenItems(item.children, item));
    }
  }
  return result;
}

const allItems = [
  ...flattenItems(navigation),
  ...footerLinks.map((link) => ({ ...link, parent: null })),
];

export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function findNavItemByHref(href) {
  const path = normalizePath(href);
  return allItems.find((item) => normalizePath(item.href) === path) ?? null;
}

export function getBreadcrumbs(pathname, searchParams) {
  const item = findNavItemByHref(pathname);
  if (!item) {
    return [{ label: 'Home', href: '/' }];
  }

  const crumbs = [];
  let current = item;
  while (current) {
    crumbs.unshift({ label: current.label, href: current.href });
    current = current.parent;
  }

  if (normalizePath(pathname) === '/laboratory/sample-collection') {
    const recordId = searchParams?.get?.('recordId');

    if (recordId) {
      const record = MOCK_LABORATORY_WORKLIST_ROWS.find((row) => row.id === recordId);
      const recordLabel = record ? `Lab #${record.labNo}` : 'Collect Sample';

      return [
        ...crumbs.slice(0, -1),
        { label: 'Sample Collection', href: '/laboratory/sample-collection' },
        { label: recordLabel, href: buildSampleCollectionHref(recordId) },
      ];
    }
  }
  if (normalizePath(pathname) === '/laboratory/sample-receiving') {
    const recordId = searchParams?.get?.('recordId');

    if (recordId) {
      const record = MOCK_LABORATORY_WORKLIST_ROWS.find((row) => row.id === recordId);
      const recordLabel = record ? `Lab #${record.labNo}` : 'Receive Sample';

      return [
        ...crumbs.slice(0, -1),
        { label: 'Sample Receiving', href: '/laboratory/sample-receiving' },
        { label: recordLabel, href: buildSampleReceivingHref(recordId) },
      ];
    }
  }



  if (normalizePath(pathname) === '/laboratory/result-entry') {
    const recordId = searchParams?.get?.('recordId');

    if (recordId) {
      const record = MOCK_LABORATORY_WORKLIST_ROWS.find((row) => row.id === recordId);
      const recordLabel = record ? `Lab #${record.labNo}` : 'Enter Result';

      return [
        ...crumbs.slice(0, -1),
        { label: 'Result Entry', href: '/laboratory/result-entry' },
        { label: recordLabel, href: buildResultEntryHref(recordId) },
      ];
    }
  }

  if (normalizePath(pathname) === '/laboratory/test-conducted') {
    const recordId = searchParams?.get?.('recordId');

    if (recordId) {
      const row = getWorklistRowById(recordId);
      const record = row ? resolveTestConductedRecord(row) : null;
      const recordLabel = record?.labNo ? `Lab #${record.labNo}` : 'Ready for Approval';

      return [
        ...crumbs.slice(0, -1),
        { label: 'Test Conducted', href: '/laboratory/test-conducted' },
        { label: recordLabel, href: buildTestConductedHref(recordId) },
      ];
    }
  }

  if (normalizePath(pathname) === '/laboratory/undelivered-reports') {
    const recordId = searchParams?.get?.('recordId');

    if (recordId) {
      const record = getWorklistRowById(recordId);
      const recordLabel = record?.labNo ? `Lab #${record.labNo}` : 'Report Delivery';

      return [
        ...crumbs.slice(0, -1),
        { label: 'Undelivered Reports', href: '/laboratory/undelivered-reports' },
        { label: recordLabel, href: buildUndeliveredReportHref(recordId) },
      ];
    }
  }

  if (normalizePath(pathname) === '/opd/services-billing') {
    const visitId = searchParams?.get?.('visitId');

    if (visitId) {
      const visit = MOCK_SERVICES_BILLING_VISITS.find((row) => row.id === visitId);
      const visitLabel = visit ? `Visit #${visit.visitNo}` : 'Visit Services';

      return [
        ...crumbs.slice(0, -1),
        { label: 'Services Billing', href: '/opd/services-billing' },
        { label: visitLabel, href: buildBillingVisitHref(visitId) },
      ];
    }
  }

  if (normalizePath(pathname) === '/opd/payment') {
    const visitId = searchParams?.get?.('visitId');

    if (visitId) {
      const visit = MOCK_SERVICES_BILLING_VISITS.find((row) => row.id === visitId);
      const visitLabel = visit ? `Visit #${visit.visitNo}` : 'Visit Payment';

      return [
        ...crumbs.slice(0, -1),
        { label: 'Payment', href: '/opd/payment' },
        { label: visitLabel, href: buildOpdPaymentHref(visitId) },
      ];
    }
  }

  return crumbs;
}

export function isPathActive(pathname, href) {
  const current = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === '/') return current === '/';
  return current === target || current.startsWith(`${target}/`);
}

export function hasActiveDescendant(item, pathname) {
  if (!item.children?.length) {
    return isPathActive(pathname, item.href);
  }

  return item.children.some((child) => hasActiveDescendant(child, pathname));
}

function collectExpandedKeys(items, pathname, keys) {
  for (const item of items) {
    if (!item.children?.length) continue;

    if (item.children.some((child) => hasActiveDescendant(child, pathname))) {
      keys.push(item.key);
      collectExpandedKeys(item.children, pathname, keys);
    }
  }
}

export function getExpandedKeys(pathname) {
  const keys = [];
  collectExpandedKeys(navigation, pathname, keys);
  return keys;
}
