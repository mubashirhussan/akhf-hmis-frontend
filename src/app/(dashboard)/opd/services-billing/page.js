import { Suspense } from 'react';
import ServicesBillingTab from '@/features/billing/pages/services-billing/ServicesBillingPage';

export const metadata = {
  title: 'Services Billing | AKHF',
};

export default function ServicesBillingPage() {
  return (
    <Suspense fallback={null}>
      <ServicesBillingTab />
    </Suspense>
  );
}
