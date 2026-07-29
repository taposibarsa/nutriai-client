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
    <section className="overflow-x-hidden bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-forest sm:text-4xl">
            Find Recipes for Every Lifestyle
          </h2>
          <p className="mt-3 text-warm-gray">
            Jump straight into the diets and habits that fit how you eat.
          </p>
        </div>

        <div className="mt-10 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.tag}
              href={`/recipes?dietaryTag=${encodeURIComponent(cat.tag)}`}
              className="min-w-[160px] shrink-0 rounded-2xl bg-card p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:min-w-0"
            >
              <span className="text-3xl" aria-hidden>
                {cat.emoji}
              </span>
              <h3 className="mt-3 text-base font-bold text-forest">{cat.label}</h3>
              <p className="mt-1 text-xs text-warm-gray">{cat.blurb}</p>
              <p className="mt-3 text-xs font-semibold text-saffron">
                {cat.count} recipes
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
