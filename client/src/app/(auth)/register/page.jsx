"use client";

import Link from "next/link";
import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Create your account</h1>
        <p className="mt-1 text-sm text-zinc-600">Join Verdant — UI only, no accounts saved.</p>
      </div>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Full name" name="name" type="text" autoComplete="name" required />
        <Input label="Email" name="email" type="email" autoComplete="email" required />
        <Input label="Password" name="password" type="password" autoComplete="new-password" required />
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-emerald-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
