import LoginForm from "@/components/auth/LoginForm";
import Logo from "@/components/ui/Logo";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen bg-base text-cream md:grid-cols-2">
      {/* Branding panel — hidden on small screens */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-hairline bg-surface/40 p-10 md:flex lg:p-14">
        <a href="/" className="flex items-center gap-2.5">
          <Logo className="h-6 w-6" />
          <span className="font-mono text-sm tracking-wide text-cream">
            Novable
          </span>
        </a>

        <div>
          <p className="eyebrow text-amber mb-4">Get started</p>
          <h2 className="font-display max-w-sm text-2xl leading-tight text-cream lg:text-[1.9rem]">
            Five questions. Two minutes. A full AI growth team, running for you.
          </h2>
        </div>

        <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
          Trusted by 400+ growth teams
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <a href="/" className="mb-10 flex items-center gap-2.5 md:hidden">
            <Logo className="h-5 w-5" />
            <span className="font-mono text-sm text-cream">Novable</span>
          </a>

          <p className="eyebrow text-amber mb-3">Create account</p>
          <h1 className="font-display text-3xl leading-tight text-cream">
            Start your trial.
          </h1>
          <p className="mt-3 text-sm text-muted">
            Create your Novable account — no card required.
          </p>

          <div className="mt-8">
            <LoginForm mode="signup" />
          </div>
        </div>
      </div>
    </main>
  );
}
