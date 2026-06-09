import { Suspense } from 'react';
import PaymentList from '@/components/opd/PaymentList';

export const metadata = {
  title: 'Payment | AKHF',
};

export default function OpdPaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentList />
    </Suspense>
  );
}
