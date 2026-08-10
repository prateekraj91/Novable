"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import UpgradeButton from "@/components/billing/UpgradeButton";
import DeviceViewportBar, { type ViewportMode } from "./DeviceViewportBar";
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

const THEMES = [
  { key: "classic", label: "Classic" },
  { key: "centered", label: "Centered" },
  { key: "editorial", label: "Editorial" },
  { key: "minimal", label: "Minimal" },
];

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
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    { role: "ai", text: "Welcome to Novable Studio! Tell me what you'd like to update on your site." },
  ]);

  async function updateTheme(themeKey: string) {
    try {
      const supabase = createClient();
      const { data: row } = await supabase
        .from("sites")
        .select("content")
        .eq("slug", slug)
        .maybeSingle();

      const prev = (row?.content ?? {}) as Record<string, unknown>;
      const merged = { ...prev, _theme: themeKey };

      const { error: upErr } = await supabase
        .from("sites")
        .update({ content: merged, updated_at: new Date().toISOString() })
        .eq("slug", slug);

      if (upErr) throw upErr;

      setContent((c) => ({ ...c, _theme: themeKey }));
      setPreviewKey((k) => k + 1);
      setChatHistory((prev) => [
        ...prev,
        { role: "user", text: `Switched template theme to ${themeKey}` },
        { role: "ai", text: `Updated layout template to ${themeKey}.` },
      ]);
    } catch {
      setError("Couldn't update theme.");
    }
  }

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
    const userPrompt = instruction;
    setLoading(true);
    setError("");
    setInstruction("");
    setChatHistory((prev) => [...prev, { role: "user", text: userPrompt }]);

    try {
      const res = await fetch(`${API_BASE_URL}/edit-website`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: content, instruction: userPrompt }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const updated = (await res.json()) as GeneratedWebsite;

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
      setPreviewKey((k) => k + 1);
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: `Applied changes for: "${userPrompt}"` },
      ]);
    } catch {
      setError("Couldn't apply that edit. Try again.");
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Error applying edit. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const canvasWidth = viewport === "mobile" ? 375 : viewport === "tablet" ? 768 : "100%";

  return (
    <div className="nb-edit-grid" style={{ gridTemplateColumns: "390px minmax(0, 1fr)" }}>
      {/* Left Control Panel: AI Assistant Workbench */}
      <div className="card elev-sm" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <span className="nb-kicker" style={{ color: "var(--color-accent-700)" }}>
            Novable Studio Workbench
          </span>
          <h2 className="nb-h3" style={{ fontSize: 20 }}>
            AI Co-pilot Chat
          </h2>
        </div>

        {/* AI Assistant Chat Log */}
        <div
          style={{
            maxHeight: 200,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: 12,
            background: "var(--color-bg)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-divider)",
          }}
        >
          {chatHistory.map((chat, i) => (
            <div
              key={i}
              style={{
                alignSelf: chat.role === "user" ? "flex-end" : "flex-start",
                background: chat.role === "user" ? "var(--color-accent)" : "var(--color-surface)",
                color: chat.role === "user" ? "var(--color-bg)" : "var(--color-text)",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                maxWidth: "88%",
              }}
            >
              {chat.text}
            </div>
          ))}
        </div>

        {/* Text Instruction Input */}
        <div>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            rows={2}
            placeholder="Describe a change (e.g. Make headline warmer, change color to navy...)"
            className="input"
            style={{ background: "var(--color-bg)" }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setInstruction(s)}
                className="btn btn-secondary"
                style={{ fontSize: 11, padding: "3px 8px" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Language Pills */}
        <div>
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-accent-700)", fontWeight: 600, display: "block", marginBottom: 4 }}>
            Multi-Language Translator
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.label}
                type="button"
                onClick={() => setInstruction(lang.prompt)}
                className="btn btn-secondary"
                style={{ fontSize: 11, padding: "3px 8px" }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Template Switcher */}
        <div>
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-accent-700)", fontWeight: 600, display: "block", marginBottom: 4 }}>
            Layout Template
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {THEMES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => updateTheme(t.key)}
                className="btn btn-secondary"
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  background: ((content as Record<string, unknown>)._theme || "classic") === t.key ? "var(--color-accent)" : undefined,
                  color: ((content as Record<string, unknown>)._theme || "classic") === t.key ? "var(--color-bg)" : undefined,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={apply}
          disabled={loading || !instruction.trim()}
          className="btn btn-primary btn-block"
          style={{ padding: 11 }}
        >
          {loading ? "Applying AI Edit…" : "Apply change"}
        </button>

        {error && <p role="alert" className="nb-note nb-note-error">{error}</p>}

        <a
          href={`/site/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-block"
          style={{ marginTop: 2 }}
        >
          {published ? "Open live site →" : "Open private preview →"}
        </a>

        {/* Publishing & Plan Status */}
        <div style={{ paddingTop: 14, borderTop: "1px solid var(--color-divider)" }}>
          <div className="nb-row" style={{ gap: 10 }}>
            <span className="nb-info-label">Live status</span>
            <span className={published ? "tag tag-accent-2" : "tag tag-outline"}>
              {published ? "Live" : "Not live"}
            </span>
          </div>

          {canPublish ? (
            <button
              type="button"
              onClick={togglePublished}
              disabled={publishing}
              className="btn btn-secondary btn-block"
              style={{ marginTop: 10, padding: 10 }}
            >
              {publishing ? "Saving…" : published ? "Unpublish" : "Publish live"}
            </button>
          ) : (
            <UpgradeButton
              label="Upgrade to publish"
              className="btn btn-primary btn-block"
              style={{ marginTop: 10, padding: 10 }}
            />
          )}

          {publishError && <p role="alert" className="nb-note nb-note-error">{publishError}</p>}
        </div>
      </div>

      {/* Right Sandbox Canvas Preview: Multi-Device Canvas */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-divider)",
          background: "var(--color-bg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Device Viewport Bar */}
        <DeviceViewportBar mode={viewport} onModeChange={setViewport} />

        {/* Sandbox Canvas Iframe Container */}
        <div
          style={{
            flex: 1,
            padding: viewport === "desktop" ? 0 : "24px 0",
            display: "flex",
            justifyContent: "center",
            background: viewport === "desktop" ? "#fff" : "color-mix(in srgb, var(--color-text) 6%, transparent)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              width: canvasWidth,
              maxWidth: "100%",
              height: "75vh",
              transition: "width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
              borderRadius: viewport === "desktop" ? 0 : 20,
              boxShadow: viewport === "desktop" ? "none" : "0 12px 32px rgba(0,0,0,0.18)",
              overflow: "hidden",
              border: viewport === "desktop" ? 0 : "8px solid #201e1d",
            }}
          >
            <iframe
              key={previewKey}
              src={`/site/${slug}`}
              title="Emergent Interactive Sandbox Preview"
              style={{ height: "100%", width: "100%", border: 0, display: "block" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
