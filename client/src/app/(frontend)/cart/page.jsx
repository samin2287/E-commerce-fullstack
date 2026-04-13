"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Button from "@/components/ui/Button";
import { useShop } from "@/components/shared/AppProviders";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } = useShop();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="text-2xl font-bold text-zinc-900 md:text-3xl">Shopping cart</h1>
      <p className="mt-2 text-sm text-zinc-600">Review items before checkout (demo UI).</p>

      {cartItems.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-16 text-center">
          <p className="text-zinc-600">Your cart is empty.</p>
          <Link href="/#products" className="mt-4 inline-block">
            <Button>Browse products</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            {cartItems.map(({ product, quantity }) => (
              <li
                key={product.id}
                className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-semibold text-zinc-900 hover:text-emerald-800"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm text-zinc-500">${product.price} each</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="text-xs font-medium text-zinc-500">
                      Qty
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) =>
                          updateQuantity(product.id, Number(e.target.value) || 1)
                        }
                        className="ml-2 w-20 rounded-lg border border-zinc-200 px-2 py-1 text-sm"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right text-sm font-semibold text-zinc-900">
                  ${(product.price * quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-900">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span>Calculated next</span>
              </div>
              <div className="flex justify-between border-t border-zinc-100 pt-3 text-base font-semibold text-zinc-900">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout" className="mt-6 block">
              <Button className="w-full">Proceed to checkout</Button>
            </Link>
            <Button variant="outline" className="mt-3 w-full" onClick={clearCart}>
              Clear cart
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
