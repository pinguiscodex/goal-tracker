"use client";

import { useState, useEffect } from "react";
import styles from "./AuthForm.module.css";
import { AuthMode, AuthFormValues, validatePassword } from "@/lib/auth";

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (data: AuthFormValues) => void;
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormValues>({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Reset form when mode changes - intentional UX for clean tab switching.
  // This is a controlled, single-state update and does not cause performance issues.
  useEffect(() => {
    setFormData({ username: "", password: "", confirmPassword: "" });
    setError(null);
  }, [mode]);

  const handleChange =
    (field: keyof AuthFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setError(null);
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup") {
      const pwdError = validatePassword(formData.password);
      if (pwdError) {
        setError(pwdError);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    onSubmit(formData);
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange("username")}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange("password")}
        required
      />

      {/* Smoothly animated confirm password field */}
      <div
        className={`${styles.formFieldWrapper} ${mode === "signup" ? styles.formFieldWrapperVisible : ""}`}
      >
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange("confirmPassword")}
          required={mode === "signup"}
        />
      </div>

      {error && <p className={styles.formError}>{error}</p>}

      <button type="submit">{mode === "login" ? "Login" : "Sign Up"}</button>
    </form>
  );
}
