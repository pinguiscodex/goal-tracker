"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthMode,
  AuthFormValues,
  validatePassword,
  validateEmail,
} from "@/lib/auth";
import { useAuthStore } from "@/lib/api/auth-store";
import AuthTabs from "@/components/auth/AuthTabs";
import AuthForm from "@/components/auth/AuthForm";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login, register } = useAuthStore();

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
  };

  const handleSubmit = async (data: AuthFormValues) => {
    setError(null);

    if (mode === "signup") {
      const emailError = validateEmail(data.email || "");
      if (emailError) {
        setError(emailError);
        return;
      }

      const pwdError = validatePassword(data.password);
      if (pwdError) {
        setError(pwdError);
        return;
      }

      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      try {
        await register(data.username, data.email || "", data.password);
        router.push("/dashboard");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Registration failed";
        setError(message);
      }
    } else {
      try {
        await login(data.username, data.password);
        router.push("/dashboard");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-10">
        {mode === "login"
          ? "Login to Goal Tracker"
          : "Sign Up for Goal Tracker"}
      </h1>

      {error && <p className="form-error mb-4">{error}</p>}

      <div className="w-full max-w-md">
        <AuthTabs activeTab={mode} onTabChange={handleModeChange} />
        <AuthForm mode={mode} onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
