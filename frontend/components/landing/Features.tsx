const phases = [
  {
    code: "STEP 01",
    name: "Connect",
    title: "Connect your business in minutes",
    body: "Securely connect your CRM, website, payment platform, analytics, and marketing tools. Novable automatically builds a unified view of your business so nothing gets missed.",
  },
  {
    code: "STEP 02",
    name: "Diagnose",
    title: "Discover your biggest growth opportunities",
    body: "Novable continuously analyzes your business to identify bottlenecks, customer drop-offs, underperforming campaigns, and hidden opportunities ranked by business impact.",
  },
  {
    code: "STEP 03",
    name: "Launch",
    title: "Turn insights into action",
    body: "Approve AI-powered recommendations with a click. Whether it's improving customer retention, optimizing marketing, or streamlining operations, Novable helps you execute faster.",
  },
  {
    code: "STEP 04",
    name: "Automate",
    title: "Keep improving while you focus on growth",
    body: "Monitor performance through a live dashboard while Novable continuously tracks results, refines strategies, and automates repetitive business workflows.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-hairline px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow text-amber mb-4">
          How Novable Works
        </p>

        <h2 className="font-display max-w-2xl text-3xl leading-tight text-cream md:text-[2.5rem]">
          Connect once.
          <br />
          Grow continuously.
        </h2>

        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          Novable brings together your business data, identifies what matters
          most, recommends high-impact actions, and helps you automate the work
          that drives sustainable growth.
        </p>

        <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-hairline bg-hairline md:grid-cols-2">
          {phases.map((p) => (
            <div
              key={p.name}
              className="group bg-base p-8 transition-all duration-300 hover:bg-surface/60"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-sage">
                  {p.code}
                </span>

                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                  {p.name}
                </span>
              </div>

              <h3 className="mt-5 font-display text-xl text-cream md:text-2xl">
                {p.title}
              </h3>

              <p className="mt-3 leading-relaxed text-muted">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}