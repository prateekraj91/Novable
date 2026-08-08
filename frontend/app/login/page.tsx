import LoginForm from "@/components/auth/LoginForm";
import BrandMark from "@/components/ui/BrandMark";

export default function LoginPage() {
  return (
    <main className="organic nb-auth">
      {/* Branding panel — hidden on small screens */}
      <div className="nb-auth-brand">
        <div
          className="nb-dot"
          style={{
            width: 260,
            height: 260,
            background: "var(--color-accent-2-100)",
            top: -80,
            right: -70,
          }}
        />
        <div
          className="nb-dot"
          style={{
            width: 120,
            height: 120,
            background: "var(--color-accent-100)",
            bottom: 90,
            left: -40,
          }}
        />

        <BrandMark size={24} />

        <div>
          <span className="nb-kicker">Flight plan — live</span>
          <h2 className="nb-h2" style={{ maxWidth: "18ch" }}>
            Every login picks up where your last experiment left off.
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

          <span className="nb-kicker">Access</span>
          <h1 className="nb-h2">Welcome back.</h1>
          <p className="nb-sub" style={{ fontSize: 15 }}>
            Sign in to keep your flight plan running.
          </p>

          <div style={{ marginTop: 32 }}>
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
