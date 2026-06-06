export const BILLING_CARD_TYPE_OPTIONS = [
  { value: 'master', label: 'Master Card' },
  { value: 'visa', label: 'Visa' },
  { value: 'amex', label: 'American Express' },
];

export const BILLING_BANK_NAME_OPTIONS = [
  { value: 'hbl', label: 'HBL' },
  { value: 'ubl', label: 'UBL' },
  { value: 'mcb', label: 'MCB' },
  { value: 'abl', label: 'Allied Bank' },
];

export const BILLING_CARD_SERVICE_OPTIONS = [
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
];

export const BILLING_COMPANY_OPTIONS = [
  { value: 'akhf', label: 'AKHF' },
  { value: 'panel-a', label: 'Panel Partner A' },
  { value: 'panel-b', label: 'Panel Partner B' },
];

export const BILLING_RECEIVABLE_PARTY_OPTIONS = [
  { value: 'patient', label: 'Patient' },
  { value: 'attendant', label: 'Attendant' },
  { value: 'company', label: 'Company' },
  { value: 'panel', label: 'Panel' },
  { value: 'other', label: 'Other' },
];

export const BILLING_DISCOUNT_HOSPITAL_OPTIONS = [
  { value: 'alkhidmat-khi', label: 'ALKHIDMAT DIAGNOSTICS KARACHI' },
  { value: 'akhf-main', label: 'AKHF Main Hospital' },
  { value: 'akhf-lab', label: 'AKHF Diagnostics Lab' },
];

export const BILLING_DISCOUNT_FORWARD_TO_OPTIONS = [
  { value: 'abdul-hameed', label: 'ABDUL HAMEED' },
  { value: 'manager-billing', label: 'Billing Manager' },
  { value: 'admin-finance', label: 'Finance Admin' },
];

export function calcBillingServiceDiscountTotal(rows = []) {
  return rows.reduce(
    (sum, row) => sum + (row.systemDiscount ?? 0) + (row.manualDiscount ?? 0),
    0,
  );
}

export function calcBillingPaymentCompanyTotal(rows = [], getCompanyAmount) {
  return rows.reduce(
    (sum, row) => sum + (getCompanyAmount ? getCompanyAmount(row) : row.companyAmount ?? 0),
    0,
  );
}

export function calcBillingPaymentPatientTotal(rows = [], getPatientAmount) {
  return rows.reduce(
    (sum, row) => sum + (getPatientAmount ? getPatientAmount(row) : row.patientAmount ?? 0),
    0,
  );
}

export function calcBillingMaxPanelAmount({
  netPayable = 0,
  advancePayment = 0,
  receivableAmount = 0,
  receivableEnabled = false,
  refundPayment = 0,
} = {}) {
  const appliedReceivable = receivableEnabled ? Math.max(0, receivableAmount) : 0;

  return Math.max(0, netPayable - advancePayment - appliedReceivable - refundPayment);
}

export function calcBillingMaxReceivableAmount({
  netPayable = 0,
  advancePayment = 0,
  panelAmount = 0,
  refundPayment = 0,
} = {}) {
  return Math.max(0, netPayable - advancePayment - panelAmount - refundPayment);
}

export function calcBillingPaymentBreakdown({
  netPayable = 0,
  advancePayment = 0,
  panelAmount = 0,
  receivableAmount = 0,
  refundPayment = 0,
  finalBill = false,
  receivableEnabled = false,
} = {}) {
  const appliedPanelAmount = finalBill ? Math.max(0, panelAmount) : 0;
  const appliedAdvancePayment = finalBill ? Math.max(0, advancePayment) : 0;
  const appliedReceivable =
    finalBill && receivableEnabled ? Math.max(0, receivableAmount) : 0;

  const duePayment = Math.max(
    0,
    netPayable -
      appliedAdvancePayment -
      appliedPanelAmount -
      appliedReceivable -
      refundPayment,
  );

  return {
    appliedPanelAmount,
    appliedAdvancePayment,
    appliedReceivable,
    duePayment,
  };
}

export function buildBillingPaymentServiceTableRows(serviceRows = []) {
  return serviceRows.map((row) => {
    const amount = row.charges ?? 0;
    const systemDiscount = row.systemDiscount ?? 0;
    const manualDiscount = row.manualDiscount ?? 0;
    const qty = row.qty ?? 1;
    const patientAmount = row.panelAmount ?? Math.max(0, amount - systemDiscount - manualDiscount);
    return {
      id: row.id,
      serviceId: row.serviceId,
      serviceName: row.serviceName,
      qty,
      amount,
      systemDiscount,
      manualDiscount,
      companyAmount: row.companyAmount ?? 0,
      patientAmount,
    };
  });
}
