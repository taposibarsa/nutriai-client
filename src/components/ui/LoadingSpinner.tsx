export function LoadingSpinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-10 w-10" : "h-6 w-6";
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-[var(--coral)] border-t-transparent ${dim} ${className}`}
      aria-label="Loading"
    />
  );
}
