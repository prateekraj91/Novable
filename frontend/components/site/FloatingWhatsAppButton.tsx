"use client";

import { siteBasics, WHATSAPP_PATH, type PublishedContent } from "./shared";
import { CONTACT_WHATSAPP } from "@/lib/contact";

export default function FloatingWhatsAppButton({
  content,
}: {
  content: PublishedContent;
}) {
  const { whatsapp, waMessage, name } = siteBasics(content, "#25D366");
  const targetPhone = whatsapp || CONTACT_WHATSAPP || "919142250799";

  const href = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
    waMessage || `Hi ${name}, I found your website and wanted to get in touch.`
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px 10px 12px",
        borderRadius: 999,
        background: "#25D366",
        color: "#ffffff",
        boxShadow: "0 4px 18px rgba(37, 211, 102, 0.45)",
        textDecoration: "none",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 14,
        fontWeight: 600,
        transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ flex: "none" }}
      >
        <path d={WHATSAPP_PATH} />
      </svg>
      <span>Chat on WhatsApp</span>
    </a>
  );
}
