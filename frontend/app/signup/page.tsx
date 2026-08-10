import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import BrandMark from "@/components/ui/BrandMark";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/nav";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeNext((await searchParams).next);

  // "Get Started" (next=/pricing) and "Try for free" (next=/onboarding) both
  // land here first; the promise on the page should match the one they clicked.
  const wantsPaidPlan = next.startsWith("/pricing");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next);

  return (
    <main className="organic nb-auth">
      {/* Branding panel — hidden on small screens */}
      <div className="nb-auth-brand">
        <div
          className="nb-dot"
          style={{
            width: 260,
            height: 260,
            background: "var(--color-accent-100)",
            top: -80,
            right: -70,
          }}
        />
        <div
          className="nb-dot"
          style={{
            width: 120,
            height: 120,
            background: "var(--color-accent-2-100)",
            bottom: 90,
            left: -40,
          }}
        />

        <BrandMark size={24} />

        <div>
          <span className="nb-kicker">Get started</span>
          <h2 className="nb-h2" style={{ maxWidth: "18ch" }}>
            Five questions. Two minutes. A full AI growth team.
          </h2>
        </div>

        <p className="nb-quiet" style={{ margin: 0, fontSize: 13 }}>
          Trusted by 400+ growth teams
        </p>
      </div>

      {/* Form panel */}
      <div className="nb-auth-form">
        <div>
          <div className="nb-auth-mobile-brand">
            <BrandMark size={22} />
          </div>

          <span className="nb-kicker">Create account</span>
          <h1 className="nb-h2">
            {wantsPaidPlan ? "Create your account." : "Start building free."}
          </h1>
          <p className="nb-sub" style={{ fontSize: 15 }}>
            {wantsPaidPlan
              ? "Set up your login first — you'll pick your plan on the next step."
              : "Build one AI website free — no card required."}
          </p>

          <div style={{ marginTop: 32 }}>
            <LoginForm mode="signup" next={next} />
          </div>
        </div>
      </div>
    </main>
  );
}
