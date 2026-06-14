"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import DataTable from "@/components/admin/DataTable";
import Button from "@/components/ui/Button";
import { useGetProductsQuery } from "../../service/api";
// export const metadata = {
//   title: "Products",
// };

export default function AdminProductsPage() {
  const { data } = useGetProductsQuery();
  const rawProducts = data || [];

  // Map backend product shape to table-friendly rows
  const products = rawProducts.map((p) => ({
    id: p._id,
    name: p.title || p.name || "",
    sku: p.variants?.[0]?.sku || "",
    price: p.price || 0,
    stock: Array.isArray(p.variants)
      ? p.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
      : 0,
    status: p.isActive ? "Active" : "Draft",
    category: p.category?.name || "",
    thumbnail: p.thumbnail,
  }));

  const columns = [
    {
      key: "name",
      header: "Product",
      render: (row) => (
        <div className="flex items-center gap-3">
          {/* Product Image */}
          <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-zinc-100">
            <Image
              src={row.thumbnail || "placeholder.png"}
              alt={row.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Name + SKU */}
          <div className="flex flex-col">
            <span className="font-medium text-zinc-800">{row.name}</span>
            <span className="text-xs text-zinc-500">{row.sku}</span>
          </div>
        </div>
      ),
    },

    {
      key: "price",
      header: "Price",
      render: (row) => `$${Number(row.price || 0).toFixed(2)}`,
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
          }`}>
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
          className="text-sm font-medium text-emerald-700 hover:underline">
          Edit
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-600">
            Manage catalog entries (static data).
          </p>
        </div>

        <Link href="/admin/products/create">
          <Button>Add product</Button>
        </Link>
      </div>

      {/* Table */}
      <DataTable columns={columns} rows={products} />
    </div>
  );
}
