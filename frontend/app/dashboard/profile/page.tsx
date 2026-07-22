import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";

type Business = {
  name: string;
  category: string | null;
  city: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  target_audience: string | null;
  tone: string | null;
  social_links: string[] | null;
};

export default async function BusinessProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select(
      "name, category, city, email, phone, address, description, target_audience, tone, social_links"
    )
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<Business>();

  return (
    <div className="flex min-h-screen flex-col bg-base text-cream md:flex-row">
      <Sidebar />
      <main className="flex-1">
        <div className="px-6 pt-8 pb-16 md:px-10">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow text-amber mb-3">Business Profile</p>
            <h1 className="font-display text-4xl text-cream">Your business.</h1>
            <p className="mt-3 max-w-xl text-muted">
              Everything Catalyst knows about your business. Every AI agent uses
              these details to make better decisions.
            </p>

            {!business ? (
              <div className="mt-10 rounded-md border border-hairline bg-surface/40 p-8">
                <p className="text-muted">
                  You haven&apos;t set up a business yet.
                </p>
                <Link
                  href="/onboarding"
                  className="mt-5 inline-block rounded-sm bg-amber px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-base transition-transform hover:-translate-y-0.5"
                >
                  Start onboarding
                </Link>
              </div>
            ) : (
              <div className="mt-10 grid gap-6">
                <section className="rounded-md border border-hairline bg-surface/40 p-7">
                  <h2 className="font-display text-2xl text-cream">
                    Business Information
                  </h2>
                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <Info label="Business Name" value={business.name} />
                    <Info label="Category" value={business.category} />
                    <Info label="City" value={business.city} />
                    <Info label="Email" value={business.email} />
                    <Info label="Phone" value={business.phone} />
                    <Info
                      label="Social"
                      value={
                        business.social_links?.length
                          ? business.social_links.join(", ")
                          : null
                      }
                    />
                  </div>
                </section>

                {business.address && (
                  <section className="rounded-md border border-hairline bg-surface/40 p-7">
                    <h2 className="font-display text-2xl text-cream">Address</h2>
                    <p className="mt-5 leading-relaxed text-muted">
                      {business.address}
                      {business.city ? `, ${business.city}` : ""}
                    </p>
                  </section>
                )}

                {business.description && (
                  <section className="rounded-md border border-hairline bg-surface/40 p-7">
                    <h2 className="font-display text-2xl text-cream">
                      About your business
                    </h2>
                    <p className="mt-5 max-w-3xl leading-8 text-muted">
                      {business.description}
                    </p>
                  </section>
                )}

                <section className="rounded-md border border-hairline bg-surface/40 p-7">
                  <h2 className="font-display text-2xl text-cream">AI Context</h2>
                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <Info
                      label="Target Audience"
                      value={business.target_audience}
                    />
                    <Info label="Brand Tone" value={business.tone} />
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-cream">{value || "—"}</p>
    </div>
  );
}
