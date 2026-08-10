import Link from "next/link";
import HeroDemoVisual from "./HeroDemoVisual";

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

        <HeroDemoVisual />
      </div>
    </section>
  );
}
