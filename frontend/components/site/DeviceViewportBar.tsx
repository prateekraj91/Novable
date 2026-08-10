"use client";

export type ViewportMode = "desktop" | "tablet" | "mobile";

export default function DeviceViewportBar({
  mode,
  onModeChange,
}: {
  mode: ViewportMode;
  onModeChange: (m: ViewportMode) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 18px",
        background: "var(--color-surface, #ebddc5)",
        borderRadius: "var(--radius-md, 16px) var(--radius-md, 16px) 0 0",
        borderBottom: "1px solid var(--color-divider, rgba(32,30,29,0.16))",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--color-accent-2, #7a8a5e)",
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-text)",
          }}
        >
          Interactive Canvas
        </span>
      </div>

      <div
        style={{
          display: "inline-flex",
          background: "var(--color-bg, #f5ead8)",
          padding: 3,
          borderRadius: 999,
          border: "1px solid var(--color-divider)",
        }}
      >
        <button
          type="button"
          onClick={() => onModeChange("desktop")}
          style={{
            padding: "5px 14px",
            borderRadius: 999,
            border: 0,
            background: mode === "desktop" ? "var(--color-accent)" : "transparent",
            color: mode === "desktop" ? "var(--color-bg)" : "var(--color-text)",
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: mode === "desktop" ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          💻 Desktop
        </button>

        <button
          type="button"
          onClick={() => onModeChange("tablet")}
          style={{
            padding: "5px 14px",
            borderRadius: 999,
            border: 0,
            background: mode === "tablet" ? "var(--color-accent)" : "transparent",
            color: mode === "tablet" ? "var(--color-bg)" : "var(--color-text)",
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: mode === "tablet" ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          📱 Tablet
        </button>

        <button
          type="button"
          onClick={() => onModeChange("mobile")}
          style={{
            padding: "5px 14px",
            borderRadius: 999,
            border: 0,
            background: mode === "mobile" ? "var(--color-accent)" : "transparent",
            color: mode === "mobile" ? "var(--color-bg)" : "var(--color-text)",
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: mode === "mobile" ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          📱 Mobile
        </button>
      </div>
    </div>
  );
}
