"use client";

import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function Pagination({
  page = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const show = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  const compact = [];
  let last = 0;
  for (const p of show) {
    if (last && p - last > 1) compact.push("ellipsis");
    compact.push(p);
    last = p;
  }

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-1 ${className}`}
      aria-label="Pagination"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:border-emerald-300 hover:text-emerald-800 disabled:opacity-40"
      >
        <IoChevronBack className="h-4 w-4" />
      </button>
      {compact.map((item, i) =>
        item === "ellipsis" ? (
          <span key={`e-${i}`} className="px-2 text-zinc-400">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange?.(item)}
            className={`min-w-[2.25rem] rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              item === page
                ? "bg-emerald-600 text-white shadow-sm"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300"
            }`}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange?.(page + 1)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:border-emerald-300 hover:text-emerald-800 disabled:opacity-40"
      >
        <IoChevronForward className="h-4 w-4" />
      </button>
    </nav>
  );
}
