"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { IoMenu, IoNotificationsOutline } from "react-icons/io5";

const titles = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/create": "Create product",
  "/admin/orders": "Orders",
  "/admin/users": "Users",
  "/admin/categories": "Categories",
  "/admin/settings": "Settings",
};

function titleForPath(pathname) {
  if (pathname?.startsWith("/admin/products/") && pathname.includes("/edit")) {
    return "Edit product";
  }
  if (pathname === "/admin/products/create") {
    return "Create product";
  }
  if (pathname?.startsWith("/admin/orders/") && pathname !== "/admin/orders") {
    return "Order detail";
  }
  return titles[pathname] ?? "Admin";
}

export default function Topbar({ onMenu }) {
  const pathname = usePathname();
  const title = titleForPath(pathname);

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm md:hidden"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <IoMenu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Overview</p>
          <h1 className="text-lg font-semibold text-zinc-900">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:border-emerald-300 hover:text-emerald-800"
          aria-label="Notifications"
        >
          <IoNotificationsOutline className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>
        <div className="hidden items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 sm:flex">
          <div className="text-right">
            <p className="text-xs font-medium text-zinc-500">Signed in</p>
            <p className="text-sm font-semibold text-zinc-900">admin@verdant.shop</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
