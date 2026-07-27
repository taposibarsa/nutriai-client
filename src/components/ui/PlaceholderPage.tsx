export default function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="rounded-full bg-[var(--sage)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--forest)]">
        Protected
      </p>
      <h1 className="mt-4 text-3xl font-bold text-[var(--forest)]">{title}</h1>
      <p className="mt-3 text-[var(--warm-gray)]">{description}</p>
    </main>
  );
}
