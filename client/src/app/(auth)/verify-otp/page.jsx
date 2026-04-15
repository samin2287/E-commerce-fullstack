"use client";

import React, { useState } from "react";
import { IoKeyOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit numeric code.");
      return;
    }
    setError("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Verify your email</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Enter the 6-digit code we sent (demo — any value works).
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="One-time code"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="••••••"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
            setError("");
          }}
          error={error}
          required
        />
        <p className="flex items-center gap-2 text-xs text-zinc-500">
          <IoKeyOutline className="h-4 w-4 text-emerald-700" />
          Enter exactly 6 digits to pass validation.
        </p>
        <Button type="submit" className="w-full">
          Verify & continue
        </Button>
      </form>
    </div>
  );
}
