const colors = {
  green: "bg-[var(--forest)]/10 text-[var(--forest)]",
  coral: "bg-[var(--coral)]/40 text-[var(--forest)]",
  amber: "bg-[var(--saffron)]/25 text-[var(--forest)]",
  gray: "bg-gray-100 text-[var(--warm-gray)]",
} as const;

export function Badge({
  label,
  color = "green",
  className = "",
}: {
  label: string;
  color?: keyof typeof colors;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${colors[color]} ${className}`}
    >
      {label}
    </span>
  );
}
