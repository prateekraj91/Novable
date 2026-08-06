import { contactLink } from "@/lib/contact";

const tiers = [
  {
    name: "Basic",
    price: "₹1,500",
    cadence: "one-time",
    desc: "Get your business online with an AI-built website you can edit anytime.",
    features: [
      "AI-generated website",
      "Published on a live URL",
      "Edit your site with AI prompts",
      "Your photos & branding",
      "Email support",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Pro",
    price: "₹3,000",
    cadence: "one-time",
    desc: "Everything in Basic, plus the AI growth agents that bring customers back.",
    features: [
      "Everything in Basic",
      "Social content calendar",
      "WhatsApp campaign generator",
      "Review reply drafting",
      "Weekly analytics reports",
      "Ask Novable — your AI chief of staff",
      "Priority support",
    ],
    cta: "Get started",
    featured: true,
  },
  {
    name: "Custom",
    price: "Let's talk",
    cadence: "",
    desc: "Multiple locations, custom integrations, or something we haven't thought of.",
    features: [
      "Everything in Pro",
      "Multiple businesses",
      "Custom integrations",
      "Dedicated support",
    ],
    cta: "Contact us",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-t border-hairline px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow text-amber mb-4">Pricing</p>

        <h2 className="font-display max-w-2xl text-3xl leading-tight text-cream md:text-[2.5rem]">
          Simple one-time pricing.
        </h2>

        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          No subscription, no lock-in. Pay once and your site goes live — we set
          it up with you personally.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`glass lift relative flex flex-col rounded-md p-7 ${
                t.featured ? "glow-amber" : ""
              }`}
            >
              <h3 className="font-display text-xl text-cream">{t.name}</h3>

              <p className="mt-1 text-sm text-muted">{t.desc}</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-3xl text-cream">
                  {t.price}
                </span>
                {t.cadence && (
                  <span className="font-mono text-xs text-muted">
                    {t.cadence}
                  </span>
                )}
              </div>

              <ul className="mt-7 flex-1 space-y-3">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-muted"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="mt-0.5 shrink-0"
                    >
                      <path
                        d="M3 8.5L6.2 11.5L13 4.5"
                        stroke={t.featured ? "#34d399" : "#6FCF97"}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={contactLink(t.name)}
                className={`mt-8 block w-full rounded-sm px-5 py-3 text-center font-mono text-xs uppercase tracking-[0.14em] transition-transform hover:-translate-y-0.5 ${
                  t.featured
                    ? "border border-amber bg-amber text-base shadow-lg hover:brightness-110"
                    : "border border-hairline text-cream hover:border-muted"
                }`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
