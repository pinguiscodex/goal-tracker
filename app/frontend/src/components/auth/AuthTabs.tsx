"use client";
import styles from "./AuthTabs.module.css";
import { AuthMode } from "@/lib/auth";

interface AuthTabsProps {
  activeTab: AuthMode;
  onTabChange: (tab: AuthMode) => void;
}

export default function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className={styles.authType} role="tablist">
      <div
        className={`${styles.authTypePill} ${activeTab === "signup" ? styles.authTypePillSignup : ""}`}
      />
      <button
        type="button"
        className={`${styles.authTypeItem} ${activeTab === "login" ? styles.authTypeItemSelected : ""}`}
        onClick={() => onTabChange("login")}
      >
        Login
      </button>
      <button
        type="button"
        className={`${styles.authTypeItem} ${activeTab === "signup" ? styles.authTypeItemSelected : ""}`}
        onClick={() => onTabChange("signup")}
      >
        Sign Up
      </button>
    </div>
  );
}
