
export const SERVICE_CATEGORY_OPTIONS = [
  { label: 'Laboratory', value: 'laboratory' },
  { label: 'Radiology', value: 'radiology' },
  { label: 'OPD Consultation', value: 'opd-consultation' },
  { label: 'Procedure', value: 'procedure' },
  { label: 'Miscellaneous', value: 'miscellaneous' },
];

export const INITIAL_SERVICE_CATEGORY_ROWS = [
  { id: '1', serviceName: 'Laboratory', value: 'laboratory' },
  { id: '2', serviceName: 'Radiology', value: 'radiology' },
  { id: '3', serviceName: 'OPD Consultation', value: 'opd-consultation' },
  { id: '4', serviceName: 'Procedure', value: 'procedure' },
  { id: '5', serviceName: 'Miscellaneous', value: 'miscellaneous' },
];

let serviceCategoryRows = INITIAL_SERVICE_CATEGORY_ROWS.map((row) => ({ ...row }));
let nextServiceCategoryId =
  Math.max(...INITIAL_SERVICE_CATEGORY_ROWS.map((row) => Number(row.id)), 0) + 1;

export function getServiceCategoryRows() {
  return serviceCategoryRows;
}

function createOptionValue(serviceName) {
  return serviceName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `category-${Date.now()}`;
}

export function createServiceCategoryRow(serviceName) {
  const value = createOptionValue(serviceName);
  const id = String(nextServiceCategoryId++);

  const row = {
    id,
    serviceName: serviceName.trim(),
    value,
  };

  serviceCategoryRows = [row, ...serviceCategoryRows];
  SERVICE_CATEGORY_OPTIONS.unshift({ label: row.serviceName, value: row.value });

  return row;
}

export function updateServiceCategoryRow(id, serviceName) {
  serviceCategoryRows = serviceCategoryRows.map((row) =>
    row.id === id ? { ...row, serviceName: serviceName.trim() } : row,
  );

  const updatedRow = serviceCategoryRows.find((row) => row.id === id);
  if (updatedRow) {
    const option = SERVICE_CATEGORY_OPTIONS.find((o) => o.value === updatedRow.value);
    if (option) {
      option.label = updatedRow.serviceName;
    }
  }

  return updatedRow ?? null;
}

export function deleteServiceCategoryRow(id) {
  const deletedRow = serviceCategoryRows.find((row) => row.id === id);
  serviceCategoryRows = serviceCategoryRows.filter((row) => row.id !== id);

  if (deletedRow) {
    const index = SERVICE_CATEGORY_OPTIONS.findIndex((o) => o.value === deletedRow.value);
    if (index !== -1) {
      SERVICE_CATEGORY_OPTIONS.splice(index, 1);
    }
  }
}

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
    serviceName: 'Blood Sugar Fasting',
    serviceCategory: 'laboratory',
    serviceCharges: 400,
    serviceChargesBefore: 'false',
    serviceEditPrice: 'false',
    serviceHead: 'laboratory-income',
    activeStatus: 'active',
  },
  {
    id: '3',
    serviceName: 'Liver Function Test',
    serviceCategory: 'laboratory',
    serviceCharges: 1800,
    serviceChargesBefore: 'false',
    serviceEditPrice: 'true',
    serviceHead: 'laboratory-income',
    activeStatus: 'active',
  },
  {
    id: '4',
    serviceName: 'Urine Routine Examination',
    serviceCategory: 'laboratory',
    serviceCharges: 350,
    serviceChargesBefore: 'false',
    serviceEditPrice: 'false',
    serviceHead: 'laboratory-income',
    activeStatus: 'active',
  },
  {
    id: '5',
    serviceName: 'Chest X-Ray',
    serviceCategory: 'radiology',
    serviceCharges: 2500,
    serviceChargesBefore: 'true',
    serviceEditPrice: 'true',
    serviceHead: 'radiology-income',
    activeStatus: 'active',
  },
  {
    id: '6',
    serviceName: 'Ultrasound Abdomen',
    serviceCategory: 'radiology',
    serviceCharges: 3500,
    serviceChargesBefore: 'true',
    serviceEditPrice: 'true',
    serviceHead: 'radiology-income',
    activeStatus: 'active',
  },
  {
    id: '7',
    serviceName: 'CT Scan Brain',
    serviceCategory: 'radiology',
    serviceCharges: 12000,
    serviceChargesBefore: 'true',
    serviceEditPrice: 'true',
    serviceHead: 'radiology-income',
    activeStatus: 'active',
  },
  {
    id: '8',
    serviceName: 'MRI Spine',
    serviceCategory: 'radiology',
    serviceCharges: 18000,
    serviceChargesBefore: 'true',
    serviceEditPrice: 'true',
    serviceHead: 'radiology-income',
    activeStatus: 'active',
  },
  {
    id: '9',
    serviceName: 'General OPD Consultation',
    serviceCategory: 'opd-consultation',
    serviceCharges: 500,
    serviceChargesBefore: 'false',
    serviceEditPrice: 'false',
    serviceHead: 'opd-income',
    activeStatus: 'active',
  },
  {
    id: '10',
    serviceName: 'Specialist Consultation',
    serviceCategory: 'opd-consultation',
    serviceCharges: 1500,
    serviceChargesBefore: 'false',
    serviceEditPrice: 'false',
    serviceHead: 'opd-income',
    activeStatus: 'active',
  },
  {
    id: '11',
    serviceName: 'Follow Up Consultation',
    serviceCategory: 'opd-consultation',
    serviceCharges: 300,
    serviceChargesBefore: 'false',
    serviceEditPrice: 'false',
    serviceHead: 'opd-income',
    activeStatus: 'active',
  },
  {
    id: '12',
    serviceName: 'Minor Surgical Procedure',
    serviceCategory: 'procedure',
    serviceCharges: 5000,
    serviceChargesBefore: 'true',
    serviceEditPrice: 'true',
    serviceHead: 'procedure-income',
    activeStatus: 'active',
  },
  {
    id: '13',
    serviceName: 'Dressing and Wound Care',
    serviceCategory: 'procedure',
    serviceCharges: 800,
    serviceChargesBefore: 'false',
    serviceEditPrice: 'false',
    serviceHead: 'procedure-income',
    activeStatus: 'active',
  },
  {
    id: '14',
    serviceName: 'IV Cannulation',
    serviceCategory: 'procedure',
    serviceCharges: 600,
    serviceChargesBefore: 'false',
    serviceEditPrice: 'false',
    serviceHead: 'procedure-income',
    activeStatus: 'active',
  },
  {
    id: '15',
    serviceName: 'Nebulization',
    serviceCategory: 'procedure',
    serviceCharges: 400,
    serviceChargesBefore: 'false',
    serviceEditPrice: 'false',
    serviceHead: 'procedure-income',
    activeStatus: 'active',
  },
  {
    id: '16',
    serviceName: 'Ambulance Service',
    serviceCategory: 'miscellaneous',
    serviceCharges: 2000,
    serviceChargesBefore: 'true',
    serviceEditPrice: 'true',
    serviceHead: 'opd-income',
    activeStatus: 'active',
  },
  {
    id: '17',
    serviceName: 'Medical Certificate',
    serviceCategory: 'miscellaneous',
    serviceCharges: 500,
    serviceChargesBefore: 'false',
    serviceEditPrice: 'false',
    serviceHead: 'opd-income',
    activeStatus: 'active',
  },
  {
    id: '18',
    serviceName: 'Physiotherapy Session',
    serviceCategory: 'miscellaneous',
    serviceCharges: 1200,
    serviceChargesBefore: 'false',
    serviceEditPrice: 'true',
    serviceHead: 'ipd-income',
    activeStatus: 'active',
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
    department: '',
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
    department: row.department ?? '',
    serviceName: row.serviceName ?? '',
    serviceCategory: row.serviceCategory ?? '',
    serviceCharges: row.serviceCharges ?? 0,
    serviceChargesBefore: row.serviceChargesBefore ?? 'true',
    serviceEditPrice: row.serviceEditPrice ?? 'false',
    serviceHead: row.serviceHead ?? 'opd-income',
  };
}

let hospitalServicePrices = {};

export function getHospitalServicePrice(hospitalId, serviceId) {
  const key = `${hospitalId}_${serviceId}`;
  return hospitalServicePrices[key] ?? null;
}

export function setHospitalServicePrice(hospitalId, serviceId, price) {
  const key = `${hospitalId}_${serviceId}`;
  hospitalServicePrices[key] = { hospitalId, serviceId, price };
}

export function bulkUpdateHospitalServicePrices(hospitalId, serviceIds, type, percentage) {
  serviceIds.forEach((serviceId) => {
    const key = `${hospitalId}_${serviceId}`;
    const existing = hospitalServicePrices[key];
    const basePrice = existing != null
      ? existing.price
      : (serviceAdminRows.find((r) => r.id === serviceId)?.serviceCharges ?? 0);
    const delta = (basePrice * percentage) / 100;
    const newPrice = type === 'increase'
      ? Math.round(basePrice + delta)
      : Math.max(0, Math.round(basePrice - delta));
    hospitalServicePrices[key] = { hospitalId, serviceId, price: newPrice };
  });
}

export function getHospitalServicesRows(hospitalId, categoryFilter, nameFilter) {
  let result = serviceAdminRows;
  if (categoryFilter) {
    result = result.filter((r) => r.serviceCategory === categoryFilter);
  }
  if (nameFilter?.trim()) {
    result = result.filter((r) =>
      r.serviceName?.toLowerCase().includes(nameFilter.trim().toLowerCase()),
    );
  }
  return result.map((r) => {
    const override = hospitalServicePrices[`${hospitalId}_${r.id}`];
    return {
      ...r,
      price: override != null ? override.price : r.serviceCharges,
    };
  });
}

export const WARD_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Female Ward', value: 'female-ward' },
  { label: 'Male Ward', value: 'male-ward' },
];

export const PACKAGE_SERVICE_HEAD_OPTIONS = [
  { label: 'Cafe Income', value: 'cafe-income' },
  { label: 'Clean Water', value: 'clean-water' },
  { label: 'Rental Income', value: 'rental-income' },
  { label: 'Radiology Income', value: 'radiology-income' },
];

export const INITIAL_PACKAGE_ROWS = [
  {
    id: '1',
    ward: 'female-ward',
    department: 'dept-1',
    packageName: 'Basic Laboratory Package',
    totalAmount: 5000,
    doctorShare: 1000,
    description: 'Core lab tests for outpatient care',
    serviceHead: 'laboratory-income',
    serviceCategory: 'laboratory',
    services: ['Complete Blood Count', 'Blood Sugar Fasting'],
  },
  {
    id: '2',
    ward: 'male-ward',
    department: 'dept-2',
    packageName: 'Radiology Screening Pack',
    totalAmount: 15000,
    doctorShare: 3000,
    description: 'Chest X-ray and ultrasound bundle',
    serviceHead: 'radiology-income',
    serviceCategory: 'radiology',
    services: ['Chest X-Ray', 'Ultrasound Abdomen'],
  },
  {
    id: '3',
    ward: 'female-ward',
    department: 'dept-3',
    packageName: 'OPD Consultation Bundle',
    totalAmount: 3200,
    doctorShare: 800,
    description: 'Consultation services for routine visits',
    serviceHead: 'opd-income',
    serviceCategory: 'opd-consultation',
    services: ['General OPD Consultation', 'Follow Up Consultation'],
  },
  {
    id: '4',
    ward: 'male-ward',
    department: 'dept-4',
    packageName: 'Minor Procedure Package',
    totalAmount: 7800,
    doctorShare: 1500,
    description: 'Procedure package for minor interventions',
    serviceHead: 'procedure-income',
    serviceCategory: 'procedure',
    services: ['Minor Surgical Procedure', 'Dressing and Wound Care'],
  },
];

let packageRows = INITIAL_PACKAGE_ROWS.map((row) => ({
  ...row,
  onDate: row.onDate ?? new Date().toISOString(),
}));
let nextPackageId = Math.max(...INITIAL_PACKAGE_ROWS.map((row) => Number(row.id ?? 0)), 0) + 1;

export function getPackageRows() {
  return packageRows;
}

export function createPackageRow(payload) {
  const id = String(nextPackageId++);
  const row = { id, onDate: new Date().toISOString(), ...payload };
  packageRows = [row, ...packageRows];
  return row;
}

export function updatePackageRow(id, payload) {
  packageRows = packageRows.map((row) =>
    row.id === id ? { ...row, ...payload } : row,
  );
  return packageRows.find((row) => row.id === id) ?? null;
}

export function deletePackageRow(id) {
  packageRows = packageRows.filter((row) => row.id !== id);
}

export function createEmptyPackageForm() {
  return {
    ward: '',
    department: '',
    packageName: '',
    totalAmount: null,
    doctorShare: null,
    description: '',
    serviceHead: '',
    serviceCategory: '',
    services: [],
  };
}

export function rowToPackageForm(row) {
  return {
    ward: row.ward ?? '',
    department: row.department ?? '',
    packageName: row.packageName ?? '',
    totalAmount: row.totalAmount ?? null,
    doctorShare: row.doctorShare ?? null,
    description: row.description ?? '',
    serviceHead: row.serviceHead ?? '',
    serviceCategory: row.serviceCategory ?? '',
    services: row.services ?? [],
  };
}