"use client";

import Link from "next/link";
import { Button, Form, Input } from "antd";
import AuthShell from "@/features/auth/components/AuthShell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Forgot password">
      <Form layout="vertical" requiredMark={false} className="auth-form">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input
            size="large"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" size="large" block>
          Send reset link
        </Button>
      </Form>

      <p className="auth-switch">
        <Link href="/login" className="auth-link auth-link--strong">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
