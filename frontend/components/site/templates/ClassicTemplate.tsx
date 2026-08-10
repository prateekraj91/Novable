import Reveal from "@/components/ui/Reveal";
import { cx, SITE_THEMES } from "../themes";
import { siteBasics, tint, WHATSAPP_PATH, type TemplateProps } from "../shared";

/**
 * Template A — Classic. The original Novable layout: two-column hero with the
 * photo beside the copy, card grids on tinted bands, rounded gradient CTA.
 *
 * This is the default every existing site renders with, so its markup is kept
 * exactly as it was before templates existed. Change it only with a
 * before/after diff of a real published site in hand.
 */
export default function ClassicTemplate({ content }: TemplateProps) {
  const t = SITE_THEMES.classic;
  const {
    accent,
    biz,
    name,
    hero,
    gallery,
    initials,
    whatsapp,
    mapAddress,
    waMessage,
  } = siteBasics(content, t.fallbackAccent);

  return (
    <div
      className={cx(
        "min-h-screen",
        t.page,
        "antialiased",
        "[font-feature-settings:'ss01']",
        t.bodyFont
      )}
    >
      {/* Header */}
      <header className={cx("sticky top-0 z-40", t.header)}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: accent }}
            >
              {initials}
            </span>
            <span className={cx(t.heading, "text-xl", t.headingWeight, "tracking-tight")}>
              {name}
            </span>
          </div>
          <a
            href="#contact"
            className={cx(
              t.pill,
              "px-5 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
            )}
            style={{ backgroundColor: accent }}
          >
            {content.cta || "Get in touch"}
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `radial-gradient(120% 90% at 100% 0%, ${tint(
            accent,
            0.14
          )}, transparent 55%), radial-gradient(90% 70% at 0% 20%, ${tint(
            accent,
            0.08
          )}, transparent 60%)`,
        }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
          <div>
            <span
              className={cx("inline-block", t.pill, "px-3 py-1 text-xs font-medium")}
              style={{ backgroundColor: tint(accent, 0.12), color: accent }}
            >
              {biz.city ? `${biz.city} · ` : ""}Now open
            </span>
            <h1
              className={cx(
                "mt-6",
                t.heading,
                "text-4xl",
                t.headingWeight,
                "leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
              )}
            >
              {content.hero_title}
            </h1>
            <p className={cx("mt-6 max-w-md text-lg leading-relaxed", t.muted)}>
              {content.hero_subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#contact"
                className={cx(
                  t.pill,
                  "px-7 py-3.5 font-medium text-white shadow-lg transition-transform hover:-translate-y-0.5"
                )}
                style={{ backgroundColor: accent }}
              >
                {content.cta || "Get in touch"}
              </a>
              <a
                href="#services"
                className={cx(
                  t.pill,
                  t.outlineBorder,
                  "px-7 py-3.5 font-medium",
                  t.bodyStrong,
                  t.outlineHover
                )}
              >
                Explore
              </a>
            </div>
          </div>

          <div className="relative">
            {hero ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero}
                alt={name}
                className={cx(
                  "aspect-[4/5] w-full",
                  t.radiusXl,
                  "object-cover shadow-2xl"
                )}
              />
            ) : (
              <div
                className={cx("aspect-[4/5] w-full", t.radiusXl, "shadow-2xl")}
                style={{
                  background: `linear-gradient(150deg, ${accent}, ${tint(
                    accent,
                    0.35
                  )})`,
                }}
              >
                <div
                  className={cx(
                    "flex h-full items-center justify-center",
                    t.heading,
                    "text-8xl",
                    t.headingWeight,
                    "text-white/90"
                  )}
                >
                  {initials}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      {content.about && (
        <Reveal>
          <section className="mx-auto max-w-3xl px-6 py-24 text-center">
            <p
              className={cx(
                t.heading,
                "text-2xl leading-relaxed",
                t.bodyStrong,
                "md:text-3xl"
              )}
            >
              {content.about}
            </p>
          </section>
        </Reveal>
      )}

      {/* Services */}
      {content.services?.length > 0 && (
        <Reveal>
          <section id="services" className={cx(t.band, "py-24")}>
            <div className="mx-auto max-w-6xl px-6">
              <p
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: accent }}
              >
                What we offer
              </p>
              <h2
                className={cx(
                  "mt-2",
                  t.heading,
                  "text-4xl",
                  t.headingWeight,
                  "tracking-tight"
                )}
              >
                Services
              </h2>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {content.services.map((s, i) => (
                  <div
                    key={i}
                    className={cx(
                      "group",
                      t.radiusLg,
                      t.card,
                      "p-7 transition-all hover:-translate-y-1 hover:shadow-xl"
                    )}
                  >
                    <div
                      className={cx(
                        "flex h-11 w-11 items-center justify-center",
                        t.radiusMd,
                        t.heading,
                        "text-lg",
                        t.headingWeight
                      )}
                      style={{ backgroundColor: tint(accent, 0.12), color: accent }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                    <p className={cx("mt-2 leading-relaxed", t.muted)}>
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* Why choose us */}
      {content.why_choose_us?.length > 0 && (
        <Reveal>
          <section className="mx-auto max-w-6xl px-6 py-24">
            <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: accent }}
                >
                  Why us
                </p>
                <h2
                  className={cx(
                    "mt-2",
                    t.heading,
                    "text-4xl",
                    t.headingWeight,
                    "leading-tight tracking-tight"
                  )}
                >
                  Reasons people keep coming back.
                </h2>
              </div>
              <ul className="grid gap-6 sm:grid-cols-2">
                {content.why_choose_us.map((w, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: accent }}
                    >
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className={t.body}>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <Reveal>
          <section className={cx(t.band, "py-24")}>
            <div className="mx-auto max-w-6xl px-6">
              <p
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: accent }}
              >
                A look inside
              </p>
              <h2
                className={cx(
                  "mt-2",
                  t.heading,
                  "text-4xl",
                  t.headingWeight,
                  "tracking-tight"
                )}
              >
                Gallery
              </h2>
              <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
                {gallery.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className={cx(
                      "aspect-square w-full",
                      t.radiusLg,
                      "object-cover shadow-sm"
                    )}
                  />
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* Testimonials */}
      {content.testimonials?.length > 0 && (
        <Reveal>
          <section className="mx-auto max-w-6xl px-6 py-24">
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: accent }}
            >
              Kind words
            </p>
            <h2
              className={cx(
                "mt-2",
                t.heading,
                "text-4xl",
                t.headingWeight,
                "tracking-tight"
              )}
            >
              What people say
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {content.testimonials.map((t2, i) => (
                <figure
                  key={i}
                  className={cx("flex flex-col", t.radiusLg, t.card, "p-7")}
                >
                  <div className="mb-4 flex gap-0.5" style={{ color: accent }}>
                    {"★★★★★".split("").map((s, j) => (
                      <span key={j}>{s}</span>
                    ))}
                  </div>
                  <blockquote className={cx("flex-1", t.body)}>
                    “{t2.review}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span
                      className={cx(
                        "flex h-9 w-9 items-center justify-center",
                        t.pill,
                        "text-sm font-semibold text-white"
                      )}
                      style={{ backgroundColor: accent }}
                    >
                      {(t2.name || "?").slice(0, 1).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium">{t2.name}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* FAQ */}
      {content.faq?.length > 0 && (
        <Reveal>
          <section className={cx(t.band, "py-24")}>
            <div className="mx-auto max-w-3xl px-6">
              <h2
                className={cx(t.heading, "text-4xl", t.headingWeight, "tracking-tight")}
              >
                Frequently asked
              </h2>
              <div
                className={cx("mt-8 divide-y", t.divide, "border-t", t.hairline)}
              >
                {content.faq.map((f, i) => (
                  <details key={i} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-medium">
                      {f.question}
                      <span
                        className="ml-4 transition-transform group-open:rotate-45"
                        style={{ color: accent }}
                      >
                        +
                      </span>
                    </summary>
                    <p className={cx("mt-3 leading-relaxed", t.muted)}>
                      {f.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* Contact CTA */}
      <section id="contact" className="px-6 py-24">
        <div
          className={cx(
            "mx-auto max-w-5xl overflow-hidden",
            t.radiusXl,
            "px-8 py-16 text-center text-white md:px-16"
          )}
          style={{
            background: `linear-gradient(135deg, ${accent}, ${tint(accent, 0.55)})`,
          }}
        >
          <h2
            className={cx(
              t.heading,
              "text-4xl",
              t.headingWeight,
              "tracking-tight md:text-5xl"
            )}
          >
            {content.cta || "Come visit us"}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 text-white/90">
            {biz.phone && (
              <a href={`tel:${biz.phone}`} className="hover:text-white">
                📞 {biz.phone}
              </a>
            )}
            {biz.email && (
              <a href={`mailto:${biz.email}`} className="break-all hover:text-white">
                ✉ {biz.email}
              </a>
            )}
            {(biz.address || biz.city) && (
              <span>📍 {[biz.address, biz.city].filter(Boolean).join(", ")}</span>
            )}
          </div>

          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                waMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cx(
                "mt-9 inline-flex items-center gap-2.5",
                t.pill,
                "bg-[#25D366] px-7 py-3.5 font-medium text-white shadow-lg transition-transform hover:-translate-y-0.5"
              )}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={WHATSAPP_PATH} />
              </svg>
              Message us on WhatsApp
            </a>
          )}
        </div>

        {mapAddress && (
          <div
            className={cx(
              "mx-auto mt-6 max-w-5xl overflow-hidden",
              t.radiusXl,
              "border",
              t.hairline,
              "shadow-sm"
            )}
          >
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                mapAddress
              )}&output=embed`}
              title={`Map showing ${mapAddress}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[4/3] w-full border-0 sm:aspect-[16/9]"
            />
          </div>
        )}
      </section>

      {/* Work with a developer */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: accent }}
            >
              Make it yours
            </p>
            <h2
              className={cx(
                "mt-2",
                t.heading,
                "text-3xl",
                t.headingWeight,
                "tracking-tight sm:text-4xl"
              )}
            >
              Want to customize this further? Work with a developer
            </h2>
            <p className={cx("mt-4", t.muted)}>
              Get hands-on help tailoring this site — message our developer
              directly on WhatsApp.
            </p>
          </div>
          <div
            className={cx(
              "mx-auto mt-12 flex max-w-sm flex-col items-center",
              t.radiusLg,
              t.card,
              "p-7 text-center"
            )}
          >
            <span
              className={cx(
                "flex h-12 w-12 items-center justify-center",
                t.pill,
                "text-lg font-semibold text-white"
              )}
              style={{ backgroundColor: accent }}
            >
              P
            </span>
            <h3 className="mt-4 text-xl font-semibold">Prateek</h3>
            <a
              href="https://wa.me/919142250799"
              target="_blank"
              rel="noopener noreferrer"
              className={cx(
                "mt-5",
                t.pill,
                "px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
              )}
              style={{ backgroundColor: accent }}
            >
              WhatsApp
            </a>
          </div>
        </section>
      </Reveal>

      {/* Footer */}
      <footer className={cx("border-t", t.hairline)}>
        <div
          className={cx(
            "mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm",
            t.faint,
            "sm:flex-row"
          )}
        >
          <span>
            © {new Date().getFullYear()} {name}
          </span>
          <a href="/" className={cx("transition-colors", t.faintHover)}>
            Made with Novable
          </a>
        </div>
      </footer>
    </div>
  );
}
