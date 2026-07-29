import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-[var(--coral)] text-[var(--forest)] hover:brightness-95 shadow-sm",
  secondary: "bg-[var(--forest)] text-white hover:opacity-90",
  outline:
    "border border-[var(--forest)] text-[var(--forest)] hover:bg-[var(--sage)]",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-[var(--forest)] hover:bg-[var(--sage)]",
} as const;

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
} as const;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className = "",
  children,
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
          Please wait...
        </>
      ) : (
        children
      )}
    </button>
  );
}
