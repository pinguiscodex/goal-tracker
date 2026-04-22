"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/api/auth-store";

export default function Home() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth().then((authenticated) => {
      if (authenticated) {
        window.location.href = "/dashboard";
      }
    });
  }, [checkAuth]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 align-items-center">
      <h1 className="text-4xl font-bold">Welcome to Goal Tracker</h1>
      <p className="mt-4 text-xl">Track the goals of your matches.</p>
      <Link href="/auth">
        <button type="button">Login</button>
      </Link>
    </main>
  );
}
