import Reveal from "@/components/ui/Reveal";
import { siteBasics, tint, WHATSAPP_PATH, type TemplateProps } from "../shared";

/**
 * Template C — Editorial.
 *
 * A magazine cover. The lead photo is a near-full-height backdrop with the
 * headline set over it and the header floating on top, rather than a box
 * beside the copy. Below that everything is deliberately asymmetric: a ticker
 * strip, a narrow sticky label against a wide body column, services that
 * alternate left and right, an uneven gallery, and a hard split-screen
 * contact block.
 */

const PAGE = "bg-[#0b0b0c] text-neutral-50";
const BODY_FONT = "[font-family:var(--font-figtree)]";
const DISPLAY = "[font-family:var(--font-caprasimo)]";
const RULE = "border-white/12";
const MUTED = "text-neutral-400";
const FALLBACK_ACCENT = "#e11d48";

export default function EditorialTemplate({ content }: TemplateProps) {
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
  } = siteBasics(content, FALLBACK_ACCENT);

  const ticker = content.why_choose_us ?? [];

  return (
    <div
      className={`min-h-screen ${PAGE} ${BODY_FONT} antialiased [font-feature-settings:'ss01']`}
    >
      {/* Hero — full-bleed image with the header and headline laid over it */}
      <section className="relative min-h-[88vh] overflow-hidden">
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${accent}, #0b0b0c 78%)`,
            }}
          />
        )}
        {/* scrim so the type stays legible over any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/55 to-[#0b0b0c]/25" />

        <header className="relative z-10 flex items-center justify-between px-6 py-7 md:px-12">
          <span className={`${DISPLAY} text-lg tracking-tight md:text-xl`}>{name}</span>
          <a
            href="#contact"
            className="border-b pb-1 text-xs uppercase tracking-[0.22em] transition-colors hover:text-white"
            style={{ borderColor: accent }}
          >
            {content.cta || "Get in touch"}
          </a>
        </header>

        <div className="relative z-10 flex min-h-[calc(88vh-88px)] items-end px-6 pb-16 md:px-12 md:pb-24">
          <div className="max-w-4xl">
            {biz.city && (
              <p
                className="text-xs font-semibold uppercase tracking-[0.32em]"
                style={{ color: accent }}
              >
                {biz.city}
              </p>
            )}
            <h1
              className={`mt-5 ${DISPLAY} text-5xl leading-[0.92] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl`}
            >
              {content.hero_title}
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-neutral-200">
              {content.hero_subtitle}
            </p>
            {!hero && (
              <p className={`mt-8 ${DISPLAY} text-6xl text-white/25`}>{initials}</p>
            )}
          </div>
        </div>
      </section>

      {/* Ticker — why-choose-us as one running strip */}
      {ticker.length > 0 && (
        <div
          className="overflow-hidden border-y py-4"
          style={{ backgroundColor: accent, borderColor: accent }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 text-xs font-semibold uppercase tracking-[0.24em] text-white">
            {ticker.map((w, i) => (
              <span key={i} className="flex items-center gap-4">
                {i > 0 && <span className="opacity-60">•</span>}
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* About — narrow sticky label against a wide body column */}
      {content.about && (
        <Reveal>
          <section className="px-6 py-24 md:px-12 md:py-32">
            <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[200px_1fr] md:gap-16">
              <div className="md:sticky md:top-12 md:self-start">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: accent }}
                >
                  About
                </p>
                <span
                  className="mt-5 block h-px w-14"
                  style={{ backgroundColor: accent }}
                />
              </div>
              <p className="text-2xl leading-[1.45] text-neutral-200 md:text-3xl">
                {content.about}
              </p>
            </div>
          </section>
        </Reveal>
      )}

      {/* Services — alternating full-width rows */}
      {content.services?.length > 0 && (
        <Reveal>
          <section id="services" className={`border-t ${RULE} px-6 md:px-12`}>
            <div className="mx-auto max-w-6xl">
              {content.services.map((s, i) => (
                <div
                  key={i}
                  className={`grid items-center gap-8 border-b ${RULE} py-14 md:grid-cols-2 md:gap-16 md:py-20`}
                >
                  {/* number/plate block — flips side on odd rows */}
                  <div className={i % 2 === 1 ? "md:order-2" : ""}>
                    <div
                      className="flex aspect-[16/10] items-center justify-center"
                      style={{
                        background: `linear-gradient(140deg, ${tint(
                          accent,
                          0.22
                        )}, rgba(255,255,255,0.03))`,
                      }}
                    >
                      <span
                        className={`${DISPLAY} text-7xl md:text-8xl`}
                        style={{ color: accent }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <div className={i % 2 === 1 ? "md:order-1" : ""}>
                    <h3 className={`${DISPLAY} text-3xl leading-tight md:text-4xl`}>
                      {s.title}
                    </h3>
                    <p className={`mt-5 text-lg leading-relaxed ${MUTED}`}>
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Gallery — deliberately uneven: first image spans 2x2 */}
      {gallery.length > 0 && (
        <Reveal>
          <section className="px-6 py-24 md:px-12">
            <div className="mx-auto max-w-6xl">
              <p
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: accent }}
              >
                A look inside
              </p>
              <div className="mt-8 grid auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[190px] md:grid-cols-4">
                {gallery.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className={`h-full w-full object-cover ${
                      i === 0 ? "col-span-2 row-span-2" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* Testimonials — pull quotes with a rule and the name pushed right */}
      {content.testimonials?.length > 0 && (
        <Reveal>
          <section className={`border-t ${RULE} px-6 py-20 md:px-12`}>
            <div className="mx-auto max-w-5xl">
              {content.testimonials.map((t, i) => (
                <figure key={i} className={`border-b ${RULE} py-12`}>
                  <blockquote
                    className={`${DISPLAY} text-2xl leading-snug md:text-4xl`}
                  >
                    <span style={{ color: accent }}>“</span>
                    {t.review}
                  </blockquote>
                  <figcaption className="mt-7 flex items-center gap-5">
                    <span className={`h-px flex-1 ${RULE} border-t`} />
                    <span className="text-xs uppercase tracking-[0.26em] text-neutral-300">
                      {t.name}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* FAQ — numbered editorial list */}
      {content.faq?.length > 0 && (
        <Reveal>
          <section className="px-6 py-24 md:px-12">
            <div className="mx-auto max-w-4xl">
              <p
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: accent }}
              >
                Frequently asked
              </p>
              <dl className={`mt-10 border-t ${RULE}`}>
                {content.faq.map((f, i) => (
                  <div key={i} className={`border-b ${RULE} py-8`}>
                    <dt className="flex gap-5">
                      <span
                        className="pt-1 text-xs font-semibold tabular-nums"
                        style={{ color: accent }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`${DISPLAY} text-xl md:text-2xl`}>
                        {f.question}
                      </span>
                    </dt>
                    <dd className={`mt-3 pl-10 leading-relaxed ${MUTED}`}>
                      {f.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </Reveal>
      )}

      {/* Contact — hard split screen, contact left, map right */}
      <section id="contact" className={`grid border-t ${RULE} md:grid-cols-2`}>
        <div className="px-6 py-20 md:px-12 md:py-28">
          <h2 className={`${DISPLAY} text-4xl leading-tight md:text-5xl`}>
            {content.cta || "Come visit us"}
          </h2>
          <div className="mt-10 space-y-4 text-lg">
            {biz.phone && (
              <a
                href={`tel:${biz.phone}`}
                className={`block ${MUTED} transition-colors hover:text-white`}
              >
                {biz.phone}
              </a>
            )}
            {biz.email && (
              <a
                href={`mailto:${biz.email}`}
                className={`block break-all ${MUTED} transition-colors hover:text-white`}
              >
                {biz.email}
              </a>
            )}
            {(biz.address || biz.city) && (
              <p className={MUTED}>
                {[biz.address, biz.city].filter(Boolean).join(", ")}
              </p>
            )}
          </div>

          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2.5 px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: accent }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={WHATSAPP_PATH} />
              </svg>
              WhatsApp
            </a>
          )}
        </div>

        {mapAddress ? (
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              mapAddress
            )}&output=embed`}
            title={`Map showing ${mapAddress}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={`block min-h-[320px] w-full border-0 border-t ${RULE} md:border-l md:border-t-0`}
          />
        ) : (
          <div
            className={`min-h-[320px] border-t ${RULE} md:border-l md:border-t-0`}
            style={{ background: `linear-gradient(140deg, ${tint(accent, 0.3)}, transparent)` }}
          />
        )}
      </section>

      {/* Work with a developer */}
      <Reveal>
        <section className={`border-t ${RULE} px-6 py-20 md:px-12`}>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: accent }}
              >
                Make it yours
              </p>
              <h2 className={`mt-4 max-w-xl ${DISPLAY} text-2xl leading-snug md:text-3xl`}>
                Want to customize this further? Work with a developer
              </h2>
              <p className={`mt-4 max-w-lg ${MUTED}`}>
                Get hands-on help tailoring this site — message our developer
                directly on WhatsApp.
              </p>
            </div>
            <a
              href="https://wa.me/919142250799"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-3 border px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-[#0b0b0c]"
              style={{ borderColor: accent }}
            >
              Prateek — WhatsApp
            </a>
          </div>
        </section>
      </Reveal>

      {/* Footer — the name set huge */}
      <footer className={`border-t ${RULE} px-6 pb-10 pt-16 md:px-12`}>
        <p className={`${DISPLAY} text-4xl leading-none text-white/15 md:text-7xl`}>
          {name}
        </p>
        <div
          className={`mt-10 flex flex-col justify-between gap-2 border-t ${RULE} pt-6 text-xs uppercase tracking-[0.2em] ${MUTED} sm:flex-row`}
        >
          <span>© {new Date().getFullYear()} {name}</span>
          <a href="/" className="transition-colors hover:text-white">
            Made with Novable
          </a>
        </div>
      </footer>
    </div>
  );
}
