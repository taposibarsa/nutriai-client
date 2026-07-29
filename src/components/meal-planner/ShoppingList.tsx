"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ShoppingCategory } from "@/types";

export function ShoppingList({ categories }: { categories: ShoppingCategory[] }) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function toggle(key: string) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  if (!categories.length) return null;

  return (
    <section className="rounded-2xl bg-[var(--card)] shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <h3 className="font-bold text-[var(--forest)]">Shopping List</h3>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[var(--warm-gray)]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[var(--warm-gray)]" />
        )}
      </button>

      {open && (
        <div className="space-y-4 border-t border-[var(--sage)] px-4 py-4">
          {categories.map((cat) => (
            <div key={cat.category}>
              <h4 className="mb-2 text-sm font-semibold text-[var(--forest)]">
                {cat.category}
              </h4>
              <ul className="space-y-1.5">
                {cat.items.map((item) => {
                  const key = `${cat.category}:${item}`;
                  return (
                    <li key={key}>
                      <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                        <input
                          type="checkbox"
                          checked={Boolean(checked[key])}
                          onChange={() => toggle(key)}
                        />
                        <span
                          className={
                            checked[key] ? "text-[var(--warm-gray)] line-through" : ""
                          }
                        >
                          {item}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
