import React from "react";
import DataTable from "@/components/admin/DataTable";
import { ADMIN_USERS } from "@/lib/data/admin";

export const metadata = {
  title: "Users",
};

export default function AdminUsersPage() {
  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            row.role === "Admin" ? "bg-emerald-100 text-emerald-900" : "bg-zinc-100 text-zinc-700"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    { key: "joined", header: "Joined" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-600">Customer and staff directory (fixture data).</p>
      <DataTable columns={columns} rows={ADMIN_USERS} />
    </div>
  );
}
