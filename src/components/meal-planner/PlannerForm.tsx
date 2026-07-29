"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import {
  plannerFormSchema,
  type PlannerFormValues,
} from "@/lib/validations";
import { Button } from "@/components/ui/Button";

const DIETARY_OPTIONS = [
  "No Restrictions",
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Keto",
  "Paleo",
  "Mediterranean",
  "Gluten-Free",
  "Dairy-Free",
];

const HEALTH_GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "Maintain Weight",
  "Boost Energy",
  "Improve Digestion",
  "Heart Health",
  "Balanced Nutrition",
];

const CUISINE_OPTIONS = [
  "Mediterranean",
  "Asian",
  "Italian",
  "Indian",
  "Mexican",
  "American",
  "Middle Eastern",
  "Japanese",
];

const ALLERGY_OPTIONS = [
  "Tree Nuts",
  "Peanuts",
  "Dairy",
  "Eggs",
  "Shellfish",
  "Soy",
  "Wheat/Gluten",
  "Fish",
];

const DAYS = [3, 5, 7] as const;
const MEALS = [2, 3, 4, 5] as const;

export function PlannerForm({
  onGenerate,
  generating,
  defaultValues,
}: {
  onGenerate: (values: PlannerFormValues) => void;
  generating: boolean;
  defaultValues?: Partial<PlannerFormValues>;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerFormSchema) as never,
    defaultValues: {
      dietaryPreference: "No Restrictions",
      healthGoal: "Balanced Nutrition",
      days: 7,
      mealsPerDay: 4,
      calorieTarget: 1800,
      cuisines: [],
      allergies: [],
      additionalNotes: "",
      ...defaultValues,
    },
  });

  const days = watch("days");
  const mealsPerDay = watch("mealsPerDay");
  const calorieTarget = watch("calorieTarget");
  const cuisines = watch("cuisines") ?? [];
  const allergies = watch("allergies") ?? [];
  const notes = watch("additionalNotes") ?? "";

  function toggleList(
    field: "cuisines" | "allergies",
    value: string,
    current: string[],
  ) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, next, { shouldValidate: true });
  }

  return (
    <form
      onSubmit={handleSubmit(onGenerate)}
      className="space-y-5 rounded-2xl bg-[var(--card)] p-5 shadow-sm"
    >
      <h2 className="text-lg font-bold text-[var(--forest)]">
        Customize Your Plan
      </h2>

      <label className="block text-sm font-semibold text-[var(--forest)]">
        Dietary Preference
        <select
          {...register("dietaryPreference")}
          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[var(--coral)]"
        >
          {DIETARY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.dietaryPreference && (
          <p className="mt-1 text-xs text-red-600">
            {errors.dietaryPreference.message}
          </p>
        )}
      </label>

      <label className="block text-sm font-semibold text-[var(--forest)]">
        Health Goal
        <select
          {...register("healthGoal")}
          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[var(--coral)]"
        >
          {HEALTH_GOALS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="text-sm font-semibold text-[var(--forest)]">
          Plan Duration
        </legend>
        <div className="mt-2 flex gap-2">
          {DAYS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setValue("days", d, { shouldValidate: true })}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
                days === d
                  ? "bg-[var(--coral)] text-[var(--forest)]"
                  : "bg-white text-[var(--forest)] ring-1 ring-gray-200"
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-[var(--forest)]">
          Meals Per Day
        </legend>
        <div className="mt-2 flex gap-2">
          {MEALS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() =>
                setValue("mealsPerDay", m, { shouldValidate: true })
              }
              className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
                mealsPerDay === m
                  ? "bg-[var(--coral)] text-[var(--forest)]"
                  : "bg-white text-[var(--forest)] ring-1 ring-gray-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="mb-1 flex items-center justify-between text-sm font-semibold text-[var(--forest)]">
          <span>Daily Calorie Target</span>
          <span>{calorieTarget.toLocaleString()} kcal / day</span>
        </div>
        <input
          type="range"
          min={1200}
          max={3500}
          step={50}
          {...register("calorieTarget", { valueAsNumber: true })}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-xs text-[var(--warm-gray)]">
          <span>Weight Loss Zone</span>
          <span>Muscle Gain Zone</span>
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-[var(--forest)]">
          Cuisine Preferences
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {CUISINE_OPTIONS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cuisines.includes(c)}
                onChange={() => toggleList("cuisines", c, cuisines)}
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-[var(--forest)]">
          Food Allergies / Intolerances
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {ALLERGY_OPTIONS.map((a) => (
            <label key={a} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={allergies.includes(a)}
                onChange={() => toggleList("allergies", a, allergies)}
              />
              {a}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm font-semibold text-[var(--forest)]">
        Additional Notes
        <textarea
          {...register("additionalNotes")}
          rows={3}
          maxLength={300}
          placeholder="e.g., I don't like spicy food. I prefer quick-prep meals under 30 minutes."
          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[var(--coral)]"
        />
        <span className="mt-1 block text-xs font-normal text-[var(--warm-gray)]">
          {notes.length}/300
        </span>
      </label>

      <Button type="submit" className="w-full" size="lg" loading={generating}>
        <Sparkles className="h-4 w-4" />
        Generate My Plan
      </Button>
    </form>
  );
}
