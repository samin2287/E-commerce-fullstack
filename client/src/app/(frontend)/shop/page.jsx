"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { IoGridOutline, IoListOutline } from "react-icons/io5";
import Pagination from "@/components/common/Pagination";
import Button from "@/components/ui/Button";
import { getProducts } from "@/services/products";
import { useShop } from "@/components/shared/AppProviders";

const LIMITS = [3, 6, 9];

function ProductListCard({ product }) {
  const { addToCart } = useShop();

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white sm:flex-row">
      <Link href={`/products/${product.slug}`} className="relative h-44 w-full overflow-hidden bg-zinc-100 sm:h-auto sm:w-52">
        <Image src={product.image} alt={product.name} fill unoptimized className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">{product.category}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 text-lg font-semibold text-zinc-900 hover:text-emerald-700">{product.name}</h3>
        </Link>
        <p className="mt-2 text-sm text-zinc-600">{product.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-zinc-900">${product.price}</span>
          {product.compareAt ? (
            <span className="text-sm text-zinc-400 line-through">${product.compareAt}</span>
          ) : null}
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" disabled={!product.inStock} onClick={() => addToCart(product, 1)}>
            {product.inStock ? "Add to cart" : "Out of stock"}
          </Button>
          <Link href={`/products/${product.slug}`}>
            <Button size="sm" variant="secondary">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

function ProductGridCard({ product }) {
  const { addToCart } = useShop();

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <Link href={`/products/${product.slug}`} className="relative block aspect-4/3 overflow-hidden bg-zinc-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="space-y-3 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">{product.category}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-base font-semibold text-zinc-900 hover:text-emerald-700">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-zinc-900">${product.price}</span>
          {product.compareAt ? (
            <span className="text-sm text-zinc-400 line-through">${product.compareAt}</span>
          ) : null}
        </div>
        <Button className="w-full" size="sm" disabled={!product.inStock} onClick={() => addToCart(product, 1)}>
          {product.inStock ? "Add to cart" : "Out of stock"}
        </Button>
      </div>
    </article>
  );
}

export default function ShopPage() {
  const products = useMemo(() => getProducts(), []);
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState("All");
  const [stockOnly, setStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [view, setView] = useState("grid");
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!categoryParam) return;
    if (categories.includes(categoryParam)) {
      setActiveCategory(categoryParam);
      setPage(1);
    }
  }, [categories, categoryParam]);

  const filteredProducts = useMemo(() => {
    const next = products.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesStock = !stockOnly || p.inStock;
      return matchesCategory && matchesStock;
    });

    if (sortBy === "price-asc") return [...next].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return [...next].sort((a, b) => b.price - a.price);
    if (sortBy === "rating-desc") return [...next].sort((a, b) => b.rating - a.rating);
    return next;
  }, [activeCategory, products, sortBy, stockOnly]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const paginatedProducts = filteredProducts.slice(start, start + limit);

  return (
    <div className="bg-zinc-50 pb-16">
      <section className="relative overflow-hidden bg-emerald-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.28),transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
          <nav className="text-sm text-emerald-100/80">
            <Link href="/" className="hover:text-white">
              Home
            </Link>{" "}
            / <span className="text-white">Shop</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Shop All Products</h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100/85">
            Discover our full collection with category filters, flexible views, and customizable product limits.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-7xl gap-6 px-4 md:grid-cols-[280px_1fr] md:px-6">
        <aside className="h-fit space-y-6 rounded-2xl border border-zinc-200 bg-white p-5">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Filter by category</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {["All", ...categories].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setPage(1);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    activeCategory === category
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Availability</h2>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={stockOnly}
                onChange={(e) => {
                  setStockOnly(e.target.checked);
                  setPage(1);
                }}
                className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
              />
              In stock only
            </label>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Sort products</h2>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="mt-3 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top rated</option>
            </select>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-600">
              Showing <span className="font-semibold text-zinc-900">{paginatedProducts.length}</span> of{" "}
              <span className="font-semibold text-zinc-900">{filteredProducts.length}</span> products
            </p>

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
                  aria-label="Grid view"
                >
                  <IoGridOutline className="h-4 w-4" /> Grid
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`inline-flex items-center gap-1 border-l border-zinc-300 px-3 py-1.5 text-sm ${
                    view === "list" ? "bg-emerald-600 text-white" : "bg-white text-zinc-700"
                  }`}
                  aria-label="List view"
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
                  <ProductGridCard key={product.id} product={product} />
                ) : (
                  <ProductListCard key={product.id} product={product} />
                ),
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
              <h3 className="text-lg font-semibold text-zinc-900">No products found</h3>
              <p className="mt-2 text-sm text-zinc-600">Try clearing filters or choosing another category.</p>
            </div>
          )}

          {filteredProducts.length > limit ? (
            <div className="mt-8">
              <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
