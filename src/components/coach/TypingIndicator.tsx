"use client";

type TypingIndicatorProps = {
  className?: string;
};

export function TypingIndicator({ className = "" }: TypingIndicatorProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm ${className}`}
      aria-label="Coach is typing"
      role="status"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 animate-pulse rounded-full bg-forest"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
