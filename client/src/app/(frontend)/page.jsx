import React from "react";
import Link from "next/link";
import BrowseCategoriesSection from "@/components/frontend/BrowseCategoriesSection";
import FeaturedProductSection from "@/components/frontend/FeaturedProductSection";
import HeroSlider from "@/components/frontend/HeroSlider";
import { getProducts } from "@/services/products";
import PopularProductSection from "@/components/frontend/PopularProductSection";

export default function HomePage() {
  const popularProducts = getProducts()
    .slice()
    .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
    .slice(0, 6);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-6 md:pt-8">
        <HeroSlider />
        <BrowseCategoriesSection />
        <section id="products" className="mt-16 scroll-mt-28">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
                Featured products
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                Curated picks with rich imagery — static data for layout and
                interaction demos.
              </p>
            </div>
          </div>
          <FeaturedProductSection />
        </section>

        <section id="popular-products" className="mt-14 scroll-mt-28">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 md:text-2xl">
              Popular products
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Quick picks based on top ratings and review count.
            </p>

            <PopularProductSection />
            {/* <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {popularProducts.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="block rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-800 transition hover:border-emerald-300 hover:text-emerald-800">
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul> */}
          </div>
        </section>
      </div>
    </div>
  );
}
