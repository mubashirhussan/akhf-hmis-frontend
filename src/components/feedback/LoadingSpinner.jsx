import { Spin } from 'antd';

export default function LoadingSpinner({ tip = 'Loading...', className = '' }) {
  return (
    <div className={`flex min-h-[200px] items-center justify-center ${className}`}>
      <Spin tip={tip} />
    </div>
  );
}
