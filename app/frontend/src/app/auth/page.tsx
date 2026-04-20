"use client";

import { useState } from "react";
import { AuthMode, AuthFormValues } from "@/lib/auth";
import AuthTabs from "@/components/auth/AuthTabs";
import AuthForm from "@/components/auth/AuthForm";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
  };

  // Fixed: Added 'data' parameter name to fix ReferenceError
  const handleSubmit = (data: AuthFormValues) => {
    console.log(`${mode} submitted:`, data);
    // TODO: Connect to NestJS backend API here
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-10">
        {mode === "login"
          ? "Login to Goal Tracker"
          : "Sign Up for Goal Tracker"}
      </h1>

      <div className="w-full max-w-md">
        <AuthTabs activeTab={mode} onTabChange={handleModeChange} />
        {/* Removed key={mode} so transitions can play smoothly */}
        <AuthForm mode={mode} onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
