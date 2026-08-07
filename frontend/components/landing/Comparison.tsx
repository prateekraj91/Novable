const rows = [
  { cap: "Website creation", wix: "DIY templates", agency: "4–6 weeks", novable: "AI in 2 min" },
  { cap: "Edit your site", wix: "Manual editing", agency: "Email the agency", novable: "Just describe it" },
  { cap: "On-page SEO", wix: "Manual", agency: "Monthly retainer", novable: "Built in" },
  { cap: "Review replies", wix: "Not included", agency: "Manual replies", novable: "AI drafted" },
  { cap: "WhatsApp campaigns", wix: "Not included", agency: "Extra service", novable: "AI generated" },
  { cap: "Social content", wix: "Not included", agency: "Extra service", novable: "AI generated" },
  { cap: "Performance reports", wix: "Basic", agency: "Monthly PDF", novable: "AI summaries" },
  { cap: "Cost", wix: "₹500–2,000/mo", agency: "₹10,000–50,000/mo", novable: "₹1,500–3,000 one-time" },
];

export default function Comparison() {
  return (
    <section
      id="compare"
      className="nb-edge"
      style={{ paddingTop: 96, paddingBottom: 96 }}
    >
      <span className="nb-kicker">Why Novable Wins</span>

      <h2 className="nb-h2" style={{ maxWidth: "26ch" }}>
        More than a website. More than an agency.
      </h2>

      <div
        className="card elev-sm"
        style={{ marginTop: 36, padding: "8px 20px 4px", overflowX: "auto" }}
      >
        <table className="table" style={{ tableLayout: "fixed", minWidth: 640 }}>
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "24%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Capability</th>
              <th scope="col">Wix / Squarespace</th>
              <th scope="col">Traditional Agency</th>
              <th scope="col" style={{ color: "var(--color-accent-700)" }}>
                Novable
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.cap}>
                <td style={{ fontWeight: 700 }}>{r.cap}</td>
                <td className="nb-quiet">{r.wix}</td>
                <td className="nb-quiet">{r.agency}</td>
                <td style={{ color: "var(--color-accent-700)", fontWeight: 700 }}>
                  {r.novable}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
