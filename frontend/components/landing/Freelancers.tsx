export default function Freelancers() {
  return (
    <section id="freelancers" className="border-t border-hairline px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_auto]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <p className="eyebrow text-amber">For Freelancers</p>
            <span className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-muted">
              Coming soon
            </span>
          </div>

          <h2 className="font-display max-w-2xl text-3xl leading-tight text-cream md:text-[2.5rem]">
            Local business leads, straight to WhatsApp.
          </h2>

          <p className="mt-4 max-w-2xl leading-relaxed text-muted">
            Designers and developers join the Novable marketplace for
            ₹299/month — a fraction of Upwork&apos;s 20% cut — and get matched to
            real local projects.
          </p>
        </div>

        <a
          href="#"
          className="justify-self-start rounded-sm border border-hairline px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-cream transition hover:border-muted md:justify-self-end"
        >
          + Join the waitlist
        </a>
      </div>
    </section>
  );
}
