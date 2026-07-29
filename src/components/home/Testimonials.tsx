"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const TESTIMONIALS = [
  {
    name: "Tasnim Akter",
    location: "Dhaka",
    quote:
      "I've tried so many diet apps but NutriAI's meal planner is different. It actually considers that I can't eat nuts and gives me interesting meals every day.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Arif Hossain",
    location: "Chittagong",
    quote:
      "The AI coach explained exactly why I should be eating more protein after my workouts. I finally understand nutrition instead of just following rules.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Sadia Rahman",
    location: "Sylhet",
    quote:
      "Generated a 7-day Mediterranean plan in under a minute. The shopping list alone saved me hours every week.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
] as const;

export function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-forest sm:text-4xl">
            Loved by Home Cooks Across Bangladesh
          </h2>
          <p className="mt-3 text-warm-gray">
            Real stories from people planning meals and chatting with NutriAI Coach.
          </p>
        </div>

        <div className="mt-12">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="nutri-testimonials !pb-12"
          >
            {TESTIMONIALS.map((t) => (
              <SwiperSlide key={t.name} className="h-auto">
                <article className="flex h-full min-h-[240px] flex-col rounded-2xl bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{t.name}</p>
                      <p className="text-xs text-warm-gray">{t.location}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-0.5 text-saffron">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-warm-gray">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
