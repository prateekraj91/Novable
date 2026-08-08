import BrandMark from "@/components/ui/BrandMark";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Agents", href: "/#agents" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Compare", href: "/#compare" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Start free", href: "/onboarding" },
      { label: "Sign in", href: "/login" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer style={{ background: "var(--color-surface)", padding: "56px 0" }}>
      <div className="nb-edge nb-footer-grid">
        <div>
          <BrandMark size={22} />

          <p
            className="nb-quiet"
            style={{
              margin: "12px 0 0",
              fontSize: 14,
              lineHeight: 1.5,
              maxWidth: "40ch",
            }}
          >
            Your AI co-pilot for growth — diagnose, automate, and compound, one
            flight plan at a time.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <span className="nb-kicker" style={{ marginBottom: 14 }}>
              {col.title}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="nb-edge"
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginTop: 36,
          fontSize: 13,
          color: "color-mix(in srgb, var(--color-text) 60%, transparent)",
        }}
      >
        <span>© {new Date().getFullYear()} Novable. All systems nominal.</span>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}
