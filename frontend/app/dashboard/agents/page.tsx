import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { getEntitlements } from "@/lib/entitlements";
import LockedPanel from "@/components/billing/LockedPanel";
import AgentWorkforce, {
  type WorkforceBusiness,
} from "@/components/dashboard/AgentWorkforce";

// Every agent is a paid feature. On the free plan the workforce is described
// but never rendered, so none of its buttons exist to be clicked — and the
// agent_outputs trigger refuses the write even if one were.
const LOCKED_AGENTS = [
  {
    eyebrow: "Account Manager",
    title: "Ask Novable",
    desc: "Your AI chief of staff — ask anything about growing the business and get an answer with priority actions.",
  },
  {
    eyebrow: "Social Media",
    title: "Weekly content calendar",
    desc: "A week of ready-to-post captions and hashtags, generated for your business.",
  },
  {
    eyebrow: "WhatsApp Campaign",
    title: "Campaign generator",
    desc: "Ready-to-send WhatsApp campaigns — festival offers, re-engagement, weekend promos.",
  },
  {
    eyebrow: "Review Agent",
    title: "Draft review replies",
    desc: "Paste your customer reviews and get personalised replies, with the negative ones flagged.",
  },
  {
    eyebrow: "Analytics Agent",
    title: "Weekly performance report",
    desc: "Your numbers turned into a summary, a trend, and what to do next.",
  },
];

export default async function AgentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: business }, { canUseAgents }] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, name, category, city, target_audience, phone")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<WorkforceBusiness>(),
    getEntitlements(),
  ]);

  return (
    <div className="nb-app">
      <Sidebar />
      <main className="nb-app-main">
        <div className="nb-page">
          <div className="nb-page-inner">
            <span className="nb-kicker">AI Workforce</span>
            <h1 className="nb-h2">Run your agents</h1>

            {!canUseAgents ? (
              <>
                <p className="nb-sub">
                  Your marketing agents are part of Standard. Unlock them once
                  and they work for {business?.name ?? "your business"} forever
                  — no subscription.
                </p>

                <div style={{ display: "grid", gap: 16, marginTop: 36 }}>
                  {LOCKED_AGENTS.map((a) => (
                    <LockedPanel key={a.title} {...a} />
                  ))}
                </div>
              </>
            ) : business ? (
              <>
                <p className="nb-sub">
                  Working for <strong>{business.name}</strong>.
                </p>
                <div style={{ marginTop: 36 }}>
                  <AgentWorkforce business={business} />
                </div>
              </>
            ) : (
              <div className="card elev-sm" style={{ marginTop: 36, padding: 30 }}>
                <p className="nb-quiet" style={{ margin: 0, fontSize: 15 }}>
                  No business yet. Generate your website first, then your agents
                  can go to work.
                </p>
                <Link
                  href="/onboarding"
                  className="btn btn-primary"
                  style={{ marginTop: 18, alignSelf: "flex-start", padding: "12px 22px" }}
                >
                  Start onboarding
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
