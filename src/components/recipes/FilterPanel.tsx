"use client";

import { Button } from "@/components/ui/Button";
import { MEAL_TYPES, DIETARY_TAGS, CUISINES } from "@/lib/constants";

export type FilterState = {
  mealType: string[];
  dietaryTag: string[];
  cuisine: string;
  maxCalories: number;
  difficulty: string;
};

export function FilterPanel({
  value,
  onChange,
  onApply,
  onClear,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  function toggle(list: string[], item: string): string[] {
    return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
  }

  return (
    <aside className="w-full rounded-2xl bg-[var(--card)] p-5 shadow-sm lg:w-[280px] lg:shrink-0">
      <h2 className="text-lg font-bold text-[var(--forest)]">Filters</h2>

      <section className="mt-5">
        <h3 className="mb-2 text-sm font-semibold">Meal Type</h3>
        <div className="space-y-2">
          {MEAL_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm capitalize">
              <input
                type="checkbox"
                checked={value.mealType.includes(type)}
                onChange={() =>
                  onChange({ ...value, mealType: toggle(value.mealType, type) })
                }
              />
              {type}
            </label>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h3 className="mb-2 text-sm font-semibold">Dietary Tag</h3>
        <div className="space-y-2">
          {DIETARY_TAGS.map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-sm capitalize">
              <input
                type="checkbox"
                checked={value.dietaryTag.includes(tag)}
                onChange={() =>
                  onChange({
                    ...value,
                    dietaryTag: toggle(value.dietaryTag, tag),
                  })
                }
              />
              {tag}
            </label>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h3 className="mb-2 text-sm font-semibold">Cuisine</h3>
        <select
          value={value.cuisine || "All"}
          onChange={(e) =>
            onChange({
              ...value,
              cuisine: e.target.value === "All" ? "" : e.target.value,
            })
          }
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
        >
          {CUISINES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </section>

      <section className="mt-5">
        <h3 className="mb-2 text-sm font-semibold">
          Max Calories: {value.maxCalories} kcal
        </h3>
        <input
          type="range"
          min={100}
          max={1200}
          step={50}
          value={value.maxCalories}
          onChange={(e) =>
            onChange({ ...value, maxCalories: Number(e.target.value) })
          }
          className="w-full"
        />
      </section>

      <section className="mt-5">
        <h3 className="mb-2 text-sm font-semibold">Difficulty</h3>
        {["any", "easy", "medium", "hard"].map((level) => (
          <label key={level} className="mb-1 flex items-center gap-2 text-sm capitalize">
            <input
              type="radio"
              name="difficulty"
              checked={value.difficulty === level}
              onChange={() => onChange({ ...value, difficulty: level })}
            />
            {level}
          </label>
        ))}
      </section>

      <div className="mt-6 space-y-2">
        <Button className="w-full" onClick={onApply}>
          Apply Filters
        </Button>
        <button
          type="button"
          onClick={onClear}
          className="w-full text-sm font-medium text-[var(--coral)]"
        >
          Clear All
        </button>
      </div>
    </aside>
  );
}
