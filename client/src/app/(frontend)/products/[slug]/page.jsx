import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { IoStar } from "react-icons/io5";
import ProductCard from "@/components/frontend/ProductCard";
import { theme } from "@/lib/constants/theme";
import { getProductBySlug, getRelatedProducts } from "@/services/products";
import ProductGallery from "./ProductGallery";
import ProductActions from "./ProductActions";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return {
    title: product ? product.name : "Product",
    description: product?.description ?? theme.brand.tagline,
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(slug, 4);
  const discountPercent = product.compareAt
    ? Math.round(
        ((product.compareAt - product.price) / product.compareAt) * 100,
      )
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery product={product} />
        <div>
          <p className="text-sm font-medium text-emerald-700">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
            <span className="inline-flex items-center gap-1 font-medium text-amber-600">
              <IoStar className="h-4 w-4" />
              {product.rating}
            </span>
            <span className="text-zinc-300">·</span>
            <span>{product.reviews} reviews</span>
          </div>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-zinc-900">
              ${product.price}
            </span>
            {product.compareAt ? (
              <span className="text-lg text-zinc-400 line-through">
                ${product.compareAt}
              </span>
            ) : null}
          </div>
          <p className="mt-6 text-base leading-relaxed text-zinc-600">
            {product.description}
          </p>

          <div className="mt-6 grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm sm:grid-cols-3">
            <div>
              <p className="mt-1 font-semibold text-zinc-900">
                {product.inStock ? "In stock" : "Currently unavailable"}
              </p>
            </div>
          </div>

          <ProductActions product={product} />

          <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600">
            <p className="font-semibold text-zinc-900">Delivery & returns</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Free shipping over $75 (UI copy only)</li>
              <li>30-day hassle-free returns</li>
              <li>Carbon-neutral shipping option at checkout</li>
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20 border-t border-zinc-200 pt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">
                Related products
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Similar picks from {product.category} you might want to add
                next.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-medium text-emerald-800 hover:underline">
              View all products
            </Link>
          </div>
          <div className="mt-8 rounded-3xl border border-emerald-100 bg-linear-to-b from-emerald-50 to-white p-4 md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Customers also bought
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Handpicked recommendations based on this product.
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                {related.length} items
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="mt-12">
        <Link
          href="/shop"
          className="text-sm font-medium text-emerald-800 hover:underline">
          ← Back to shop
        </Link>
      </div>
    </div>
  );
}
