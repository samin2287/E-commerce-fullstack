"use client";

import Link from "next/link";
import React from "react";
import { IoBagCheckOutline, IoHeartOutline, IoPersonCircleOutline } from "react-icons/io5";
import { useShop } from "@/components/shared/AppProviders";

export default function DashboardPage() {
  const { authUser, isAuthenticated, cartItems, wishlistIds, subtotal } = useShop();

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
          <IoPersonCircleOutline className="mx-auto h-12 w-12 text-emerald-700" />
          <h1 className="mt-4 text-2xl font-bold text-zinc-900">Please sign in first</h1>
          <p className="mt-2 text-sm text-zinc-600">
            You need an account to access the dashboard.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/login" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
              Sign in
            </Link>
            <Link href="/register" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <p className="text-sm text-zinc-500">Welcome back</p>
        <h1 className="mt-1 text-3xl font-bold text-zinc-900">{authUser?.name || "Customer"}</h1>
        <p className="mt-2 text-sm text-zinc-600">Email: {authUser?.email}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <IoBagCheckOutline className="h-6 w-6 text-emerald-700" />
          <p className="mt-3 text-sm text-zinc-500">Items in cart</p>
          <p className="text-2xl font-bold text-zinc-900">{cartItems.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <IoHeartOutline className="h-6 w-6 text-emerald-700" />
          <p className="mt-3 text-sm text-zinc-500">Wishlist products</p>
          <p className="text-2xl font-bold text-zinc-900">{wishlistIds.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <IoBagCheckOutline className="h-6 w-6 text-emerald-700" />
          <p className="mt-3 text-sm text-zinc-500">Cart subtotal</p>
          <p className="text-2xl font-bold text-zinc-900">${subtotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-zinc-900">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/shop" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
            Continue Shopping
          </Link>
          <Link href="/cart" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700">
            Go to Cart
          </Link>
          <Link href="/wishlist" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700">
            View Wishlist
          </Link>
        </div>
      </div>
    </div>
  );
}
