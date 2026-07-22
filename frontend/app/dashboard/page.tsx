import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import CopyButton from "@/components/ui/CopyButton";
import { createClient } from "@/lib/supabase/server";

const AGENT_LABEL: Record<string, string> = {
  chat: "Ask Catalyst",
  social: "Social calendar",
  campaign: "WhatsApp campaign",
  reviews: "Review replies",
  analytics: "Analytics report",
  website: "Website",
};

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [businessRes, sitesRes, outputsRes] = await Promise.all([
    supabase
      .from("businesses")
      .select("name")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("sites")
      .select("id, slug, content, created_at", { count: "exact" })
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("agent_outputs")
      .select("agent_type, created_at", { count: "exact" })
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const businessName = businessRes.data?.name ?? null;
  const sites = (sitesRes.data ?? []) as {
    id: string;
    slug: string;
    content: { hero_title?: string };
    created_at: string;
  }[];
  const siteCount = sitesRes.count ?? sites.length;
  const outputs = (outputsRes.data ?? []) as {
    agent_type: string;
    created_at: string;
  }[];
  const runCount = outputsRes.count ?? outputs.length;

  const stats = [
    { label: "Sites published", value: String(siteCount), sub: "Live on the web" },
    { label: "Agent runs", value: String(runCount), sub: "Tasks completed" },
    { label: "Agents available", value: "5", sub: "Ready to work" },
    {
      label: "Business",
      value: businessName ?? "—",
      sub: businessName ? "Active" : "Not set up",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-base text-cream md:flex-row">
      <Sidebar />
      <main className="flex-1">
        <div className="px-6 pt-8 pb-16 md:px-10">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl leading-tight text-cream md:text-5xl">
                  Welcome back.
                </h1>
                <p className="mt-2 max-w-lg text-muted">
                  {businessName
                    ? `Here's how ${businessName} is doing. Run your agents any time.`
                    : "Generate your website to get started, then your agents can go to work."}
                </p>
              </div>
              <Link
                href="/dashboard/agents"
                className="rounded-sm bg-amber px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-base transition-transform hover:-translate-y-0.5"
              >
                Run agents →
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="glass rounded-md p-6">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                    {s.label}
                  </p>
                  <p className="mt-3 truncate font-display text-3xl text-cream">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm text-sage">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Your sites */}
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl text-cream">Your sites</h2>
                <Link
                  href="/onboarding"
                  className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-amber"
                >
                  + New site
                </Link>
              </div>
              {sites.length > 0 ? (
                <div className="grid gap-4">
                  {sites.map((s) => (
                    <div
                      key={s.id}
                      className="flex flex-col items-start gap-3 rounded-md border border-hairline bg-surface/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <div className="w-full min-w-0 sm:w-auto">
                        <p className="truncate text-cream">
                          {s.content?.hero_title ?? "Generated site"}
                        </p>
                        <p className="mt-1 font-mono text-[0.65rem] text-muted">
                          /site/{s.slug} · {timeAgo(s.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:shrink-0">
                        <CopyButton
                          path={`/site/${s.slug}`}
                          className="rounded-sm border border-hairline px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-muted transition hover:border-amber hover:text-amber"
                        />
                        <Link
                          href={`/dashboard/edit/${s.slug}`}
                          className="rounded-sm border border-hairline px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-cream transition hover:border-amber hover:text-amber"
                        >
                          Edit
                        </Link>
                        <a
                          href={`/site/${s.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-sm border border-hairline px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-cream transition hover:border-amber hover:text-amber"
                        >
                          View live →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-hairline bg-surface/40 p-6 text-sm text-muted">
                  No sites yet.{" "}
                  <Link href="/onboarding" className="text-amber hover:text-sage">
                    Generate your first one
                  </Link>
                  .
                </div>
              )}
            </div>

            {/* Recent activity */}
            <div className="mt-10">
              <h2 className="mb-4 font-display text-xl text-cream">
                Recent activity
              </h2>
              {outputs.length > 0 ? (
                <ul className="divide-y divide-hairline rounded-md border border-hairline bg-surface/40">
                  {outputs.map((o, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between px-5 py-4"
                    >
                      <span className="text-sm text-cream">
                        {AGENT_LABEL[o.agent_type] ?? o.agent_type} ran
                      </span>
                      <span className="font-mono text-[0.65rem] text-muted">
                        {timeAgo(o.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-md border border-hairline bg-surface/40 p-6 text-sm text-muted">
                  No agent activity yet.{" "}
                  <Link
                    href="/dashboard/agents"
                    className="text-amber hover:text-sage"
                  >
                    Run an agent
                  </Link>
                  .
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
