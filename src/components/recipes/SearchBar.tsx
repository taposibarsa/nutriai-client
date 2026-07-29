"use client";

import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search recipes, ingredients...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--warm-gray)]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-[var(--card)] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[var(--coral)]"
      />
    </div>
  );
}
