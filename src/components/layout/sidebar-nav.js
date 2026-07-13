/**
 * Sidebar menu — only routes that have a real `app/(protected)/.../page` file.
 */
export const navigation = [
  {
    key: 'opd',
    label: 'OPD',
    href: '/opd',
    icon: 'mdi:chart-bar',
    children: [
      { key: 'patient-registration', label: 'Patient Registration', href: '/opd/patient-registration' },
      { key: 'walk-in-patient', label: 'Walk-in patient', href: '/opd/walk-in-patient' },
      { key: 'patient-search', label: 'Patient Search', href: '/opd/patient-search' },
      { key: 'opd-payment', label: 'Payment', href: '/opd/payment' },
      { key: 'emergency-registration', label: 'Emergency Registration', href: '/opd/emergency-registration' },
      { key: 'services-billing', label: 'Services Billing', href: '/opd/services-billing' },
    ],
  },
  {
    key: 'admin-pathology',
    label: 'Admin Pathology',
    href: '/admin-pathology',
    icon: 'mdi:microscope',
    children: [
      { key: 'pathology-main-group', label: 'Main Group', href: '/admin-pathology/main-group' },
      { key: 'pathology-sub-group', label: 'Sub Group', href: '/admin-pathology/sub-group' },
      { key: 'pathology-test-name', label: 'Test Name', href: '/admin-pathology/test-name' },
      { key: 'pathology-component', label: 'Component', href: '/admin-pathology/pathology-component' },
      { key: 'pathology-test-range', label: 'Test Range', href: '/admin-pathology/test-range' },
      { key: 'pathology-test-booking', label: 'Test Booking', href: '/admin-pathology/test-booking' },
      { key: 'map-pathology-services', label: 'Map Services', href: '/admin-pathology/map-services' },
      { key: 'pathology-report-consultant', label: 'Report Consultant', href: '/admin-pathology/report-consultant' },
      { key: 'add-interpretation', label: 'Add Interpretation', href: '/admin-pathology/interpretation' },
      {
        key: 'machine-integration-compwise',
        label: 'Machine Integration Component Wise',
        href: '/admin-pathology/machine-integration-compwise',
      },
    ],
  },
  {
    key: 'laboratory',
    label: 'Laboratory',
    href: '/laboratory',
    icon: 'mdi:flask-outline',
    children: [
      { key: 'sample-collection', label: 'Sample Collection', href: '/laboratory/sample-collection' },
      { key: 'sample-receiving', label: 'Sample Receiving', href: '/laboratory/sample-receiving' },
      { key: 'result-entry', label: 'Result Entry', href: '/laboratory/result-entry' },
      { key: 'test-conducted', label: 'Test Conducted', href: '/laboratory/test-conducted' },
      { key: 'undelivered-reports', label: 'Undelivered Reports', href: '/laboratory/undelivered-reports' },
      { key: 'delivered-reports', label: 'Delivered Reports', href: '/laboratory/delivered-reports' },
    ],
  },
  {
    key: 'service-admin',
    label: 'Service Admin',
    href: '/service-admin',
    icon: 'mdi:account-cog-outline',
    children: [
      { key: 'new-category', label: 'Service Category', href: '/service-admin/new-category' },
      { key: 'admin-services', label: 'Admin Services', href: '/service-admin/admin-services' },
      { key: 'hospital-services', label: 'Hospital Services', href: '/service-admin/hospital-services' },
      { key: 'update-admin-services', label: 'Update Admin Services', href: '/service-admin/update-admin-services' },
      { key: 'new-package', label: 'New Package', href: '/service-admin/new-package' },
      { key: 'discount-authorities', label: 'Discount Authorities', href: '/service-admin/discount-authorities' },
      { key: 'refund-authorities', label: 'Refund Authorities', href: '/service-admin/refund-authorities' },
      { key: 'add-report-header', label: 'Add Report Header', href: '/service-admin/add-report-header' },
      { key: 'new-company', label: 'New Company', href: '/service-admin/new-company' },
      { key: 'assign-company-rates', label: 'Company Rates', href: '/service-admin/assign-company-rates' },
      { key: 'patient-type', label: 'Patient Type', href: '/service-admin/patient-type' },
      { key: 'assign-opd-services', label: 'Assign OPD Services', href: '/service-admin/assign-opd-services' },
      { key: 'ward-beds', label: 'Ward Beds', href: '/service-admin/ward-beds' },
      { key: 'assign-bed-location', label: 'Assign Bed Location', href: '/service-admin/assign-bed-location' },
    ],
  },
  {
    key: 'human-resource',
    label: 'Human Resource',
    href: '/human-resource',
    icon: 'mdi:account-group-outline',
    children: [
      { key: 'employee-entry', label: 'Add Employee', href: '/human-resource/employee-entry' },
      { key: 'search-all-employee', label: 'Search All Employee', href: '/human-resource/search-all-employee' },
      { key: 'activate-employee', label: 'Activate Employee', href: '/human-resource/activate-employee' },
      { key: 'add-hospital', label: 'Add Hospital', href: '/human-resource/add-hospital' },
      { key: 'department-type', label: 'Department Type', href: '/human-resource/department-type' },
      { key: 'add-department', label: 'Add Department', href: '/human-resource/add-department' },
      { key: 'sub-department-type', label: 'Sub Department Type', href: '/human-resource/sub-department-type' },
      { key: 'add-sub-department', label: 'Add Sub Department', href: '/human-resource/add-sub-department' },
      { key: 'add-designation', label: 'Add Designation', href: '/human-resource/add-designation' },
      { key: 'change-department', label: 'Change Department', href: '/human-resource/change-department' },
      { key: 'mark-receptionist', label: 'Mark Receptionist', href: '/human-resource/mark-receptionist' },
      { key: 'mark-visiting', label: 'Mark Visiting', href: '/human-resource/mark-visiting' },
    ],
  },
  {
    key: 'duty-roaster',
    label: 'Duty Roaster',
    href: '/duty-roaster',
    icon: 'mdi:calendar-clock',
    children: [
      { key: 'add-shift', label: 'Add Shift', href: '/duty-roaster/add-shift' },
      { key: 'admin-duty-roaster', label: 'Admin Duty Roaster', href: '/duty-roaster/admin-duty-roaster' },
      { key: 'assign-duty-to-employee', label: 'Assign Duty To Employee', href: '/duty-roaster/assign-duty-to-employee' },
    ],
  },
  {
    key: 'user-role',
    label: 'User Role & Mng.',
    href: '/user-role',
    icon: 'carbon:user',
    children: [
      { key: 'create-login', label: 'Create Login', href: '/user-role/create-login' },
    ],
  },
  { key: 'pharmacy', label: 'Pharmacy', href: '/pharmacy', icon: 'mdi:pharmacy' },
  { key: 'billing', label: 'Billing', href: '/billing', icon: 'mdi:receipt-text-outline' },
  { key: 'settings', label: 'Settings', href: '/settings', icon: 'mdi:cog-outline' },
];

export const footerLinks = [
  { key: 'logout', label: 'Logout', href: '/logout', icon: 'mdi:logout' },
];

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
