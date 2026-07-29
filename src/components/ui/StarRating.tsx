"use client";

import { Star } from "lucide-react";

export function StarRating({
  rating,
  interactive = false,
  onRatingChange,
  size = 18,
}: {
  rating: number;
  interactive?: boolean;
  onRatingChange?: (value: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => {
        const filled = value <= Math.round(rating);
        return (
          <button
            key={value}
            type="button"
            disabled={!interactive}
            onClick={() => onRatingChange?.(value)}
            className={interactive ? "cursor-pointer" : "cursor-default"}
            aria-label={`${value} star`}
          >
            <Star
              size={size}
              className={
                filled
                  ? "fill-[var(--saffron)] text-[var(--saffron)]"
                  : "text-gray-300"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
