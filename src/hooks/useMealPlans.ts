"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type {
  GeneratedPlan,
  MealPlanPreferences,
  SavedMealPlan,
} from "@/types";

export function useSavedMealPlans() {
  return useQuery({
    queryKey: ["meal-plans"],
    queryFn: () => apiFetch<{ data: SavedMealPlan[] }>("/api/ai/meal-plans"),
  });
}

export function useGenerateMealPlan() {
  return useMutation({
    mutationFn: (preferences: MealPlanPreferences) =>
      apiFetch<{ generatedPlan: GeneratedPlan; preferences: MealPlanPreferences }>(
        "/api/ai/meal-plan/generate",
        {
          method: "POST",
          body: JSON.stringify(preferences),
        },
      ),
  });
}

export function useSaveMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      title: string;
      preferences: MealPlanPreferences;
      generatedPlan: GeneratedPlan;
    }) =>
      apiFetch<SavedMealPlan>("/api/ai/meal-plan/save", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
    },
  });
}

export function useDeleteMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/ai/meal-plans/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
    },
  });
}

export async function saveUserPreferences(
  preferences: MealPlanPreferences,
): Promise<void> {
  try {
    await apiFetch("/api/users/preferences", {
      method: "PATCH",
      body: JSON.stringify({ preferences }),
    });
  } catch {
    // Non-blocking — preference persistence should not break generate UX
  }
}
