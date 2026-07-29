import { RecipeGrid } from "@/components/recipes/RecipeGrid";
import type { Recipe } from "@/types";

export function RelatedRecipes({ recipes }: { recipes: Recipe[] }) {
  if (!recipes.length) return null;
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-[var(--forest)]">
        You Might Also Like
      </h2>
      <RecipeGrid recipes={recipes} />
    </section>
  );
}
