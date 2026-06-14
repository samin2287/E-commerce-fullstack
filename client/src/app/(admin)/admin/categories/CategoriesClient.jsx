"use client";

import React from "react";
import DataTable from "@/components/admin/DataTable";
import Button from "@/components/ui/Button";
import { useGetCategoriesQuery } from "@/app/(admin)/service/api";

export default function CategoriesClient() {
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();

  const columns = [
    { key: "name", header: "Name" },
    { key: "slug", header: "Slug" },
    {
      key: "products",
      header: "Products",
      render: (row) => row.products ?? 0,
    },
    {
      key: "actions",
      header: " ",
      render: () => (
        <button
          type="button"
          className="text-sm font-medium text-emerald-700 hover:underline">
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600">Organize merchandising taxonomy.</p>
        <Button type="button" variant="secondary">
          Add category
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-12 text-center text-sm text-zinc-500">
          Loading categories...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-12 text-center text-sm text-red-600">
          Failed to load categories.
        </div>
      ) : (
        <DataTable columns={columns} rows={categories} />
      )}
    </div>
  );
}
