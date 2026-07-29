"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type {
  RecipeDetail,
  RecipeListParams,
  RecipeListResponse,
  Review,
} from "@/types";

function toQuery(params: RecipeListParams): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function useRecipes(params: RecipeListParams) {
  return useQuery({
    queryKey: ["recipes", params],
    queryFn: () =>
      apiFetch<RecipeListResponse>(`/api/recipes${toQuery(params)}`),
  });
}

export function useFeaturedRecipes() {
  return useQuery({
    queryKey: ["recipes", "featured"],
    queryFn: () =>
      apiFetch<{ data: RecipeListResponse["data"] }>("/api/recipes/featured"),
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => apiFetch<RecipeDetail>(`/api/recipes/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateReview(recipeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { rating: number; comment: string }) =>
      apiFetch<{ review: Review; averageRating: number; totalReviews: number }>(
        "/api/reviews",
        {
          method: "POST",
          body: JSON.stringify({ recipeId, ...body }),
        },
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recipes", recipeId] });
      void queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

export function useMyRecipes() {
  return useQuery({
    queryKey: ["recipes", "mine"],
    queryFn: () => apiFetch<{ data: RecipeListResponse["data"] }>("/api/recipes/user"),
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch<RecipeListResponse["data"][number]>("/api/recipes", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recipes"] });
      void queryClient.invalidateQueries({ queryKey: ["recipes", "mine"] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/recipes/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recipes"] });
      void queryClient.invalidateQueries({ queryKey: ["recipes", "mine"] });
    },
  });
}
