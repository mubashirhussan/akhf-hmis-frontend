'use client';

import { Spin } from 'antd';

export default function LoadingSpinner({ description = 'Loading...', className = '' }) {
  return (
    <div
      className={`page-loader flex items-center justify-center ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label={description}
    >
      <Spin size="large" description={description} />
    </div>
  );
}
