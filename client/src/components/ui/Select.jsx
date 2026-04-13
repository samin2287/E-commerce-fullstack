import React from "react";

export default function Select({ className = "", label, id, error, children, ...props }) {
  const selectId = id ?? props.name;
  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label htmlFor={selectId} className="block text-sm font-medium text-zinc-700">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={`w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${error ? "border-red-400" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
