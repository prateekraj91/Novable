const columns = ["Capability", "Wix / Squarespace", "Traditional Agency", "Novable"];

const rows = [
  ["Website creation", "DIY templates", "4–6 weeks", "AI in 2 min"],
  ["Edit your site", "Manual editing", "Email the agency", "Just describe it"],
  ["On-page SEO", "Manual", "Monthly retainer", "Built in"],
  ["Review replies", "Not included", "Manual replies", "AI drafted"],
  ["WhatsApp campaigns", "Not included", "Extra service", "AI generated"],
  ["Social content", "Not included", "Extra service", "AI generated"],
  ["Performance reports", "Basic", "Monthly PDF", "AI summaries"],
  ["Cost", "₹500–2,000/mo", "₹10,000–50,000/mo", "₹1,500–3,000 one-time"],
];

export default function Comparison() {
  return (
    <section id="compare" className="border-t border-hairline px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow text-amber mb-4">Why Novable Wins</p>

        <h2 className="font-display max-w-2xl text-3xl leading-tight text-cream md:text-[2.5rem]">
          More than a website. More than an agency.
        </h2>

        <div className="glass mt-14 overflow-x-auto rounded-md">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline">
                {columns.map((col, i) => (
                  <th
                    key={col}
                    className={`px-5 py-4 font-mono text-[0.65rem] uppercase tracking-[0.16em] ${
                      i === 3 ? "bg-amber/10 text-amber" : "text-muted"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]} className="border-b border-hairline last:border-0">
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={`px-5 py-4 text-sm ${
                        i === 0
                          ? "font-medium text-cream"
                          : i === 3
                          ? "bg-amber/5 font-medium text-cream"
                          : "text-muted"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
