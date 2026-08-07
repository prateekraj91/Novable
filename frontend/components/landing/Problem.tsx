const problems = [
  "Local agencies cost ₹10,000–50,000/month — out of reach for most owners.",
  "Businesses stay invisible on Google Maps and local search.",
  "Reviews sit unanswered for weeks, quietly costing trust.",
  "No way to measure what marketing actually drives customers.",
];

export default function Problem() {
  return (
    <section id="problem" className="nb-edge" style={{ paddingBottom: 96 }}>
      <span className="nb-kicker">The Problem</span>

      <h2 className="nb-h2" style={{ maxWidth: "22ch" }}>
        Local businesses are losing the internet.
      </h2>

      <div className="nb-grid-2" style={{ marginTop: 36 }}>
        {problems.map((text) => (
          <div key={text} className="card elev-sm" style={{ padding: 26 }}>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55 }}>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
