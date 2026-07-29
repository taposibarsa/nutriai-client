"use client";

import Link from "next/link";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFeaturedRecipes } from "@/hooks/useRecipes";

export function FeaturedRecipes() {
  const { data, isLoading, isError } = useFeaturedRecipes();
  const recipes = data?.data ?? [];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-forest sm:text-4xl">
            Nutritionist-Approved Recipes
          </h2>
          <p className="mt-3 text-warm-gray">
            Handpicked meals that are as delicious as they are healthy.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-12">
            <EmptyState
              heading="Could not load featured recipes"
              description="Browse the full library while we sort this out."
              ctaLabel="Explore All Recipes →"
              ctaLink="/recipes"
            />
          </div>
        ) : recipes.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              heading="No featured recipes yet"
              description="Explore the full library for healthy meals you can cook tonight."
              ctaLabel="Explore All Recipes →"
              ctaLink="/recipes"
            />
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/recipes"
                className="inline-flex rounded-full bg-coral px-6 py-3 text-sm font-bold text-foreground transition hover:brightness-95"
              >
                Explore All Recipes →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
