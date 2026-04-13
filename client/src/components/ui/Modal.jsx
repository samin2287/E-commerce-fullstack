"use client";

import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";

export default function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const maxW =
    size === "lg"
      ? "max-w-2xl"
      : size === "sm"
        ? "max-w-sm"
        : "max-w-lg";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/50 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className={`relative z-[101] w-full ${maxW} rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl shadow-zinc-900/10`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? (
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>
        <div className="text-sm text-zinc-600">{children}</div>
      </div>
    </div>
  );
}
