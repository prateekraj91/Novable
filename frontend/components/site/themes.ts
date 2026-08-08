/**
 * Visual themes for generated sites.
 *
 * IMPORTANT — additive by design. `classic` holds the *exact* class strings the
 * published site has always used, so a site with no theme stored renders
 * identical markup to before themes existed. Every other theme is opt-in and
 * only reachable when the owner picked it during onboarding.
 *
 * Fonts are limited to the families already loaded by the root layout
 * (Fraunces, Inter, Figtree, Caprasimo) so a theme never costs an extra
 * webfont request.
 */

export type SiteThemeKey = "classic" | "modern" | "elegant" | "bold" | "minimal";

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

const modern: SiteThemeTokens = {
  page: "bg-white text-slate-900",
  bodyFont: "[font-family:var(--font-figtree)]",
  heading: "[font-family:var(--font-figtree)]",
  headingWeight: "font-bold",
  header: "border-b border-slate-200/70 bg-white/80 backdrop-blur-xl",
  band: "bg-slate-50",
  card: "border border-slate-200 bg-white",
  hairline: "border-slate-200",
  divide: "divide-slate-200",
  outlineBorder: "border border-slate-300",
  outlineHover: "transition-colors hover:border-slate-900",
  muted: "text-slate-600",
  body: "text-slate-700",
  bodyStrong: "text-slate-800",
  faint: "text-slate-500",
  faintHover: "hover:text-slate-900",
  pill: "rounded-lg",
  radiusXl: "rounded-2xl",
  radiusLg: "rounded-xl",
  radiusMd: "rounded-lg",
  fallbackAccent: "#2563eb",
};

const elegant: SiteThemeTokens = {
  page: "bg-[#fbf9f4] text-stone-900",
  bodyFont: "[font-family:var(--font-figtree)]",
  heading: "font-display",
  headingWeight: "font-medium",
  header: "border-b border-stone-200/70 bg-[#fbf9f4]/80 backdrop-blur-xl",
  band: "bg-[#f4efe6]",
  card: "border border-stone-200 bg-[#fffdf9]",
  hairline: "border-stone-200",
  divide: "divide-stone-200",
  outlineBorder: "border border-stone-300",
  outlineHover: "transition-colors hover:border-stone-900",
  muted: "text-stone-600",
  body: "text-stone-700",
  bodyStrong: "text-stone-800",
  faint: "text-stone-500",
  faintHover: "hover:text-stone-800",
  pill: "rounded-full",
  radiusXl: "rounded-3xl",
  radiusLg: "rounded-2xl",
  radiusMd: "rounded-xl",
  fallbackAccent: "#9a6a3c",
};

const bold: SiteThemeTokens = {
  page: "bg-neutral-950 text-neutral-50",
  bodyFont: "[font-family:var(--font-figtree)]",
  heading: "[font-family:var(--font-caprasimo)]",
  headingWeight: "font-normal",
  header: "border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl",
  band: "bg-neutral-900",
  card: "border border-white/10 bg-neutral-900",
  hairline: "border-white/10",
  divide: "divide-white/10",
  outlineBorder: "border border-white/20",
  outlineHover: "transition-colors hover:border-white",
  muted: "text-neutral-400",
  body: "text-neutral-300",
  bodyStrong: "text-neutral-100",
  faint: "text-neutral-500",
  faintHover: "hover:text-neutral-200",
  pill: "rounded-full",
  radiusXl: "rounded-3xl",
  radiusLg: "rounded-2xl",
  radiusMd: "rounded-xl",
  fallbackAccent: "#f59e0b",
};

const minimal: SiteThemeTokens = {
  page: "bg-white text-neutral-900",
  bodyFont: "",
  heading: "font-body",
  headingWeight: "font-medium",
  header: "border-b border-neutral-200 bg-white",
  band: "bg-neutral-50",
  card: "border border-neutral-200 bg-white",
  hairline: "border-neutral-200",
  divide: "divide-neutral-200",
  outlineBorder: "border border-neutral-200",
  outlineHover: "transition-colors hover:border-neutral-500",
  muted: "text-neutral-500",
  body: "text-neutral-600",
  bodyStrong: "text-neutral-900",
  faint: "text-neutral-400",
  faintHover: "hover:text-neutral-700",
  pill: "rounded-sm",
  radiusXl: "rounded-md",
  radiusLg: "rounded-md",
  radiusMd: "rounded-sm",
  fallbackAccent: "#111111",
};

export const SITE_THEMES: Record<SiteThemeKey, SiteThemeTokens> = {
  classic,
  modern,
  elegant,
  bold,
  minimal,
};

export const DEFAULT_SITE_THEME: SiteThemeKey = "classic";

/**
 * Maps a stored theme key to its tokens. Anything missing or unrecognised —
 * including every site generated before themes existed — falls back to
 * `classic`, which is the original design.
 */
export function resolveSiteTheme(key?: string | null): SiteThemeTokens {
  const k = (key ?? "").trim().toLowerCase();
  return SITE_THEMES[k as SiteThemeKey] ?? SITE_THEMES[DEFAULT_SITE_THEME];
}

/** Joins class names, dropping empty tokens so no stray whitespace is emitted. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** Presentation data for the onboarding theme picker. */
export const SITE_THEME_OPTIONS: {
  key: SiteThemeKey;
  label: string;
  hint: string;
  /** Small swatch used in the picker: page bg, ink, accent. */
  swatch: { bg: string; ink: string; accent: string };
  /** CSS font-family for the picker's sample text. */
  sampleFont: string;
}[] = [
  {
    key: "classic",
    label: "Classic",
    hint: "Warm serif headings on white. The Novable default.",
    swatch: { bg: "#ffffff", ink: "#171717", accent: "#16a34a" },
    sampleFont: "var(--font-fraunces), serif",
  },
  {
    key: "modern",
    label: "Modern",
    hint: "Crisp geometric sans, cool greys, soft corners.",
    swatch: { bg: "#f8fafc", ink: "#0f172a", accent: "#2563eb" },
    sampleFont: "var(--font-figtree), sans-serif",
  },
  {
    key: "elegant",
    label: "Elegant",
    hint: "Cream paper, light serif headings, generous space.",
    swatch: { bg: "#fbf9f4", ink: "#1c1917", accent: "#9a6a3c" },
    sampleFont: "var(--font-fraunces), serif",
  },
  {
    key: "bold",
    label: "Bold",
    hint: "Dark background, chunky display type, high contrast.",
    swatch: { bg: "#0a0a0a", ink: "#fafafa", accent: "#f59e0b" },
    sampleFont: "var(--font-caprasimo), cursive",
  },
  {
    key: "minimal",
    label: "Minimal",
    hint: "Quiet sans, square corners, almost no colour.",
    swatch: { bg: "#ffffff", ink: "#111111", accent: "#111111" },
    sampleFont: "var(--font-inter), sans-serif",
  },
];
