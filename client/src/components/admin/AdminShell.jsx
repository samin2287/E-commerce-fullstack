"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminShell({ children }) {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <div
        className={`fixed inset-0 z-40 bg-zinc-900/50 transition md:hidden ${
          mobileNav ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!mobileNav}
      >
        <button type="button" className="absolute inset-0" onClick={() => setMobileNav(false)} />
      </div>
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition md:static md:translate-x-0 ${
          mobileNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={() => setMobileNav(false)} />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar onMenu={() => setMobileNav(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
