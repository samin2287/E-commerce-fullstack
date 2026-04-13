import React from "react";
import Link from "next/link";
import { theme } from "@/lib/constants/theme";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-zinc-50">
      <header className="border-b border-emerald-100 bg-white/80 px-6 py-4 backdrop-blur">
        <Link href="/" className="text-sm font-semibold text-emerald-900">
          ← {theme.brand.name}
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl shadow-emerald-900/5">
          {children}
        </div>
      </div>
    </div>
  );
}
