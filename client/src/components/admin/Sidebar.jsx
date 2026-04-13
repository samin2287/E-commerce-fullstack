"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  IoBagHandleOutline,
  IoGridOutline,
  IoHomeOutline,
  IoLayersOutline,
  IoPeopleOutline,
  IoReceiptOutline,
  IoSettingsOutline,
} from "react-icons/io5";

const nav = [
  { href: "/admin", label: "Dashboard", icon: IoHomeOutline, end: true },
  { href: "/admin/products", label: "Products", icon: IoBagHandleOutline },
  { href: "/admin/orders", label: "Orders", icon: IoReceiptOutline },
  { href: "/admin/users", label: "Users", icon: IoPeopleOutline },
  { href: "/admin/categories", label: "Categories", icon: IoLayersOutline },
  { href: "/admin/settings", label: "Settings", icon: IoSettingsOutline },
];

export default function Sidebar({ onNavigate }) {
  const pathname = usePathname();

  const active = (item) => {
    if (item.end) return pathname === "/admin";
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-emerald-900/40 bg-emerald-950 text-emerald-50">
      <div className="flex items-center gap-2 px-5 py-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-emerald-950">
          A
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-300/90">
            Admin
          </p>
          <p className="text-sm font-semibold">Verdant</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 pb-6">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = active(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-800 text-white shadow-inner shadow-emerald-950/40"
                  : "text-emerald-100/80 hover:bg-emerald-900/80 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-emerald-900/50 px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-emerald-200/90 hover:text-white"
        >
          <IoGridOutline className="h-5 w-5" />
          View storefront
        </Link>
      </div>
    </aside>
  );
}
