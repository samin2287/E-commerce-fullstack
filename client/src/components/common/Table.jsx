import React from "react";

export function Table({ children, className = "" }) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}
    >
      <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return <thead className="bg-emerald-50/80">{children}</thead>;
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-zinc-100 bg-white">{children}</tbody>;
}

export function TR({ children, className = "" }) {
  return <tr className={className}>{children}</tr>;
}

export function TH({ children, className = "" }) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 font-semibold text-zinc-700 first:pl-6 last:pr-6 ${className}`}
    >
      {children}
    </th>
  );
}

export function TD({ children, className = "" }) {
  return (
    <td className={`px-4 py-3 text-zinc-600 first:pl-6 last:pr-6 ${className}`}>
      {children}
    </td>
  );
}
