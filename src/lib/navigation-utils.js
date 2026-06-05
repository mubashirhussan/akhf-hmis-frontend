import { footerLinks, navigation } from '@/config/navigation-data';
import { MOCK_SERVICES_BILLING_VISITS } from '@/data/mock-services-billing';

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

  if (normalizePath(pathname) === '/opd/services-billing') {
    const visitId = searchParams?.get?.('visitId');
    if (visitId) {
      const visit = MOCK_SERVICES_BILLING_VISITS.find((row) => row.id === visitId);
      const visitLabel = visit ? `Visit #${visit.visitNo}` : 'Visit Services';

      return [
        ...crumbs.slice(0, -1),
        { label: 'Services Billing', href: '/opd/services-billing' },
        { label: visitLabel, href: `/opd/services-billing?visitId=${visitId}` },
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

export function getExpandedKeys(pathname) {
  const keys = [];
  for (const item of navigation) {
    if (item.children?.some((child) => isPathActive(pathname, child.href))) {
      keys.push(item.key);
    }
  }
  return keys;
}
