import React from "react";

export default function Textarea({ className = "", label, id, error, ...props }) {
  const tid = id ?? props.name;
  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label htmlFor={tid} className="block text-sm font-medium text-zinc-700">
          {label}
        </label>
      ) : null}
      <textarea
        id={tid}
        rows={4}
        className={`w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${error ? "border-red-400" : ""} ${className}`}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
