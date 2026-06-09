import { Empty } from 'antd';

export default function EmptyState({ description = 'No data', className = '' }) {
  return (
    <div className={`flex min-h-[200px] items-center justify-center ${className}`}>
      <Empty description={description} />
    </div>
  );
}
