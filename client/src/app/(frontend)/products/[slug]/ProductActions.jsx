"use client";

import React from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { useShop } from "@/components/shared/AppProviders";

export default function ProductActions({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const liked = isInWishlist(product.id);

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button
        className="min-w-[180px]"
        disabled={!product.inStock}
        onClick={() => addToCart(product, 1)}
      >
        {product.inStock ? "Add to cart" : "Out of stock"}
      </Button>
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
  );
}
