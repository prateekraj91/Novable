import { headers } from "next/headers";
import type { Metadata } from "next";
import type { PublishedContent } from "@/components/site/PublishedSite";

/**
 * Absolute origin (https://host) for the current request.
 *
 * Open Graph consumers — WhatsApp, Facebook, X, LinkedIn — refuse relative
 * URLs, so og:url and og:image have to be fully qualified. We derive the origin
 * from the incoming request headers rather than an env var so the same code
 * works on localhost, preview deploys and production without configuration.
 * NEXT_PUBLIC_SITE_URL, if someone sets it later, wins.
 */
export async function requestOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");
  return `${proto}://${host}`;
}

function firstNonEmpty(...values: (string | null | undefined)[]): string {
  for (const v of values) {
    const t = (v ?? "").trim();
    if (t) return t;
  }
  return "";
}

/** Trim to a share-card friendly length, breaking on a word where possible. */
function clamp(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * Title / description / OG values for one published site, built from the
 * business data already embedded in the site's content blob.
 */
export function siteSeo(content: PublishedContent, slug: string, origin: string) {
  const biz = content._business ?? {};
  const name = firstNonEmpty(biz.name, content.hero_title, "Website");
  const city = firstNonEmpty(biz.city);

  const baseTitle = firstNonEmpty(content.meta_title, name, content.hero_title);
  const title =
    city && !baseTitle.toLowerCase().includes(city.toLowerCase())
      ? `${baseTitle} · ${city}`
      : baseTitle;

  const description = clamp(
    firstNonEmpty(
      content.meta_description,
      biz.description,
      content.hero_subtitle,
      content.about,
      city ? `${name} in ${city}.` : name
    ),
    200
  );

  const url = `${origin}/site/${slug}`;
  // A real photo of the business makes the best share card; when the owner
  // uploaded none we fall back to a generated card (see ./og/route.tsx).
  const photo = content._images?.[0];
  const image = photo || `${url}/og`;

  return { name, city, title, description, url, image };
}

/** Full Next.js Metadata for a published site page. */
export function siteMetadata(
  content: PublishedContent,
  slug: string,
  origin: string
): Metadata {
  const { name, title, description, url, image } = siteSeo(content, slug, origin);

  return {
    metadataBase: new URL(origin),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: name,
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
