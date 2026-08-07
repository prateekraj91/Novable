const steps = [
  {
    n: 1,
    title: "Connect your business in minutes",
    desc: "Securely connect your CRM, website, payment platform, analytics, and marketing tools. Novable automatically builds a unified view of your business.",
  },
  {
    n: 2,
    title: "Discover your biggest growth opportunities",
    desc: "Novable continuously analyzes your business to identify bottlenecks, drop-offs, underperforming campaigns, and hidden opportunities ranked by impact.",
  },
  {
    n: 3,
    title: "Turn insights into action",
    desc: "Approve AI-powered recommendations with a click. Whether it's retention, marketing, or operations, Novable helps you execute faster.",
  },
  {
    n: 4,
    title: "Keep improving while you focus on growth",
    desc: "Monitor performance through a live dashboard while Novable tracks results, refines strategies, and automates repetitive workflows.",
  },
];

export default function Features() {
  return (
    <section id="how" className="nb-edge" style={{ paddingBottom: 96 }}>
      <span className="nb-kicker">How Novable Works</span>

      <h2 className="nb-h2" style={{ maxWidth: "26ch" }}>
        Connect once. Grow continuously.
      </h2>

      <p className="nb-sub">
        Novable brings together your business data, identifies what matters
        most, recommends high-impact actions, and helps you automate the work
        that drives sustainable growth.
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
