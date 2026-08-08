// Novable mark. Two colourways, each a flat recolour of the same silhouette:
//   "cream" — for the dark app shell (legal pages, published-site chrome)
//   "ink"   — for the Organic system's cream ground (landing, auth, dashboard)
// If placed inside a `group`, the mark swaps to its accent on hover.
type Variant = "cream" | "ink";

const ASSETS: Record<Variant, { base: string; hover: string }> = {
  cream: { base: "/logo-cream.png", hover: "/logo-amber.png" },
  ink: { base: "/logo-ink.png", hover: "/logo-terracotta.png" },
};

export default function Logo({
  className = "h-8 w-8",
  variant = "cream",
}: {
  className?: string;
  variant?: Variant;
}) {
  const { base, hover } = ASSETS[variant];

  return (
    <span className={`relative inline-block ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={base}
        alt="Novable"
        className="h-full w-full object-contain transition-opacity duration-300 group-hover:opacity-0"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hover}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </span>
  );
}
