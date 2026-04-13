import Link from "next/link";
import React from "react";
import DataTable from "@/components/admin/DataTable";
import { ADMIN_ORDERS } from "@/lib/data/admin";

export const metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  const columns = [
    { key: "id", header: "Order" },
    { key: "customer", header: "Customer" },
    {
      key: "total",
      header: "Total",
      render: (row) => `$${row.total.toFixed(2)}`,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
          {row.status}
        </span>
      ),
    },
    { key: "date", header: "Date" },
    {
      key: "actions",
      header: " ",
      render: (row) => (
        <Link
          href={`/admin/orders/${encodeURIComponent(row.id)}`}
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-600">Recent orders pulled from static fixtures.</p>
      <DataTable columns={columns} rows={ADMIN_ORDERS} />
    </div>
  );
}
