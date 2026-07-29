"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { PlanDay } from "@/types";

export function DayCard({ day, defaultOpen }: { day: PlanDay; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));

  return (
    <article className="overflow-hidden rounded-2xl bg-[var(--card)] shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <h3 className="font-bold text-[var(--forest)]">Day {day.dayNumber}</h3>
          <p className="text-xs text-[var(--warm-gray)]">
            {day.totalCalories} kcal · {day.meals.length} meals
          </p>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[var(--warm-gray)]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[var(--warm-gray)]" />
        )}
      </button>

      {open && (
        <div className="space-y-3 border-t border-[var(--sage)] px-4 py-3">
          {day.meals.map((meal, index) => (
            <div
              key={`${meal.mealType}-${index}`}
              className="rounded-xl bg-[var(--sage)]/50 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--warm-gray)]">
                  {meal.mealType}
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-[var(--forest)]">
                  <span className="rounded-full bg-white px-2 py-0.5">
                    {meal.calories} kcal
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5">
                    P {meal.protein}g
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5">
                    C {meal.carbs}g
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5">
                    F {meal.fat}g
                  </span>
                </div>
              </div>
              <p className="mt-1 font-semibold text-[var(--forest)]">{meal.name}</p>
              <p className="mt-0.5 line-clamp-2 text-sm text-[var(--warm-gray)]">
                {meal.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
