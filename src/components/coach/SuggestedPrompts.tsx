"use client";

type SuggestedPromptsProps = {
  prompts: string[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

export function SuggestedPrompts({
  prompts,
  onSelect,
  disabled = false,
}: SuggestedPromptsProps) {
  if (prompts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-1">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-forest/20 bg-card px-3 py-1.5 text-left text-xs text-forest transition hover:border-forest/40 hover:bg-sage/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
