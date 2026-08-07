import { contactLink } from "@/lib/contact";

const tiers = [
  {
    name: "Basic",
    desc: "Get your business online with an AI-built website you can edit anytime.",
    price: "₹1,500",
    priceSuffix: " one-time",
    featured: false,
    cta: "Get started",
    features: [
      "AI-generated website",
      "Published on a live URL",
      "Edit your site with AI prompts",
      "Your photos & branding",
      "Email support",
    ],
  },
  {
    name: "Pro",
    desc: "Everything in Basic, plus the AI growth agents that bring customers back.",
    price: "₹3,000",
    priceSuffix: " one-time",
    featured: true,
    cta: "Get started",
    features: [
      "Everything in Basic",
      "Social content calendar",
      "WhatsApp campaign generator",
      "Review reply drafting",
      "Weekly analytics reports",
      "Ask Novable — your AI chief of staff",
      "Priority support",
    ],
  },
  {
    name: "Custom",
    desc: "Multiple locations, custom integrations, or something we haven't thought of.",
    price: "Let's talk",
    priceSuffix: "",
    featured: false,
    cta: "Contact us",
    features: [
      "Everything in Pro",
      "Multiple businesses",
      "Custom integrations",
      "Dedicated support",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="nb-edge" style={{ paddingBottom: 96 }}>
      <span className="nb-kicker">Pricing</span>

      <h2 className="nb-h2">Simple one-time pricing.</h2>

      <p className="nb-sub">
        No subscription, no lock-in. Pay once and your site goes live — we set
        it up with you personally.
      </p>

      <div className="nb-grid-3" style={{ marginTop: 36 }}>
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`card elev-md ${t.featured ? "nb-tier-featured" : ""}`}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 30,
              background: t.featured ? "var(--color-accent)" : "var(--color-bg)",
              color: t.featured ? "var(--color-bg)" : "var(--color-text)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 400,
                fontSize: 20,
              }}
            >
              {t.name}
            </span>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                margin: "10px 0 0",
                opacity: 0.85,
                minHeight: 44,
              }}
            >
              {t.desc}
            </p>

            <div
              style={{
                margin: "22px 0 20px",
                fontFamily: "var(--font-heading)",
                fontWeight: 400,
                fontSize: 36,
              }}
            >
              {t.price}
              {t.priceSuffix && (
                <span
                  style={{
                    fontSize: 14,
                    fontFamily: "var(--font-body)",
                    opacity: 0.7,
                  }}
                >
                  {t.priceSuffix}
                </span>
              )}
            </div>

            <ul
              style={{
                margin: "0 0 24px",
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
              }}
            >
              {t.features.map((f) => (
                <li
                  key={f}
                  style={{
                    fontSize: 14,
                    lineHeight: 1.4,
                    paddingLeft: 18,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 6,
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "currentColor",
                      opacity: 0.5,
                    }}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={contactLink(t.name)}
              className="btn btn-secondary btn-block"
              style={{ padding: 12 }}
            >
              {t.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
