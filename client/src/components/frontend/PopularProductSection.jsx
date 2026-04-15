"use client";

import React, { useMemo } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "@/components/frontend/ProductCard";
import { getProducts } from "@/services/products";
import "swiper/css";
import "swiper/css/navigation";

export default function PopularProductSection() {
  const products = useMemo(() => getProducts(), []);

  return (
    <div className="mt-10">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        loop={products.length > 3}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        navigation
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="featured-products-swiper pb-12">
        {products.map((p) => (
          <SwiperSlide key={p.id}>
            <ProductCard product={p} />
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .featured-products-swiper .swiper-button-prev::after,
        .featured-products-swiper .swiper-button-next::after {
          font-size: 16px;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
