import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import CopyButton from "@/components/ui/CopyButton";
import { createClient } from "@/lib/supabase/server";

const AGENT_LABEL: Record<string, string> = {
  chat: "Ask Novable",
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
    <div className="nb-app">
      <Sidebar />
      <main className="nb-app-main">
        <div className="nb-page">
          <div className="nb-page-inner">
            {/* Header */}
            <div className="nb-row" style={{ alignItems: "flex-start" }}>
              <div>
                <span className="nb-kicker">Overview</span>
                <h1 className="nb-h2">Welcome back.</h1>
                <p className="nb-sub">
                  {businessName
                    ? `Here's how ${businessName} is doing. Run your agents any time.`
                    : "Generate your website to get started, then your agents can go to work."}
                </p>
              </div>
              <Link
                href="/dashboard/agents"
                className="btn btn-primary"
                style={{ padding: "12px 22px" }}
              >
                Run agents →
              </Link>
            </div>

            {/* Stats */}
            <div className="nb-stat-grid" style={{ marginTop: 36 }}>
              {stats.map((s) => (
                <div key={s.label} className="card elev-sm" style={{ padding: 22 }}>
                  <p className="nb-stat-label">{s.label}</p>
                  <p className="nb-stat-value">{s.value}</p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 13,
                      color: "var(--color-accent-2-700)",
                    }}
                  >
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Your sites */}
            <div style={{ marginTop: 44 }}>
              <div className="nb-section-head">
                <h2 className="nb-h3">Your sites</h2>
                <Link href="/onboarding" className="btn btn-secondary">
                  + New site
                </Link>
              </div>

              {sites.length > 0 ? (
                <div style={{ display: "grid", gap: 12 }}>
                  {sites.map((s) => (
                    <div
                      key={s.id}
                      className="card elev-sm nb-row"
                      style={{ padding: "18px 22px" }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontFamily: "var(--font-heading)",
                            fontSize: 16,
                          }}
                        >
                          {s.content?.hero_title ?? "Generated site"}
                        </p>
                        <p className="nb-quiet" style={{ margin: "4px 0 0", fontSize: 13 }}>
                          /site/{s.slug} · {timeAgo(s.created_at)}
                        </p>
                      </div>

                      <div className="nb-row-actions">
                        <CopyButton
                          path={`/site/${s.slug}`}
                          className="btn btn-secondary"
                        />
                        <Link
                          href={`/dashboard/edit/${s.slug}`}
                          className="btn btn-secondary"
                        >
                          Edit
                        </Link>
                        <a
                          href={`/site/${s.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary"
                        >
                          View live →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card elev-sm" style={{ padding: 26 }}>
                  <p className="nb-quiet" style={{ margin: 0, fontSize: 15 }}>
                    No sites yet.{" "}
                    <Link href="/onboarding">Generate your first one</Link>.
                  </p>
                </div>
              )}
            </div>

            {/* Recent activity */}
            <div style={{ marginTop: 44 }}>
              <div className="nb-section-head">
                <h2 className="nb-h3">Recent activity</h2>
              </div>

              {outputs.length > 0 ? (
                <div className="card elev-sm" style={{ padding: "6px 22px" }}>
                  <ul className="nb-list">
                    {outputs.map((o, i) => (
                      <li
                        key={i}
                        className="nb-row"
                        style={{ padding: "14px 0", gap: 12 }}
                      >
                        <span style={{ fontSize: 15 }}>
                          {AGENT_LABEL[o.agent_type] ?? o.agent_type} ran
                        </span>
                        <span className="nb-quiet" style={{ fontSize: 13 }}>
                          {timeAgo(o.created_at)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="card elev-sm" style={{ padding: 26 }}>
                  <p className="nb-quiet" style={{ margin: 0, fontSize: 15 }}>
                    No agent activity yet.{" "}
                    <Link href="/dashboard/agents">Run an agent</Link>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
