"use client";

import { Button } from "@/components/ui/Button";

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    Math.min(totalPages, page + 2),
  );

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </Button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
            p === page
              ? "bg-[var(--coral)] text-[var(--forest)]"
              : "bg-[var(--card)] text-[var(--forest)] shadow-sm"
          }`}
        >
          {p}
        </button>
      ))}
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
