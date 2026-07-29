import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { AiFeatures } from "@/components/home/AiFeatures";
import { FeaturedRecipes } from "@/components/home/FeaturedRecipes";
import { DietaryCategories } from "@/components/home/DietaryCategories";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <AiFeatures />
      <FeaturedRecipes />
      <DietaryCategories />
      <Stats />
      <Testimonials />
      <FAQ />
      <NewsletterCTA />
    </main>
  );
}
