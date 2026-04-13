"use client";

import React from "react";
import ProductCard from "@/components/frontend/ProductCard";
import { getProducts } from "@/services/products";
import { useShop } from "@/components/shared/AppProviders";

export default function WishlistPage() {
  const { wishlistIds } = useShop();
  const products = getProducts().filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="text-2xl font-bold text-zinc-900 md:text-3xl">Wishlist</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Items you heart appear here for this session (UI demo).
      </p>

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-16 text-center text-zinc-600">
          No saved items yet. Tap the heart on a product card to add one.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
