"use client";

import { SITE_TEMPLATE_OPTIONS } from "@/components/site/themes";

type Wireframe = (typeof SITE_TEMPLATE_OPTIONS)[number]["wireframe"];
type Swatch = (typeof SITE_TEMPLATE_OPTIONS)[number]["swatch"];

/**
 * A tiny abstract of each layout — the point of the picker is that these are
 * different arrangements, not different colour schemes, so the miniature has
 * to show shape rather than a paint chip.
 */
function Miniature({
  kind,
  swatch,
  font,
}: {
  kind: Wireframe;
  swatch: Swatch;
  font: string;
}) {
  const bar = (w: string | number, h = 4, color = swatch.ink, opacity = 0.75) => ({
    width: typeof w === "number" ? `${w}%` : w,
    height: h,
    borderRadius: 2,
    background: color,
    opacity,
  });

  return (
    <span
      aria-hidden="true"
      style={{
        display: "block",
        height: 92,
        padding: 10,
        borderRadius: 8,
        background: swatch.bg,
        border: "1px solid var(--color-divider)",
        overflow: "hidden",
      }}
    >
      {kind === "split" && (
        <span style={{ display: "flex", gap: 8, height: "100%" }}>
          <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ color: swatch.ink, fontFamily: font, fontSize: 13, lineHeight: 1 }}>
              Aa
            </span>
            <span style={bar(90, 3)} />
            <span style={bar(70, 3)} />
            <span style={{ ...bar(36, 7, swatch.accent, 1), borderRadius: 999, marginTop: 2 }} />
          </span>
          <span
            style={{
              width: "38%",
              borderRadius: 4,
              background: swatch.accent,
              opacity: 0.55,
            }}
          />
        </span>
      )}

      {kind === "centered" && (
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
            height: "100%",
          }}
        >
          <span style={{ color: swatch.ink, fontFamily: font, fontSize: 15, lineHeight: 1 }}>
            Aa
          </span>
          <span style={bar(60, 3)} />
          <span style={{ ...bar(30, 6, swatch.accent, 1), marginBottom: 2 }} />
          <span
            style={{
              width: "100%",
              flex: 1,
              borderRadius: 3,
              background: swatch.accent,
              opacity: 0.5,
            }}
          />
        </span>
      )}

      {kind === "overlay" && (
        <span
          style={{
            position: "relative",
            display: "block",
            height: "100%",
            borderRadius: 4,
            background: `linear-gradient(140deg, ${swatch.accent}, ${swatch.bg} 85%)`,
            overflow: "hidden",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 8,
              bottom: 8,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              width: "70%",
            }}
          >
            <span style={{ color: swatch.ink, fontFamily: font, fontSize: 14, lineHeight: 1 }}>
              Aa
            </span>
            <span style={bar("100%", 3, swatch.ink, 0.6)} />
          </span>
        </span>
      )}

      {kind === "column" && (
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            height: "100%",
            paddingInline: "22%",
          }}
        >
          <span style={{ color: swatch.ink, fontFamily: font, fontSize: 12, lineHeight: 1 }}>
            Aa
          </span>
          <span style={bar(100, 2, swatch.ink, 0.45)} />
          <span style={bar(100, 2, swatch.ink, 0.45)} />
          <span style={bar(60, 2, swatch.ink, 0.45)} />
          <span style={{ height: 1, background: swatch.ink, opacity: 0.18 }} />
          <span style={bar(100, 2, swatch.ink, 0.45)} />
          <span style={bar(45, 2, swatch.ink, 0.45)} />
        </span>
      )}
    </span>
  );
}

/**
 * Layout chooser for the generated site. "Classic" is preselected and is the
 * layout every existing site already uses, so leaving this alone changes
 * nothing.
 */
export default function ThemePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (template: string) => void;
}) {
  return (
    <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
      <legend className="nb-info-label" style={{ padding: 0 }}>
        Site layout
      </legend>
      <p
        className="nb-quiet"
        style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.5 }}
      >
        These are four different page structures, not just colour schemes — the
        hero, the sections and the order all change. Your brand colour still
        comes from your photos and description.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 12,
          marginTop: 14,
        }}
      >
        {SITE_TEMPLATE_OPTIONS.map((opt) => {
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
              <Miniature
                kind={opt.wireframe}
                swatch={opt.swatch}
                font={opt.sampleFont}
              />

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
