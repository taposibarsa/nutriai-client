"use client";

import { Trash2 } from "lucide-react";
import type { SavedMealPlan } from "@/types";
import { Button } from "@/components/ui/Button";

export function SavedPlanCard({
  plan,
  onLoad,
  onDelete,
  deleting,
}: {
  plan: SavedMealPlan;
  onLoad: () => void;
  onDelete: () => void;
  deleting?: boolean;
}) {
  return (
    <article className="rounded-xl bg-[var(--sage)]/60 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-bold text-[var(--forest)]">
            {plan.title}
          </h4>
          <p className="text-xs text-[var(--warm-gray)]">
            {new Date(plan.createdAt).toLocaleDateString()} ·{" "}
            {plan.preferences.days} days · {plan.preferences.calorieTarget} kcal
          </p>
        </div>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="rounded-full p-1.5 text-[var(--warm-gray)] hover:bg-white hover:text-red-600 disabled:opacity-50"
          aria-label={`Delete ${plan.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2 w-full"
        onClick={onLoad}
      >
        Load
      </Button>
    </article>
  );
}
