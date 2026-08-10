import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import SiteList, { type DashboardSite } from "@/components/dashboard/SiteList";
import UpgradeButton from "@/components/billing/UpgradeButton";
import { createClient } from "@/lib/supabase/server";
import { getEntitlements } from "@/lib/entitlements";
import { timeAgo } from "@/lib/time";

const AGENT_LABEL: Record<string, string> = {
  chat: "Ask Novable",
  social: "Social calendar",
  campaign: "WhatsApp campaign",
  reviews: "Review replies",
  analytics: "Analytics report",
  website: "Website",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [businessRes, sitesRes, outputsRes, entitlements] = await Promise.all([
    supabase
      .from("businesses")
      .select("name")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("sites")
      .select("id, slug, content, published, created_at", { count: "exact" })
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("agent_outputs")
      .select("agent_type, created_at", { count: "exact" })
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(6),
    getEntitlements(),
  ]);

  const { isPaid, canCreateSite, canPublish } = entitlements;

  const businessName = businessRes.data?.name ?? null;
  const sites = (sitesRes.data ?? []) as DashboardSite[];
  const siteCount = sitesRes.count ?? sites.length;
  const outputs = (outputsRes.data ?? []) as {
    agent_type: string;
    created_at: string;
  }[];
  const runCount = outputsRes.count ?? outputs.length;

  const liveCount = sites.filter((s) => s.published).length;

  const stats = [
    {
      label: "Sites",
      value: String(siteCount),
      sub: liveCount > 0 ? `${liveCount} live on the web` : "None live yet",
    },
    { label: "Agent runs", value: String(runCount), sub: "Tasks completed" },
    {
      label: "Agents available",
      value: isPaid ? "5" : "0",
      sub: isPaid ? "Ready to work" : "Locked on the free plan",
    },
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
                href={isPaid ? "/dashboard/agents" : "/pricing"}
                className="btn btn-primary"
                style={{ padding: "12px 22px" }}
              >
                {isPaid ? "Run agents →" : "Unlock agents →"}
              </Link>
            </div>

            {/* Free accounts are told exactly where the wall is, up front,
                rather than discovering it one locked button at a time. */}
            {!isPaid && (
              <div
                className="card elev-sm"
                style={{
                  marginTop: 28,
                  padding: 24,
                  background: "var(--color-accent-100)",
                  border: "1px solid var(--color-accent-300)",
                }}
              >
                <div className="nb-row" style={{ gap: 14, alignItems: "flex-start" }}>
                  <div style={{ minWidth: 0 }}>
                    <span className="nb-kicker" style={{ margin: 0 }}>
                      Free plan
                    </span>
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 15,
                        lineHeight: 1.55,
                        color: "var(--color-accent-800)",
                      }}
                    >
                      You can build <strong>one website</strong> and restyle it
                      with AI. Publishing it live and all five marketing agents
                      are part of Standard — ₹500, once.
                    </p>
                  </div>
                  <div className="nb-row-actions" style={{ flex: "none" }}>
                    <UpgradeButton
                      label="Upgrade — ₹500"
                      style={{ padding: "11px 22px" }}
                    />
                    <Link href="/pricing" className="btn btn-secondary">
                      See plans
                    </Link>
                  </div>
                </div>
              </div>
            )}

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
                {canCreateSite ? (
                  <Link href="/onboarding" className="btn btn-secondary">
                    + New site
                  </Link>
                ) : (
                  <Link href="/pricing" className="btn btn-secondary">
                    Upgrade for more sites
                  </Link>
                )}
              </div>

              <SiteList sites={sites} canPublish={canPublish} />
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
