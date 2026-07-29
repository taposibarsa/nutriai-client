"use client";

import { useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STATS = [
  { value: 2400, suffix: "+", label: "Recipes in our library" },
  { value: 50000, suffix: "+", label: "Meal plans generated" },
  { value: 12, suffix: "", label: "Dietary preferences supported" },
  { value: 4.9, suffix: "★", label: "Average user rating", decimals: 1 },
] as const;

const CHART_DATA = [
  { month: "Jan", plans: 6200 },
  { month: "Feb", plans: 7100 },
  { month: "Mar", plans: 8400 },
  { month: "Apr", plans: 9100 },
  { month: "May", plans: 10200 },
  { month: "Jun", plans: 11800 },
];

function formatStat(value: number, decimals?: number) {
  if (decimals != null) return value.toFixed(decimals);
  return Math.round(value).toLocaleString();
}

function AnimatedStat({
  value,
  suffix,
  label,
  decimals,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
  active: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1200;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value]);

  return (
    <div className="text-center">
      <p className="text-3xl font-extrabold text-saffron sm:text-4xl">
        {formatStat(display, decimals)}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-white/80">{label}</p>
    </div>
  );
}

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-forest py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <AnimatedStat
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              decimals={"decimals" in s ? s.decimals : undefined}
              active={active}
            />
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-white/10 p-4 sm:p-6">
          <p className="mb-4 text-center text-sm font-medium text-white/90">
            Meal Plans Generated Per Month
          </p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="plansFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fdcc3f" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#fdcc3f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "none",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="plans"
                  stroke="#fdcc3f"
                  strokeWidth={2}
                  fill="url(#plansFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
