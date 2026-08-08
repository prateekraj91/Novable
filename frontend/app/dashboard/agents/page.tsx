import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";
import AgentWorkforce, {
  type WorkforceBusiness,
} from "@/components/dashboard/AgentWorkforce";

export default async function AgentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, category, city, target_audience, phone")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<WorkforceBusiness>();

  return (
    <div className="nb-app">
      <Sidebar />
      <main className="nb-app-main">
        <div className="nb-page">
          <div className="nb-page-inner">
            <span className="nb-kicker">AI Workforce</span>
            <h1 className="nb-h2">Run your agents</h1>

            {business ? (
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
