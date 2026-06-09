export const OPD_PAYMENT_PATH = '/opd/payment';

export function buildBillingVisitHref(visitId) {
  const params = new URLSearchParams({ visitId });
  return `/opd/services-billing?${params.toString()}`;
}

export function buildOpdPaymentHref(visitId) {
  const params = new URLSearchParams({ visitId });
  return `${OPD_PAYMENT_PATH}?${params.toString()}`;
}
