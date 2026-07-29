"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useRecipes } from "@/hooks/useRecipes";
import { SearchBar } from "@/components/recipes/SearchBar";
import {
  FilterPanel,
  type FilterState,
} from "@/components/recipes/FilterPanel";
import { SortDropdown } from "@/components/recipes/SortDropdown";
import { RecipeGrid } from "@/components/recipes/RecipeGrid";
import { PaginationControls } from "@/components/recipes/PaginationControls";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";

function filtersFromParams(params: URLSearchParams): FilterState {
  return {
    mealType: params.get("mealType")?.split(",").filter(Boolean) ?? [],
    dietaryTag: params.get("dietaryTag")?.split(",").filter(Boolean) ?? [],
    cuisine: params.get("cuisine") ?? "",
    maxCalories: Number(params.get("maxCalories") ?? 1200),
    difficulty: params.get("difficulty") ?? "any",
  };
}

const EMPTY_FILTERS: FilterState = {
  mealType: [],
  dietaryTag: [],
  cuisine: "",
  maxCalories: 1200,
  difficulty: "any",
};

export default function RecipesExploreClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsKey = searchParams.toString();
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") ?? "",
  );
  const debouncedSearch = useDebounce(searchInput, 300);
  const [draftFilters, setDraftFilters] = useState<FilterState>(() =>
    filtersFromParams(searchParams),
  );
  const skipSearchSync = useRef(false);

  const page = Number(searchParams.get("page") ?? 1);
  const sort = searchParams.get("sort") ?? "newest";
  const applied = useMemo(
    () => filtersFromParams(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when query string changes
    [paramsKey],
  );

  // Keep local controls in sync with URL (back/forward, Clear CTA, shared links)
  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    setSearchInput(urlSearch);
    setDraftFilters(filtersFromParams(searchParams));
    skipSearchSync.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  const query = useRecipes({
    page,
    limit: 8,
    search: (searchParams.get("search") ?? "") || undefined,
    mealType: applied.mealType.join(",") || undefined,
    dietaryTag: applied.dietaryTag.join(",") || undefined,
    cuisine: applied.cuisine || undefined,
    maxCalories: applied.maxCalories < 1200 ? applied.maxCalories : undefined,
    difficulty: applied.difficulty !== "any" ? applied.difficulty : undefined,
    sort,
  });

  function pushParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    const qs = params.toString();
    router.push(qs ? `/recipes?${qs}` : "/recipes");
  }

  useEffect(() => {
    if (skipSearchSync.current) {
      skipSearchSync.current = false;
      return;
    }
    const current = searchParams.get("search") ?? "";
    if (debouncedSearch === current) return;
    pushParams({
      search: debouncedSearch || undefined,
      page: "1",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  function applyFilters() {
    pushParams({
      page: "1",
      mealType: draftFilters.mealType.join(",") || undefined,
      dietaryTag: draftFilters.dietaryTag.join(",") || undefined,
      cuisine: draftFilters.cuisine || undefined,
      maxCalories:
        draftFilters.maxCalories < 1200
          ? String(draftFilters.maxCalories)
          : undefined,
      difficulty:
        draftFilters.difficulty !== "any" ? draftFilters.difficulty : undefined,
    });
  }

  function clearFilters() {
    skipSearchSync.current = true;
    setDraftFilters(EMPTY_FILTERS);
    setSearchInput("");
    router.push("/recipes");
  }

  const showSkeletons = query.isLoading || query.isFetching;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--forest)]">Explore Recipes</h1>
        <p className="mt-2 text-[var(--warm-gray)]">
          Search, filter, and discover nutritionist-approved meals.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <FilterPanel
          value={draftFilters}
          onChange={setDraftFilters}
          onApply={applyFilters}
          onClear={clearFilters}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar value={searchInput} onChange={setSearchInput} />
            <SortDropdown
              value={sort}
              onChange={(value) => pushParams({ sort: value, page: "1" })}
            />
          </div>

          {showSkeletons ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : query.isError ? (
            <EmptyState
              heading="Could not load recipes"
              description="Please check that the API server is running and try again."
            />
          ) : !query.data?.data.length ? (
            <EmptyState
              heading="No recipes found"
              description="Try adjusting your filters or search terms."
              ctaLabel="Clear filters"
              onCtaClick={clearFilters}
            />
          ) : (
            <>
              <p className="mb-4 text-sm text-[var(--warm-gray)]">
                Showing {(page - 1) * 8 + 1}–
                {Math.min(page * 8, query.data.total)} of {query.data.total} recipes
              </p>
              <RecipeGrid recipes={query.data.data} />
              <PaginationControls
                page={query.data.page}
                totalPages={query.data.totalPages}
                onPageChange={(nextPage) =>
                  pushParams({ page: String(nextPage) })
                }
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
