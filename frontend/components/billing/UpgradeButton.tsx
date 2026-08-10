import { standardPlanLink } from "@/lib/contact";

/**
 * The one button that turns a free user into a paying one: it opens WhatsApp
 * with the Standard plan message pre-filled. Every lock in the app uses it, so
 * the upgrade path is identical wherever someone hits a wall.
 */
export default function UpgradeButton({
  label = "Upgrade on WhatsApp",
  className = "btn btn-primary",
  style,
}: {
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <a
      href={standardPlanLink()}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {label}
    </a>
  );
}
