"use client";

import { SITE_THEME_OPTIONS } from "@/components/site/themes";

/**
 * Visual theme chooser for the generated site. "Classic" is preselected and is
 * the design every existing site already uses, so leaving this alone changes
 * nothing.
 */
export default function ThemePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (theme: string) => void;
}) {
  return (
    <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
      <legend className="nb-info-label" style={{ padding: 0 }}>
        Site theme
      </legend>
      <p
        className="nb-quiet"
        style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.5 }}
      >
        Pick the look of your website. Your brand colour still comes from your
        photos and description — this sets the typography and surfaces.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          marginTop: 14,
        }}
      >
        {SITE_THEME_OPTIONS.map((opt) => {
          const selected = value === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange(opt.key)}
              aria-pressed={selected}
              className="card"
              style={{
                textAlign: "left",
                padding: 12,
                gap: 10,
                cursor: "pointer",
                borderColor: selected
                  ? "var(--color-accent)"
                  : "var(--color-divider)",
                boxShadow: selected
                  ? "0 0 0 2px var(--color-accent-100)"
                  : "var(--shadow-sm)",
              }}
            >
              {/* Miniature of the theme: surface, heading, accent button */}
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  borderRadius: 8,
                  background: opt.swatch.bg,
                  border: "1px solid var(--color-divider)",
                  padding: "12px 10px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: opt.swatch.ink,
                    fontFamily: opt.sampleFont,
                    fontSize: 16,
                    lineHeight: 1.1,
                  }}
                >
                  Aa
                </span>
                <span
                  style={{
                    display: "block",
                    marginTop: 8,
                    width: 44,
                    height: 8,
                    borderRadius: 999,
                    background: opt.swatch.accent,
                  }}
                />
              </span>

              <span style={{ display: "block", fontSize: 14, fontWeight: 600 }}>
                {opt.label}
                {opt.key === "classic" && (
                  <span
                    className="nb-quiet"
                    style={{ fontWeight: 400, fontSize: 12 }}
                  >
                    {" "}
                    · default
                  </span>
                )}
              </span>
              <span
                className="nb-quiet"
                style={{ display: "block", fontSize: 12, lineHeight: 1.45 }}
              >
                {opt.hint}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
