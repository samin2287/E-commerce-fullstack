"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { useShop } from "@/components/shared/AppProviders";

export default function ProductActions({ product }) {
  const { addToCart, toggleWishlist, isInWishlist, cartItems } = useShop();
  const liked = isInWishlist(product.id);
  const isInCart = cartItems.some((line) => line.product.id === product.id);
  const sizeOptions = useMemo(
    () => (product.sizes?.length ? product.sizes : ["Standard"]),
    [product.sizes],
  );
  const colorOptions = useMemo(
    () => (product.colors?.length ? product.colors : ["Default"]),
    [product.colors],
  );
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  return (
    <div className="mt-8 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="text-sm">
          <span className="mb-2 block font-medium text-zinc-700">Size</span>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                  selectedSize === size
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-emerald-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className="text-sm">
          <span className="mb-2 block font-medium text-zinc-700">Color</span>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                  selectedColor === color
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-emerald-300"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-zinc-500">
        Selected: <span className="font-medium text-zinc-700">{selectedSize}</span> /{" "}
        <span className="font-medium text-zinc-700">{selectedColor}</span>
      </p>

      <div className="flex flex-wrap gap-3">
      {isInCart ? (
        <Link href="/cart">
          <Button className="min-w-[180px]">Go to cart</Button>
        </Link>
      ) : (
        <Button
          className="min-w-[180px]"
          disabled={!product.inStock}
          onClick={() => addToCart(product, 1)}
        >
          {product.inStock ? "Add to cart" : "Out of stock"}
        </Button>
      )}
      <Button
        type="button"
        variant="secondary"
        className="inline-flex items-center gap-2"
        onClick={() => toggleWishlist(product.id)}
      >
        {liked ? (
          <>
            <IoHeart className="h-5 w-5 text-emerald-700" />
            Saved
          </>
        ) : (
          <>
            <IoHeartOutline className="h-5 w-5" />
            Wishlist
          </>
        )}
      </Button>
      </div>
    </div>
  );
}
