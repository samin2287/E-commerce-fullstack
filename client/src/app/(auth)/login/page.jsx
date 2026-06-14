"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { IoInformationCircleOutline, IoMailOutline, IoLockClosedOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useShop } from "@/components/shared/AppProviders";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useShop();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const onChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Please enter a valid email.";
    if (values.password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) {
    setServerError("Please fix the highlighted fields.");
    toast.error("Login failed. Please check your email and password.");
    return;
  }

  try {
    setServerError("");

    const user = await login({
      email: values.email.trim().toLowerCase(),
      password: values.password,
    });

    console.log("LOGIN USER:", user);

    toast.success("Welcome back.");

    if (user?.role === "admin") {
      router.push("/admin-dashboard");
    } else {
      router.push("/user-dashboard");
    }
  } catch (error) {
    const message = error?.message || "Login failed. Please try again.";
    setServerError(message);
    toast.error(message);
  }
};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-600">Sign in to your account and continue shopping.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {serverError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        ) : null}
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(e) => {
            onChange("email", e.target.value);
            setServerError("");
          }}
          error={errors.email}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={values.password}
          onChange={(e) => {
            onChange("password", e.target.value);
            setServerError("");
          }}
          error={errors.password}
          placeholder="At least 6 characters"
        />
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
          <p className="flex items-center gap-2"><IoMailOutline className="h-4 w-4 text-emerald-700" /> Use the same email you used during registration.</p>
          <p className="mt-1 flex items-center gap-2"><IoLockClosedOutline className="h-4 w-4 text-emerald-700" /> Password is validated on client side in this demo.</p>
          <p className="mt-1 flex items-center gap-2"><IoInformationCircleOutline className="h-4 w-4 text-emerald-700" /> This app currently uses local session storage only.</p>
        </div>
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
