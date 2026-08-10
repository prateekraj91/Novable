import type { GeneratedWebsite } from "@/types/website";
import type { SiteTemplateKey } from "./themes";

export type Business = {
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
   * Template picked during onboarding. Absent on every site generated before
   * templates existed, which resolves to the original "classic" layout.
   */
  _theme?: SiteTemplateKey | string;
};

/** Every template receives exactly this. */
export type TemplateProps = { content: PublishedContent };

export function isHex(v: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim());
}

// tint helper: append alpha to a hex color (expects #rrggbb)
export function tint(hex: string, alpha: number) {
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
export function waNumber(phone?: string | null) {
  const digits = (phone || "").replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return digits.length >= 8 ? digits : null;
}

/**
 * The values every template derives from the same content blob. Keeping this in
 * one place means a new template can't accidentally disagree with the others
 * about, say, which image is the hero or how a phone number is normalised.
 */
export function siteBasics(content: PublishedContent, fallbackAccent: string) {
  const accent = isHex(content.primary_color || "")
    ? content.primary_color.trim()
    : fallbackAccent;
  const biz = content._business ?? {};
  const images = content._images ?? [];
  const name = (biz.name || (content as unknown as Record<string, string>).name || content.hero_title || "Website").trim();
  const hero = images[0];
  const gallery = images.slice(hero ? 1 : 0);
  const initials = (name || "?").slice(0, 2).toUpperCase();
  const whatsapp = waNumber(biz.phone);
  const mapAddress = [biz.address, biz.city].filter(Boolean).join(", ");
  const waMessage = `Hi ${
    name || "there"
  }, I found your website and wanted to get in touch.`;

  return {
    accent,
    biz,
    images,
    name,
    hero,
    gallery,
    initials,
    whatsapp,
    mapAddress,
    waMessage,
  };
}

/** Shared WhatsApp glyph so every template draws the same mark. */
export const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.585 0 11.946-5.359 11.949-11.945a11.87 11.87 0 0 0-3.497-8.4";
