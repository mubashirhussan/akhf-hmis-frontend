"use client";

import Link from "next/link";
import { Button, Form, Input } from "antd";
import AuthShell from "@/features/auth/components/AuthShell";
import { ROUTES } from "@/config/routes";

export default function SignupPage() {
  const [form] = Form.useForm();

  return (
    <AuthShell title="Create account">
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        className="auth-form"
      >
        <Form.Item
          label="Full name"
          name="fullName"
          rules={[{ required: true, message: "Full name is required" }]}
        >
          <Input
            size="large"
            placeholder="Enter full name"
            autoComplete="name"
          />
        </Form.Item>
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
        {/* <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Username is required" },
            { min: 4, message: "Username must be at least 4 characters" },
          ]}
        >
          <Input
            size="large"
            placeholder="Choose a username"
            autoComplete="username"
          />
        </Form.Item> */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Password is required" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Create a password"
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Re-enter password"
            autoComplete="new-password"
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" size="large" block>
          Create account
        </Button>
      </Form>

      <p className="auth-switch">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="auth-link auth-link--strong">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
