import Link from "next/link";
import OnboardingForm from "@/components/Onboarding/OnboardingForm";
import BrandMark from "@/components/ui/BrandMark";

export default function OnboardingPage() {
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
