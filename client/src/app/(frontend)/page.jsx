import React from "react";
import FeaturedProductSection from "@/components/frontend/FeaturedProductSection";
import HeroSlider from "@/components/frontend/HeroSlider";

export default function HomePage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-6 md:pt-8">
        <HeroSlider />
        <section id="products" className="mt-16 scroll-mt-28">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
                Featured products
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                Curated picks with rich imagery — static data for layout and interaction demos.
              </p>
            </div>
          </div>
          <FeaturedProductSection />
        </section>
      </div>
    </div>
  );
}
