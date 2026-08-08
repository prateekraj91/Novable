import type { ReactNode } from "react";

/**
 * One labelled control in the onboarding flow. Wraps the design system's
 * `.field` so every step gets the same label, error and hint treatment.
 */
export default function Field({
  label,
  htmlFor,
  error,
  hint,
  trailing,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  /** Optional control shown opposite the label (e.g. a character counter). */
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="field">
      {trailing ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <label htmlFor={htmlFor}>{label}</label>
          {trailing}
        </div>
      ) : (
        <label htmlFor={htmlFor}>{label}</label>
      )}

      {children}

      {error && (
        <p className="nb-field-error" role="alert">
          {error}
        </p>
      )}

      {hint && (
        <p className="nb-quiet" style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
    </div>
  );
}
