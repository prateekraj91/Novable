import Link from "next/link";
import Logo from "@/components/ui/Logo";

/**
 * The Novable lockup for the Organic system: the ink mark plus the name in
 * the display face. Used across the app's own cream-ground pages (landing,
 * auth, dashboard). Hovering swaps the mark to terracotta.
 */
export default function BrandMark({
  size = 22,
  href = "/",
  className = "",
}: {
  size?: number;
  href?: string | null;
  className?: string;
}) {
  const inner = (
    <>
      <Logo variant="ink" className="shrink-0" />
      Novable
    </>
  );

  const style = {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    fontFamily: "var(--font-heading)",
    fontWeight: 400,
    fontSize: Math.round(size * 0.86),
    color: "var(--color-text)",
    textDecoration: "none",
    ["--nb-logo-size" as string]: `${size}px`,
  } as React.CSSProperties;

  const cls = `group nb-brand-lockup ${className}`;

  if (!href) {
    return (
      <span className={cls} style={style}>
        {inner}
      </span>
    );
  }

  return (
    <Link href={href} className={cls} style={style}>
      {inner}
    </Link>
  );
}
