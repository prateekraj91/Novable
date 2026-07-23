import OnboardingForm from "@/components/Onboarding/OnboardingForm";
import Logo from "@/components/ui/Logo";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-base text-cream bg-grain">
      <header className="border-b border-hairline px-6 py-5">
        <a href="/" className="mx-auto flex max-w-2xl items-center gap-2.5">
          <Logo className="h-5 w-5" />
          <span className="font-mono text-sm text-cream">
            Catalyst
          </span>
        </a>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="eyebrow text-amber mb-3">Pre-flight checklist</p>
        <h1 className="font-display text-3xl leading-tight text-cream md:text-4xl">
          Tell us about your business.
        </h1>
        <p className="mt-3 max-w-md text-muted">
          This sets up your workspace and lets Catalyst tailor its first
          recommendations to your business.
        </p>

        <div className="mt-10 rounded-md border border-hairline bg-surface/40 p-6 md:p-8">
          <OnboardingForm />
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Already have a website?{" "}
          <a href="/onboarding/existing" className="text-amber hover:text-sage">
            Skip the builder and just grow →
          </a>
        </p>
      </div>
    </main>
  );
}
