"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { App, Button, Checkbox, Form, Input } from "antd";
import AuthShell from "@/features/auth/components/AuthShell";
import { useLoginMutation } from "@/features/auth/api/authApi";
import { selectIsAuthHydrated, selectIsAuthenticated } from "@/store/authSlice";
import { ROUTES } from "@/config/routes";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";

function getLoginErrorMessage(err) {
  debugger
  if (err?.status === "FETCH_ERROR") {
    return "Unable to reach the server. Check that the API is running and try again.";
  }

  return err?.data?.message || err?.message || "Invalid username or password";
}

function LoginPageContent() {
  const router = useRouter();
  const { message } = App.useApp();
  const [login, { isLoading }] = useLoginMutation();
  const isHydrated = useSelector(selectIsAuthHydrated);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace(ROUTES.dashboard);
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated) {
    return <LoadingSpinner description="Alkhidmat Foundation" />;
  }

  if (isAuthenticated) {
    return <LoadingSpinner description="Redirecting to dashboard..." />;
  }

  const handleLogin = async (values) => {
    try {
      await login({
        userName: values.username,
        password: values.password,
        remember: values.remember ?? false,
      }).unwrap();
      router.push(ROUTES.dashboard);
    } catch (err) {
      message.error(getLoginErrorMessage(err));
    }
  };

  return (
    <AuthShell title="Sign In">
      <Form
        layout="vertical"
        requiredMark={false}
        className="auth-form"
        autoComplete="off"
        onFinish={handleLogin}
      >
        <Form.Item
          label="Username or Email Address"
          name="username"
          rules={[{ required: true, message: "Username is required" }]}
        >
          <Input size="large" placeholder="Enter username" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password
            size="large"
            placeholder="Enter password"
            autoComplete="new-password"
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
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isLoading}
        >
          Sign in
        </Button>
      </Form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <App>
      <LoginPageContent />
    </App>
  );
}
