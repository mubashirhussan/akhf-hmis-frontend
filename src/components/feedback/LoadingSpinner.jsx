import { Spin } from 'antd';

export default function LoadingSpinner({ description = 'Loading...', className = '' }) {
  return (
    <div className={`flex min-h-[200px] items-center justify-center ${className}`}>
      <Spin description={description} />
    </div>
  );
}
