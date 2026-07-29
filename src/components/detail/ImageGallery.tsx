"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { SafeImage } from "@/components/ui/SafeImage";

export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : ["/recipe-placeholder.svg"];
  const current = gallery[active] ?? gallery[0]!;

  return (
    <>
      <div className="hidden gap-3 lg:grid lg:grid-cols-[1.6fr_0.8fr]">
        <div className="relative h-[420px] overflow-hidden rounded-2xl">
          <SafeImage
            src={current}
            alt={`${title} image ${active + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
            {active + 1} / {gallery.length}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {gallery.slice(0, 3).map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-[130px] overflow-hidden rounded-2xl border-2 ${
                active === index ? "border-[var(--coral)]" : "border-transparent"
              }`}
            >
              <SafeImage
                src={src}
                alt={`${title} thumb ${index + 1}`}
                fill
                className="object-cover"
                sizes="200px"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="lg:hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={12}
          className="overflow-hidden rounded-2xl"
          onSlideChange={(swiper) => setActive(swiper.activeIndex)}
        >
          {gallery.map((src, index) => (
            <SwiperSlide key={src + index}>
              <div className="relative h-[280px] w-full sm:h-[360px]">
                <SafeImage
                  src={src}
                  alt={`${title} image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
