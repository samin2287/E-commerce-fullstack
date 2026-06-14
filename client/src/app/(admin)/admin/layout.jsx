"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { adminApiService } from "../service/api";
import { useShop } from "@/components/shared/AppProviders";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { authLoaded, isAuthenticated, authUser } = useShop();

  useEffect(() => {
    if (!authLoaded) return;
    if (!isAuthenticated || String(authUser?.role).toLowerCase() !== "admin") {
      router.push("/login");
    }
  }, [authLoaded, isAuthenticated, authUser, router]);

  if (!authLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-zinc-500">Checking authentication…</p>
      </div>
    );
  }

  if (!isAuthenticated || String(authUser?.role).toLowerCase() !== "admin") {
    return null;
  }

  return (
    <AdminShell>
      <main>
        <ApiProvider api={adminApiService}>{children}</ApiProvider>
      </main>
    </AdminShell>
  );
}
