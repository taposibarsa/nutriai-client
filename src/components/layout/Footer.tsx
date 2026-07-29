import Link from "next/link";
import { Leaf, MapPin, Mail, Clock } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M6.94 6.5A1.94 1.94 0 1 1 5 4.56 1.94 1.94 0 0 1 6.94 6.5zM7 8.89H4v11.6h3zm5.16 0H9.2v11.6h2.94v-6.1c0-1.61.78-2.56 2.13-2.56 1.27 0 1.93.9 1.93 2.56v6.1H19v-6.55c0-3.2-1.71-4.69-4-4.69a3.5 3.5 0 0 0-3.16 1.74V8.89z" />
    </svg>
  );
}

const exploreLinks = [
  { href: "/recipes", label: "Recipes" },
  { href: "/recipes?dietaryTag=vegan", label: "Vegan Recipes" },
  { href: "/recipes?dietaryTag=keto", label: "Keto Recipes" },
  { href: "/recipes?dietaryTag=high-protein", label: "High-Protein Recipes" },
];

const aiLinks = [
  { href: "/meal-planner", label: "Meal Planner" },
  { href: "/coach", label: "Nutrition Coach" },
  { href: "/about", label: "About NutriAI" },
  { href: "/contact", label: "Contact Us" },
];

const socialLinks = [
  { href: "https://www.instagram.com/", label: "Instagram", icon: InstagramIcon },
  { href: "https://www.facebook.com/", label: "Facebook", icon: FacebookIcon },
  { href: "https://x.com/", label: "X", icon: XIcon },
  { href: "https://www.linkedin.com/", label: "LinkedIn", icon: LinkedInIcon },
];

export function Footer() {
  return (
    <footer className="bg-[var(--footer)] text-white">
      <div>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <Link
              href="/"
              className="font-display inline-flex items-center gap-2 text-lg font-bold"
            >
              <Leaf className="h-5 w-5 text-[var(--coral)]" />
              <span>
                Nutri<span className="text-[var(--coral)]">AI</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
              Eat smarter with the power of AI.
            </p>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-coral hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold tracking-wider text-[var(--coral)] uppercase">
              Explore
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-[var(--coral)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold tracking-wider text-[var(--coral)] uppercase">
              AI Tools
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              {aiLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-[var(--coral)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold tracking-wider text-[var(--coral)] uppercase">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                <a
                  href="mailto:hello@nutriai.app"
                  className="transition hover:text-[var(--coral)]"
                >
                  hello@nutriai.app
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                <span>Support: Mon–Fri 9AM–6PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-white/55 sm:flex-row sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} NutriAI. All Rights Reserved.</p>
            <div className="flex gap-4">
              <Link href="/about" className="hover:text-[var(--coral)]">
                About
              </Link>
              <Link href="/contact" className="hover:text-[var(--coral)]">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
