"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ExternalLink, Trash2 } from "lucide-react";
import { useMyRecipes, useDeleteRecipe } from "@/hooks/useRecipes";
import { ApiError } from "@/lib/api";
import type { Recipe } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { isAllowedImageUrl } from "@/lib/imageHosts";

export default function ManageRecipesPage() {
  const { data, isLoading, isError } = useMyRecipes();
  const deleteRecipe = useDeleteRecipe();
  const [pendingDelete, setPendingDelete] = useState<Recipe | null>(null);

  const recipes = data?.data ?? [];

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteRecipe.mutateAsync(pendingDelete._id);
      toast.success("Recipe deleted");
      setPendingDelete(null);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not delete recipe.";
      toast.error(message);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--forest)]">My Recipes</h1>
          <p className="mt-2 text-[var(--warm-gray)]">
            All the recipes you&apos;ve contributed to the NutriAI library.
          </p>
        </div>
        <Link
          href="/items/add"
          className="rounded-full bg-[var(--coral)] px-5 py-2.5 text-sm font-bold text-[var(--forest)] transition hover:brightness-95"
        >
          Add Recipe
        </Link>
      </div>

      {isLoading ? (
        <>
          <div className="hidden overflow-hidden rounded-2xl bg-[var(--card)] shadow-sm md:block">
            <div className="animate-pulse space-y-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b border-[var(--sage)] px-4 py-4 last:border-0"
                >
                  <div className="h-4 w-6 rounded bg-gray-200" />
                  <div className="h-12 w-12 rounded-xl bg-gray-200" />
                  <div className="h-4 flex-1 rounded bg-gray-200" />
                  <div className="h-4 w-16 rounded bg-gray-200" />
                  <div className="h-4 w-20 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 md:hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-[var(--card)] p-4 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="h-20 w-20 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-200" />
                    <div className="h-3 w-1/3 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : isError ? (
        <EmptyState
          heading="Could not load your recipes"
          description="Please check that the API server is running and try again."
        />
      ) : recipes.length === 0 ? (
        <EmptyState
          heading="You haven't published any recipes yet."
          description="Share your first healthy recipe with the NutriAI community."
          ctaLabel="Add Your First Recipe →"
          ctaLink="/items/add"
        />
      ) : (
        <>
          <p className="mb-4 text-sm font-medium text-[var(--forest)]">
            You have {recipes.length} published recipe
            {recipes.length === 1 ? "" : "s"}
          </p>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl bg-[var(--card)] shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--sage)] bg-[var(--sage)]/50 text-xs uppercase tracking-wide text-[var(--warm-gray)]">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Recipe</th>
                  <th className="px-4 py-3">Meal</th>
                  <th className="px-4 py-3">Calories</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe, index) => (
                  <tr
                    key={recipe._id}
                    className="border-b border-[var(--sage)] last:border-0"
                  >
                    <td className="px-4 py-3 text-[var(--warm-gray)]">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            isAllowedImageUrl(recipe.images[0] ?? "")
                              ? recipe.images[0]!
                              : "/recipe-placeholder.svg"
                          }
                          alt={recipe.title}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                        <span className="font-semibold text-[var(--forest)]">
                          {recipe.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <Badge label={recipe.mealType} color="amber" />
                    </td>
                    <td className="px-4 py-3">
                      {recipe.nutrition.calories} kcal
                    </td>
                    <td className="px-4 py-3">
                      {recipe.averageRating.toFixed(1)}★
                    </td>
                    <td className="px-4 py-3 text-[var(--warm-gray)]">
                      {new Date(recipe.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/recipes/${recipe._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--forest)] px-3 py-1.5 text-xs font-semibold text-[var(--forest)] hover:bg-[var(--sage)]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> View
                        </a>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setPendingDelete(recipe)}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {recipes.map((recipe, index) => (
              <article
                key={recipe._id}
                className="rounded-2xl bg-[var(--card)] p-4 shadow-sm"
              >
                <div className="flex gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      isAllowedImageUrl(recipe.images[0] ?? "")
                        ? recipe.images[0]!
                        : "/recipe-placeholder.svg"
                    }
                    alt={recipe.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[var(--warm-gray)]">#{index + 1}</p>
                    <h2 className="truncate font-bold text-[var(--forest)]">
                      {recipe.title}
                    </h2>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--warm-gray)]">
                      <Badge label={recipe.mealType} color="amber" />
                      <span>{recipe.nutrition.calories} kcal</span>
                      <span>{recipe.averageRating.toFixed(1)}★</span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--warm-gray)]">
                      {new Date(recipe.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`/recipes/${recipe._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-[var(--forest)] px-3 py-2 text-xs font-semibold text-[var(--forest)]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View
                  </a>
                  <Button
                    variant="danger"
                    size="sm"
                    className="flex-1"
                    onClick={() => setPendingDelete(recipe)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <Modal
        open={Boolean(pendingDelete)}
        title="Delete recipe?"
        confirmLabel="Delete"
        confirmLoading={deleteRecipe.isPending}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      >
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-[var(--forest)]">
            {pendingDelete?.title}
          </strong>
          ? This cannot be undone.
        </p>
      </Modal>
    </main>
  );
}
