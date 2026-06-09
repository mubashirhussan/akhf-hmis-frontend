import { footerLinks, navigation } from '@/config/navigation-data';
import { MOCK_LABORATORY_WORKLIST_ROWS } from '@/data/mock-laboratory-worklist';
import { MOCK_SERVICES_BILLING_VISITS } from '@/data/mock-services-billing';
import { buildBillingVisitHref, buildOpdPaymentHref } from '@/lib/billing-navigation';
import { buildSampleCollectionHref } from '@/lib/laboratory-navigation';

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
