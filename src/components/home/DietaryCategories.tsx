import Link from "next/link";

const CATEGORIES = [
  {
    label: "Vegan",
    emoji: "🌱",
    blurb: "Plant-based, whole-food meals",
    tag: "vegan",
    count: 48,
  },
  {
    label: "Keto",
    emoji: "🥑",
    blurb: "Low-carb, high-fat recipes",
    tag: "keto",
    count: 36,
  },
  {
    label: "Mediterranean",
    emoji: "🫒",
    blurb: "Heart-healthy, balanced eating",
    tag: "mediterranean",
    count: 52,
  },
  {
    label: "High-Protein",
    emoji: "💪",
    blurb: "Muscle-building meals",
    tag: "high-protein",
    count: 64,
  },
  {
    label: "Gluten-Free",
    emoji: "🌾",
    blurb: "Safe for gluten intolerance",
    tag: "gluten-free",
    count: 41,
  },
  {
    label: "Meal Prep",
    emoji: "📦",
    blurb: "Batch-cook and save time",
    tag: "meal-prep",
    count: 29,
  },
] as const;

export function DietaryCategories() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-forest sm:text-3xl lg:text-4xl">
            Find Recipes for Every Lifestyle
          </h2>
          <p className="mt-2 text-sm text-warm-gray sm:mt-3 sm:text-base">
            Jump straight into the diets and habits that fit how you eat.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.tag}
              href={`/recipes?dietaryTag=${encodeURIComponent(cat.tag)}`}
              className="flex h-full flex-col rounded-2xl bg-card p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <span className="text-2xl sm:text-3xl" aria-hidden>
                {cat.emoji}
              </span>
              <h3 className="mt-2 text-sm font-bold text-forest sm:mt-3 sm:text-base">
                {cat.label}
              </h3>
              <p className="mt-1 line-clamp-2 flex-1 text-[11px] leading-snug text-warm-gray sm:text-xs">
                {cat.blurb}
              </p>
              <p className="mt-2 text-[11px] font-semibold text-saffron sm:mt-3 sm:text-xs">
                {cat.count} recipes
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
