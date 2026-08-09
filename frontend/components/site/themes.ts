/**
 * Template registry for generated sites.
 *
 * A template is a whole layout — hero shape, section order, grid structure —
 * along with its own palette and font pairing. The layouts themselves live in
 * ./templates; this file holds the key resolution, the picker's presentation
 * data, and Classic's design tokens.
 *
 * IMPORTANT — additive by design. `classic` holds the *exact* class strings the
 * published site has always used, so a site with no template stored renders
 * identical markup to before any of this existed.
 *
 * Every template draws only on the font families the root layout already loads
 * (Fraunces, Inter, Figtree, Caprasimo), so choosing one never costs an extra
 * webfont request.
 */

export type SiteThemeTokens = {
  /** Page background + base text colour. */
  page: string;
  /** Body font-family override; "" inherits the app default (Inter). */
  bodyFont: string;
  /** Heading font-family utility. */
  heading: string;
  /** Heading weight utility. */
  headingWeight: string;
  /** Sticky header surface. */
  header: string;
  /** Alternating section band. */
  band: string;
  /** Card surface (border + background). */
  card: string;
  /** Hairline border colour used on dividers, footer and the map frame. */
  hairline: string;
  /** Divider colour for the FAQ list. */
  divide: string;
  /** Outline/secondary button border. */
  outlineBorder: string;
  /** Outline/secondary button hover treatment. */
  outlineHover: string;
  /** Muted body copy. */
  muted: string;
  /** Standard body copy. */
  body: string;
  /** Strongest body copy — the About pull-quote and outline button label. */
  bodyStrong: string;
  /** Footer / de-emphasised copy. */
  faint: string;
  /** Footer link hover. */
  faintHover: string;
  /** Radius for pills: buttons and badges. */
  pill: string;
  /** Radius for the largest surfaces: hero image, CTA panel, map. */
  radiusXl: string;
  /** Radius for cards. */
  radiusLg: string;
  /** Radius for small chips. */
  radiusMd: string;
  /**
   * Accent used when the generator did not return a usable hex colour. The
   * business's own `primary_color` always wins when it is valid hex.
   */
  fallbackAccent: string;
};

const classic: SiteThemeTokens = {
  page: "bg-white text-neutral-900",
  bodyFont: "",
  heading: "font-display",
  headingWeight: "font-semibold",
  header: "border-b border-neutral-200/60 bg-white/80 backdrop-blur-xl",
  band: "bg-neutral-50/70",
  card: "border border-neutral-200 bg-white",
  hairline: "border-neutral-200",
  divide: "divide-neutral-200",
  outlineBorder: "border border-neutral-300",
  outlineHover: "transition-colors hover:border-neutral-900",
  muted: "text-neutral-600",
  body: "text-neutral-700",
  bodyStrong: "text-neutral-800",
  faint: "text-neutral-500",
  faintHover: "hover:text-neutral-800",
  pill: "rounded-full",
  radiusXl: "rounded-3xl",
  radiusLg: "rounded-2xl",
  radiusMd: "rounded-xl",
  fallbackAccent: "#16a34a",
};


/**
 * A template is a whole layout — hero shape, section order, grid structure —
 * together with its own palette and font pairing. `classic` is the original
 * design and the default.
 */
export type SiteTemplateKey = "classic" | "centered" | "editorial" | "minimal";

export const DEFAULT_SITE_TEMPLATE: SiteTemplateKey = "classic";

/**
 * Keys stored before templates existed, when the choice was palette-only.
 * Nothing in production uses them — the picker never shipped — but a stored
 * value must never fall off a cliff, so each maps to its nearest template.
 */
const TEMPLATE_ALIASES: Record<string, SiteTemplateKey> = {
  modern: "centered",
  elegant: "centered",
  bold: "editorial",
};

/**
 * Maps a stored key to a template. Anything missing or unrecognised —
 * including every site generated before templates existed — resolves to
 * `classic`, which is the original layout.
 */
export function resolveTemplateKey(key?: string | null): SiteTemplateKey {
  const k = (key ?? "").trim().toLowerCase();
  if (k === "classic" || k === "centered" || k === "editorial" || k === "minimal") {
    return k;
  }
  return TEMPLATE_ALIASES[k] ?? DEFAULT_SITE_TEMPLATE;
}

/**
 * Classic's tokens, kept as a table because ClassicTemplate's markup must stay
 * byte-identical and was written against these names. The other templates
 * carry their palette as local constants instead.
 */
export const SITE_THEMES = { classic } satisfies Record<string, SiteThemeTokens>;

/** Joins class names, dropping empty tokens so no stray whitespace is emitted. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** Presentation data for the onboarding template picker. */
export const SITE_TEMPLATE_OPTIONS: {
  key: SiteTemplateKey;
  label: string;
  /** What the layout actually does — the reason to pick it. */
  hint: string;
  /** Which miniature the picker draws. */
  wireframe: "split" | "centered" | "overlay" | "column";
  /** Miniature palette: page bg, ink, accent. */
  swatch: { bg: string; ink: string; accent: string };
  /** CSS font-family for the miniature's sample text. */
  sampleFont: string;
}[] = [
  {
    key: "classic",
    label: "Classic",
    hint: "Photo beside the headline, service cards, tinted bands. The Novable default.",
    wireframe: "split",
    swatch: { bg: "#ffffff", ink: "#171717", accent: "#16a34a" },
    sampleFont: "var(--font-fraunces), serif",
  },
  {
    key: "centered",
    label: "Centered",
    hint: "Big centred headline, full-width banner photo, services as numbered rows.",
    wireframe: "centered",
    swatch: { bg: "#fdfbf7", ink: "#1c1917", accent: "#b45309" },
    sampleFont: "var(--font-fraunces), serif",
  },
  {
    key: "editorial",
    label: "Editorial",
    hint: "Full-screen photo with the headline over it, alternating sections, dark.",
    wireframe: "overlay",
    swatch: { bg: "#0b0b0c", ink: "#fafafa", accent: "#e11d48" },
    sampleFont: "var(--font-caprasimo), cursive",
  },
  {
    key: "minimal",
    label: "Minimal",
    hint: "One narrow column, hairlines, lots of white space. No photos up top.",
    wireframe: "column",
    swatch: { bg: "#ffffff", ink: "#171717", accent: "#171717" },
    sampleFont: "var(--font-inter), sans-serif",
  },
];
