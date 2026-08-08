import type { GeneratedWebsite } from "@/types/website";
import Reveal from "@/components/ui/Reveal";
import { cx, resolveSiteTheme, type SiteThemeKey } from "./themes";

type Business = {
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  /** Owner-written blurb. Optional — older sites were saved without it. */
  description?: string | null;
};

export type PublishedContent = GeneratedWebsite & {
  _business?: Business;
  _images?: string[];
  /**
   * Visual theme picked during onboarding. Absent on every site generated
   * before themes existed, which resolves to the original "classic" design.
   */
  _theme?: SiteThemeKey | string;
};

function isHex(v: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim());
}

// tint helper: append alpha to a hex color (expects #rrggbb)
function tint(hex: string, alpha: number) {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return hex.length === 7 ? `${hex}${a}` : hex;
}

// wa.me expects a bare international number — digits only, no +, spaces or dashes.
// Indian businesses routinely save a 10-digit mobile with no country code, so
// prepend 91 for those. Leading zeros (09142250799) are trunk prefixes, not part
// of the number. Numbers that already carry a country code pass through, and
// anything too short to be a real number is treated as missing.
function waNumber(phone?: string | null) {
  const digits = (phone || "").replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return digits.length >= 8 ? digits : null;
}

export default function PublishedSite({
  content,
}: {
  content: PublishedContent;
}) {
  const t = resolveSiteTheme(content._theme);
  const accent = isHex(content.primary_color || "")
    ? content.primary_color.trim()
    : t.fallbackAccent;
  const biz = content._business ?? {};
  const images = content._images ?? [];
  const name = biz.name || content.hero_title;
  const hero = images[0];
  const gallery = images.slice(hero ? 1 : 0);
  const initials = (name || "?").slice(0, 2).toUpperCase();
  const whatsapp = waNumber(biz.phone);
  const mapAddress = [biz.address, biz.city].filter(Boolean).join(", ");
  const waMessage = `Hi ${
    name || "there"
  }, I found your website and wanted to get in touch.`;

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
          <span className={cx(t.heading, "text-xl", t.headingWeight, "tracking-tight")}>
            {name}
          </span>
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
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.585 0 11.946-5.359 11.949-11.945a11.87 11.87 0 0 0-3.497-8.4" />
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
