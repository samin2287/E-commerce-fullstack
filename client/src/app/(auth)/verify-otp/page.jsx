"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { IoKeyOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { verifyOtp } from "@/services/auth";
import Button from "@/components/ui/Button";

const DIGIT_COUNT = 4;
const INITIAL_SECONDS = 2 * 60; // 2 minutes

export default function VerifyOtpPage() {
  const router = useRouter();
  const search = useSearchParams();
  const email = search?.get("email") || "";
  const [values, setValues] = useState(Array(DIGIT_COUNT).fill(""));
  const [error, setError] = useState("");
  const inputsRef = useRef([]);
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [resending, setResending] = useState(false);

  const otp = useMemo(() => values.join(""), [values]);

  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    const next = [...values];
    next[index] = value.slice(-1);
    setValues(next);
    setError("");
    if (value.length === 1 && index < DIGIT_COUNT - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== DIGIT_COUNT) {
      setError(`Please enter the ${DIGIT_COUNT}-digit code.`);
      return;
    }

    try {
      setError("");
      if (!email) throw new Error("Missing email. Please register first.");
      await verifyOtp({ email, otp });
      toast.success("OTP verified successfully. You can now sign in.");
      router.push("/login");
    } catch (err) {
      const message = err?.message || "OTP verification failed.";
      setError(message);
      toast.error(message);
    }
  };

  useEffect(() => {
    let timer = null;
    if (secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Missing email to resend OTP.");
      return;
    }
    setResending(true);
    try {
      await import("@/services/auth").then((m) => m.resendOtp({ email }));
      toast.success("OTP resent to your email.");
      setSecondsLeft(INITIAL_SECONDS);
    } catch (err) {
      toast.error(err?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Verify your email</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Enter the 6-digit code we sent to your email address.
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <div className="grid grid-cols-4 gap-3">
          {values.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={value}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 text-center text-2xl font-semibold text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-xs text-zinc-500">
            <IoKeyOutline className="h-4 w-4 text-emerald-700" />
            Use the code from your email. If you did not receive it, check spam.
          </p>
          <div className="text-xs text-zinc-500">
            {secondsLeft > 0 ? (
              <span>Resend in {formatTime(secondsLeft)}</span>
            ) : (
              <button
                type="button"
                disabled={resending}
                onClick={handleResend}
                className="text-emerald-700 hover:underline disabled:opacity-50"
              >
                {resending ? "Resending..." : "Resend code"}
              </button>
            )}
          </div>
        </div>
        <Button type="submit" className="w-full">
          Verify & continue
        </Button>
      </form>
    </div>
  );
}
