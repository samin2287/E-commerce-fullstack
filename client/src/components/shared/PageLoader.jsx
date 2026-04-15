import React from "react";

export default function PageLoader() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      <h2 className="mt-5 text-xl font-semibold text-zinc-900">Loading...</h2>
      <p className="mt-2 max-w-md text-sm text-zinc-600">
        Please wait while we prepare your page.
      </p>
    </div>
  );
}
