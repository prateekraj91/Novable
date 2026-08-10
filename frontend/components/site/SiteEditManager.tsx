"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import UpgradeButton from "@/components/billing/UpgradeButton";
import { API_BASE_URL } from "@/lib/config";
import type { GeneratedWebsite } from "@/types/website";

const SUGGESTIONS = [
  "Make the hero headline punchier",
  "Use a warmer, friendlier tone",
  "Change the brand colour to deep blue",
  "Add more detail to the About section",
];

const LANGUAGES = [
  { label: "🌐 Hindi", prompt: "Translate all website text and copy into natural, fluent Hindi." },
  { label: "🌐 Tamil", prompt: "Translate all website text and copy into natural, fluent Tamil." },
  { label: "🌐 Kannada", prompt: "Translate all website text and copy into natural, fluent Kannada." },
  { label: "🌐 Marathi", prompt: "Translate all website text and copy into natural, fluent Marathi." },
  { label: "🌐 Spanish", prompt: "Translate all website text and copy into natural, fluent Spanish." },
];

/**
 * Restyling with AI is included in the free plan; taking the result live is
 * not. Both states are shown side by side so the free plan feels like a real
 * plan with one thing left to unlock.
 */
export default function SiteEditManager({
  slug,
  initialContent,
  initialPublished,
  canPublish,
}: {
  slug: string;
  initialContent: GeneratedWebsite;
  initialPublished: boolean;
  canPublish: boolean;
}) {
  const [content, setContent] = useState<GeneratedWebsite>(initialContent);
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const [published, setPublished] = useState(initialPublished);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  async function togglePublished() {
    setPublishing(true);
    setPublishError("");

    try {
      const supabase = createClient();
      const { data, error: upErr } = await supabase
        .from("sites")
        .update({ published: !published, updated_at: new Date().toISOString() })
        .eq("slug", slug)
        .select("published")
        .single();

      if (upErr) throw upErr;

      // The database has the final say — a free account's row comes back
      // unpublished no matter what we asked for.
      if (data.published !== !published) {
        setPublishError(
          "Publishing is part of the Standard plan — upgrade to take this site live."
        );
        return;
      }

      setPublished(data.published);
    } catch {
      setPublishError("Couldn't update that. Try again.");
    } finally {
      setPublishing(false);
    }
  }

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

        <div style={{ marginTop: 14 }}>
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-accent-700)", fontWeight: 600, display: "block", marginBottom: 6 }}>
            Multi-Language Translator
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.label}
                type="button"
                onClick={() => setInstruction(lang.prompt)}
                className="btn btn-secondary"
                style={{ fontSize: 12, padding: "4px 10px" }}
              >
                {lang.label}
              </button>
            ))}
          </div>
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
          {published ? "Open live site →" : "Open private preview →"}
        </a>

        {/* Publishing */}
        <div
          style={{
            marginTop: 22,
            paddingTop: 20,
            borderTop: "1px solid var(--color-divider)",
          }}
        >
          <div className="nb-row" style={{ gap: 10 }}>
            <span className="nb-info-label">Live status</span>
            <span className={published ? "tag tag-accent-2" : "tag tag-outline"}>
              {published ? "Live" : "Not live"}
            </span>
          </div>

          {canPublish ? (
            <>
              <p className="nb-quiet" style={{ margin: "10px 0 0", fontSize: 13, lineHeight: 1.55 }}>
                {published
                  ? "Anyone with the link can see this site."
                  : "Only you can see this site right now."}
              </p>
              <button
                type="button"
                onClick={togglePublished}
                disabled={publishing}
                className="btn btn-secondary btn-block"
                style={{ marginTop: 12, padding: 11 }}
              >
                {publishing
                  ? "Saving…"
                  : published
                    ? "Unpublish"
                    : "Publish live"}
              </button>
            </>
          ) : (
            <>
              <p className="nb-quiet" style={{ margin: "10px 0 0", fontSize: 13, lineHeight: 1.55 }}>
                Your site is saved and only you can see it. Publishing it to a
                public link is part of the Standard plan — ₹500, once.
              </p>
              <UpgradeButton
                label="Upgrade to publish"
                className="btn btn-primary btn-block"
                style={{ marginTop: 12, padding: 11 }}
              />
            </>
          )}

          {publishError && (
            <p role="alert" className="nb-note nb-note-error">
              {publishError}
            </p>
          )}
        </div>
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
