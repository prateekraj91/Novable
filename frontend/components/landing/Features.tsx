const steps = [
  {
    n: 1,
    title: "Answer 5 quick questions",
    desc: "Business name, type, location, services, and phone number — that's all Novable needs. No technical setup, no forms to fill.",
  },
  {
    n: 2,
    title: "Get a live website in 2 minutes",
    desc: "Our AI builds a complete site — hero copy, services, FAQs, testimonials, SEO metadata, and branding — and publishes it on a live URL.",
  },
  {
    n: 3,
    title: "Receive ready-to-use marketing drafts",
    desc: "AI agents draft WhatsApp campaigns, social posts, review replies, and weekly performance summaries — you review and post.",
  },
  {
    n: 4,
    title: "Grow week over week",
    desc: "Keep restyling your site, generating fresh campaigns, and tracking what works — all from one dashboard, no agency needed.",
  },
];

export default function Features() {
  return (
    <section id="how" className="nb-edge" style={{ paddingBottom: 96 }}>
      <span className="nb-kicker">How Novable Works</span>

      <h2 className="nb-h2" style={{ maxWidth: "26ch" }}>
        Enter 5 details. Get a live site &amp; marketing drafts.
      </h2>

      <p className="nb-sub">
        No tech skills, no agency, no waiting. Novable turns your business
        basics into a published website and ready-to-send marketing — in
        minutes, not weeks.
      </p>

      <div className="nb-grid-4" style={{ marginTop: 36 }}>
        {steps.map((s) => (
          <div key={s.n} className="card elev-sm" style={{ padding: 24 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "var(--color-accent-2-100)",
                color: "var(--color-accent-2-800)",
                fontFamily: "var(--font-heading)",
                fontSize: 15,
                marginBottom: 16,
              }}
            >
              {s.n}
            </span>

            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 400,
                fontSize: 19,
                margin: "0 0 8px",
              }}
            >
              {s.title}
            </h3>

            <p className="nb-quiet" style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
