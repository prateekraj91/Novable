import Reveal from "@/components/ui/Reveal";
import { siteBasics, WHATSAPP_PATH, type TemplateProps } from "../shared";

/**
 * Template D — Minimal.
 *
 * One narrow column from top to bottom, separated by hairlines and a lot of
 * air. No sticky header, no hero photo, no gradient, no cards, no coloured
 * buttons, no accordion — the things every other template leans on are exactly
 * what this one removes. Text links carry the actions.
 */

const PAGE = "bg-white text-neutral-900";
const COL = "mx-auto w-full max-w-2xl px-6";
const RULE = "border-neutral-200";
const MUTED = "text-neutral-500";
const FALLBACK_ACCENT = "#171717";

export default function MinimalTemplate({ content }: TemplateProps) {
  const { accent, biz, name, images, whatsapp, mapAddress, waMessage } =
    siteBasics(content, FALLBACK_ACCENT);

  return (
    <div
      className={`min-h-screen ${PAGE} antialiased [font-feature-settings:'ss01'] [font-family:var(--font-inter)]`}
    >
      {/* Header — a name, nothing else. Not sticky. */}
      <header className={`${COL} pt-14`}>
        <span className="text-sm font-medium tracking-tight">{name}</span>
        {biz.city && <span className={`ml-3 text-sm ${MUTED}`}>{biz.city}</span>}
      </header>

      {/* Hero — modest type, a text link instead of a button */}
      <section className={`${COL} py-20 md:py-28`}>
        <h1 className="text-3xl font-medium leading-[1.2] tracking-tight md:text-4xl">
          {content.hero_title}
        </h1>
        <p className={`mt-6 text-lg leading-relaxed ${MUTED}`}>
          {content.hero_subtitle}
        </p>
        <a
          href="#contact"
          className="mt-8 inline-block border-b pb-0.5 text-sm font-medium transition-opacity hover:opacity-60"
          style={{ borderColor: accent, color: accent }}
        >
          {content.cta || "Get in touch"} →
        </a>
      </section>

      {/* About */}
      {content.about && (
        <Reveal>
          <section className={`${COL} border-t ${RULE} py-16`}>
            <p className="text-base leading-[1.8]">{content.about}</p>
          </section>
        </Reveal>
      )}

      {/* Services — a plain definition list */}
      {content.services?.length > 0 && (
        <Reveal>
          <section id="services" className={`${COL} border-t ${RULE} py-16`}>
            <h2 className={`text-xs uppercase tracking-[0.18em] ${MUTED}`}>
              Services
            </h2>
            <dl className="mt-8 space-y-8">
              {content.services.map((s, i) => (
                <div key={i}>
                  <dt className="text-base font-medium">{s.title}</dt>
                  <dd className={`mt-1.5 leading-relaxed ${MUTED}`}>
                    {s.description}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </Reveal>
      )}

      {/* Why us — one plain line, comma separated */}
      {content.why_choose_us?.length > 0 && (
        <Reveal>
          <section className={`${COL} border-t ${RULE} py-16`}>
            <h2 className={`text-xs uppercase tracking-[0.18em] ${MUTED}`}>
              Why us
            </h2>
            <ul className="mt-6 space-y-2">
              {content.why_choose_us.map((w, i) => (
                <li key={i} className="flex gap-3 text-base">
                  <span className={MUTED}>—</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      {/* Photographs — stacked full-column, generous gaps, no grid */}
      {images.length > 0 && (
        <Reveal>
          <section className={`${COL} border-t ${RULE} py-16`}>
            <div className="space-y-10">
              {images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="block w-full object-cover"
                />
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Testimonials — plain quotes */}
      {content.testimonials?.length > 0 && (
        <Reveal>
          <section className={`${COL} border-t ${RULE} py-16`}>
            <div className="space-y-10">
              {content.testimonials.map((t, i) => (
                <figure key={i}>
                  <blockquote className="text-base italic leading-relaxed">
                    “{t.review}”
                  </blockquote>
                  <figcaption className={`mt-2 text-sm ${MUTED}`}>
                    — {t.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* FAQ — always open, no chrome */}
      {content.faq?.length > 0 && (
        <Reveal>
          <section className={`${COL} border-t ${RULE} py-16`}>
            <h2 className={`text-xs uppercase tracking-[0.18em] ${MUTED}`}>
              Questions
            </h2>
            <dl className="mt-8 space-y-8">
              {content.faq.map((f, i) => (
                <div key={i}>
                  <dt className="text-base font-medium">{f.question}</dt>
                  <dd className={`mt-1.5 leading-relaxed ${MUTED}`}>{f.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        </Reveal>
      )}

      {/* Contact — plain lines and a text link */}
      <section id="contact" className={`${COL} border-t ${RULE} py-16`}>
        <h2 className={`text-xs uppercase tracking-[0.18em] ${MUTED}`}>
          {content.cta || "Visit us"}
        </h2>
        <div className="mt-6 space-y-2 text-base">
          {biz.phone && (
            <a href={`tel:${biz.phone}`} className="block hover:opacity-60">
              {biz.phone}
            </a>
          )}
          {biz.email && (
            <a href={`mailto:${biz.email}`} className="block break-all hover:opacity-60">
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
            className="mt-6 inline-flex items-center gap-2 border-b pb-0.5 text-sm font-medium transition-opacity hover:opacity-60"
            style={{ borderColor: accent, color: accent }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={WHATSAPP_PATH} />
            </svg>
            WhatsApp
          </a>
        )}

        {mapAddress && (
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              mapAddress
            )}&output=embed`}
            title={`Map showing ${mapAddress}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={`mt-10 block aspect-square w-full border ${RULE}`}
          />
        )}
      </section>

      {/* Work with a developer */}
      <Reveal>
        <section className={`${COL} border-t ${RULE} py-16`}>
          <h2 className={`text-xs uppercase tracking-[0.18em] ${MUTED}`}>
            Make it yours
          </h2>
          <p className="mt-6 text-base leading-relaxed">
            Want to customize this further? Work with a developer — get
            hands-on help tailoring this site.
          </p>
          <a
            href="https://wa.me/919142250799"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block border-b pb-0.5 text-sm font-medium transition-opacity hover:opacity-60"
            style={{ borderColor: accent, color: accent }}
          >
            Message Prateek →
          </a>
        </section>
      </Reveal>

      {/* Footer */}
      <footer className={`${COL} border-t ${RULE} py-10`}>
        <div className={`flex flex-col justify-between gap-2 text-sm ${MUTED} sm:flex-row`}>
          <span>
            © {new Date().getFullYear()} {name}
          </span>
          <a href="/" className="transition-opacity hover:opacity-60">
            Made with Novable
          </a>
        </div>
      </footer>
    </div>
  );
}
