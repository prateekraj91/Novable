"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { API_BASE_URL } from "@/lib/config";
import type { GeneratedWebsite } from "@/types/website";

const SUGGESTIONS = [
  "Make the hero headline punchier",
  "Use a warmer, friendlier tone",
  "Change the brand colour to deep blue",
  "Add more detail to the About section",
];

export default function SiteEditManager({
  slug,
  initialContent,
}: {
  slug: string;
  initialContent: GeneratedWebsite;
}) {
  const [content, setContent] = useState<GeneratedWebsite>(initialContent);
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewKey, setPreviewKey] = useState(0);

  async function apply() {
    if (!instruction.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/edit-website`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: content, instruction }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const updated = (await res.json()) as GeneratedWebsite;

      // Save, preserving the stored _business / _images extras.
      const supabase = createClient();
      const { data: row } = await supabase
        .from("sites")
        .select("content")
        .eq("slug", slug)
        .maybeSingle();
      const prev = (row?.content ?? {}) as Record<string, unknown>;
      const merged = { ...prev, ...updated };
      const { error: upErr } = await supabase
        .from("sites")
        .update({ content: merged, updated_at: new Date().toISOString() })
        .eq("slug", slug);
      if (upErr) throw upErr;

      setContent(updated);
      setInstruction("");
      setPreviewKey((k) => k + 1); // reload the preview iframe
    } catch {
      setError("Couldn't apply that edit. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="nb-edit-grid">
      {/* Editor */}
      <div className="card elev-sm" style={{ padding: 26 }}>
        <span className="nb-kicker">Refine with AI</span>
        <h2 className="nb-h3">Describe a change</h2>
        <p className="nb-quiet" style={{ margin: "6px 0 0", fontSize: 14 }}>
          Tell Novable what to change and it rewrites your site.
        </p>

        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          rows={3}
          placeholder="e.g. Make it more premium and change the colour to navy"
          className="input"
          style={{ marginTop: 18, background: "var(--color-bg)" }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setInstruction(s)}
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: "5px 12px" }}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={apply}
          disabled={loading || !instruction.trim()}
          className="btn btn-primary btn-block"
          style={{ marginTop: 18, padding: 12 }}
        >
          {loading ? "Applying…" : "Apply change"}
        </button>

        {error && (
          <p role="alert" className="nb-note nb-note-error">
            {error}
          </p>
        )}

        <a
          href={`/site/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-block"
          style={{ marginTop: 12 }}
        >
          Open live site →
        </a>
      </div>

      {/* Live preview — the customer's own site, rendered in its own design */}
      <div
        style={{
          overflow: "hidden",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-divider)",
          background: "#fff",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <iframe
          key={previewKey}
          src={`/site/${slug}`}
          title="Live preview"
          style={{ height: "70vh", width: "100%", border: 0, display: "block" }}
        />
      </div>
    </div>
  );
}
