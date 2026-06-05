import { Suspense } from 'react';
import ServicesBillingTab from '@/components/opd/ServicesBillingTab';

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
