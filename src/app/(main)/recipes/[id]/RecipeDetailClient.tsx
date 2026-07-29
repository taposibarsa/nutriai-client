"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Clock, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useRecipe, useCreateReview } from "@/hooks/useRecipes";
import { authClient } from "@/lib/auth-client";
import { ApiError } from "@/lib/api";
import { ImageGallery } from "@/components/detail/ImageGallery";
import { MacroStrip } from "@/components/detail/MacroStrip";
import { IngredientsList } from "@/components/detail/IngredientsList";
import { InstructionSteps } from "@/components/detail/InstructionSteps";
import { ReviewCard } from "@/components/detail/ReviewCard";
import { RelatedRecipes } from "@/components/detail/RelatedRecipes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { EmptyState } from "@/components/ui/EmptyState";

function RecipeDetailSkeleton() {
  return (
    <main className="mx-auto max-w-7xl animate-pulse space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-[320px] rounded-2xl bg-gray-200 sm:h-[400px]" />
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full bg-gray-200" />
          <div className="h-6 w-16 rounded-full bg-gray-200" />
        </div>
        <div className="h-9 w-2/3 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-200" />
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="h-64 rounded-2xl bg-gray-200" />
        <div className="h-64 rounded-2xl bg-gray-200" />
      </div>
    </main>
  );
}

export default function RecipeDetailClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: recipe, isLoading, isError } = useRecipe(id);
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const createReview = useCreateReview(id);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (isLoading) {
    return <RecipeDetailSkeleton />;
  }

  if (isError || !recipe) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          heading="Recipe not found"
          description="This recipe may have been removed or the link is invalid."
          ctaLabel="Back to Explore"
          ctaLink="/recipes"
        />
      </main>
    );
  }

  const alreadyReviewed = Boolean(
    session?.user?.id &&
      recipe.reviews.some((r) => String(r.user) === session.user.id),
  );

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createReview.mutateAsync({ rating, comment });
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not submit review.";
      toast.error(message);
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <ImageGallery images={recipe.images} title={recipe.title} />

      <header className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge label={recipe.mealType} color="amber" />
          <Badge label={recipe.difficulty} color="green" />
          <Badge label={recipe.cuisine} color="gray" />
          {recipe.dietaryTags.map((tag) => (
            <Badge key={tag} label={tag} color="coral" />
          ))}
        </div>
        <h1 className="text-3xl font-bold text-[var(--forest)] sm:text-4xl">
          {recipe.title}
        </h1>
        <p className="max-w-3xl text-[var(--warm-gray)]">
          {recipe.shortDescription}
        </p>
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--warm-gray)]">
          {recipe.fullDescription}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--warm-gray)]">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" /> Prep {recipe.prepTime} min · Cook{" "}
            {recipe.cookTime} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-4 w-4" /> {recipe.servings} servings
          </span>
          <span className="inline-flex items-center gap-2">
            <StarRating rating={recipe.averageRating} />
            {recipe.averageRating.toFixed(1)} ({recipe.totalReviews} reviews)
            <a
              href="#reviews"
              className="font-semibold text-[var(--coral)] hover:underline"
            >
              Write a Review
            </a>
          </span>
        </div>
      </header>

      <MacroStrip nutrition={recipe.nutrition} />

      <div className="grid gap-6 lg:grid-cols-2">
        <IngredientsList
          ingredients={recipe.ingredients}
          baseServings={recipe.servings}
        />
        <InstructionSteps steps={recipe.instructions} />
      </div>

      <section id="reviews" className="scroll-mt-24 rounded-2xl bg-[var(--card)] p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-bold text-[var(--forest)]">Reviews</h2>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-[var(--forest)]">
              {recipe.averageRating.toFixed(1)}
            </span>
            <div>
              <StarRating rating={recipe.averageRating} size={20} />
              <p className="text-xs text-[var(--warm-gray)]">
                {recipe.totalReviews} reviews
              </p>
            </div>
          </div>
        </div>

        {sessionPending ? (
          <p className="mb-6 text-sm text-[var(--warm-gray)]">Checking session...</p>
        ) : session?.user ? (
          alreadyReviewed ? (
            <p className="mb-6 rounded-xl bg-[var(--sage)] p-4 text-sm text-[var(--forest)]">
              You have already reviewed this recipe. Thank you!
            </p>
          ) : (
            <form onSubmit={handleSubmitReview} className="mb-6 space-y-3">
              <label className="block text-sm font-semibold text-[var(--forest)]">
                Your rating
                <div className="mt-1">
                  <StarRating
                    rating={rating}
                    interactive
                    onRatingChange={setRating}
                    size={22}
                  />
                </div>
              </label>
              <label className="block text-sm font-semibold text-[var(--forest)]">
                Comment
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  minLength={20}
                  required
                  rows={4}
                  placeholder="Share at least 20 characters about this recipe..."
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal outline-none focus:border-[var(--coral)]"
                />
              </label>
              <Button type="submit" loading={createReview.isPending}>
                Submit Review
              </Button>
            </form>
          )
        ) : (
          <div className="mb-6 rounded-xl bg-[var(--sage)] p-4 text-sm">
            <Link
              href={`/login?redirect=/recipes/${recipe._id}`}
              className="font-semibold text-[var(--coral)] hover:underline"
            >
              Sign in
            </Link>{" "}
            to leave a review.
          </div>
        )}

        {recipe.reviews.length === 0 ? (
          <p className="text-sm text-[var(--warm-gray)]">
            No reviews yet. Be the first to share your thoughts.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recipe.reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}
      </section>

      <RelatedRecipes recipes={recipe.related} />
    </main>
  );
}
