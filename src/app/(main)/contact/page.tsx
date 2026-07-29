import { MapPin, Phone, Mail } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with NutriAI about meal planning, recipes, technical support, or partnerships.",
};

const INFO = [
  {
    icon: MapPin,
    title: "Address",
    lines: ["Gulshan, Dhaka 1212", "Bangladesh"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+880 1712-345678"],
    href: "tel:+8801712345678",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["hello@nutriai.app"],
    href: "mailto:hello@nutriai.app",
  },
] as const;

/** OpenStreetMap embed centered on Dhaka */
const MAP_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=90.35%2C23.75%2C90.45%2C23.85&layer=mapnik&marker=23.8103%2C90.4125";

export default function ContactPage() {
  return (
    <main>
      <section className="bg-forest py-14 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-display text-sm font-semibold tracking-[0.2em] text-coral uppercase">
            NutriAI
          </p>
          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/80">
            Questions about meal plans, recipes, or partnerships? We usually
            reply within one business day.
          </p>
        </div>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {INFO.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl bg-card p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage text-forest">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-forest">
                  {item.title}
                </h2>
                <div className="mt-2 space-y-0.5 text-sm text-warm-gray">
                  {item.lines.map((line) =>
                    "href" in item && item.href ? (
                      <a
                        key={line}
                        href={item.href}
                        className="block transition hover:text-forest"
                      >
                        {line}
                      </a>
                    ) : (
                      <p key={line}>{line}</p>
                    ),
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-forest">Send a Message</h2>
            <p className="mt-2 text-sm text-warm-gray">
              Tell us how we can help — general questions, meal planning, tech
              issues, or partnership ideas.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-forest">Find Us</h2>
            <p className="mt-2 text-sm text-warm-gray">
              Our team is based in Dhaka. Support hours: Mon–Fri, 9AM–6PM.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-forest/10 shadow-sm">
              <iframe
                title="NutriAI location map — Dhaka"
                src={MAP_SRC}
                className="h-[360px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://www.openstreetmap.org/?mlat=23.8103&mlon=90.4125#map=12/23.8103/90.4125"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs text-warm-gray underline transition hover:text-forest"
            >
              View larger map on OpenStreetMap
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
