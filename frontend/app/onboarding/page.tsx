import Link from "next/link";
import OnboardingForm from "@/components/Onboarding/OnboardingForm";
import BrandMark from "@/components/ui/BrandMark";
import UpgradeButton from "@/components/billing/UpgradeButton";
import { getEntitlements } from "@/lib/entitlements";

export default async function OnboardingPage() {
  // Checked here as well as in the database so a free user who's already used
  // their site never sits through a generation that can't be saved.
  const { canCreateSite } = await getEntitlements();

  if (!canCreateSite) {
    return (
      <main className="nb-onb-shell">
        <header className="nb-onb-head">
          <div className="nb-onb-head-inner">
            <BrandMark size={20} />
          </div>
        </header>

        <div className="nb-onb-body">
          <span className="nb-kicker">Free plan</span>
          <h1 className="nb-h2">You&apos;ve used your free website.</h1>
          <p className="nb-sub">
            The free plan includes one AI website, which you can keep restyling
            as much as you like. Standard unlocks unlimited sites, live
            publishing, and every marketing agent — ₹500, once.
          </p>

          <div
            className="card elev-sm"
            style={{ marginTop: 36, padding: "clamp(22px, 4vw, 34px)" }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <UpgradeButton
                label="Upgrade — ₹500"
                style={{ padding: "12px 24px" }}
              />
              <Link
                href="/pricing"
                className="btn btn-secondary"
                style={{ padding: "12px 24px" }}
              >
                See plans
              </Link>
              <Link
                href="/dashboard"
                className="btn btn-ghost"
                style={{ padding: "12px 24px" }}
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="nb-onb-shell">
      <header className="nb-onb-head">
        <div className="nb-onb-head-inner">
          <BrandMark size={20} />
        </div>
      </header>

      <div className="nb-onb-body">
        <span className="nb-kicker">Pre-flight checklist</span>
        <h1 className="nb-h2">Tell us about your business.</h1>
        <p className="nb-sub">
          This sets up your workspace and lets Novable tailor its first
          recommendations to your business.
        </p>

        <div
          className="card elev-sm"
          style={{ marginTop: 36, padding: "clamp(22px, 4vw, 34px)" }}
        >
          <OnboardingForm />
        </div>

        <p
          className="nb-quiet"
          style={{ margin: "22px 0 0", textAlign: "center", fontSize: 14 }}
        >
          Already have a website?{" "}
          <Link href="/onboarding/existing">
            Skip the builder and just grow →
          </Link>
        </p>
      </div>
    </main>
  );
}
