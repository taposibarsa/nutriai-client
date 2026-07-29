import { StarRating } from "@/components/ui/StarRating";
import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-3">
        {review.userImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.userImage}
            alt={review.userName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sage)] text-sm font-bold text-[var(--forest)]">
            {review.userName.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-[var(--forest)]">{review.userName}</p>
          <p className="text-xs text-[var(--warm-gray)]">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <StarRating rating={review.rating} />
      </div>
      <p className="mt-2 text-sm text-[var(--warm-gray)]">{review.comment}</p>
    </article>
  );
}
