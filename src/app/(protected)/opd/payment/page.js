import { Suspense } from 'react';
import PaymentList from '@/features/billing/pages/payment/PaymentListPage';

export const metadata = {
  title: 'Payment',
};

export default function OpdPaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentList />
    </Suspense>
  );
}
