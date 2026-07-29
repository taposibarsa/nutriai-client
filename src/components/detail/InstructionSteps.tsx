export function InstructionSteps({ steps }: { steps: string[] }) {
  return (
    <section className="rounded-2xl bg-[var(--card)] p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-[var(--forest)]">Instructions</h2>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-4 rounded-xl bg-[var(--sage)] p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--forest)] text-sm font-bold text-white">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-[var(--foreground)]">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
