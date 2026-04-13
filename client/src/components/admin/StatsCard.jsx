import React from "react";
import { IoTrendingDown, IoTrendingUp } from "react-icons/io5";

export default function StatsCard({ label, value, change, trend }) {
  const up = trend === "up";
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold tracking-tight text-zinc-900">{value}</p>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            up ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
          }`}
        >
          {up ? <IoTrendingUp className="h-3.5 w-3.5" /> : <IoTrendingDown className="h-3.5 w-3.5" />}
          {change}
        </span>
      </div>
    </div>
  );
}
