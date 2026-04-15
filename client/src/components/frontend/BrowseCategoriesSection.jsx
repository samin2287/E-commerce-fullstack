"use client";

import Link from "next/link";
import React, { useMemo } from "react";
import {
  IoBagHandleOutline,
  IoGameControllerOutline,
  IoHomeOutline,
  IoPhonePortraitOutline,
  IoShirtOutline,
  IoWalkOutline,
} from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { getProducts } from "@/services/products";
import "swiper/css";
import "swiper/css/navigation";

const categoryIcons = {
  Apparel: IoShirtOutline,
  Bags: IoBagHandleOutline,
  Home: IoHomeOutline,
  Electronics: IoPhonePortraitOutline,
  Footwear: IoWalkOutline,
  default: IoGameControllerOutline,
};

export default function BrowseCategoriesSection() {
  const categories = useMemo(() => {
    const all = getProducts().map((p) => p.category);
    return Array.from(new Set(all));
  }, []);

  return (
    <section className="mt-16">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
            Browse categories
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Explore products by category with quick shortcuts to the shop page.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 3200, disableOnInteraction: false }}
          loop={categories.length > 4}
          spaceBetween={16}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 4 },
          }}
          className="browse-categories-swiper pb-10"
        >
          {categories.map((category) => {
            const Icon = categoryIcons[category] || categoryIcons.default;
            return (
              <SwiperSlide key={category}>
                <Link
                  href={`/shop?category=${encodeURIComponent(category)}`}
                  className="group block rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-zinc-900 group-hover:text-emerald-800">
                    {category}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">Shop {category.toLowerCase()} products</p>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <style jsx global>{`
          .browse-categories-swiper .swiper-button-prev::after,
          .browse-categories-swiper .swiper-button-next::after {
            font-size: 16px;
            font-weight: 700;
          }
        `}</style>
      </div>
    </section>
  );
}
