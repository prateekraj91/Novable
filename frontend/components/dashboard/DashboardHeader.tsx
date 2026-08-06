"use client";

export default function DashboardHeader() {
  const now = new Date().getHours();

  let greeting = "Hello";

  if (now < 12) greeting = "Good morning";
  else if (now < 17) greeting = "Good afternoon";
  else greeting = "Good evening";

  return (
    <header className="border-b border-hairline px-6 py-8 md:px-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

        <div>
        

          <h1 className="font-display text-4xl leading-tight text-cream">
            {greeting}.
          </h1>

          <p className="mt-3 max-w-2xl text-muted leading-relaxed">
            Novable coordinated your AI workforce. Review recent activity, monitor your agents,
            and approve recommendations before they go live.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <button className="rounded-sm border border-hairline px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-cream transition hover:border-muted">
            View Reports
          </button>

          <button className="rounded-sm bg-amber px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-base transition hover:-translate-y-0.5">
            + Add Agent
          </button>

        </div>

      </div>
    </header>
  );
}