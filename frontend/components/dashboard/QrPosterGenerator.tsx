"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrPosterGenerator({
  businessName,
}: {
  businessName: string;
}) {
  const [reviewUrl, setReviewUrl] = useState("https://g.page/r/your-google-business-review-link");
  const [headline, setHeadline] = useState("Enjoyed your visit? Scan & leave a 5★ Review!");
  const posterRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    window.print();
  }

  return (
    <section className="card elev-sm" style={{ padding: 26, marginTop: 16 }}>
      <span className="nb-kicker" style={{ color: "var(--color-accent-2-700)" }}>
        Growth Tool
      </span>
      <h2 className="nb-h3">Printable Google Review Poster</h2>
      <p className="nb-quiet" style={{ margin: "6px 0 0", fontSize: 14 }}>
        Generate a ready-to-print poster with a QR code for your shop counter to get more 5-star Google reviews.
      </p>

      <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
        <label style={{ display: "block" }}>
          <span style={{ fontSize: 12, display: "block", marginBottom: 5, color: "var(--color-text)" }}>
            Google Review URL / Business Link:
          </span>
          <input
            type="url"
            value={reviewUrl}
            onChange={(e) => setReviewUrl(e.target.value)}
            className="input"
            style={{ background: "var(--color-bg)" }}
          />
        </label>

        <label style={{ display: "block" }}>
          <span style={{ fontSize: 12, display: "block", marginBottom: 5, color: "var(--color-text)" }}>
            Poster Heading:
          </span>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="input"
            style={{ background: "var(--color-bg)" }}
          />
        </label>
      </div>

      {/* Poster Preview */}
      <div
        ref={posterRef}
        style={{
          marginTop: 24,
          padding: 32,
          borderRadius: "var(--radius-lg)",
          background: "#FAF7F2",
          border: "2px dashed var(--color-accent)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          maxWidth: 420,
          marginInline: "auto",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 22,
            color: "var(--color-accent-800)",
          }}
        >
          {businessName || "Your Business Name"}
        </div>

        <div style={{ color: "#E5A000", fontSize: 20, letterSpacing: 4 }}>
          ★★★★★
        </div>

        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--color-text)",
            maxWidth: 320,
            lineHeight: 1.4,
          }}
        >
          {headline}
        </div>

        {/* QR Code Container */}
        <div
          style={{
            padding: 16,
            background: "#FFFFFF",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            display: "inline-block",
            marginTop: 8,
          }}
        >
          <QRCodeSVG value={reviewUrl || "https://novable.vercel.app"} size={160} />
        </div>

        <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>
          Scan with your phone camera to leave a review!
        </p>
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button
          type="button"
          onClick={handlePrint}
          className="btn btn-primary"
          style={{ padding: "11px 24px" }}
        >
          🖨️ Print / Save Poster (PDF)
        </button>
      </div>
    </section>
  );
}
