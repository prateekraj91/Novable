"use client";

import { useState } from "react";

// Copies `origin + path` (e.g. the full public URL of a /site/[slug] page).
export default function CopyButton({
  path,
  className = "",
  label = "Copy link",
}: {
  path: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.origin + path);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <button onClick={copy} className={className}>
      {copied ? "Copied!" : label}
    </button>
  );
}
