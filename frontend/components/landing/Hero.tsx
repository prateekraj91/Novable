import Link from "next/link";

const dashboardAgents = [
  { name: "Website Agent", status: "Generated" },
  { name: "Review Agent", status: "Running" },
  { name: "WhatsApp Agent", status: "Scheduled" },
  { name: "Analytics Agent", status: "Updated" },
];

export default function Hero() {
  return (
    // Only the block padding is set here — the `padding` shorthand would
    // wipe out .nb-edge's horizontal gutter.
    <section className="nb-edge" style={{ paddingTop: 48, paddingBottom: 96 }}>
      <div
        className="nb-dot"
        style={{
          width: 220,
          height: 220,
          background: "var(--color-accent-2-100)",
          top: -40,
          right: 60,
        }}
      />
      <div
        className="nb-dot"
        style={{
          width: 90,
          height: 90,
          background: "var(--color-accent-100)",
          top: 280,
          right: 340,
        }}
      />

      <div className="nb-hero-grid">
        <div>
          <span className="nb-kicker">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--color-accent-2)",
              }}
            />
            AI co-pilot for growth
          </span>

          <h1 className="nb-h1">
            Where insights
            <br />
            become action.
          </h1>

          <p className="nb-sub">
            The AI operating system that turns your business data into insights,
            recommendations, and measurable growth — for the price of a single
            agency invoice.
          </p>

          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 32,
              flexWrap: "wrap",
            }}
          >
            {/* Both routes sign the visitor in first; they differ in where
                they land. Get started → the paywall. Try for free → the
                builder, on the one-site free plan. */}
            <Link
              href="/signup?next=/pricing"
              className="btn btn-primary"
              style={{ padding: "14px 28px", fontSize: 15 }}
            >
              Get started
            </Link>
            <Link
              href="/signup?next=/onboarding"
              className="btn btn-secondary"
              style={{ padding: "14px 28px", fontSize: 15 }}
            >
              Try for free
            </Link>
          </div>
        </div>

        <div
          className="card elev-lg"
          style={{
            padding: 0,
            overflow: "hidden",
            background: "var(--color-bg)",
            border: "1px solid var(--color-divider)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              background: "var(--color-surface)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 400,
                fontSize: 17,
              }}
            >
              ABC Salon Dashboard
            </span>
            <span className="tag tag-accent-2">Live</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", padding: "6px 12px" }}>
            {dashboardAgents.map((row) => (
              <div
                key={row.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 8px",
                  borderBottom: "1px solid var(--color-divider)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 400,
                    fontSize: 15,
                  }}
                >
                  {row.name}
                </span>
                <span className="tag tag-outline">{row.status}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              gap: 12,
              background: "var(--color-accent-100)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                flex: "none",
                borderRadius: "50%",
                background: "var(--color-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-heading)",
                fontSize: 13,
                color: "var(--color-bg)",
              }}
            >
              AI
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.5,
                color: "var(--color-accent-800)",
              }}
            >
              Revenue increased 18% this month. WhatsApp campaign generated 42
              leads. Recommend launching a festive offer next week.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
