'use client';

import ErrorState from '@/components/feedback/ErrorState';

export default function Error({ error, reset }) {
  return (
    <ErrorState
      title="Application error"
      subTitle={error?.message || 'An unexpected error occurred.'}
      onRetry={reset}
    />
  );
}
