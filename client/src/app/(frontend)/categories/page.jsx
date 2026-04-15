"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useRef, useState } from "react";
import {
  IoBagHandleOutline,
  IoGameControllerOutline,
  IoGridOutline,
  IoHomeOutline,
  IoListOutline,
  IoPhonePortraitOutline,
  IoShirtOutline,
  IoWalkOutline,
} from "react-icons/io5";
import Pagination from "@/components/common/Pagination";
import Button from "@/components/ui/Button";
import { useShop } from "@/components/shared/AppProviders";
import { getProducts } from "@/services/products";

const LIMITS = [3, 6, 9];
const categoryIcons = {
  Apparel: IoShirtOutline,
  Bags: IoBagHandleOutline,
  Home: IoHomeOutline,
  Electronics: IoPhonePortraitOutline,
  Footwear: IoWalkOutline,
  default: IoGameControllerOutline,
};

function CategoryGridCard({ product }) {
  const { addToCart } = useShop();
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <Link href={`/products/${product.slug}`} className="relative block aspect-4/3 overflow-hidden bg-zinc-100">
        <Image src={product.image} alt={product.name} fill unoptimized className="object-cover" />
      </Link>
      <div className="space-y-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">{product.category}</p>
        <Link href={`/products/${product.slug}`} className="block text-base font-semibold text-zinc-900 hover:text-emerald-700">
          {product.name}
        </Link>
        <p className="text-lg font-bold text-zinc-900">${product.price}</p>
        <Button className="w-full" size="sm" disabled={!product.inStock} onClick={() => addToCart(product, 1)}>
          {product.inStock ? "Add to cart" : "Out of stock"}
        </Button>
      </div>
    </article>
  );
}

function CategoryListCard({ product }) {
  const { addToCart } = useShop();
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white sm:flex-row">
      <Link href={`/products/${product.slug}`} className="relative h-40 w-full overflow-hidden bg-zinc-100 sm:h-auto sm:w-48">
        <Image src={product.image} alt={product.name} fill unoptimized className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">{product.category}</p>
        <Link href={`/products/${product.slug}`} className="mt-1 text-lg font-semibold text-zinc-900 hover:text-emerald-700">
          {product.name}
        </Link>
        <p className="mt-2 text-sm text-zinc-600">{product.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-zinc-900">${product.price}</span>
          {product.compareAt ? <span className="text-sm text-zinc-400 line-through">${product.compareAt}</span> : null}
        </div>
        <Button className="mt-4 w-fit" size="sm" disabled={!product.inStock} onClick={() => addToCart(product, 1)}>
          {product.inStock ? "Add to cart" : "Out of stock"}
        </Button>
      </div>
    </article>
  );
}

export default function CategoriesPage() {
  const allProducts = useMemo(() => getProducts(), []);
  const categories = useMemo(() => Array.from(new Set(allProducts.map((p) => p.category))), [allProducts]);
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "All");
  const [view, setView] = useState("grid");
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const productsRef = useRef(null);

  const categoryProducts = useMemo(
    () => allProducts.filter((product) => product.category === activeCategory),
    [activeCategory, allProducts],
  );

  const totalPages = Math.max(1, Math.ceil(categoryProducts.length / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const paginatedProducts = categoryProducts.slice(start, start + limit);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setPage(1);
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-zinc-50 pb-16">
      <section className="relative overflow-hidden bg-emerald-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.28),transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
          <nav className="text-sm text-emerald-100/80">
            <Link href="/" className="hover:text-white">
              Home
            </Link>{" "}
            / <span className="text-white">Categories</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Browse Categories</h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100/85">
            Choose a category from the icons below and explore products with view, limit, and pagination controls.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 md:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = categoryIcons[category] || categoryIcons.default;
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={`aspect-square rounded-2xl border p-4 text-center transition ${
                  active
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-zinc-200 bg-white hover:border-emerald-200"
                }`}
              >
                <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                  <Icon className="h-9 w-9" />
                </span>
                <p className="mt-4 text-base font-semibold text-zinc-900">{category}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section ref={productsRef} className="mx-auto mt-8 max-w-7xl px-4 md:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">{activeCategory} products</h2>
            <p className="text-sm text-zinc-600">Showing {paginatedProducts.length} of {categoryProducts.length} products</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm text-zinc-600">
              Show{" "}
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-700"
              >
                {LIMITS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <div className="inline-flex overflow-hidden rounded-lg border border-zinc-300">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm ${
                  view === "grid" ? "bg-emerald-600 text-white" : "bg-white text-zinc-700"
                }`}
              >
                <IoGridOutline className="h-4 w-4" /> Grid
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`inline-flex items-center gap-1 border-l border-zinc-300 px-3 py-1.5 text-sm ${
                  view === "list" ? "bg-emerald-600 text-white" : "bg-white text-zinc-700"
                }`}
              >
                <IoListOutline className="h-4 w-4" /> List
              </button>
            </div>
          </div>
        </div>

        {paginatedProducts.length ? (
          <div className={view === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
            {paginatedProducts.map((product) =>
              view === "grid" ? (
                <CategoryGridCard key={product.id} product={product} />
              ) : (
                <CategoryListCard key={product.id} product={product} />
              ),
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
            <h3 className="text-lg font-semibold text-zinc-900">No products found in this category</h3>
          </div>
        )}

        {categoryProducts.length > limit ? (
          <div className="mt-8">
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        ) : null}
      </section>
    </div>
  );
}
