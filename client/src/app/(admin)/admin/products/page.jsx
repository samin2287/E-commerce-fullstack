import Link from "next/link";
import React from "react";
import DataTable from "@/components/admin/DataTable";
import Button from "@/components/ui/Button";
import { ADMIN_PRODUCTS } from "@/lib/data/admin";

export const metadata = {
  title: "Products",
};

export default function AdminProductsPage() {
  const columns = [
    { key: "name", header: "Product" },
    { key: "sku", header: "SKU" },
    {
      key: "price",
      header: "Price",
      render: (row) => `$${row.price.toFixed(2)}`,
    },
    { key: "stock", header: "Stock" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            row.status === "Active"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    { key: "category", header: "Category" },
    {
      key: "actions",
      header: " ",
      render: (row) => (
        <Link
          href={`/admin/products/${row.id}/edit`}
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          Edit
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-600">Manage catalog entries (static data).</p>
        </div>
        <Link href="/admin/products/create">
          <Button>Add product</Button>
        </Link>
      </div>
      <DataTable columns={columns} rows={ADMIN_PRODUCTS} />
    </div>
  );
}
