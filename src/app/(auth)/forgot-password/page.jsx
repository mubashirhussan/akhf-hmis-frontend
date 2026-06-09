'use client';

import Link from 'next/link';
import { Button, Card, Form, Input, Typography } from 'antd';

export default function ForgotPasswordPage() {
  return (
    <Card>
      <Typography.Title level={3} className="!mb-2 text-center">
        Forgot password
      </Typography.Title>
      <Typography.Paragraph type="secondary" className="!mb-6 text-center">
        Enter your email and we will send reset instructions.
      </Typography.Paragraph>
      <Form layout="vertical" requiredMark={false}>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input size="large" placeholder="you@example.com" />
        </Form.Item>
        <Button type="primary" htmlType="submit" size="large" block className="!mb-3">
          Send reset link
        </Button>
        <Link href="/login" className="block text-center text-[var(--app-primary)]">
          Back to sign in
        </Link>
      </Form>
    </Card>
  );
}
