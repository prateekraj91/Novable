// Novable mark. Cream by default; if placed inside a `group`, it swaps to
// amber on hover. Extracted + recoloured from the source logo.
export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-cream.png"
        alt="Novable"
        className="h-full w-full object-contain transition-opacity duration-300 group-hover:opacity-0"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-amber.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </span>
  );
}
