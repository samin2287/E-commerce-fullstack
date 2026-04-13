"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Button from "@/components/ui/Button";
import { theme } from "@/lib/constants/theme";
import { HERO_SLIDES } from "@/lib/data/products";

export default function HeroSlider() {
  return (
    <section className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        loop
        className="hero-swiper !pb-12"
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-900 md:aspect-[21/9]">
              <Image
                src={slide.image}
                alt=""
                fill
                priority
                unoptimized
                className="object-cover opacity-90"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/50 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-6 py-10 md:px-16 lg:px-24">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  {theme.brand.name} market
                </p>
                <h1 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-white md:text-5xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-lg text-base text-emerald-100 md:text-lg">
                  {slide.subtitle}
                </p>
                <div className="mt-8">
                  <Link href={slide.href}>
                    <Button size="lg" className="shadow-lg shadow-emerald-900/40">
                      {slide.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
