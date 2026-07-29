"use client";

import type { Nutrition } from "@/types";
import { MacroChart } from "./MacroChart";

export function MacroStrip({ nutrition }: { nutrition: Nutrition }) {
  return (
    <div className="grid gap-6 rounded-2xl bg-[var(--card)] p-6 shadow-sm lg:grid-cols-[1.4fr_0.8fr]">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <MacroItem label="Calories" value={`${nutrition.calories} kcal`} />
        <MacroItem label="Protein" value={`${nutrition.protein}g`} />
        <MacroItem label="Carbs" value={`${nutrition.carbs}g`} />
        <MacroItem label="Fat" value={`${nutrition.fat}g`} />
        <MacroItem label="Fiber" value={`${nutrition.fiber ?? 0}g`} />
      </div>
      <div className="mx-auto h-48 w-48">
        <MacroChart
          protein={nutrition.protein}
          carbs={nutrition.carbs}
          fat={nutrition.fat}
        />
      </div>
    </div>
  );
}

function MacroItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--sage)] p-3 text-center">
      <p className="text-xs uppercase tracking-wide text-[var(--warm-gray)]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[var(--forest)]">{value}</p>
    </div>
  );
}
