import { Suspense } from "react";
import RecipesExploreClient from "./RecipesExploreClient";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

function ExploreFallback() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-16 w-72 animate-pulse rounded-xl bg-[var(--card)]" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </main>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<ExploreFallback />}>
      <RecipesExploreClient />
    </Suspense>
  );
}
