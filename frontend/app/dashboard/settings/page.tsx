import Sidebar from "@/components/layout/Sidebar";
import SignOutButton from "@/components/auth/SignOutButton";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
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
    <div className="flex min-h-screen flex-col bg-base text-cream md:flex-row">
      <Sidebar />
      <main className="flex-1">
        <div className="px-6 pt-8 pb-16 md:px-10">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow text-amber mb-3">Settings</p>
            <h1 className="font-display text-4xl text-cream">Account.</h1>
            <p className="mt-3 max-w-xl text-muted">
              Manage your Novable account.
            </p>

            <section className="mt-10 rounded-md border border-hairline bg-surface/40 p-7">
              <h2 className="font-display text-2xl text-cream">Account</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Setting label="Email" value={user?.email ?? "—"} />
                <Setting label="Workspace" value={business?.name ?? "—"} />
                <Setting label="Member since" value={joined} />
              </div>
            </section>

            <section className="mt-6 flex flex-col items-start gap-3 rounded-md border border-hairline bg-surface/40 p-7">
              <h2 className="font-display text-2xl text-cream">Session</h2>
              <p className="text-sm text-muted">
                Sign out of Novable on this device.
              </p>
              <SignOutButton className="mt-1 rounded-sm border border-hairline px-5 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-muted transition hover:border-amber hover:text-amber" />
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
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-2 break-all text-cream">{value}</p>
    </div>
  );
}
