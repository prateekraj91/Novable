import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import SignOutButton from "@/components/auth/SignOutButton";
import UpgradeButton from "@/components/billing/UpgradeButton";
import { createClient } from "@/lib/supabase/server";
import { getEntitlements } from "@/lib/entitlements";

export default async function SettingsPage() {
  const { isPaid } = await getEntitlements();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="nb-app">
      <Sidebar />
      <main className="nb-app-main">
        <div className="nb-page">
          <div className="nb-page-inner">
            <span className="nb-kicker">Settings</span>
            <h1 className="nb-h2">Account.</h1>
            <p className="nb-sub">Manage your Novable account.</p>

            <section className="card elev-sm" style={{ marginTop: 36, padding: 28 }}>
              <h2 className="nb-h3">Account</h2>
              <div className="nb-info-grid" style={{ marginTop: 24 }}>
                <Setting label="Email" value={user?.email ?? "—"} />
                <Setting label="Workspace" value={business?.name ?? "—"} />
                <Setting label="Member since" value={joined} />
                <Setting label="Plan" value={isPaid ? "Standard" : "Free"} />
              </div>
            </section>

            <section className="card elev-sm" style={{ marginTop: 16, padding: 28 }}>
              <h2 className="nb-h3">Plan</h2>
              {isPaid ? (
                <p className="nb-quiet" style={{ margin: "10px 0 0", fontSize: 15 }}>
                  You&apos;re on <strong>Standard</strong> — unlimited sites,
                  live publishing, and every marketing agent are unlocked.
                </p>
              ) : (
                <>
                  <p className="nb-quiet" style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.6 }}>
                    You&apos;re on the <strong>free plan</strong>: one AI
                    website with AI restyling. Publishing live and the marketing
                    agents are part of Standard — ₹500, once.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
                    <UpgradeButton
                      label="Upgrade — ₹500"
                      style={{ padding: "11px 22px" }}
                    />
                    <Link href="/pricing" className="btn btn-secondary">
                      See plans
                    </Link>
                  </div>
                </>
              )}
            </section>

            <section className="card elev-sm" style={{ marginTop: 16, padding: 28 }}>
              <h2 className="nb-h3">Session</h2>
              <p className="nb-quiet" style={{ margin: "10px 0 0", fontSize: 15 }}>
                Sign out of Novable on this device.
              </p>
              <SignOutButton
                className="btn btn-secondary"
                style={{ marginTop: 18, alignSelf: "flex-start", padding: "11px 22px" }}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="nb-info-label">{label}</p>
      <p className="nb-info-value">{value}</p>
    </div>
  );
}
