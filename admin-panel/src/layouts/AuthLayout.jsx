import { Outlet, Link, useLocation } from "react-router-dom";
import { APP_NAME } from "../config/constants";

// Map each auth path to a heading + subtext
const PAGE_META = {
  "/login": { heading: "Welcome back", sub: "Sign in to your account" },
  "/signup": { heading: "Create an account", sub: "Get started in seconds" },
  "/verify-otp": {
    heading: "Check your email",
    sub: "Enter the 6-digit OTP we sent you",
  },
  "/forgot-password": {
    heading: "Forgot password?",
    sub: "We'll email you a reset link",
  },
};

export default function AuthLayout() {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? {
    heading: "Reset password",
    sub: "Enter your new password",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      {/* Brand mark */}
      <Link to="/login" className="flex items-center gap-2.5 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-blue-700 transition-colors">
          A
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {APP_NAME}
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
        {/* Card header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {meta.heading}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {meta.sub}
          </p>
        </div>

        {/* Card body — rendered by child route */}
        <div className="px-8 py-7">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-gray-400 dark:text-gray-600">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </p>
    </div>
  );
}
