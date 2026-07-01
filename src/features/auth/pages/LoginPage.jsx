'use client';

import Link from 'next/link';
import { Button, Checkbox, Form, Input } from 'antd';
import AuthShell from '@/features/auth/components/AuthShell';
import { ROUTES } from '@/config/routes';

function preventAutofill(event) {
  event.target.removeAttribute('readonly');
}

export default function LoginPage() {
  return (
    <AuthShell title="Login">
      <Form layout="vertical" requiredMark={false} className="auth-form" autoComplete="off">
        <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Username is required' }]}>
          <Input
            size="large"
            placeholder="Enter username"
            autoComplete="off"
            readOnly
            onFocus={preventAutofill}
          />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Password is required' }]}>
          <Input.Password
            size="large"
            placeholder="Enter password"
            autoComplete="new-password"
            readOnly
            onFocus={preventAutofill}
          />
        </Form.Item>
        <div className="auth-form__actions-row">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="auth-form__remember">Remember me</Checkbox>
          </Form.Item>
          <Link href={ROUTES.forgotPassword} className="auth-link">
            Forgot Password?
          </Link>
        </div>
        <Button type="primary" htmlType="submit" size="large" block>
          Sign in
        </Button>
      </Form>

      <p className="auth-switch">
        Don&apos;t have an account?{' '}
        <Link href={ROUTES.signup} className="auth-link auth-link--strong">
          Create account
        </Link>
      </p>
    </AuthShell>
  );
}
