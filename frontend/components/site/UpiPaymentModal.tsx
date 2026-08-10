"use client";

import { QRCodeSVG } from "qrcode.react";

export default function UpiPaymentModal({
  isOpen,
  onClose,
  upiId,
  businessName,
  itemName,
  amount,
}: {
  isOpen: boolean;
  onClose: () => void;
  upiId?: string;
  businessName: string;
  itemName: string;
  amount?: string | number;
}) {
  if (!isOpen) return null;

  const targetUpi = upiId || "paytmqr2810050501011000@paytm";
  const numAmount = amount ? String(amount).replace(/[^0-9.]/g, "") : "";
  
  const upiLink = `upi://pay?pa=${targetUpi}&pn=${encodeURIComponent(
    businessName
  )}&tn=${encodeURIComponent(itemName)}${numAmount ? `&am=${numAmount}&cu=INR` : ""}`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#FAF7F2",
          borderRadius: "var(--radius-lg, 24px)",
          padding: 28,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          position: "relative",
          border: "1px solid var(--color-divider, #e2d7c5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: 0,
            fontSize: 20,
            cursor: "pointer",
            color: "#666",
          }}
        >
          ✕
        </button>

        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-accent, #c67139)",
            fontWeight: 700,
            display: "block",
            marginBottom: 6,
          }}
        >
          Instant 0-Fee UPI Payment
        </span>

        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-heading, serif)",
            fontSize: 22,
            color: "#201e1d",
          }}
        >
          {businessName}
        </h3>

        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#666" }}>
          {itemName} {numAmount ? `— ₹${numAmount}` : ""}
        </p>

        {/* QR Code */}
        <div
          style={{
            margin: "20px auto 16px",
            padding: 16,
            background: "#FFFFFF",
            borderRadius: 16,
            display: "inline-block",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <QRCodeSVG value={upiLink} size={170} />
        </div>

        <p style={{ fontSize: 12, color: "#777", margin: "0 0 16px" }}>
          Scan with <strong>Google Pay, PhonePe, Paytm, or BHIM</strong>
        </p>

        <a
          href={upiLink}
          className="btn btn-primary"
          style={{
            display: "block",
            width: "100%",
            padding: "12px 20px",
            background: "#25D366",
            color: "#fff",
            borderRadius: 999,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          ⚡ Pay via UPI App
        </a>
      </div>
    </div>
  );
}
