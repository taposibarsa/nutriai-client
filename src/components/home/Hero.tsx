"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const MACRO_DATA = [
  { name: "Protein", value: 35, color: "#386639" },
  { name: "Carbs", value: 40, color: "#e9b44c" },
  { name: "Fat", value: 25, color: "#fdcc3f" },
];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=2000&q=80";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.5, ease: "easeOut" as const },
  }),
};

export function Hero() {
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    setChartReady(true);
  }, []);

  return (
    <section className="relative min-h-[65vh] w-full overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt="Colorful healthy plated meal with fresh vegetables"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/75 to-forest/35 max-md:from-forest/90 max-md:via-forest/80 max-md:to-forest/70" />

      <div className="relative mx-auto flex min-h-[65vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-xl text-white">
            <motion.span
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex rounded-full bg-coral px-3 py-1 text-xs font-semibold tracking-wide text-foreground"
            >
              Powered by Claude AI
            </motion.span>

            <motion.p
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-5 font-display text-sm font-semibold tracking-[0.2em] text-coral uppercase"
            >
              NutriAI
            </motion.p>

            <motion.h1
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-2 text-4xl leading-tight font-extrabold sm:text-5xl lg:text-[3.75rem] lg:leading-[1.1]"
            >
              Eat Smart. Live Better. Powered by AI.
            </motion.h1>

            <motion.p
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-4 text-base text-white/80 sm:text-lg"
            >
              NutriAI builds your personalized meal plan in seconds, then coaches
              you through it — one conversation at a time.
            </motion.p>

            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/meal-planner"
                className="inline-flex rounded-full bg-coral px-6 py-3 text-sm font-bold text-foreground transition hover:brightness-95"
              >
                Generate My Meal Plan
              </Link>
              <Link
                href="/recipes"
                className="inline-flex rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Browse Recipes
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
            className="mx-auto hidden w-full max-w-sm lg:block"
          >
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
              <div className="relative h-56 min-h-[14rem] w-full min-w-0">
                {chartReady ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                      <Pie
                        data={MACRO_DATA}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={2}
                        isAnimationActive
                        animationBegin={200}
                        animationDuration={900}
                      >
                        {MACRO_DATA.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : null}
              </div>
              <p className="mt-2 text-center text-sm font-medium text-white">
                Balanced Macro Distribution
              </p>
              <div className="mt-3 flex justify-center gap-4 text-xs text-white/80">
                {MACRO_DATA.map((m) => (
                  <span key={m.name} className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                    {m.name} {m.value}%
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
