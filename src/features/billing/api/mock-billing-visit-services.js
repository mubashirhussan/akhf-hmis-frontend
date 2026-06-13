import { MOCK_DOCTORS } from '@/features/opd/api/mock-walk-in-services';

export const BILLING_SERVICE_CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'consultation', label: 'Consultation' },
];

export const BILLING_REFERENCE_OPTIONS = [
  { value: 'ref-1', label: 'Internal Reference' },
  { value: 'ref-2', label: 'External Lab' },
  { value: 'ref-3', label: 'Panel Partner' },
];

export const BILLING_PACKAGE_OPTIONS = [
  { value: 'pkg-1', label: 'Basic Health Package' },
  { value: 'pkg-2', label: 'Executive Checkup' },
  { value: 'pkg-3', label: 'Lab Panel A' },
];

const BILLING_SERVICE_DATE = 'Jun 02, 2026';

/** Default line items when opening Services for a visit. */
export const MOCK_BILLING_VISIT_SERVICE_ROWS = [
  {
    id: 'bs-1',
    serviceId: 'esr',
    date: BILLING_SERVICE_DATE,
    serviceName: 'ESR (Erythrocytes Sedimentation Rate)',
    charges: 1500,
    systemDiscount: 0,
    manualDiscount: 0,
    doctorId: MOCK_DOCTORS[0].id,
    qty: 1,
    serviceDate: 'Jun 02, 2026',
    panelAmount: 1500,
  },
  {
    id: 'bs-2',
    serviceId: 'cbc',
    date: BILLING_SERVICE_DATE,
    serviceName: 'CBC (Complete Blood Count)',
    charges: 1500,
    systemDiscount: 0,
    manualDiscount: 0,
    doctorId: MOCK_DOCTORS[0].id,
    qty: 1,
    serviceDate: 'Jun 02, 2026',
    panelAmount: 1500,
  },
  {
    id: 'bs-3',
    serviceId: 'lft',
    date: BILLING_SERVICE_DATE,
    serviceName: 'Liver Function Test',
    charges: 1000,
    systemDiscount: 0,
    manualDiscount: 0,
    doctorId: MOCK_DOCTORS[1].id,
    qty: 1,
    serviceDate: 'Jun 02, 2026',
    panelAmount: 1000,
  },
  {
    id: 'bs-4',
    serviceId: 'urine',
    date: BILLING_SERVICE_DATE,
    serviceName: 'Urine Routine Examination',
    charges: 1000,
    systemDiscount: 0,
    manualDiscount: 0,
    doctorId: MOCK_DOCTORS[0].id,
    qty: 1,
    serviceDate: 'Jun 02, 2026',
    panelAmount: 1000,
  },
];

let visitServiceRowsByVisitId = {};

export function getBillingVisitServiceRows(visitId) {
  if (!visitId) return [];

  if (!visitServiceRowsByVisitId[visitId]) {
    visitServiceRowsByVisitId[visitId] = MOCK_BILLING_VISIT_SERVICE_ROWS.map((row) => ({ ...row }));
  }

  return visitServiceRowsByVisitId[visitId];
}

export function setBillingVisitServiceRows(visitId, rows) {
  if (!visitId) return [];
  visitServiceRowsByVisitId[visitId] = rows;
  return rows;
}

export { buildPatientInfoSummary as buildBillingPatientSummary } from '@/features/patient/utils/patient-info';

export function calcBillingServicesGrandTotal(rows = []) {
  return rows.reduce((sum, row) => sum + (row.panelAmount ?? row.charges ?? 0) * (row.qty ?? 1), 0);
}

export function createBillingServiceRow(service, doctorId = MOCK_DOCTORS[0].id) {
  return {
    id: `bs-${service.id}-${Date.now()}`,
    serviceId: service.id,
    date: BILLING_SERVICE_DATE,
    serviceName: service.name,
    charges: service.price,
    systemDiscount: 0,
    manualDiscount: 0,
    doctorId,
    qty: 1,
    serviceDate: BILLING_SERVICE_DATE,
    panelAmount: service.price,
  };
}
