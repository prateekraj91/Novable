import { customPlanLink, standardPlanLink, STANDARD_PRICE } from "@/lib/contact";

// The offer, stated once. Both the landing pricing section and the in-app
// paywall render this, so what we advertise is always what we charge.
const plans = [
  {
    name: "Standard",
    desc: "Everything Novable does — your site goes live and every growth agent unlocks.",
    price: STANDARD_PRICE,
    priceSuffix: " one-time",
    featured: true,
    cta: "Get Standard",
    href: standardPlanLink(),
    features: [
      "AI-generated website",
      "Published live on your own URL",
      "Unlimited sites & AI restyling",
      "Review reply agent",
      "WhatsApp campaign agent",
      "Social content agent",
      "Analytics & weekly reports",
      "Support from a real person",
    ],
  },
  {
    name: "Custom",
    desc: "Multiple businesses, custom integrations, or something we haven't thought of.",
    price: "Let's talk",
    priceSuffix: "",
    featured: false,
    cta: "Let's talk",
    href: customPlanLink(),
    features: [
      "Everything in Standard",
      "Tailored to your needs",
      "Multiple businesses",
      "Custom integrations",
      "Dedicated support",
    ],
  },
];

export default function PlanCards() {
  return (
    <div className="nb-plan-grid">
      {plans.map((p) => (
        <div
          key={p.name}
          className={`card elev-md ${p.featured ? "nb-tier-featured" : ""}`}
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 30,
            background: p.featured ? "var(--color-accent)" : "var(--color-bg)",
            color: p.featured ? "var(--color-bg)" : "var(--color-text)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 400,
              fontSize: 20,
            }}
          >
            {p.name}
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
            {p.desc}
          </p>

          <div
            style={{
              margin: "22px 0 20px",
              fontFamily: "var(--font-heading)",
              fontWeight: 400,
              fontSize: 36,
            }}
          >
            {p.price}
            {p.priceSuffix && (
              <span
                style={{
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  opacity: 0.7,
                }}
              >
                {p.priceSuffix}
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
            {p.features.map((f) => (
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
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-block"
            style={{ padding: 12 }}
          >
            {p.cta}
          </a>
        </div>
      ))}
    </div>
  );
}
