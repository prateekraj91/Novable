"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import BrandMark from "@/components/ui/BrandMark";
import CopyButton from "@/components/ui/CopyButton";
import QrCodeButton from "@/components/ui/QrCodeButton";
import UpgradeButton from "@/components/billing/UpgradeButton";
import { createClient } from "@/lib/supabase/client";
import { GeneratedWebsite } from "@/types/website";

export default function ResultPage() {
  const router = useRouter();
  const [site, setSite] = useState<GeneratedWebsite | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  // null until we've asked the database — the banner shouldn't promise the
  // site is live before we know that it is.
  const [published, setPublished] = useState<boolean | null>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const found = new URLSearchParams(window.location.search).get("slug");
    setSlug(found);

    if (found) {
      createClient()
        .from("sites")
        .select("published")
        .eq("slug", found)
        .maybeSingle()
        .then(({ data }) => setPublished(data?.published ?? false));
    }

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
      <main
        className="organic"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
        }}
      >
        <p className="nb-quiet" style={{ margin: 0 }}>
          No generated site found for this session.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: "12px 24px" }}
          onClick={() => router.push("/onboarding")}
        >
          Start onboarding
        </button>
      </main>
    );
  }

  if (!site) {
    return (
      <main
        className="organic"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p className="nb-kicker" style={{ margin: 0 }}>
          Loading your site…
        </p>
      </main>
    );
  }

  // primary_color should be a hex code, but the model sometimes returns a name
  // like "Warm Amber". Only trust valid hex; otherwise fall back to the
  // system's own accent.
  const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(
    (site.primary_color || "").trim()
  );
  const accent = isHex ? site.primary_color.trim() : "var(--color-accent)";

  return (
    <main className="organic" style={{ minHeight: "100vh" }}>
      <header className="nb-onb-head">
        <div
          className="nb-row"
          style={{ maxWidth: 1000, margin: "0 auto", gap: 16 }}
        >
          <BrandMark size={20} />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push("/onboarding")}
          >
            Start over
          </button>
        </div>
      </header>

      {slug && (
        <div
          style={{
            background:
              published === false
                ? "var(--color-accent-100)"
                : "var(--color-accent-2-100)",
            borderBottom: "1px solid var(--color-divider)",
            padding: "16px clamp(20px, 5vw, 40px)",
          }}
        >
          <div className="nb-row" style={{ maxWidth: 1000, margin: "0 auto" }}>
            {published === false ? (
              <p style={{ margin: 0, fontSize: 14 }}>
                <strong style={{ color: "var(--color-accent-800)" }}>
                  ✓ Saved — not live yet.
                </strong>{" "}
                Only you can see it. Publishing is part of Standard.
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: 14 }}>
                <strong style={{ color: "var(--color-accent-2-800)" }}>
                  ✓ Saved &amp; published.
                </strong>{" "}
                Your live site:{" "}
                <a href={`/site/${slug}`} target="_blank" rel="noopener noreferrer">
                  /site/{slug}
                </a>
              </p>
            )}

            <div className="nb-row-actions">
              {published !== false && (
                <>
                  <CopyButton path={`/site/${slug}`} className="btn btn-secondary" />
                  <QrCodeButton
                    path={`/site/${slug}`}
                    title={slug}
                    className="btn btn-secondary"
                  />
                </>
              )}
              <Link href={`/dashboard/edit/${slug}`} className="btn btn-secondary">
                Refine with AI
              </Link>
              {published === false ? (
                <>
                  <a
                    href={`/site/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    Preview →
                  </a>
                  <UpgradeButton label="Upgrade to publish" />
                </>
              ) : (
                <a
                  href={`/site/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  View live site →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="nb-edge" style={{ padding: "72px 0", textAlign: "center" }}>
        <span className="nb-kicker" style={{ color: accent }}>
          Your generated site
        </span>
        <h1 className="nb-h1" style={{ maxWidth: "18ch", margin: "0 auto" }}>
          {site.hero_title}
        </h1>
        <p className="nb-sub" style={{ margin: "18px auto 0" }}>
          {site.hero_subtitle}
        </p>
        <div style={{ marginTop: 30 }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{ background: accent, padding: "14px 28px", fontSize: 15 }}
            onClick={() =>
              contactRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {site.cta}
          </button>
        </div>
      </div>

      <section className="nb-edge" style={{ paddingBottom: 72, maxWidth: 820 }}>
        <h2 className="nb-h2">About</h2>
        <p className="nb-sub" style={{ maxWidth: "none" }}>
          {site.about}
        </p>
      </section>

      {site.services?.length > 0 && (
        <section className="nb-edge" style={{ paddingBottom: 72 }}>
          <h2 className="nb-h2">Services</h2>
          <div className="nb-grid-3" style={{ marginTop: 28 }}>
            {site.services.map((s, i) => (
              <div key={i} className="card elev-sm" style={{ padding: 24 }}>
                <span
                  className="nb-kicker"
                  style={{ color: accent, margin: "0 0 8px" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="nb-h3">{s.title}</h3>
                <p className="nb-quiet" style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.55 }}>
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {site.why_choose_us?.length > 0 && (
        <section className="nb-edge" style={{ paddingBottom: 72, maxWidth: 900 }}>
          <h2 className="nb-h2">Why choose us</h2>
          <div className="nb-grid-2" style={{ marginTop: 28 }}>
            {site.why_choose_us.map((item, i) => (
              <div
                key={i}
                className="card elev-sm"
                style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 20 }}
              >
                <span style={{ color: accent, flex: "none", marginTop: 2 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8.5L6.2 11.5L13 4.5"
                      stroke="currentColor"
                      strokeWidth="2.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span style={{ fontSize: 14, lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {site.testimonials?.length > 0 && (
        <section className="nb-edge" style={{ paddingBottom: 72 }}>
          <h2 className="nb-h2">Testimonials</h2>
          <div className="nb-grid-3" style={{ marginTop: 28 }}>
            {site.testimonials.map((t, i) => (
              <div key={i} className="card elev-sm" style={{ padding: 24 }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
                  &ldquo;{t.review}&rdquo;
                </p>
                <p className="nb-info-label" style={{ marginTop: 14 }}>
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {site.faq?.length > 0 && (
        <section className="nb-edge" style={{ paddingBottom: 72, maxWidth: 820 }}>
          <h2 className="nb-h2">FAQ</h2>
          <div style={{ marginTop: 28, display: "grid", gap: 12 }}>
            {site.faq.map((f, i) => (
              <div key={i} className="card elev-sm" style={{ padding: "20px 24px" }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-heading)",
                    fontSize: 18,
                  }}
                >
                  {f.question}
                </p>
                <p className="nb-quiet" style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.6 }}>
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div ref={contactRef} style={{ scrollMarginTop: 80 }}>
        <section
          className="nb-edge"
          style={{ paddingBottom: 88, maxWidth: 820, textAlign: "center" }}
        >
          <h2 className="nb-h2" style={{ maxWidth: "24ch", margin: "0 auto" }}>
            Want to customize this further? Work with a developer
          </h2>
          <p className="nb-sub" style={{ margin: "16px auto 0" }}>
            Get hands-on help tailoring your site — reach out to our developer
            directly on WhatsApp.
          </p>

          <div
            className="card elev-md"
            style={{
              maxWidth: 340,
              margin: "32px auto 0",
              alignItems: "center",
              gap: 14,
              padding: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "var(--color-accent-100)",
                color: "var(--color-accent-800)",
                fontFamily: "var(--font-heading)",
                fontSize: 20,
              }}
            >
              P
            </div>
            <h3 className="nb-h3">Prateek</h3>
            <a
              href="https://wa.me/919142250799"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: "12px 26px" }}
            >
              WhatsApp
            </a>
          </div>
        </section>
      </div>

      <footer
        className="nb-quiet"
        style={{
          borderTop: "1px solid var(--color-divider)",
          padding: "28px 0",
          textAlign: "center",
          fontSize: 13,
        }}
      >
        Generated by Novable
      </footer>
    </main>
  );
}
