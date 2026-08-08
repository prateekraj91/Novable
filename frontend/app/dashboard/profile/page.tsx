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
    <div className="nb-app">
      <Sidebar />
      <main className="nb-app-main">
        <div className="nb-page">
          <div className="nb-page-inner">
            <span className="nb-kicker">Business Profile</span>
            <h1 className="nb-h2">Your business.</h1>
            <p className="nb-sub">
              Everything Novable knows about your business. Every AI agent uses
              these details to make better decisions.
            </p>

            {!business ? (
              <div className="card elev-sm" style={{ marginTop: 36, padding: 30 }}>
                <p className="nb-quiet" style={{ margin: 0, fontSize: 15 }}>
                  You haven&apos;t set up a business yet.
                </p>
                <Link
                  href="/onboarding"
                  className="btn btn-primary"
                  style={{ marginTop: 18, alignSelf: "flex-start", padding: "12px 22px" }}
                >
                  Start onboarding
                </Link>
              </div>
            ) : (
              <div style={{ marginTop: 36, display: "grid", gap: 16 }}>
                <section className="card elev-sm" style={{ padding: 28 }}>
                  <h2 className="nb-h3">Business Information</h2>
                  <div className="nb-info-grid" style={{ marginTop: 24 }}>
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
                  <section className="card elev-sm" style={{ padding: 28 }}>
                    <h2 className="nb-h3">Address</h2>
                    <p className="nb-quiet" style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.7 }}>
                      {business.address}
                      {business.city ? `, ${business.city}` : ""}
                    </p>
                  </section>
                )}

                {business.description && (
                  <section className="card elev-sm" style={{ padding: 28 }}>
                    <h2 className="nb-h3">About your business</h2>
                    <p
                      className="nb-quiet"
                      style={{
                        margin: "16px 0 0",
                        maxWidth: "70ch",
                        fontSize: 15,
                        lineHeight: 1.75,
                      }}
                    >
                      {business.description}
                    </p>
                  </section>
                )}

                <section className="card elev-sm" style={{ padding: 28 }}>
                  <h2 className="nb-h3">AI Context</h2>
                  <div className="nb-info-grid" style={{ marginTop: 24 }}>
                    <Info label="Target Audience" value={business.target_audience} />
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
      <p className="nb-info-label">{label}</p>
      <p className="nb-info-value">{value || "—"}</p>
    </div>
  );
}
