"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function VerifyOtpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Verify your email</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Enter the 6-digit code we sent (demo — any value works).
        </p>
      </div>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="One-time code"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="••••••"
          required
        />
        <Button type="submit" className="w-full">
          Verify & continue
        </Button>
      </form>
    </div>
  );
}
