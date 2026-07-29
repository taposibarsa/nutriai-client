"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You're subscribed! Check your inbox Monday. 🥦");
    setEmail("");
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/newsletter.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[var(--forest)]/75" aria-hidden />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Get Weekly Healthy Recipes in Your Inbox
        </h2>
        <p className="mt-3 text-sm text-white/85 sm:text-base">
          Join 12,000+ people who receive curated recipes and nutrition tips every
          Monday morning.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-h-12 flex-1 rounded-full border border-white/20 bg-white px-5 text-sm text-foreground outline-none placeholder:text-warm-gray focus:border-white/50"
          />
          <button
            type="submit"
            className="min-h-12 rounded-full bg-[#FDCC3F] px-6 text-sm font-bold text-[var(--forest)] transition hover:brightness-105"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
