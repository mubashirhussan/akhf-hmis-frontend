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