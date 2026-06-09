import { Button, Result } from 'antd';

export default function ErrorState({
  title = 'Something went wrong',
  subTitle = 'Please try again.',
  onRetry,
}) {
  return (
    <Result
      status="error"
      title={title}
      subTitle={subTitle}
      extra={
        onRetry ? (
          <Button type="primary" onClick={onRetry}>
            Try again
          </Button>
        ) : null
      }
    />
  );
}
