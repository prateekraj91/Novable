"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/common/Container";
import Section from "@/components/common/Section";
import Heading from "@/components/common/Heading";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import CopyButton from "@/components/ui/CopyButton";
import { GeneratedWebsite } from "@/types/website";

export default function ResultPage() {
  const router = useRouter();
  const [site, setSite] = useState<GeneratedWebsite | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    setSlug(new URLSearchParams(window.location.search).get("slug"));
    const raw = sessionStorage.getItem("growthpilot_site");

    if (!raw) {
      setNotFound(true);
      return;
    }

    try {
      setSite(JSON.parse(raw));
    } catch {
      setNotFound(true);
    }
  }, []);

  if (notFound) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base text-cream">
        <p className="text-muted">No generated site found for this session.</p>
        <Button onClick={() => router.push("/onboarding")}>
          Start onboarding
        </Button>
      </main>
    );
  }

  if (!site) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base text-cream">
        <p className="eyebrow text-sage">Loading your site...</p>
      </main>
    );
  }

  // primary_color should be a hex code, but the model sometimes returns a name
  // like "Warm Amber". Only trust valid hex; otherwise fall back to the default.
  const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(
    (site.primary_color || "").trim()
  );
  const accent = isHex ? site.primary_color.trim() : "#FF8A3D";

  return (
    <main className="min-h-screen bg-base text-cream bg-grain">
      <header className="border-b border-hairline px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <span className="font-mono text-sm text-cream">
              Catalyst
            </span>
          </a>
          <Button
            variant="secondary"
            onClick={() => router.push("/onboarding")}
          >
            Start over
          </Button>
        </div>
      </header>

      {slug && (
        <div className="border-b border-hairline bg-surface/40 px-6 py-4">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-cream">
              <span className="text-sage">✓ Saved &amp; published.</span> Your
              live site:{" "}
              <a
                href={`/site/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber underline-offset-2 hover:text-sage hover:underline"
              >
                /site/{slug}
              </a>
            </p>
            <div className="flex flex-wrap gap-2">
              <CopyButton
                path={`/site/${slug}`}
                className="rounded-sm border border-hairline px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-cream transition hover:border-amber hover:text-amber"
              />
              <a
                href={`/dashboard/edit/${slug}`}
                className="rounded-sm border border-hairline px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-cream transition hover:border-amber hover:text-amber"
              >
                Refine with AI
              </a>
              <a
                href={`/site/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm bg-amber px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-base transition-transform hover:-translate-y-0.5"
              >
                View live site →
              </a>
            </div>
          </div>
        </div>
      )}

      <Section className="text-center">
        <Container>
          <p className="eyebrow mb-3" style={{ color: accent }}>
            Your generated site
          </p>
          <h1 className="font-display text-4xl leading-tight text-cream md:text-6xl">
            {site.hero_title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            {site.hero_subtitle}
          </p>
          <div className="mt-8">
            <Button style={{ backgroundColor: accent }}>{site.cta}</Button>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-hairline">
        <Container className="max-w-3xl">
          <Heading title="About" />
          <p className="mt-4 leading-relaxed text-muted">{site.about}</p>
        </Container>
      </Section>

      {site.services?.length > 0 && (
        <Section className="border-t border-hairline">
          <Container>
            <Heading title="Services" align="center" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {site.services.map((s, i) => (
                <Card key={i}>
                  <p className="eyebrow mb-2" style={{ color: accent }}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display text-xl text-cream">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{s.description}</p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {site.why_choose_us?.length > 0 && (
        <Section className="border-t border-hairline">
          <Container className="max-w-3xl">
            <Heading title="Why choose us" align="center" />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {site.why_choose_us.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-md border border-hairline bg-surface/40 p-4"
                >
                  <Badge>OK</Badge>
                  <span className="text-sm text-cream">{item}</span>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {site.testimonials?.length > 0 && (
        <Section className="border-t border-hairline">
          <Container>
            <Heading title="Testimonials" align="center" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {site.testimonials.map((t, i) => (
                <Card key={i}>
                  <p className="text-sm leading-relaxed text-cream">
                    &ldquo;{t.review}&rdquo;
                  </p>
                  <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                    {t.name}
                  </p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {site.faq?.length > 0 && (
        <Section className="border-t border-hairline">
          <Container className="max-w-3xl">
            <Heading title="FAQ" align="center" />
            <div className="mt-8 space-y-4">
              {site.faq.map((f, i) => (
                <div
                  key={i}
                  className="rounded-md border border-hairline bg-surface/40 p-5"
                >
                  <p className="font-display text-lg text-cream">
                    {f.question}
                  </p>
                  <p className="mt-2 text-sm text-muted">{f.answer}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section className="border-t border-hairline">
        <Container className="max-w-3xl text-center">
          <Heading
            title="Want to customize this further? Work with a developer"
            align="center"
          />
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Get hands-on help tailoring your site — reach out to one of our
            developers directly on WhatsApp.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { name: "Prateek", phone: "91XXXXXXXXXX" },
              { name: "Prakhar", phone: "91XXXXXXXXXX" },
              { name: "Rudransh", phone: "91XXXXXXXXXX" },
            ].map((dev) => (
              <Card key={dev.name} className="flex flex-col items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-surface/40 font-display text-lg text-cream">
                  {dev.name.slice(0, 1)}
                </div>
                <h3 className="font-display text-xl text-cream">{dev.name}</h3>
                <a
                  href={`https://wa.me/${dev.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm bg-amber px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-base transition-transform hover:-translate-y-0.5"
                >
                  WhatsApp
                </a>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <footer className="border-t border-hairline py-8 text-center text-xs text-muted">
        Generated by Catalyst
      </footer>
    </main>
  );
}
