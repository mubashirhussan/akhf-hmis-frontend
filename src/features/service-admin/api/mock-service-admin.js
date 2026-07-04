
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

export const INITIAL_DISCOUNT_AUTHORITY_ROWS = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'Aisha Khan',
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Bilal Ahmed',
  },
  {
    id: '3',
    employeeId: '103',
    employeeName: 'Farah Siddiqui',
  },
];
let discountAuthorityRows = INITIAL_DISCOUNT_AUTHORITY_ROWS.map((row) => ({ ...row }));
let nextDiscountAuthorityId =
  Math.max(...INITIAL_DISCOUNT_AUTHORITY_ROWS.map((row) => Number(row.id)), 0) + 1;

export function getDiscountAuthorityRows() {
  return discountAuthorityRows;
}

export function createDiscountAuthorityRow(payload) {
  const id = String(nextDiscountAuthorityId++);
  const row = { id, ...payload };
  discountAuthorityRows = [row, ...discountAuthorityRows];
  return row;
}

export function deleteDiscountAuthorityRow(id) {
  discountAuthorityRows = discountAuthorityRows.filter((row) => row.id !== id);
}

export const INITIAL_REFUND_AUTHORITY_ROWS = [
  {
    id: '1',
    employeeId: '201',
    employeeName: 'Hassan Raza',
  },
  {
    id: '2',
    employeeId: '202',
    employeeName: 'Nida Mir',
  },
  {
    id: '3',
    employeeId: '203',
    employeeName: 'Adil Sheikh',
  },
];
let refundAuthorityRows = INITIAL_REFUND_AUTHORITY_ROWS.map((row) => ({ ...row }));
let nextRefundAuthorityId =
  Math.max(...INITIAL_REFUND_AUTHORITY_ROWS.map((row) => Number(row.id)), 0) + 1;

export function getRefundAuthorityRows() {
  return refundAuthorityRows;
}

export function createRefundAuthorityRow(payload) {
  const id = String(nextRefundAuthorityId++);
  const row = { id, ...payload };
  refundAuthorityRows = [row, ...refundAuthorityRows];
  return row;
}

export function deleteRefundAuthorityRow(id) {
  refundAuthorityRows = refundAuthorityRows.filter((row) => row.id !== id);
}

export const INITIAL_REPORT_HEADER_ROWS = [];
let reportHeaderRows = INITIAL_REPORT_HEADER_ROWS.map((row) => ({ ...row }));
let nextReportHeaderId = 1;

export function getReportHeaderRows() {
  return reportHeaderRows;
}

export function createReportHeaderRow(payload) {
  const id = String(nextReportHeaderId++);
  const row = { id, ...payload };
  reportHeaderRows = [row, ...reportHeaderRows];
  return row;
}

export function updateReportHeaderRow(id, payload) {
  reportHeaderRows = reportHeaderRows.map((row) =>
    row.id === id ? { ...row, ...payload } : row,
  );
  return reportHeaderRows.find((row) => row.id === id) ?? null;
}

export function deleteReportHeaderRow(id) {
  reportHeaderRows = reportHeaderRows.filter((row) => row.id !== id);
}

export const INITIAL_COMPANY_ROWS = [
  {
    id: '1',
    companyType: 'gov',
    companyName: 'National Health Services',
    ntn: '1234567-8',
    city: 'Lahore',
    address: '123 Health Avenue, Lahore',
    contactPersonName: 'Dr. Saima Iqbal',
    cnic: '42101-1234567-1',
    phone: '042-12345678',
    fax: '042-87654321',
    email: 'info@nhs.gov.pk',
    website: 'www.nhs.gov.pk',
    str: 'STR0012345',
    bankAccount: '0011223344556677',
    status: 'individuals',
  },
  {
    id: '2',
    companyType: 'semi-gov',
    companyName: 'City Medical Supplies',
    ntn: '2345678-9',
    city: 'Karachi',
    address: '45 Medical Plaza, Karachi',
    contactPersonName: 'Sara Ali',
    cnic: '42201-2345678-2',
    phone: '021-23456789',
    fax: '021-98765432',
    email: 'contact@citymed.com',
    website: 'www.citymed.com',
    str: 'STR0023456',
    bankAccount: '1122334455667788',
    status: 'business',
  },
  {
    id: '3',
    companyType: 'priv',
    companyName: 'Care Plus Diagnostics',
    ntn: '3456789-0',
    city: 'Islamabad',
    address: '99 Diagnostic Road, Islamabad',
    contactPersonName: 'Omar Khan',
    cnic: '42301-3456789-3',
    phone: '051-34567890',
    fax: '051-09876543',
    email: 'support@careplus.pk',
    website: 'www.careplus.pk',
    str: 'STR0034567',
    bankAccount: '2233445566778899',
    status: 'trust',
  },
];
let companyRows = INITIAL_COMPANY_ROWS.map((row) => ({ ...row }));
let nextCompanyId =
  Math.max(...INITIAL_COMPANY_ROWS.map((row) => Number(row.id)), 0) + 1;

export function getCompanyRows() {
  return companyRows;
}

export function createCompanyRow(payload) {
  const id = String(nextCompanyId++);
  const row = { id, ...payload };
  companyRows = [row, ...companyRows];
  return row;
}

export function updateCompanyRow(id, payload) {
  companyRows = companyRows.map((row) =>
    row.id === id ? { ...row, ...payload } : row,
  );
  return companyRows.find((row) => row.id === id) ?? null;
}

export function deleteCompanyRow(id) {
  companyRows = companyRows.filter((row) => row.id !== id);
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

export function bulkUpdateHospitalServicePrices(hospitalId, serviceIds, type, percentage, fixedAmount) {
  serviceIds.forEach((serviceId) => {
    const key = `${hospitalId}_${serviceId}`;
    const existing = hospitalServicePrices[key];
    const basePrice = existing != null
      ? existing.price
      : (serviceAdminRows.find((r) => r.id === serviceId)?.serviceCharges ?? 0);
    let delta;
    if (fixedAmount != null) {
      delta = fixedAmount;
    } else {
      delta = (basePrice * percentage) / 100;
    }
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

let companyServicePrices = {};

export function getCompanyServicePrice(companyId, serviceId) {
  const key = `${companyId}_${serviceId}`;
  return companyServicePrices[key] ?? null;
}

export function setCompanyServicePrice(companyId, serviceId, price) {
  const key = `${companyId}_${serviceId}`;
  companyServicePrices[key] = { companyId, serviceId, price };
}

export function bulkUpdateCompanyServicePrices(companyId, serviceIds, type, percentage, fixedAmount) {
  serviceIds.forEach((serviceId) => {
    const key = `${companyId}_${serviceId}`;
    const existing = companyServicePrices[key];
    const basePrice = existing != null
      ? existing.price
      : (serviceAdminRows.find((r) => r.id === serviceId)?.serviceCharges ?? 0);
    let delta;
    if (fixedAmount != null) {
      delta = fixedAmount;
    } else {
      delta = (basePrice * percentage) / 100;
    }
    const newPrice = type === 'increase'
      ? Math.round(basePrice + delta)
      : Math.max(0, Math.round(basePrice - delta));
    companyServicePrices[key] = { companyId, serviceId, price: newPrice };
  });
}

export function getCompanyServicesRows(companyId, categoryFilter, nameFilter) {
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
    const override = companyServicePrices[`${companyId}_${r.id}`];
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
    totalAmount: 1300,
    doctorShare: 200,
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
    totalAmount: 5000,
    doctorShare: 1000,
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
    totalAmount: 650,
    doctorShare: 150,
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
    totalAmount: 4800,
    doctorShare: 800,
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

export const B2B_LABS_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const INITIAL_PATIENT_TYPE_ROWS = [
  { id: '1', patientType: 'Indoor', b2bLabs: 'no', status: 'active' },
  { id: '2', patientType: 'Outdoor', b2bLabs: 'yes', status: 'active' },
];

let patientTypeRows = INITIAL_PATIENT_TYPE_ROWS.map((row) => ({ ...row }));
let nextPatientTypeId =
  Math.max(...INITIAL_PATIENT_TYPE_ROWS.map((row) => Number(row.id)), 0) + 1;

export function getPatientTypeRows() {
  return patientTypeRows;
}

export function createPatientTypeRow(payload) {
  const id = String(nextPatientTypeId++);
  const row = { id, status: 'active', ...payload };
  patientTypeRows = [row, ...patientTypeRows];
  return row;
}

export function updatePatientTypeRow(id, payload) {
  patientTypeRows = patientTypeRows.map((row) =>
    row.id === id ? { ...row, ...payload } : row,
  );
  return patientTypeRows.find((row) => row.id === id) ?? null;
}

export function deletePatientTypeRow(id) {
  patientTypeRows = patientTypeRows.filter((row) => row.id !== id);
}

const INITIAL_ASSIGN_OPD_ROWS = [
  {
    id: '1',
    hospital: '1',
    hospitalLabel: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    patientType: '1',
    patientTypeLabel: 'Indoor',
    serviceCategory: 'opd-consultation',
    serviceCategoryLabel: 'OPD Consultation',
    service: '9',
    serviceLabel: 'General OPD Consultation',
    subDepartment: '1',
    subDepartmentLabel: 'Cath Lab',
    amount: 500,
  },
  {
    id: '2',
    hospital: '1',
    hospitalLabel: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    patientType: '2',
    patientTypeLabel: 'Outdoor',
    serviceCategory: 'opd-consultation',
    serviceCategoryLabel: 'OPD Consultation',
    service: '10',
    serviceLabel: 'Specialist Consultation',
    subDepartment: '1',
    subDepartmentLabel: 'Cath Lab',
    amount: 1500,
  },
  {
    id: '3',
    hospital: '2',
    hospitalLabel: 'ALKHIDMAT HOSPITAL PESHAWAR',
    patientType: '1',
    patientTypeLabel: 'Indoor',
    serviceCategory: 'opd-consultation',
    serviceCategoryLabel: 'OPD Consultation',
    service: '11',
    serviceLabel: 'Follow Up Consultation',
    subDepartment: '1',
    subDepartmentLabel: 'Cath Lab',
    amount: 300,
  },
];

let assignOpdRows = INITIAL_ASSIGN_OPD_ROWS.map((row) => ({ ...row }));
let nextAssignOpdId =
  Math.max(...INITIAL_ASSIGN_OPD_ROWS.map((row) => Number(row.id)), 0) + 1;

export function getAssignOpdRows() {
  return assignOpdRows;
}

export function createAssignOpdRow(payload) {
  const id = String(nextAssignOpdId++);
  const row = { id, ...payload };
  assignOpdRows = [row, ...assignOpdRows];
  return row;
}

export function updateAssignOpdRow(id, payload) {
  assignOpdRows = assignOpdRows.map((row) =>
    row.id === id ? { ...row, ...payload } : row,
  );
  return assignOpdRows.find((row) => row.id === id) ?? null;
}

export function deleteAssignOpdRow(id) {
  assignOpdRows = assignOpdRows.filter((row) => row.id !== id);
}

// ─── Ward Beds ────────────────────────────────────────────────────────────────

const INITIAL_WARD_BED_ROWS = [
  {
    id: '1',
    hospitalId: '1',
    hospitalName: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    departmentId: '1',
    departmentName: 'Cardiac Care Unit',
    subDepartmentId: '1',
    subDepartmentName: 'Cath Lab',
    wardName: 'General Ward A',
    rooms: 10,
    maxBeds: 30,
  },
  {
    id: '2',
    hospitalId: '1',
    hospitalName: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    departmentId: '1',
    departmentName: 'Cardiac Care Unit',
    subDepartmentId: '1',
    subDepartmentName: 'Cath Lab',
    wardName: 'ICU Ward',
    rooms: 5,
    maxBeds: 15,
  },
  {
    id: '3',
    hospitalId: '2',
    hospitalName: 'ALKHIDMAT HOSPITAL PESHAWAR',
    departmentId: '2',
    departmentName: 'Bone & Joint Clinic',
    subDepartmentId: '1',
    subDepartmentName: 'Cath Lab',
    wardName: 'Orthopedic Ward',
    rooms: 8,
    maxBeds: 24,
  },
];

let wardBedRows = INITIAL_WARD_BED_ROWS.map((r) => ({ ...r }));
let nextWardBedId =
  Math.max(...INITIAL_WARD_BED_ROWS.map((row) => Number(row.id)), 0) + 1;

export function getWardBedRows() {
  return wardBedRows;
}

export function createWardBedRow(payload) {
  const id = String(nextWardBedId++);
  const row = { id, ...payload };
  wardBedRows = [row, ...wardBedRows];
  return row;
}

export function updateWardBedRow(id, payload) {
  wardBedRows = wardBedRows.map((r) => (r.id === id ? { ...r, ...payload } : r));
  return wardBedRows.find((r) => r.id === id) ?? null;
}

export function deleteWardBedRow(id) {
  wardBedRows = wardBedRows.filter((r) => r.id !== id);
  bedLocationRows = bedLocationRows.filter((r) => r.wardBedId !== id);
}

// ─── Assign Bed Location & Fees ───────────────────────────────────────────────

const INITIAL_BED_LOCATION_ROWS = [
  {
    id: '1',
    wardBedId: '1',
    wardName: 'General Ward A',
    hospitalId: '1',
    hospitalName: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    departmentId: '1',
    departmentName: 'Cardiac Care Unit',
    subDepartmentId: '1',
    subDepartmentName: 'Cath Lab',
    roomNumber: '1',
    bedNumber: '1',
    location: 'Block A, Row 1',
    price: 2500,
  },
  {
    id: '2',
    wardBedId: '1',
    wardName: 'General Ward A',
    hospitalId: '1',
    hospitalName: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    departmentId: '1',
    departmentName: 'Cardiac Care Unit',
    subDepartmentId: '1',
    subDepartmentName: 'Cath Lab',
    roomNumber: '1',
    bedNumber: '2',
    location: 'Block A, Row 2',
    price: 2500,
  },
  {
    id: '3',
    wardBedId: '2',
    wardName: 'ICU Ward',
    hospitalId: '1',
    hospitalName: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    departmentId: '1',
    departmentName: 'Cardiac Care Unit',
    subDepartmentId: '1',
    subDepartmentName: 'Cath Lab',
    roomNumber: '1',
    bedNumber: '1',
    location: 'ICU Bay 1',
    price: 5000,
  },
];

let bedLocationRows = INITIAL_BED_LOCATION_ROWS.map((r) => ({ ...r }));
let nextBedLocationId =
  Math.max(...INITIAL_BED_LOCATION_ROWS.map((row) => Number(row.id)), 0) + 1;

export function getBedLocationRows() {
  return bedLocationRows;
}

export function createBedLocationRow(payload) {
  const id = String(nextBedLocationId++);
  const row = { id, ...payload };
  bedLocationRows = [row, ...bedLocationRows];
  return row;
}

export function updateBedLocationRow(id, payload) {
  bedLocationRows = bedLocationRows.map((r) => (r.id === id ? { ...r, ...payload } : r));
  return bedLocationRows.find((r) => r.id === id) ?? null;
}

export function deleteBedLocationRow(id) {
  bedLocationRows = bedLocationRows.filter((r) => r.id !== id);
}