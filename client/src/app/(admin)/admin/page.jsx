import React from "react";
import DashboardCharts from "@/components/admin/DashboardCharts";
import StatsCard from "@/components/admin/StatsCard";
import { ADMIN_STATS } from "@/lib/data/admin";

export const metadata = {
  title: "Admin dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ADMIN_STATS.map((s) => (
          <StatsCard key={s.id} {...s} />
        ))}
      </div>
      <DashboardCharts />
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-900">Operational snapshot</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Inventory sync, fulfillment SLAs, and campaign performance will surface here once
          analytics are connected. For now, this panel demonstrates spacing and hierarchy.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "Open tickets", value: "12" },
            { label: "Low stock SKUs", value: "5" },
            { label: "Campaign CTR", value: "3.8%" },
          ].map((x) => (
            <div key={x.label} className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3">
              <p className="text-xs font-medium text-zinc-500">{x.label}</p>
              <p className="mt-1 text-xl font-semibold text-zinc-900">{x.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
