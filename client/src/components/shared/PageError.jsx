"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { IoAlertCircleOutline, IoRefreshOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";

export default function PageError({ error, reset }) {
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <IoAlertCircleOutline className="h-14 w-14 text-red-500" />
      <h1 className="mt-4 text-2xl font-bold text-zinc-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-zinc-600">
        An unexpected error occurred while loading this page.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} className="inline-flex items-center gap-2">
          <IoRefreshOutline className="h-4 w-4" />
          Try again
        </Button>
        <Link href="/">
          <Button variant="secondary">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
