"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";

export default function ProductGallery({ product }) {
  const gallery = useMemo(() => {
    const images = Array.isArray(product.images) && product.images.length ? product.images : [product.image];
    return images.filter(Boolean);
  }, [product.image, product.images]);

  const [activeImage, setActiveImage] = useState(gallery[0]);

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-zinc-100 lg:aspect-5/4">
        <Image
          src={activeImage}
          alt={product.name}
          fill
          unoptimized
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {product.badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
            {product.badge}
          </span>
        ) : null}
      </div>

      {gallery.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {gallery.map((img) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${
                activeImage === img ? "border-emerald-500" : "border-transparent hover:border-emerald-200"
              }`}
            >
              <Image src={img} alt={`${product.name} thumbnail`} fill unoptimized className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
