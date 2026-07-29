import Link from "next/link";
import { Sparkles, MessageCircle } from "lucide-react";

const FEATURES = [
  {
    accent: "bg-coral",
    icon: Sparkles,
    title: "7-Day Personalized Meal Plans",
    description:
      "Claude analyzes your dietary preferences, health goals, calorie targets, and allergies to build a complete eating plan with recipes, macros, and a ready-to-use shopping list.",
    chips: [
      "Vegan / Keto / Paleo Friendly",
      "Full Macro Breakdown",
      "Shopping List Included",
      "One-Click Regenerate",
    ],
    href: "/meal-planner",
    cta: "Try Meal Planner →",
  },
  {
    accent: "bg-forest",
    icon: MessageCircle,
    title: "Your Personal Nutrition Coach, Available 24/7",
    description:
      "Ask anything about food, nutrition, or your meal plan. The AI Coach remembers your conversation, understands your goals, and gives evidence-based guidance in real time.",
    chips: [
      "Streaming Responses",
      "Conversation Memory",
      "Context-Aware",
      "Suggested Follow-ups",
    ],
    href: "/coach",
    cta: "Chat with Coach →",
  },
] as const;

export function AiFeatures() {
  return (
    <section className="bg-[#F4F7F4] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-forest sm:text-4xl">
            AI Features Built for Real Life
          </h2>
          <p className="mt-3 text-warm-gray">
            Plan your week, then get coaching when questions come up in the kitchen.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <article
                key={f.href}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className={`h-1.5 w-full ${f.accent}`} />
                <div className="p-6 sm:p-8">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage text-forest">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-foreground sm:text-2xl">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-warm-gray">
                    {f.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {f.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-forest/15 bg-card px-3 py-1 text-xs font-medium text-forest"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={f.href}
                    className="mt-6 inline-flex text-sm font-bold text-forest transition hover:text-forest/80"
                  >
                    {f.cta}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
