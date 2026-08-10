"use client";

import { useState } from "react";
import { runAgent } from "@/lib/agents";
import type { WorkforceBusiness } from "./AgentWorkforce";

type LocalSeoOutput = {
  gbp_post: string;
  local_keywords: string[];
  suggested_meta_description: string;
  maps_optimization_tip: string;
};

export default function LocalSeoAgent({ business }: { business: WorkforceBusiness }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<LocalSeoOutput | null>(null);

  async function run() {
    setLoading(true);
    setError("");
    try {
      const res = await runAgent<{
        answer?: string;
        priority_actions?: string[];
        alert?: string;
      }>(
        "/chat",
        {
          business_name: business.name,
          category: business.category,
          city: business.city,
          question: `Generate a Google Business Profile update post, top local search keywords, and a Google Maps ranking optimization tip for ${business.name} in ${business.city}.`,
          context: `Local SEO and Google Maps optimization for ${business.name} (${business.category}) in ${business.city}.`,
        },
        { agentType: "chat", businessId: business.id }
      );

      // Structure response fallback cleanly
      setOut({
        gbp_post: res.answer || `Exciting news from ${business.name}! Visit us in ${business.city} today for top-quality ${business.category}.`,
        local_keywords: res.priority_actions || [`Best ${business.category} in ${business.city}`, `${business.category} near me`, `${business.name} ${business.city}`],
        suggested_meta_description: `Looking for the best ${business.category} in ${business.city}? Visit ${business.name}. High quality, top rated, and customer recommended.`,
        maps_optimization_tip: res.alert || "Upload 3 new high-resolution photos of your storefront & products to Google Business Profile weekly to boost your Maps ranking.",
      });
    } catch {
      setError("Couldn't run Local SEO agent. Check backend connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card elev-sm" style={{ padding: 26, marginTop: 16 }}>
      <span className="nb-kicker" style={{ color: "var(--color-accent-700)" }}>
        Local SEO & Google Maps
      </span>
      <h2 className="nb-h3">Google Maps Auto-Pilot Agent</h2>
      <p className="nb-quiet" style={{ margin: "6px 0 0", fontSize: 14 }}>
        Generate weekly Google Business Profile posts & top local keywords to rank #1 on Google Maps.
      </p>

      <div style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="btn btn-primary"
          style={{ padding: "11px 22px" }}
        >
          {loading ? "Optimizing…" : "📍 Generate Local SEO Update"}
        </button>
      </div>

      {error && (
        <p role="alert" className="nb-note nb-note-error" style={{ marginTop: 14 }}>
          {error}
        </p>
      )}

      {out && (
        <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
          <div
            style={{
              padding: 18,
              borderRadius: "var(--radius-lg)",
              background: "var(--color-bg)",
              border: "1px solid var(--color-divider)",
            }}
          >
            <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent-700)", fontWeight: 700 }}>
              Google Business Profile Post
            </span>
            <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.6 }}>
              {out.gbp_post}
            </p>
          </div>

          <div
            style={{
              padding: 18,
              borderRadius: "var(--radius-lg)",
              background: "var(--color-bg)",
              border: "1px solid var(--color-divider)",
            }}
          >
            <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent-2-700)", fontWeight: 700 }}>
              Top Local Search Keywords
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {out.local_keywords.map((kw, i) => (
                <span key={i} className="tag tag-accent-2" style={{ fontSize: 12 }}>
                  🔍 {kw}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: 18,
              borderRadius: "var(--radius-lg)",
              background: "var(--color-accent-100)",
              border: "1px solid var(--color-accent-300)",
            }}
          >
            <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent-800)", fontWeight: 700 }}>
              💡 Google Maps Ranking Tip
            </span>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--color-accent-900)" }}>
              {out.maps_optimization_tip}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
