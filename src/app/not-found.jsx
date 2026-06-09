import Link from 'next/link';
import { Button, Result } from 'antd';

export default function NotFound() {
  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <Result
        status="404"
        title="404"
        subTitle="The page you are looking for does not exist."
        extra={
          <Link href="/">
            <Button type="primary">Back to home</Button>
          </Link>
        }
      />
    </div>
  );
}
