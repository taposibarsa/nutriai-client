"use client";

import { UtensilsCrossed } from "lucide-react";
import type { GeneratedPlan, MealPlanPreferences } from "@/types";
import { MacroChart } from "@/components/detail/MacroChart";
import { DayCard } from "./DayCard";
import { ShoppingList } from "./ShoppingList";
import { Button } from "@/components/ui/Button";

function averageMacros(plan: GeneratedPlan) {
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let meals = 0;
  for (const day of plan.days) {
    for (const meal of day.meals) {
      protein += meal.protein;
      carbs += meal.carbs;
      fat += meal.fat;
      meals += 1;
    }
  }
  const days = Math.max(plan.days.length, 1);
  return {
    protein: Math.round(protein / days),
    carbs: Math.round(carbs / days),
    fat: Math.round(fat / days),
    totalMeals: meals,
  };
}

export function MealPlanDisplay({
  plan,
  preferences,
  loading,
  onRegenerate,
  onSave,
  regenerating,
}: {
  plan: GeneratedPlan | null;
  preferences: MealPlanPreferences | null;
  loading: boolean;
  onRegenerate?: () => void;
  onSave?: () => void;
  regenerating?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl bg-[var(--card)] p-8 text-center shadow-sm">
        <div className="mb-4 h-16 w-16 animate-pulse rounded-full bg-[var(--sage)]" />
        <p className="text-lg font-semibold text-[var(--forest)]">
          Claude is crafting your personalized meal plan
          <span className="inline-block animate-pulse">...</span>
        </p>
        <p className="mt-2 max-w-sm text-sm text-[var(--warm-gray)]">
          This usually takes a few seconds depending on plan length.
        </p>
        <div className="mt-8 w-full max-w-md space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-[var(--sage)]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!plan || !preferences) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--forest)]/20 bg-[var(--card)] p-8 text-center shadow-sm">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--sage)]">
          <UtensilsCrossed className="h-8 w-8 text-[var(--forest)]" />
        </div>
        <p className="max-w-md text-sm text-[var(--warm-gray)]">
          Fill in your preferences and click Generate to create your personalized
          meal plan.
        </p>
      </div>
    );
  }

  const macros = averageMacros(plan);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-[var(--card)] p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <h2 className="text-xl font-bold text-[var(--forest)]">Your Plan</h2>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-[var(--warm-gray)]">
              <span className="rounded-full bg-[var(--sage)] px-3 py-1 font-semibold text-[var(--forest)]">
                {plan.totalCaloriesPerDay} kcal / day avg
              </span>
              <span className="rounded-full bg-[var(--sage)] px-3 py-1 font-semibold text-[var(--forest)]">
                {preferences.days} days
              </span>
              <span className="rounded-full bg-[var(--sage)] px-3 py-1 font-semibold text-[var(--forest)]">
                {macros.totalMeals} meals
              </span>
              <span className="rounded-full bg-[var(--sage)] px-3 py-1 font-semibold text-[var(--forest)]">
                {preferences.dietaryPreference}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {onRegenerate && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onRegenerate}
                  loading={regenerating}
                >
                  Regenerate
                </Button>
              )}
              {onSave && (
                <Button type="button" variant="secondary" onClick={onSave}>
                  Save Plan
                </Button>
              )}
            </div>
          </div>
          <div className="mx-auto h-40 w-40">
            <MacroChart
              protein={macros.protein}
              carbs={macros.carbs}
              fat={macros.fat}
            />
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {plan.days.map((day, index) => (
          <DayCard key={day.dayNumber} day={day} defaultOpen={index === 0} />
        ))}
      </div>

      <ShoppingList
        key={`${plan.totalCaloriesPerDay}-${plan.days.length}-${plan.shoppingList.length}`}
        categories={plan.shoppingList}
      />

      {plan.preparationTips.length > 0 && (
        <section className="rounded-2xl bg-[var(--card)] p-5 shadow-sm">
          <h3 className="mb-3 font-bold text-[var(--forest)]">Preparation Tips</h3>
          <ul className="space-y-2">
            {plan.preparationTips.map((tip, index) => (
              <li
                key={index}
                className="rounded-xl bg-[var(--sage)]/50 px-3 py-2 text-sm text-[var(--foreground)]"
              >
                {tip}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
