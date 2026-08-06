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
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Editor */}
      <div className="glass h-fit rounded-md p-6">
        <p className="eyebrow text-amber mb-2">Refine with AI</p>
        <h2 className="font-display text-xl text-cream">Describe a change</h2>
        <p className="mt-1 text-sm text-muted">
          Tell Novable what to change and it rewrites your site.
        </p>

        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          rows={3}
          placeholder="e.g. Make it more premium and change the colour to navy"
          className="mt-4 w-full rounded-sm border border-hairline bg-base/60 px-4 py-3 text-sm text-cream placeholder:text-muted/60 outline-none focus:border-amber"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setInstruction(s)}
              className="rounded-full border border-hairline px-3 py-1 text-xs text-muted transition hover:border-amber hover:text-amber"
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={apply}
          disabled={loading || !instruction.trim()}
          className="mt-4 w-full rounded-sm bg-amber px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-base transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? "Applying…" : "Apply change"}
        </button>

        {error && (
          <p className="mt-3 rounded-sm border border-amber/30 bg-amber/10 px-4 py-2.5 font-mono text-xs text-amber">
            {error}
          </p>
        )}

        <a
          href={`/site/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-center font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-amber"
        >
          Open live site →
        </a>
      </div>

      {/* Live preview */}
      <div className="overflow-hidden rounded-md border border-hairline bg-white">
        <iframe
          key={previewKey}
          src={`/site/${slug}`}
          title="Live preview"
          className="h-[70vh] w-full"
        />
      </div>
    </div>
  );
}
