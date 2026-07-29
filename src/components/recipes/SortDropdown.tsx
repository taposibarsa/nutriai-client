"use client";

const OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
  { value: "calories", label: "Lowest Calories" },
  { value: "quickest", label: "Quickest" },
  { value: "reviews", label: "Most Reviewed" },
];

export function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-gray-200 bg-[var(--card)] px-3 py-2.5 text-sm outline-none focus:border-[var(--coral)]"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
