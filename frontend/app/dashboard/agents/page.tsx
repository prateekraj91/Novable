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
    <div className="flex min-h-screen flex-col bg-base text-cream md:flex-row">
      <Sidebar />
      <main className="flex-1">
        <div className="px-6 pt-8 md:px-10">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow text-amber mb-2">AI Workforce</p>
            <h1 className="font-display text-3xl leading-tight text-cream md:text-4xl">
              Run your agents
            </h1>

            {business ? (
              <>
                <p className="mt-2 text-muted">
                  Working for{" "}
                  <span className="text-cream">{business.name}</span>.
                </p>
                <div className="mt-10 pb-16">
                  <AgentWorkforce business={business} />
                </div>
              </>
            ) : (
              <div className="mt-10 rounded-md border border-hairline bg-surface/40 p-8">
                <p className="text-muted">
                  No business yet. Generate your website first, then your agents
                  can go to work.
                </p>
                <Link
                  href="/onboarding"
                  className="mt-5 inline-block rounded-sm bg-amber px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-base transition-transform hover:-translate-y-0.5"
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
