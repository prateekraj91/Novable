import Reveal from "@/components/ui/Reveal";
import { siteBasics, tint, WHATSAPP_PATH, type TemplateProps } from "../shared";

/**
 * Template B — Centered.
 *
 * Everything sits on one centre axis. The hero is a single centred column with
 * oversized display type and no photo; the lead photo is promoted to a
 * full-bleed banner beneath it. Card grids are replaced by full-width rows and
 * hairlines, the gallery is a horizontal scroll strip, and the contact block
 * runs edge to edge with square corners.
 */

const PAGE = "bg-[#fdfbf7] text-stone-900";
const BODY_FONT = "[font-family:var(--font-figtree)]";
const DISPLAY = "font-display";
const RULE = "border-stone-300/70";
const MUTED = "text-stone-600";
const FALLBACK_ACCENT = "#b45309";

export default function CenteredTemplate({ content }: TemplateProps) {
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

  return (
    <div
      className={`min-h-screen ${PAGE} ${BODY_FONT} antialiased [font-feature-settings:'ss01']`}
    >
      {/* Header — centred wordmark over a centred nav, no button */}
      <header className="border-b border-stone-200/80 py-7 text-center">
        <span className={`${DISPLAY} text-lg font-medium tracking-[0.22em] uppercase`}>
          {name}
        </span>
        <nav className={`mt-3 flex justify-center gap-7 text-xs uppercase tracking-[0.18em] ${MUTED}`}>
          {content.services?.length > 0 && (
            <a href="#services" className="transition-colors hover:text-stone-900">
              Services
            </a>
          )}
          <a href="#about" className="transition-colors hover:text-stone-900">
            About
          </a>
          <a href="#contact" className="transition-colors hover:text-stone-900">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero — one centred column, oversized type, no image */}
      <section className="px-6 py-28 text-center md:py-40">
        <p
          className="text-xs font-medium uppercase tracking-[0.3em]"
          style={{ color: accent }}
        >
          {biz.city ? `${biz.city} — ` : ""}Now open
        </p>
        <h1
          className={`mx-auto mt-8 max-w-5xl ${DISPLAY} text-5xl font-medium leading-[0.98] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl`}
        >
          {content.hero_title}
        </h1>
        <p className={`mx-auto mt-9 max-w-2xl text-lg leading-relaxed md:text-xl ${MUTED}`}>
          {content.hero_subtitle}
        </p>
        <div className="mt-12">
          <a
            href="#contact"
            className="inline-block px-10 py-4 text-sm font-medium uppercase tracking-[0.18em] text-white transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: accent }}
          >
            {content.cta || "Get in touch"}
          </a>
        </div>
      </section>

      {/* Lead photo — full bleed, wide crop */}
      {hero ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hero}
          alt={name}
          className="block aspect-[16/9] w-full object-cover md:aspect-[21/9]"
        />
      ) : (
        <div
          className="flex aspect-[16/9] w-full items-center justify-center md:aspect-[21/9]"
          style={{
            background: `linear-gradient(120deg, ${accent}, ${tint(accent, 0.4)})`,
          }}
        >
          <span className={`${DISPLAY} text-7xl font-medium text-white/90 md:text-9xl`}>
            {initials}
          </span>
        </div>
      )}

      {/* About — centred, large, under a short rule */}
      {content.about && (
        <Reveal>
          <section id="about" className="px-6 py-28 text-center md:py-36">
            <span
              className="mx-auto mb-10 block h-px w-16"
              style={{ backgroundColor: accent }}
            />
            <p
              className={`mx-auto max-w-3xl ${DISPLAY} text-2xl font-medium leading-[1.45] md:text-4xl`}
            >
              {content.about}
            </p>
          </section>
        </Reveal>
      )}

      {/* Services — full-width numbered rows, not cards */}
      {content.services?.length > 0 && (
        <Reveal>
          <section id="services" className="px-6 pb-8">
            <div className="mx-auto max-w-5xl">
              <h2
                className={`text-center text-xs font-medium uppercase tracking-[0.3em] ${MUTED}`}
              >
                What we offer
              </h2>
              <div className={`mt-12 border-t ${RULE}`}>
                {content.services.map((s, i) => (
                  <div
                    key={i}
                    className={`grid gap-4 border-b ${RULE} py-10 md:grid-cols-[auto_1fr_1.4fr] md:items-baseline md:gap-10`}
                  >
                    <span
                      className={`${DISPLAY} text-3xl font-medium md:text-4xl`}
                      style={{ color: accent }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className={`${DISPLAY} text-2xl font-medium md:text-3xl`}>
                      {s.title}
                    </h3>
                    <p className={`text-base leading-relaxed ${MUTED}`}>
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* Why us — a centred cluster of chips */}
      {content.why_choose_us?.length > 0 && (
        <Reveal>
          <section className="px-6 py-24 text-center">
            <h2
              className={`text-xs font-medium uppercase tracking-[0.3em] ${MUTED}`}
            >
              Why us
            </h2>
            <ul className="mt-10 flex flex-wrap justify-center gap-3">
              {content.why_choose_us.map((w, i) => (
                <li
                  key={i}
                  className="rounded-full border px-6 py-3 text-sm"
                  style={{
                    borderColor: tint(accent, 0.35),
                    backgroundColor: tint(accent, 0.07),
                  }}
                >
                  {w}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      {/* Gallery — full-bleed horizontal scroll strip */}
      {gallery.length > 0 && (
        <Reveal>
          <section className="py-16">
            <h2
              className={`px-6 text-center text-xs font-medium uppercase tracking-[0.3em] ${MUTED}`}
            >
              A look inside
            </h2>
            <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:thin]">
              {gallery.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-64 w-[78vw] shrink-0 snap-center object-cover sm:w-[46vw] md:h-96 md:w-[38vw]"
                />
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Testimonials — one large centred quote per row */}
      {content.testimonials?.length > 0 && (
        <Reveal>
          <section className="px-6 py-20">
            <div className={`mx-auto max-w-4xl border-t ${RULE}`}>
              {content.testimonials.map((t, i) => (
                <figure key={i} className={`border-b ${RULE} px-2 py-16 text-center`}>
                  <blockquote
                    className={`${DISPLAY} text-2xl font-medium leading-[1.5] md:text-3xl`}
                  >
                    “{t.review}”
                  </blockquote>
                  <figcaption
                    className={`mt-7 text-xs uppercase tracking-[0.24em] ${MUTED}`}
                  >
                    — {t.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* FAQ — two open columns, no accordion */}
      {content.faq?.length > 0 && (
        <Reveal>
          <section className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
              <h2
                className={`text-center text-xs font-medium uppercase tracking-[0.3em] ${MUTED}`}
              >
                Frequently asked
              </h2>
              <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-2">
                {content.faq.map((f, i) => (
                  <div key={i}>
                    <h3 className={`${DISPLAY} text-xl font-medium`}>{f.question}</h3>
                    <p className={`mt-3 leading-relaxed ${MUTED}`}>{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* Contact — full-bleed accent band, square corners */}
      <section
        id="contact"
        className="px-6 py-28 text-center text-white"
        style={{ backgroundColor: accent }}
      >
        <h2
          className={`mx-auto max-w-3xl ${DISPLAY} text-4xl font-medium leading-tight md:text-6xl`}
        >
          {content.cta || "Come visit us"}
        </h2>
        <div className="mt-10 flex flex-col items-center gap-3 text-white/90">
          {biz.phone && (
            <a href={`tel:${biz.phone}`} className="text-lg hover:text-white">
              {biz.phone}
            </a>
          )}
          {biz.email && (
            <a href={`mailto:${biz.email}`} className="break-all text-lg hover:text-white">
              {biz.email}
            </a>
          )}
          {(biz.address || biz.city) && (
            <span className="text-lg">
              {[biz.address, biz.city].filter(Boolean).join(", ")}
            </span>
          )}
        </div>

        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2.5 bg-white px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] transition-transform hover:-translate-y-0.5"
            style={{ color: accent }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={WHATSAPP_PATH} />
            </svg>
            Message us on WhatsApp
          </a>
        )}
      </section>

      {/* Map — full bleed, square */}
      {mapAddress && (
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            mapAddress
          )}&output=embed`}
          title={`Map showing ${mapAddress}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block aspect-[4/3] w-full border-0 sm:aspect-[21/9]"
        />
      )}

      {/* Work with a developer */}
      <Reveal>
        <section className="px-6 py-24 text-center">
          <h2
            className={`mx-auto max-w-2xl ${DISPLAY} text-2xl font-medium leading-snug md:text-3xl`}
          >
            Want to customize this further? Work with a developer
          </h2>
          <p className={`mx-auto mt-4 max-w-xl ${MUTED}`}>
            Get hands-on help tailoring this site — message our developer
            directly on WhatsApp.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-medium text-white"
              style={{ backgroundColor: accent }}
            >
              P
            </span>
            <h3 className={`${DISPLAY} text-xl font-medium`}>Prateek</h3>
            <a
              href="https://wa.me/919142250799"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: accent }}
            >
              WhatsApp
            </a>
          </div>
        </section>
      </Reveal>

      {/* Footer — centred stack */}
      <footer className="border-t border-stone-200 px-6 py-12 text-center">
        <p className={`text-sm ${MUTED}`}>
          © {new Date().getFullYear()} {name}
        </p>
        <a
          href="/"
          className={`mt-2 inline-block text-xs uppercase tracking-[0.22em] ${MUTED} transition-colors hover:text-stone-900`}
        >
          Made with Novable
        </a>
      </footer>
    </div>
  );
}
