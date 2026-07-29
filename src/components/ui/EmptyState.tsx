import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  heading,
  description,
  ctaLabel,
  ctaLink,
  onCtaClick,
  icon,
  compact = false,
}: {
  heading: string;
  description: string;
  ctaLabel?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  icon?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact
          ? "px-2 py-6"
          : "rounded-2xl bg-[var(--card)] px-6 py-16 shadow-sm"
      }`}
    >
      {icon}
      <h3
        className={`font-bold text-[var(--forest)] ${
          compact ? "mt-0 text-base" : "mt-4 text-xl"
        }`}
      >
        {heading}
      </h3>
      <p
        className={`mt-2 max-w-md text-[var(--warm-gray)] ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        {description}
      </p>
      {ctaLabel && onCtaClick ? (
        <Button className="mt-6" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      ) : ctaLabel && ctaLink ? (
        <Link
          href={ctaLink}
          className="mt-6 rounded-full bg-[var(--coral)] px-4 py-2.5 text-sm font-semibold text-[var(--forest)]"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
