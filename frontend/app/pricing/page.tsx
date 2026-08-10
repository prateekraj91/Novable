import Link from "next/link";
import type { Metadata } from "next";

import BrandMark from "@/components/ui/BrandMark";
import PlanCards from "@/components/billing/PlanCards";
import { createClient } from "@/lib/supabase/server";
import { getEntitlements } from "@/lib/entitlements";

export const metadata: Metadata = {
  title: "Pricing — Novable",
  description:
    "One-time ₹500 for your AI website, live publishing, and every growth agent.",
};

const freeIncludes = ["One AI-generated website", "Restyle it with AI, anytime"];
const freeExcludes = ["Publishing it live", "All marketing agents"];

/**
 * The paywall. "Get Started" lands here after sign-up; the locks inside the app
 * link here too. Payment is a WhatsApp conversation — the flag that unlocks the
 * account is ticked by hand in Supabase afterwards.
 */
export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { isPaid } = await getEntitlements();

  return (
    <main className="organic" style={{ minHeight: "100vh" }}>
      <header className="nb-onb-head">
        <div className="nb-onb-head-inner">
          <BrandMark size={20} />
        </div>
      </header>

      <div className="nb-edge" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div
          className="nb-dot"
          style={{
            width: 220,
            height: 220,
            background: "var(--color-accent-2-100)",
            top: -30,
            right: 40,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <span className="nb-kicker">Pricing</span>
          <h1 className="nb-h2">One payment. Everything unlocked.</h1>
          <p className="nb-sub">
            No subscription, no lock-in. Pay once and your site goes live — we
            set it up with you personally over WhatsApp.
          </p>

          {isPaid ? (
            <div
              className="card elev-sm"
              style={{
                marginTop: 32,
                maxWidth: 760,
                padding: 26,
                background: "var(--color-accent-2-100)",
              }}
            >
              <div className="nb-row" style={{ gap: 12 }}>
                <div>
                  <h2 className="nb-h3" style={{ margin: 0 }}>
                    You&apos;re on Standard.
                  </h2>
                  <p
                    className="nb-quiet"
                    style={{ margin: "6px 0 0", fontSize: 14 }}
                  >
                    Every feature is unlocked on this account — nothing left to
                    buy.
                  </p>
                </div>
                <Link href="/dashboard" className="btn btn-primary">
                  Go to dashboard →
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 36 }}>
              <PlanCards />

              {/* The free plan is real, so it gets stated plainly rather than
                  buried — people who aren't ready to pay still have a path. */}
              <div
                className="card elev-sm"
                style={{ marginTop: 20, maxWidth: 760, padding: 26 }}
              >
                <div className="nb-row" style={{ gap: 12, alignItems: "flex-start" }}>
                  <div style={{ minWidth: 0 }}>
                    <h2 className="nb-h3" style={{ margin: 0 }}>
                      Not ready? Try it free.
                    </h2>
                    <p
                      className="nb-quiet"
                      style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.55 }}
                    >
                      {freeIncludes.join(" · ")}.{" "}
                      <span style={{ color: "var(--color-accent-700)" }}>
                        Not included: {freeExcludes.join(", ").toLowerCase()}.
                      </span>
                    </p>
                  </div>
                  <Link
                    href={user ? "/onboarding" : "/signup?next=/onboarding"}
                    className="btn btn-secondary"
                    style={{ flex: "none" }}
                  >
                    Start free →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <p
            className="nb-quiet"
            style={{ margin: "28px 0 0", fontSize: 14, maxWidth: 760 }}
          >
            {user ? (
              <>
                Signed in as {user.email}.{" "}
                <Link href="/dashboard">Back to dashboard</Link>
              </>
            ) : (
              <>
                Already paid? <Link href="/login">Sign in</Link> — your account
                unlocks as soon as we mark it paid.
              </>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
