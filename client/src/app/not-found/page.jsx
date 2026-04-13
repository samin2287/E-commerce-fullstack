import Link from "next/link";
import React from "react";
import Button from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">404</p>
      <h1 className="mt-2 text-2xl font-bold text-zinc-900">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-zinc-600">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link href="/" className="mt-8">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
