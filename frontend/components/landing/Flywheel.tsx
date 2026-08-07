const flywheel = [
  "Business joins & AI builds the site",
  "AI improves visibility & rankings",
  "More leads & enquiries flow in",
  "Owner sees real ROI",
  "Owner stays subscribed",
  "Owner shares a testimonial",
  "Testimonials attract new businesses",
  "Platform data improves the AI",
];

export default function Flywheel() {
  return (
    <section
      id="flywheel"
      style={{
        background: "var(--color-accent-2-900)",
        color: "var(--color-bg)",
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="nb-dot"
        style={{
          width: 280,
          height: 280,
          background: "color-mix(in srgb, var(--color-bg) 8%, transparent)",
          top: -100,
          left: -80,
        }}
      />

      <div className="nb-edge">
        <span className="nb-kicker" style={{ color: "var(--color-accent-2-200)" }}>
          Growth Flywheel
        </span>

        <h2 className="nb-h2" style={{ maxWidth: "28ch" }}>
          Every customer makes the next one easier.
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            marginTop: 36,
            alignItems: "center",
          }}
        >
          {flywheel.map((text, i) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderRadius: 999,
                  background: "color-mix(in srgb, var(--color-bg) 10%, transparent)",
                  padding: "12px 18px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 400,
                    fontSize: 15,
                    color: "var(--color-accent-2-200)",
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, lineHeight: 1.3, maxWidth: "20ch" }}>
                  {text}
                </span>
              </div>

              {i < flywheel.length - 1 && (
                <span
                  aria-hidden
                  style={{ color: "var(--color-accent-2-200)", fontSize: 16 }}
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        <p
          style={{
            margin: "28px 0 0",
            fontSize: 14,
            color: "var(--color-accent-2-200)",
          }}
        >
          Loops back to the start — every cycle strengthens the platform.
        </p>
      </div>
    </section>
  );
}
