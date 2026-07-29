"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Leaf, UtensilsCrossed } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function NotFoundContent() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16 sm:px-6">
      {/* Atmospheric background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(253,204,63,0.22), transparent 55%), radial-gradient(ellipse 70% 50% at 80% 80%, rgba(56,102,57,0.18), transparent 50%), radial-gradient(ellipse 60% 45% at 10% 70%, rgba(56,102,57,0.12), transparent 45%), linear-gradient(165deg, #faf9f6 0%, #eef4ee 45%, #fcf7e8 100%)",
        }}
        aria-hidden
      />

      {/* Soft drifting orbs */}
      <motion.div
        className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-[var(--forest)]/10 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -right-10 bottom-20 h-64 w-64 rounded-full bg-[var(--coral)]/25 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-xl text-center">
        <motion.div
          className="relative mx-auto mb-2 inline-flex"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="font-display select-none text-[7.5rem] font-extrabold leading-none tracking-tight text-[var(--forest)]/15 sm:text-[9.5rem]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            404
          </motion.span>

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ y: [0, -10, 0], rotate: [-8, 8, -8] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--forest)] shadow-lg shadow-[var(--forest)]/25 sm:h-20 sm:w-20">
              <Leaf className="h-8 w-8 text-[var(--coral)] sm:h-10 sm:w-10" strokeWidth={2.25} />
            </span>
          </motion.div>
        </motion.div>

        <motion.p
          className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-[var(--forest)]"
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          NutriAI
        </motion.p>

        <motion.h1
          className="font-display mt-3 text-3xl font-bold tracking-tight text-[var(--forest)] sm:text-4xl"
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Page not found
        </motion.h1>

        <motion.p
          className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--warm-gray)] sm:text-base"
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          This plate is empty — the page you&apos;re looking for doesn&apos;t exist or may have
          moved. Let&apos;s get you back to something nourishing.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--coral)] px-6 text-sm font-bold text-[var(--forest)] transition hover:brightness-105"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/recipes"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[var(--forest)] bg-transparent px-6 text-sm font-bold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-white"
          >
            <UtensilsCrossed className="h-4 w-4" />
            Browse Recipes
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
