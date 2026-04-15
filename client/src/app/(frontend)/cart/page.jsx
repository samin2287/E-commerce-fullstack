"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { useShop } from "@/components/shared/AppProviders";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } = useShop();
  const [selectedIds, setSelectedIds] = useState(null);

  useEffect(() => {
    setSelectedIds((prev) => {
      if (prev === null) return cartItems.map((line) => line.product.id);
      return prev.filter((id) => cartItems.some((line) => line.product.id === id));
    });
  }, [cartItems]);

  const selectedList = selectedIds ?? [];

  const selectedTotal = useMemo(
    () =>
      cartItems
        .filter((line) => selectedList.includes(line.product.id))
        .reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    [cartItems, selectedList],
  );

  const allSelected = cartItems.length > 0 && selectedList.length === cartItems.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="text-2xl font-bold text-zinc-900 md:text-3xl">Shopping cart</h1>
      <p className="mt-2 text-sm text-zinc-600">Review items before checkout (demo UI).</p>

      {cartItems.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-16 text-center">
          <p className="text-zinc-600">Your cart is empty.</p>
          <Link href="/shop" className="mt-4 inline-block">
            <Button>Browse products</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            <li className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm">
              <label className="inline-flex items-center gap-2 text-zinc-700">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) =>
                    setSelectedIds(
                      e.target.checked ? cartItems.map((line) => line.product.id) : [],
                    )
                  }
                />
                Select all for checkout
              </label>
              <span className="text-zinc-500">{selectedList.length} selected</span>
            </li>
            {cartItems.map(({ product, quantity }) => (
              <li
                key={product.id}
                className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <label className="mt-1">
                  <input
                    type="checkbox"
                    checked={selectedList.includes(product.id)}
                    onChange={(e) =>
                      setSelectedIds((prev) =>
                        prev === null
                          ? e.target.checked
                            ? [product.id]
                            : []
                          :
                        e.target.checked
                          ? [...prev, product.id]
                          : prev.filter((id) => id !== product.id),
                      )
                    }
                    aria-label={`Select ${product.name} for checkout`}
                  />
                </label>
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
                    <div className="inline-flex items-center overflow-hidden rounded-xl border border-zinc-200">
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                        onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                        aria-label={`Decrease quantity for ${product.name}`}
                      >
                        <IoRemove className="h-4 w-4" />
                      </button>
                      <span className="inline-flex h-9 min-w-10 items-center justify-center px-3 text-sm font-semibold text-zinc-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label={`Increase quantity for ${product.name}`}
                      >
                        <IoAdd className="h-4 w-4" />
                      </button>
                    </div>
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
                <span>Selected total</span>
                <span>${selectedTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span>Calculated next</span>
              </div>
              <div className="flex justify-between border-t border-zinc-100 pt-3 text-base font-semibold text-zinc-900">
                <span>Total</span>
                <span>${selectedTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href={selectedList.length ? `/checkout?selected=${selectedList.join(",")}` : "/cart"}
              className="mt-6 block"
            >
              <Button className="w-full" disabled={!selectedList.length}>
                {selectedList.length ? `Checkout selected (${selectedList.length})` : "Select items first"}
              </Button>
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
