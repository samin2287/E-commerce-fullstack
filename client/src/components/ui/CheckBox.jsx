import React from "react";

export default function CheckBox({ label, id, className = "", ...props }) {
  const cid = id ?? props.name;
  return (
    <label className={`inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-700 ${className}`}>
      <input
        type="checkbox"
        id={cid}
        className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
        {...props}
      />
      {label}
    </label>
  );
}
