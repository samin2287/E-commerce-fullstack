"use client";

import PageError from "@/components/shared/PageError";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <PageError error={error} reset={reset} />
      </body>
    </html>
  );
}
