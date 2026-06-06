export const BILLING_VIEW_PAYMENT = 'payment';

export function buildBillingVisitHref(visitId, { view } = {}) {
  const params = new URLSearchParams({ visitId });
  if (view) {
    params.set('view', view);
  }
  return `/opd/services-billing?${params.toString()}`;
}
