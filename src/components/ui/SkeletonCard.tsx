export function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-[var(--card)] shadow-sm">
      <div className="h-[220px] bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-2/3 rounded bg-gray-200" />
        <div className="h-10 w-full rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}
