import { ClipboardList, Sparkles, MessageCircle } from "lucide-react";

const STEPS = [
  {
    n: 1,
    icon: ClipboardList,
    title: "Set Your Goals",
    text: "Tell NutriAI about your dietary preferences, health goals, and any food restrictions.",
  },
  {
    n: 2,
    icon: Sparkles,
    title: "Generate Your Plan",
    text: "Claude AI creates a complete personalized meal plan with daily meals, macros, and a shopping list.",
  },
  {
    n: 3,
    icon: MessageCircle,
    title: "Cook & Chat",
    text: "Follow your plan and ask our AI Nutrition Coach anything — anytime, in real time.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-forest sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-warm-gray">
            Three simple steps from goals to a plan you can cook and chat about.
          </p>
        </div>

        <div className="relative mt-12">
          <div
            className="pointer-events-none absolute top-8 right-[16%] left-[16%] hidden border-t-2 border-dotted border-forest/25 md:block"
            aria-hidden
          />
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.n} className="relative text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest text-2xl font-extrabold text-white shadow-md">
                    {step.n}
                  </div>
                  <div className="mx-auto mt-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-forest">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-warm-gray">
                    {step.text}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
