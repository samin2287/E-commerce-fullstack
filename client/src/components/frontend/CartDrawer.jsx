"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoClose } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { useShop } from "@/components/shared/AppProviders";

export default function CartDrawer() {
  const {
    cartOpen,
    closeCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    clearCart,
  } = useShop();

  if (!cartOpen) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[90] bg-zinc-900/40 backdrop-blur-sm"
        aria-label="Close cart overlay"
        onClick={closeCart}
      />
      <aside className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Your cart
            </p>
            <h2 className="text-lg font-semibold text-zinc-900">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
          >
            <IoClose className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <p className="text-sm text-zinc-600">Your cart is empty.</p>
              <Button variant="secondary" onClick={closeCart}>
                Continue shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cartItems.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-zinc-900">{product.name}</p>
                    <p className="text-sm text-zinc-500">${product.price} each</p>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) =>
                          updateQuantity(product.id, Number(e.target.value) || 1)
                        }
                        className="w-16 rounded-lg border border-zinc-200 px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-zinc-100 bg-white px-5 py-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-zinc-600">Subtotal</span>
            <span className="text-lg font-semibold text-zinc-900">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <p className="mb-4 text-xs text-zinc-500">Taxes and shipping calculated at checkout.</p>
          <div className="flex flex-col gap-2">
            <Link href="/checkout" onClick={closeCart}>
              <Button className="w-full">Checkout</Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={clearCart}>
              Clear cart
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
