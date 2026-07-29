import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles, UtensilsCrossed, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about NutriAI’s mission to make personalized, evidence-based nutrition guidance accessible through AI.",
};

const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=2000&q=80";

const WHY = [
  {
    icon: Sparkles,
    title: "AI-Powered Personalization",
    text: "Meal plans and coaching adapt to your goals, preferences, allergies, and calorie targets — not a one-size-fits-all template.",
  },
  {
    icon: UtensilsCrossed,
    title: "2,400+ Verified Recipes",
    text: "A growing library of cookable meals with clear macros, dietary tags, and practical prep times for real kitchens.",
  },
  {
    icon: BarChart3,
    title: "Real Nutritional Data",
    text: "Every recipe and plan surfaces calories and macros so you can eat with intention, not guesswork.",
  },
] as const;

const TEAM = [
  {
    name: "Nusrat Jahan",
    role: "Co-Founder & CEO",
    bio: "Former public-health strategist focused on making nutrition guidance reachable beyond clinic walls.",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Dr. Rafiq Hasan",
    role: "Head of Nutrition Science",
    bio: "Registered dietitian translating evidence-based eating patterns into clear, everyday advice.",
    photo:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Anika Chowdhury",
    role: "Lead Developer",
    bio: "Full-stack engineer shipping the meal planner, coach chat, and recipe platform people rely on daily.",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Imran Kabir",
    role: "UX Designer",
    bio: "Designs calm, cook-friendly interfaces so planning meals feels simple instead of overwhelming.",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
] as const;

const STATS = [
  { value: "2,400+", label: "Recipes in our library" },
  { value: "50,000+", label: "Meal plans generated" },
  { value: "12", label: "Dietary preferences supported" },
  { value: "4.9★", label: "Average user rating" },
] as const;

export default function AboutPage() {
  return (
    <main>
      <section className="relative flex min-h-[40vh] items-center overflow-hidden">
        <Image
          src={BANNER_IMAGE}
          alt="Fresh ingredients and healthy prepared meals"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-forest/85" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="font-display text-sm font-semibold tracking-[0.2em] text-coral uppercase">
            NutriAI
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-white sm:text-5xl">
            About NutriAI
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/80 sm:text-lg">
            Personalized nutrition guidance powered by AI — built for everyday
            cooks, not just clinic appointments.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-forest">Our Story</h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-warm-gray sm:text-base">
            <p>
              NutriAI was built in 2024 with one simple belief: everyone deserves
              access to personalized nutrition guidance, not just those who can
              afford a private dietitian. We saw friends and family juggling
              conflicting advice online, abandoned meal plans, and grocery lists
              that never matched what they actually cooked.
            </p>
            <p>
              So we combined a cookable recipe library with Claude-powered meal
              planning and a conversational nutrition coach. The goal was never
              to replace clinical care — it was to make evidence-informed eating
              feel practical on a Tuesday night when you are tired, hungry, and
              out of ideas.
            </p>
            <p>
              Today NutriAI helps people set goals, generate balanced plans, and
              ask follow-up questions in plain language. We are based in
              Bangladesh and building for kitchens everywhere that want smarter
              food choices without the overwhelm.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <article className="rounded-2xl bg-card p-8 shadow-sm">
            <p className="text-xs font-bold tracking-widest text-coral uppercase">
              Mission
            </p>
            <h3 className="mt-2 text-2xl font-bold text-forest">
              To make evidence-based nutrition advice accessible to everyone
              through AI.
            </h3>
          </article>
          <article className="rounded-2xl bg-card p-8 shadow-sm">
            <p className="text-xs font-bold tracking-widest text-coral uppercase">
              Vision
            </p>
            <h3 className="mt-2 text-2xl font-bold text-forest">
              A world where healthy eating is simple, personalized, and joyful.
            </h3>
          </article>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-forest">Why NutriAI?</h2>
            <p className="mt-3 text-warm-gray">
              Three pillars behind every plan, recipe, and coaching conversation.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {WHY.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-forest/10 bg-background p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage text-forest">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-warm-gray">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-forest">Meet the Team</h2>
            <p className="mt-3 text-warm-gray">
              Nutrition science, product engineering, and design working as one.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <article
                key={member.name}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold tracking-wide text-coral uppercase">
                    {member.role}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-foreground">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-warm-gray">
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-saffron sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/meal-planner"
            className="inline-flex rounded-full bg-coral px-6 py-3 text-sm font-bold text-foreground transition hover:brightness-95"
          >
            Try the Meal Planner
          </Link>
        </div>
      </section>
    </main>
  );
}
