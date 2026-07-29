import Link from "next/link";
import { Clock, Flame, Star, Users } from "lucide-react";
import type { Recipe } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { SafeImage } from "@/components/ui/SafeImage";

const mealColors = {
  breakfast: "amber" as const,
  lunch: "green" as const,
  dinner: "coral" as const,
  snack: "gray" as const,
  dessert: "coral" as const,
};

const difficultyColors = {
  easy: "green" as const,
  medium: "amber" as const,
  hard: "coral" as const,
};

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--card)] shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="relative h-[220px] w-full overflow-hidden">
        <SafeImage
          src={recipe.images[0]}
          alt={recipe.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <div className="absolute left-3 top-3">
          <Badge label={recipe.mealType} color={mealColors[recipe.mealType]} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex h-6 items-center gap-1 overflow-hidden">
          {recipe.dietaryTags.slice(0, 2).map((tag) => (
            <Badge key={tag} label={tag} color="green" />
          ))}
        </div>
        <h3 className="min-h-[1.75rem] line-clamp-1 text-lg font-bold leading-7 text-[var(--forest)]">
          {recipe.title}
        </h3>
        <p className="mt-1 min-h-[2.5rem] line-clamp-2 text-sm leading-5 text-[var(--warm-gray)]">
          {recipe.shortDescription}
        </p>
        <div className="mt-auto pt-3">
          <div className="flex h-5 flex-wrap items-center gap-3 overflow-hidden text-xs text-[var(--warm-gray)]">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {totalTime} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" /> {recipe.nutrition.calories} kcal
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-[var(--saffron)]" />{" "}
              {recipe.averageRating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {recipe.servings}
            </span>
          </div>
          <div className="mt-3 h-6">
            <Badge
              label={recipe.difficulty}
              color={difficultyColors[recipe.difficulty]}
            />
          </div>
          <Link
            href={`/recipes/${recipe._id}`}
            className="mt-3 block rounded-full bg-[var(--coral)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--forest)] transition hover:brightness-95"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </article>
  );
}
