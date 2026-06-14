"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { IoMailOutline, IoPersonOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useShop } from "@/components/shared/AppProviders";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useShop();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const onChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (values.name.trim().length < 3) next.name = "Name must be at least 3 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Please enter a valid email.";
    if (values.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (values.confirmPassword !== values.password) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setServerError("Please fix the highlighted fields.");
      toast.error("Registration failed. Please fix the highlighted fields.");
      return;
    }
    try {
      setServerError("");
      await registerUser({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      toast.success(`Account created successfully.`);
      router.push(`/verify-otp?email=${encodeURIComponent(values.email.trim().toLowerCase())}`);
    } catch (error) {
      const message = error?.message || "Registration failed. Please try again.";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Create your account</h1>
        <p className="mt-1 text-sm text-zinc-600">Join Verdant and manage orders from your dashboard.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {serverError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        ) : null}
        <Input
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={(e) => {
            onChange("name", e.target.value);
            setServerError("");
          }}
          error={errors.name}
          placeholder="e.g. John Doe"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={values.password}
          onChange={(e) => {
            onChange("password", e.target.value);
            setServerError("");
          }}
          error={errors.password}
          placeholder="Minimum 6 characters"
        />
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={values.confirmPassword}
          onChange={(e) => {
            onChange("confirmPassword", e.target.value);
            setServerError("");
          }}
          error={errors.confirmPassword}
          placeholder="Retype password"
        />
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-900">
          <p className="flex items-center gap-2"><IoPersonOutline className="h-4 w-4" /> Use your real name for invoice and delivery profile.</p>
          <p className="mt-1 flex items-center gap-2"><IoMailOutline className="h-4 w-4" /> A valid email helps order communication.</p>
          <p className="mt-1 flex items-center gap-2"><IoShieldCheckmarkOutline className="h-4 w-4" /> Password should be strong and unique.</p>
        </div>
        <Button type="submit" className="w-full">
          Create account
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
