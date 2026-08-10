"use client";

import { useState } from "react";
import { runAgent } from "@/lib/agents";
import type { WorkforceBusiness } from "./AgentWorkforce";

type ReengagementOutput = {
  headline: string;
  whatsapp_message: string;
  suggested_discount: string;
  recommended_send_time: string;
};

export default function CustomerReengagementCrm({ business }: { business: WorkforceBusiness }) {
  const [daysInactive, setDaysInactive] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<ReengagementOutput | null>(null);

  async function run() {
    setLoading(true);
    setError("");
    try {
      const res = await runAgent<{ campaigns: { title: string; message: string; target_audience: string; status: string }[] }>(
        "/generate-campaign",
        {
          business_name: business.name,
          category: business.category,
          city: business.city,
          phone: business.phone,
          campaign_type: `Re-engagement (${daysInactive} days inactive)`,
        },
        { agentType: "campaign", businessId: business.id }
      );

      const campaign = res.campaigns?.[0];
      setOut({
        headline: campaign?.title || `${daysInactive}-Day Customer Win-Back Offer`,
        whatsapp_message: campaign?.message || `Hi! We miss you at ${business.name}. Enjoy 15% off your next visit in ${business.city} this weekend!`,
        suggested_discount: "15% OFF / Special Gift",
        recommended_send_time: "Friday evening (6 PM - 8 PM)",
      });
    } catch {
      setError("Couldn't run CRM agent. Check backend connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card elev-sm" style={{ padding: 26, marginTop: 16 }}>
      <span className="nb-kicker" style={{ color: "var(--color-accent-2-700)" }}>
        Autonomous CRM
      </span>
      <h2 className="nb-h3">Customer Re-engagement Engine</h2>
      <p className="nb-quiet" style={{ margin: "6px 0 0", fontSize: 14 }}>
        Bring back inactive customers with automated 30-day WhatsApp win-back campaigns.
      </p>

      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          <span>Customer Inactive Window:</span>
          <select
            value={daysInactive}
            onChange={(e) => setDaysInactive(Number(e.target.value))}
            className="input"
            style={{ width: "auto", minHeight: 40, background: "var(--color-bg)" }}
          >
            <option value={15}>15 Days Inactive</option>
            <option value={30}>30 Days Inactive</option>
            <option value={60}>60 Days Inactive</option>
            <option value={90}>90 Days Inactive</option>
          </select>
        </label>

        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="btn btn-primary"
          style={{ padding: "10px 20px" }}
        >
          {loading ? "Generating…" : "🔄 Generate Win-Back Campaign"}
        </button>
      </div>

      {error && (
        <p role="alert" className="nb-note nb-note-error" style={{ marginTop: 14 }}>
          {error}
        </p>
      )}

      {out && (
        <div style={{ marginTop: 20, display: "grid", gap: 14 }}>
          <div
            style={{
              padding: 20,
              borderRadius: "var(--radius-lg)",
              background: "var(--color-bg)",
              border: "1px solid var(--color-divider)",
            }}
          >
            <div className="nb-row" style={{ gap: 8 }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: 18 }}>
                {out.headline}
              </h3>
              <span className="tag tag-accent-2">{out.suggested_discount}</span>
            </div>

            <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {out.whatsapp_message}
            </p>

            <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "var(--color-accent-700)" }}>
                ⏰ Recommended Send Time: <strong>{out.recommended_send_time}</strong>
              </span>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(out.whatsapp_message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: 12, padding: "6px 14px", marginLeft: "auto" }}
              >
                Send via WhatsApp →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
