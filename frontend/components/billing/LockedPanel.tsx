import Link from "next/link";
import UpgradeButton from "@/components/billing/UpgradeButton";

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="4"
        y="10.5"
        width="16"
        height="10"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path
        d="M8 10.5V7.6a4 4 0 018 0v2.9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Stands in for a paid feature a free user can see but not run — the agents,
 * publishing. It names the feature rather than hiding it, so the wall reads as
 * an offer instead of a missing button.
 */
export default function LockedPanel({
  eyebrow,
  title,
  desc,
  cta = "Upgrade to unlock",
}: {
  eyebrow: string;
  title: string;
  desc: string;
  cta?: string;
}) {
  return (
    <section
      className="card elev-sm"
      style={{ padding: 26, background: "var(--color-surface)" }}
    >
      <div className="nb-row" style={{ gap: 12, alignItems: "flex-start" }}>
        <div style={{ minWidth: 0 }}>
          <span
            className="nb-kicker"
            style={{ color: "var(--color-accent-2-700)" }}
          >
            {eyebrow}
          </span>
          <h2 className="nb-h3" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--color-accent-700)", flex: "none" }}>
              <LockIcon />
            </span>
            {title}
          </h2>
          <p className="nb-quiet" style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.55 }}>
            {desc}
          </p>
        </div>
        <span className="tag tag-outline" style={{ flex: "none" }}>
          Standard
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          marginTop: 20,
        }}
      >
        <UpgradeButton label={cta} style={{ padding: "11px 22px" }} />
        <Link href="/pricing" className="btn btn-ghost">
          See what&apos;s included →
        </Link>
      </div>
    </section>
  );
}
