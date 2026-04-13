"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { useShop } from "@/components/shared/AppProviders";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const liked = isInWishlist(product.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/5">
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow">
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-emerald-700 shadow backdrop-blur transition hover:bg-white"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          {liked ? <IoHeart className="h-5 w-5" /> : <IoHeartOutline className="h-5 w-5" />}
        </button>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            {product.category}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-1 line-clamp-2 text-base font-semibold text-zinc-900 hover:text-emerald-800">
              {product.name}
            </h3>
          </Link>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-zinc-900">${product.price}</span>
            {product.compareAt ? (
              <span className="text-sm text-zinc-400 line-through">${product.compareAt}</span>
            ) : null}
          </div>
        </div>
        <div className="mt-auto flex gap-2">
          <Button
            type="button"
            className="flex-1"
            size="sm"
            disabled={!product.inStock}
            onClick={() => addToCart(product, 1)}
          >
            {product.inStock ? "Add to cart" : "Out of stock"}
          </Button>
          <Link href={`/products/${product.slug}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
