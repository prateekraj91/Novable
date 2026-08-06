import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service — Novable",
};

export default function TermsPage() {
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
        <h1 className="font-display text-4xl text-cream">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-10 space-y-8 leading-relaxed text-muted">
          <section>
            <h2 className="font-display text-xl text-cream">The service</h2>
            <p className="mt-3">
              Novable generates websites and marketing content for your business
              using AI, and provides a set of AI agents to help you grow. You are
              responsible for reviewing and approving anything generated before
              you publish or send it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Your account</h2>
            <p className="mt-3">
              You are responsible for keeping your login credentials secure and for
              all activity under your account. You must provide accurate business
              information and only submit content you have the right to use.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Content ownership</h2>
            <p className="mt-3">
              You own the business information you provide and the sites and content
              generated for you. You are responsible for ensuring generated content
              is accurate and compliant before it goes live.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Payments</h2>
            <p className="mt-3">
              Paid plans are billed as described on the pricing page. Payments are
              processed by Razorpay. You can cancel at any time; access continues
              through the end of your current billing period.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Liability</h2>
            <p className="mt-3">
              Novable is provided &ldquo;as is.&rdquo; We work hard to keep it
              reliable, but we are not liable for indirect or consequential damages
              arising from your use of the service.
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
