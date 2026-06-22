export const SERVICE_CATEGORY_OPTIONS = [
  { label: 'Laboratory', value: 'laboratory' },
  { label: 'Radiology', value: 'radiology' },
  { label: 'OPD Consultation', value: 'opd-consultation' },
  { label: 'Procedure', value: 'procedure' },
  { label: 'Miscellaneous', value: 'miscellaneous' },
];

export const BOOLEAN_OPTIONS = [
  { label: 'True', value: 'true' },
  { label: 'False', value: 'false' },
];

export const SERVICE_HEAD_OPTIONS = [
  { label: 'OPD Income', value: 'opd-income' },
  { label: 'IPD Income', value: 'ipd-income' },
  { label: 'Laboratory Income', value: 'laboratory-income' },
  { label: 'Radiology Income', value: 'radiology-income' },
  { label: 'Procedure Income', value: 'procedure-income' },
];

export const ACTIVE_STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export function getServiceCategoryLabel(value) {
  return SERVICE_CATEGORY_OPTIONS.find((o) => o.value === value)?.label ?? value ?? '';
}

export function getServiceHeadLabel(value) {
  return SERVICE_HEAD_OPTIONS.find((o) => o.value === value)?.label ?? value ?? '';
}

export function getBooleanLabel(value) {
  return BOOLEAN_OPTIONS.find((o) => o.value === value)?.label ?? value ?? '';
}

export function getActiveStatusLabel(value) {
  return ACTIVE_STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value ?? '';
}

export const INITIAL_SERVICE_ADMIN_ROWS = [
  {
    id: '1',
    serviceName: 'Complete Blood Count',
    serviceCategory: 'laboratory',
    serviceCharges: 1200,
    serviceChargesBefore: 'false',
    serviceEditPrice: 'false',
    serviceHead: 'laboratory-income',
    activeStatus: 'active',
  },
  {
    id: '2',
    serviceName: 'Chest X-Ray',
    serviceCategory: 'radiology',
    serviceCharges: 2500,
    serviceChargesBefore: 'true',
    serviceEditPrice: 'true',
    serviceHead: 'radiology-income',
    activeStatus: 'active',
  },
  {
    id: '3',
    serviceName: 'General OPD Consultation',
    serviceCategory: 'opd-consultation',
    serviceCharges: 500,
    serviceChargesBefore: 'false',
    serviceEditPrice: 'false',
    serviceHead: 'opd-income',
    activeStatus: 'inactive',
  },
];

let serviceAdminRows = INITIAL_SERVICE_ADMIN_ROWS.map((row) => ({ ...row }));

let nextServiceAdminId =
  Math.max(...INITIAL_SERVICE_ADMIN_ROWS.map((row) => Number(row.id)), 0) + 1;

export function getServiceAdminRows() {
  return serviceAdminRows;
}

export function createServiceAdminRow(rowPayload) {
  const id = String(nextServiceAdminId++);

  const row = {
    id,
    activeStatus: 'active',
    ...rowPayload,
  };

  serviceAdminRows = [row, ...serviceAdminRows];

  return row;
}

export function updateServiceAdminRow(id, rowPayload) {
  serviceAdminRows = serviceAdminRows.map((row) =>
    row.id === id ? { ...row, ...rowPayload } : row,
  );

  return serviceAdminRows.find((row) => row.id === id) ?? null;
}

export function deleteServiceAdminRow(id) {
  serviceAdminRows = serviceAdminRows.filter((row) => row.id !== id);
}

export function createEmptyServiceAdminForm() {
  return {
    serviceName: '',
    serviceCategory: '',
    serviceCharges: 0,
    serviceChargesBefore: 'true',
    serviceEditPrice: 'false',
    serviceHead: 'opd-income',
  };
}

export function rowToServiceAdminForm(row) {
  return {
    serviceName: row.serviceName ?? '',
    serviceCategory: row.serviceCategory ?? '',
    serviceCharges: row.serviceCharges ?? 0,
    serviceChargesBefore: row.serviceChargesBefore ?? 'true',
    serviceEditPrice: row.serviceEditPrice ?? 'false',
    serviceHead: row.serviceHead ?? 'opd-income',
  };
}
