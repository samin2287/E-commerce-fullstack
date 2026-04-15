import React from "react";
import DataTable from "@/components/admin/DataTable";
import Button from "@/components/ui/Button";
import { ADMIN_CATEGORIES } from "@/lib/data/admin";

export const metadata = {
  title: "Categories",
};

export default function AdminCategoriesPage() {
  const columns = [
    { key: "name", header: "Name" },
    { key: "slug", header: "Slug" },
    {
      key: "products",
      header: "Products",
      render: (row) => row.products,
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
        <p className="text-sm text-zinc-600">
          Organize merchandising taxonomy.
        </p>
        <Button type="button" variant="secondary">
          Add category
        </Button>
      </div>
      <DataTable columns={columns} rows={ADMIN_CATEGORIES} />
    </div>
  );
}
