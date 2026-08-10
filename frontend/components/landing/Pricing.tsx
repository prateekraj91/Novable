import Link from "next/link";
import PlanCards from "@/components/billing/PlanCards";

export default function Pricing() {
  return (
    <section id="pricing" className="nb-edge" style={{ paddingBottom: 96 }}>
      <span className="nb-kicker">Pricing</span>

      <h2 className="nb-h2">Simple one-time pricing.</h2>

      <p className="nb-sub">
        No subscription, no lock-in. Pay once and your site goes live — we set
        it up with you personally.
      </p>

      <div style={{ marginTop: 36 }}>
        <PlanCards />
      </div>

      <p
        className="nb-quiet"
        style={{ margin: "24px 0 0", fontSize: 14, maxWidth: 760, lineHeight: 1.6 }}
      >
        Want to try first? The free plan builds you{" "}
        <strong>one AI website</strong> and lets you restyle it with AI.
        Publishing it live and the marketing agents are part of Standard.{" "}
        <Link href="/signup?next=/onboarding">Start free →</Link>
      </p>
    </section>
  );
}
