'use client';

import Link from 'next/link';
import { Button, Card, Form, Input, Typography } from 'antd';

export default function LoginPage() {
  return (
    <Card className="auth-card">
      <Typography.Title level={3} className="!mb-6 text-center">
        Sign in to AKHF
      </Typography.Title>
      <Form layout="vertical" requiredMark={false}>
        <Form.Item label="Username" name="username" rules={[{ required: true }]}>
          <Input size="large" placeholder="Enter username" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password size="large" placeholder="Enter password" />
        </Form.Item>
        <div className="mb-4 text-right">
          <Link href="/forgot-password" className="text-[var(--app-primary)]">
            Forgot password?
          </Link>
        </div>
        <Button type="primary" htmlType="submit" size="large" block>
          Sign in
        </Button>
      </Form>
    </Card>
  );
}
