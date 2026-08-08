"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

/**
 * Shows a QR code for `origin + path` — the published site's public URL — in a
 * small dialog the shop owner can screenshot, or download as a PNG to print.
 *
 * The code is generated in the browser by qrcode.react; nothing is sent to an
 * external QR service.
 */
export default function QrCodeButton({
  path,
  className = "",
  label = "QR code",
  /** Used for the downloaded file name. */
  title = "site",
}: {
  path: string;
  className?: string;
  label?: string;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  // window is only available in the browser, and the origin differs between
  // localhost and production, so resolve it on open rather than at render.
  useEffect(() => {
    if (open) setUrl(window.location.origin + path);
  }, [open, path]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const download = useCallback(() => {
    const canvas = wrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-qr.png`;
    a.click();
  }, [title]);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Website QR code"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(20, 16, 12, 0.55)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            className="card elev-md"
            onClick={(e) => e.stopPropagation()}
            style={{
              alignItems: "center",
              gap: 14,
              maxWidth: 340,
              padding: 26,
              textAlign: "center",
            }}
          >
            <h3 className="nb-h3" style={{ margin: 0 }}>
              Scan to open
            </h3>
            <p
              className="nb-quiet"
              style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}
            >
              Print this or stick it up in your shop — customers scan it with
              their phone camera to open your site.
            </p>

            <div
              ref={wrapRef}
              style={{
                background: "#ffffff",
                padding: 14,
                borderRadius: "var(--radius-md, 10px)",
                lineHeight: 0,
              }}
            >
              {url && (
                <QRCodeCanvas
                  value={url}
                  size={512}
                  level="M"
                  marginSize={0}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  style={{ width: 208, height: 208 }}
                />
              )}
            </div>

            <p
              className="nb-quiet"
              style={{
                margin: 0,
                fontSize: 12,
                wordBreak: "break-all",
              }}
            >
              {url}
            </p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={download}
              >
                Download PNG
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
