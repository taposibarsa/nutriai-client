"use client";

import { useMemo, useState } from "react";
import type { Ingredient } from "@/types";

function scaleQuantity(quantity: string, factor: number): string {
  const match = quantity.match(/^([\d./]+)\s*(.*)$/);
  if (!match) return quantity;
  const raw = match[1] ?? "";
  const unit = match[2] ?? "";
  let num = Number(raw);
  if (raw.includes("/")) {
    const [a, b] = raw.split("/");
    num = Number(a) / Number(b);
  }
  if (!Number.isFinite(num)) return quantity;
  const scaled = Math.round(num * factor * 100) / 100;
  return `${scaled} ${unit}`.trim();
}

export function IngredientsList({
  ingredients,
  baseServings,
}: {
  ingredients: Ingredient[];
  baseServings: number;
}) {
  const [servings, setServings] = useState(baseServings);
  const factor = servings / Math.max(baseServings, 1);

  const scaled = useMemo(
    () =>
      ingredients.map((item) => ({
        ...item,
        quantity: scaleQuantity(item.quantity, factor),
      })),
    [ingredients, factor],
  );

  return (
    <section className="rounded-2xl bg-[var(--card)] p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-[var(--forest)]">Ingredients</h2>
        <label className="flex items-center gap-2 text-sm">
          Serves
          <input
            type="number"
            min={1}
            value={servings}
            onChange={(e) => setServings(Math.max(1, Number(e.target.value) || 1))}
            className="w-16 rounded-lg border border-gray-200 px-2 py-1"
          />
        </label>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {scaled.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className="flex justify-between gap-3 border-b border-gray-100 py-2 text-sm"
          >
            <span className="font-medium text-[var(--forest)]">{item.name}</span>
            <span className="text-[var(--warm-gray)]">{item.quantity}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
