"use client";

import PageError from "@/components/shared/PageError";

export default function FrontendError({ error, reset }) {
  return <PageError error={error} reset={reset} />;
}
