"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  IoCartOutline,
  IoChevronDownOutline,
  IoHeartOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoMenu,
  IoPersonCircleOutline,
  IoSearchOutline,
  IoSpeedometerOutline,
} from "react-icons/io5";
import { useShop } from "@/components/shared/AppProviders";
import { theme } from "@/lib/constants/theme";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/wishlist", label: "Wishlist" },
];

export default function Navbar() {
  const { cartItems, wishlistIds, authUser, isAuthenticated, logoutUser } = useShop();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountWrapRef = useRef(null);
  const count = cartItems.reduce((n, l) => n + l.quantity, 0);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!accountWrapRef.current?.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/20 bg-emerald-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-emerald-950">
            V
          </span>
          <span className="text-lg font-semibold tracking-tight">{theme.brand.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-emerald-100/90 transition hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 items-center justify-center md:flex md:max-w-md">
          <label className="relative w-full">
            <span className="sr-only">Search</span>
            <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-200/70" />
            <input
              readOnly
              placeholder="Search products (UI only)"
              className="w-full rounded-xl border border-emerald-800/60 bg-emerald-900/40 py-2 pl-10 pr-4 text-sm text-white placeholder:text-emerald-200/50 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            />
          </label>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Link href="/wishlist" className="relative rounded-xl p-2 text-emerald-100 transition hover:bg-emerald-900/60 hover:text-white" aria-label="Wishlist">
            <IoHeartOutline className="h-6 w-6" />
            {wishlistIds.length > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-bold text-emerald-950">
                {wishlistIds.length}
              </span>
            ) : null}
          </Link>
          <Link
            href="/cart"
            className="relative rounded-xl p-2 text-emerald-100 transition hover:bg-emerald-900/60 hover:text-white"
            aria-label="Open cart"
          >
            <IoCartOutline className="h-6 w-6" />
            {count > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-bold text-emerald-950">
                {count}
              </span>
            ) : null}
          </Link>
          <div className="relative" ref={accountWrapRef}>
            <button
              type="button"
              onClick={() => setAccountOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-xl p-2 text-emerald-100 transition hover:bg-emerald-900/60 hover:text-white"
              aria-label="Account menu"
            >
              <IoPersonCircleOutline className="h-6 w-6" />
              <IoChevronDownOutline className="h-4 w-4" />
            </button>
            {accountOpen ? (
              <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-emerald-900/30 bg-white py-2 text-zinc-800 shadow-xl">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 pb-2 text-xs text-zinc-500">
                      Signed in as
                      <p className="truncate font-semibold text-zinc-800">{authUser?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-50"
                      onClick={() => setAccountOpen(false)}
                    >
                      <IoSpeedometerOutline className="h-4 w-4 text-emerald-700" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-zinc-50"
                      onClick={() => {
                        logoutUser();
                        setAccountOpen(false);
                      }}
                    >
                      <IoLogOutOutline className="h-4 w-4 text-emerald-700" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-50"
                      onClick={() => setAccountOpen(false)}
                    >
                      <IoLogInOutline className="h-4 w-4 text-emerald-700" />
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-50"
                      onClick={() => setAccountOpen(false)}
                    >
                      <IoPersonCircleOutline className="h-4 w-4 text-emerald-700" />
                      Login / Register
                    </Link>
                  </>
                )}
              </div>
            ) : null}
          </div>
          <Link
            href="/cart"
            className="hidden rounded-xl px-3 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-900/60 md:inline"
          >
            Cart
          </Link>
          <button
            type="button"
            className="rounded-xl p-2 text-emerald-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <IoMenu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-emerald-900/40 bg-emerald-950 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-2 py-2 text-emerald-50"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="rounded-lg px-2 py-2 text-emerald-50"
              onClick={() => setOpen(false)}
            >
              Cart
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
