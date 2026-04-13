"use client";

import Link from "next/link";
import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-600">Sign in to your account — UI only.</p>
      </div>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Email" name="email" type="email" autoComplete="email" required />
        <Input label="Password" name="password" type="password" autoComplete="current-password" required />
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
      <p className="text-center text-sm text-zinc-600">
        New here?{" "}
        <Link href="/register" className="font-medium text-emerald-700 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
