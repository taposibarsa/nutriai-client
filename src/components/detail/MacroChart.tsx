"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function MacroChart({
  protein,
  carbs,
  fat,
}: {
  protein: number;
  carbs: number;
  fat: number;
}) {
  // Calorie contributions: protein/carbs 4 kcal/g, fat 9 kcal/g
  const data = [
    { name: "Protein", value: protein * 4, color: "#386639" },
    { name: "Carbs", value: carbs * 4, color: "#FDCC3F" },
    { name: "Fat", value: fat * 9, color: "#E9B44C" },
  ].filter((entry) => entry.value > 0);

  if (!data.length) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-[var(--warm-gray)]">
        No macro data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={45}
          outerRadius={70}
          paddingAngle={3}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) =>
            typeof value === "number" ? [`${Math.round(value)} kcal`, ""] : value
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
