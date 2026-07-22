import type { GeneratedWebsite } from "@/types/website";
import Reveal from "@/components/ui/Reveal";

type Business = {
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
};

export type PublishedContent = GeneratedWebsite & {
  _business?: Business;
  _images?: string[];
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

export default function PublishedSite({
  content,
}: {
  content: PublishedContent;
}) {
  const accent = isHex(content.primary_color || "")
    ? content.primary_color.trim()
    : "#16a34a";
  const biz = content._business ?? {};
  const images = content._images ?? [];
  const name = biz.name || content.hero_title;
  const hero = images[0];
  const gallery = images.slice(hero ? 1 : 0);
  const initials = (name || "?").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased [font-feature-settings:'ss01']">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-xl font-semibold tracking-tight">
            {name}
          </span>
          <a
            href="#contact"
            className="rounded-full px-5 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
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
              className="inline-block rounded-full px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: tint(accent, 0.12), color: accent }}
            >
              {biz.city ? `${biz.city} · ` : ""}Now open
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              {content.hero_title}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-600">
              {content.hero_subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="rounded-full px-7 py-3.5 font-medium text-white shadow-lg transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: accent }}
              >
                {content.cta || "Get in touch"}
              </a>
              <a
                href="#services"
                className="rounded-full border border-neutral-300 px-7 py-3.5 font-medium text-neutral-800 transition-colors hover:border-neutral-900"
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
                className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl"
              />
            ) : (
              <div
                className="aspect-[4/5] w-full rounded-3xl shadow-2xl"
                style={{
                  background: `linear-gradient(150deg, ${accent}, ${tint(
                    accent,
                    0.35
                  )})`,
                }}
              >
                <div className="flex h-full items-center justify-center font-display text-8xl font-semibold text-white/90">
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
            <p className="font-display text-2xl leading-relaxed text-neutral-800 md:text-3xl">
              {content.about}
            </p>
          </section>
        </Reveal>
      )}

      {/* Services */}
      {content.services?.length > 0 && (
        <Reveal>
          <section id="services" className="bg-neutral-50/70 py-24">
            <div className="mx-auto max-w-6xl px-6">
              <p
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: accent }}
              >
                What we offer
              </p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">
                Services
              </h2>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {content.services.map((s, i) => (
                  <div
                    key={i}
                    className="group rounded-2xl border border-neutral-200 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl font-display text-lg font-semibold"
                      style={{ backgroundColor: tint(accent, 0.12), color: accent }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                    <p className="mt-2 leading-relaxed text-neutral-600">
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
                <h2 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight">
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
                    <span className="text-neutral-700">{w}</span>
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
          <section className="bg-neutral-50/70 py-24">
            <div className="mx-auto max-w-6xl px-6">
              <p
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: accent }}
              >
                A look inside
              </p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">
                Gallery
              </h2>
              <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
                {gallery.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="aspect-square w-full rounded-2xl object-cover shadow-sm"
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
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">
              What people say
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {content.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-7"
                >
                  <div className="mb-4 flex gap-0.5" style={{ color: accent }}>
                    {"★★★★★".split("").map((s, j) => (
                      <span key={j}>{s}</span>
                    ))}
                  </div>
                  <blockquote className="flex-1 text-neutral-700">
                    “{t.review}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {(t.name || "?").slice(0, 1).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium">{t.name}</span>
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
          <section className="bg-neutral-50/70 py-24">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="font-display text-4xl font-semibold tracking-tight">
                Frequently asked
              </h2>
              <div className="mt-8 divide-y divide-neutral-200 border-t border-neutral-200">
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
                    <p className="mt-3 leading-relaxed text-neutral-600">
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
          className="mx-auto max-w-5xl overflow-hidden rounded-3xl px-8 py-16 text-center text-white md:px-16"
          style={{
            background: `linear-gradient(135deg, ${accent}, ${tint(accent, 0.55)})`,
          }}
        >
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
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
        </div>
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
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Want to customize this further? Work with a developer
            </h2>
            <p className="mt-4 text-neutral-600">
              Get hands-on help tailoring this site — message one of our
              developers directly on WhatsApp.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
            {[
              { name: "Prateek", phone: "919142250799" },
              { name: "Prakhar", phone: "919696427822" },
              { name: "Rudransh", phone: "916375908635" },
            ].map((dev) => (
              <div
                key={dev.name}
                className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-7 text-center"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white"
                  style={{ backgroundColor: accent }}
                >
                  {dev.name.slice(0, 1)}
                </span>
                <h3 className="mt-4 text-xl font-semibold">{dev.name}</h3>
                <a
                  href={`https://wa.me/${dev.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 rounded-full px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: accent }}
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Footer */}
      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-neutral-500 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {name}
          </span>
          <a href="/" className="transition-colors hover:text-neutral-800">
            Made with Catalyst
          </a>
        </div>
      </footer>
    </div>
  );
}
