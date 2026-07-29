"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How does NutriAI create my meal plan?",
    a: "Claude AI uses your dietary preferences, health goals, calorie target, and restrictions to build a nutritionally balanced plan with daily meals, macros, and a shopping list you can cook from right away.",
  },
  {
    q: "Is NutriAI suitable for medical dietary conditions?",
    a: "NutriAI is a wellness tool, not a medical service. For clinical conditions, allergies that require medical oversight, or therapeutic diets, please consult a registered dietitian or your doctor.",
  },
  {
    q: "Can I use NutriAI if I'm vegetarian / vegan / keto?",
    a: "Yes. The meal planner fully supports major dietary approaches including vegetarian, vegan, keto, Mediterranean, high-protein, gluten-free, and more.",
  },
  {
    q: "How does the AI Nutrition Coach remember our conversation?",
    a: "Conversation history is stored securely and sent to Claude with each message, so the coach has true memory within a conversation and can reference your goals and prior questions.",
  },
  {
    q: "Is my data private and secure?",
    a: "Your recipes, meal plans, and chats are stored securely and never sold. Authentication protects personal data so only you can access your private content.",
  },
] as const;

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-forest sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-warm-gray">
            Quick answers about meal plans, coaching, and your data.
          </p>
        </div>

        <div className="mt-10 divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-white">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-foreground sm:text-base">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-forest transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen ? (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-warm-gray">
                    {item.a}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
