import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy — Novable",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-base text-cream">
      <header className="border-b border-hairline px-6 py-5">
        <Link href="/" className="mx-auto flex max-w-3xl items-center gap-2.5">
          <Logo className="h-6 w-6" />
          <span className="font-mono text-sm text-cream">Novable</span>
        </Link>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="eyebrow text-amber mb-3">Legal</p>
        <h1 className="font-display text-4xl text-cream">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-10 space-y-8 leading-relaxed text-muted">
          <section>
            <h2 className="font-display text-xl text-cream">What we collect</h2>
            <p className="mt-3">
              When you create an account we collect your email address. When you
              use Novable you provide details about your business (name,
              category, location, contact information, and description), which we
              store to generate your website and power your AI agents.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">How we use it</h2>
            <p className="mt-3">
              We use your information solely to provide the service: generating
              your website and content, running the AI agents you request, and
              maintaining your account. We do not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Third parties</h2>
            <p className="mt-3">
              Novable uses trusted infrastructure providers to operate — including
              Google Vertex AI for content generation, Supabase for authentication
              and data storage, and Razorpay for payments. Your data is processed
              by these providers only as needed to deliver the service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Your rights</h2>
            <p className="mt-3">
              You can request access to, correction of, or deletion of your data
              at any time by contacting us. Deleting your account removes your
              business data and generated sites.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Contact</h2>
            <p className="mt-3">
              Questions about this policy? Reach us at{" "}
              <span className="text-cream">hello@novable.example</span>.
            </p>
          </section>

          <p className="rounded-md border border-hairline bg-surface/40 p-4 text-sm">
            This is a starting template and not legal advice. Have it reviewed by
            a qualified professional before relying on it for a live business.
          </p>
        </div>
      </article>

      <Footer />
    </main>
  );
}
