"use client";

import PageError from "@/components/shared/PageError";

export default function AuthError({ error, reset }) {
  return <PageError error={error} reset={reset} />;
}
