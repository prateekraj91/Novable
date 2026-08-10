"use client";

import { useState, type ReactNode } from "react";
import { runAgent } from "@/lib/agents";
import QrPosterGenerator from "./QrPosterGenerator";
import LocalSeoAgent from "./LocalSeoAgent";
import CustomerReengagementCrm from "./CustomerReengagementCrm";

export type WorkforceBusiness = {
  id: string;
  name: string;
  category: string;
  city: string;
  target_audience: string;
  phone: string;
};

type AccountManagerOutput = {
  answer: string;
  priority_actions: string[];
  alert: string;
};
type SocialPost = {
  day: string;
  platform: string;
  caption: string;
  hashtags: string[];
  post_type: string;
};
type Campaign = {
  title: string;
  message: string;
  target_audience: string;
  scheduled_date: string;
  status: string;
};

function Panel({
  eyebrow,
  title,
  desc,
  children,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <section className="card elev-sm" style={{ padding: 26 }}>
      <span className="nb-kicker" style={{ color: "var(--color-accent-2-700)" }}>
        {eyebrow}
      </span>
      <h2 className="nb-h3">{title}</h2>
      <p className="nb-quiet" style={{ margin: "6px 0 0", fontSize: 14 }}>
        {desc}
      </p>
      <div style={{ marginTop: 20 }}>{children}</div>
    </section>
  );
}

function RunButton({
  loading,
  onClick,
  children,
  disabled = false,
}: {
  loading: boolean;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="btn btn-primary"
      style={{ padding: "11px 22px" }}
    >
      {loading && (
        <svg className="nb-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.75" strokeOpacity="0.3" />
          <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
        </svg>
      )}
      {loading ? "Working…" : children}
    </button>
  );
}

function ErrorNote({ msg }: { msg: string }) {
  return (
    <p role="alert" className="nb-note nb-note-error">
      {msg}
    </p>
  );
}

// Shared shape for the result cards each agent renders below its controls.
const RESULT_CARD: React.CSSProperties = {
  padding: 18,
  borderRadius: "var(--radius-lg)",
  background: "var(--color-bg)",
  border: "1px solid var(--color-divider)",
};

const META: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "color-mix(in srgb, var(--color-text) 60%, transparent)",
};

function Bullets({ items }: { items: string[] }) {
  return (
    <ul
      style={{
        margin: "10px 0 0",
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: 7,
      }}
    >
      {items.map((t, i) => (
        <li
          key={i}
          className="nb-quiet"
          style={{ fontSize: 14, lineHeight: 1.5, paddingLeft: 16, position: "relative" }}
        >
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 7,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--color-accent-2)",
            }}
          />
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function AgentWorkforce({
  business,
}: {
  business: WorkforceBusiness;
}) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <AskCatalyst business={business} />
      <QrPosterGenerator businessName={business.name} />
      <LocalSeoAgent business={business} />
      <CustomerReengagementCrm business={business} />
      <SocialAgent business={business} />
      <CampaignAgent business={business} />
      <ReviewAgent business={business} />
      <AnalyticsAgent business={business} />
    </div>
  );
}

/* ---------- Account Manager ---------- */
function AskCatalyst({ business }: { business: WorkforceBusiness }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<AccountManagerOutput | null>(null);

  async function run() {
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await runAgent<AccountManagerOutput>(
        "/chat",
        {
          business_name: business.name,
          category: business.category,
          city: business.city,
          question,
          context: `${business.name} is a ${business.category} in ${business.city}. Target audience: ${business.target_audience}.`,
        },
        { agentType: "chat", businessId: business.id }
      );
      setOut(res);
    } catch {
      setError("Couldn't reach the agent. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel
      eyebrow="Account Manager"
      title="Ask Novable"
      desc="Your AI chief of staff — ask anything about growing the business."
    >
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={2}
        placeholder="e.g. How do I get more weekend customers?"
        className="input"
        style={{ background: "var(--color-bg)" }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <RunButton loading={loading} disabled={!question.trim()} onClick={run}>
          Ask
        </RunButton>
        {!question.trim() && (
          <span className="nb-quiet" style={{ fontSize: 13 }}>
            Type a question first
          </span>
        )}
      </div>
      {error && <ErrorNote msg={error} />}
      {out && (
        <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65 }}>{out.answer}</p>
          {out.priority_actions?.length > 0 && (
            <div>
              <span className="nb-kicker" style={{ margin: 0 }}>
                Priority actions
              </span>
              <Bullets items={out.priority_actions} />
            </div>
          )}
          {out.alert && (
            <p className="nb-quiet" style={{ ...RESULT_CARD, margin: 0, fontSize: 14 }}>
              ⚠ {out.alert}
            </p>
          )}
        </div>
      )}
    </Panel>
  );
}

/* ---------- Social ---------- */
function SocialAgent({ business }: { business: WorkforceBusiness }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<SocialPost[] | null>(null);

  async function run() {
    setLoading(true);
    setError("");
    try {
      const res = await runAgent<{ posts: SocialPost[] }>(
        "/generate-social",
        {
          business_name: business.name,
          category: business.category,
          city: business.city,
          target_audience: business.target_audience,
        },
        { agentType: "social", businessId: business.id }
      );
      setPosts(res.posts);
    } catch {
      setError("Couldn't reach the agent. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel
      eyebrow="Social Media"
      title="Weekly content calendar"
      desc="Generate a week of ready-to-post social content."
    >
      <RunButton loading={loading} onClick={run}>
        Generate week
      </RunButton>
      {error && <ErrorNote msg={error} />}
      {posts && (
        <div className="nb-post-grid" style={{ marginTop: 20 }}>
          {posts.map((p, i) => (
            <div key={i} style={RESULT_CARD}>
              <div className="nb-row" style={{ gap: 8 }}>
                <span style={{ ...META, color: "var(--color-accent-2-700)", fontWeight: 700 }}>
                  {p.day} · {p.platform}
                </span>
                <span style={META}>{p.post_type}</span>
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.55 }}>
                {p.caption}
              </p>
              {p.hashtags?.length > 0 && (
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 13,
                    color: "var(--color-accent-700)",
                  }}
                >
                  {p.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ---------- Campaign ---------- */
const CAMPAIGN_TYPES = [
  "Festival offer",
  "Re-engagement",
  "New customer welcome",
  "Weekend promotion",
];

function CampaignAgent({ business }: { business: WorkforceBusiness }) {
  const [type, setType] = useState(CAMPAIGN_TYPES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);

  async function run() {
    setLoading(true);
    setError("");
    try {
      const res = await runAgent<{ campaigns: Campaign[] }>(
        "/generate-campaign",
        {
          business_name: business.name,
          category: business.category,
          city: business.city,
          phone: business.phone,
          campaign_type: type,
        },
        { agentType: "campaign", businessId: business.id }
      );
      setCampaigns(res.campaigns);
    } catch {
      setError("Couldn't reach the agent. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel
      eyebrow="WhatsApp Campaign"
      title="Generate a campaign"
      desc="Ready-to-send WhatsApp campaigns that drive repeat business."
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input"
          style={{ width: "auto", minHeight: 42, background: "var(--color-bg)" }}
        >
          {CAMPAIGN_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <RunButton loading={loading} onClick={run}>
          Generate
        </RunButton>
      </div>
      {error && <ErrorNote msg={error} />}
      {campaigns && (
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {campaigns.map((c, i) => (
            <div key={i} style={RESULT_CARD}>
              <div className="nb-row" style={{ gap: 8 }}>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-heading)",
                    fontWeight: 400,
                    fontSize: 17,
                  }}
                >
                  {c.title}
                </h3>
                <span className="tag tag-accent-2">{c.status}</span>
              </div>
              <p className="nb-quiet" style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.55 }}>
                {c.message}
              </p>
              <p style={{ ...META, margin: "12px 0 0" }}>
                {c.target_audience} · {c.scheduled_date}
              </p>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ---------- Reviews ---------- */
type ReviewReply = {
  reviewer_name: string;
  suggested_reply: string;
  is_negative: boolean;
};
type ReviewOutput = {
  replies: ReviewReply[];
  summary: string;
  average_rating: number;
};

function ReviewAgent({ business }: { business: WorkforceBusiness }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<ReviewOutput | null>(null);

  async function run() {
    const today = new Date().toISOString().slice(0, 10);
    const reviews = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line, i) => {
        const m = line.match(/^([1-5])\s*[-|:]\s*(.+)$/);
        return {
          reviewer_name: `Customer ${i + 1}`,
          rating: m ? parseInt(m[1], 10) : 5,
          review_text: m ? m[2] : line,
          date: today,
        };
      });
    if (reviews.length === 0) {
      setError("Add at least one review (one per line).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await runAgent<ReviewOutput>(
        "/generate-reviews",
        { reviews },
        { agentType: "reviews", businessId: business.id }
      );
      setOut(res);
    } catch {
      setError("Couldn't reach the agent. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel
      eyebrow="Review Agent"
      title="Draft review replies"
      desc="Paste customer reviews (one per line, optionally start with a 1–5 rating). Novable drafts personalised replies."
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder={"5 - Amazing service, loved it!\n2 - Waited too long for my order"}
        className="input"
        style={{ background: "var(--color-bg)" }}
      />
      <div style={{ marginTop: 12 }}>
        <RunButton loading={loading} onClick={run}>
          Draft replies
        </RunButton>
      </div>
      {error && <ErrorNote msg={error} />}
      {out && (
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          <p className="nb-quiet" style={{ margin: 0, fontSize: 14 }}>
            {out.summary}{" "}
            <span style={{ color: "var(--color-accent-2-700)", fontWeight: 700 }}>
              Avg {out.average_rating?.toFixed(1)}★
            </span>
          </p>
          {out.replies?.map((r, i) => (
            <div
              key={i}
              style={{
                ...RESULT_CARD,
                // Negative reviews are flagged with the accent tint, not a
                // separate alarm colour — the system has one warm voice.
                ...(r.is_negative
                  ? {
                      background: "var(--color-accent-100)",
                      border: "1px solid var(--color-accent-300)",
                    }
                  : null),
              }}
            >
              <div className="nb-row" style={{ gap: 8 }}>
                <span style={META}>{r.reviewer_name}</span>
                {r.is_negative && (
                  <span className="tag tag-outline">Needs attention</span>
                )}
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.55 }}>
                {r.suggested_reply}
              </p>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ---------- Analytics ---------- */
type AnalyticsReport = {
  weekly_summary: string;
  top_recommendations: string[];
  visitor_growth_percentage: number;
  trend_direction: "up" | "down" | "stable";
  best_performing_channel: string;
  projected_revenue: number;
  currency: string;
};

const METRIC_FIELDS: { key: string; label: string }[] = [
  { key: "visitors", label: "Visitors" },
  { key: "website_clicks", label: "Website clicks" },
  { key: "leads", label: "Leads" },
  { key: "conversions", label: "Conversions" },
  { key: "revenue", label: "Revenue (₹)" },
  { key: "average_rating", label: "Avg rating" },
  { key: "review_count", label: "Reviews" },
  { key: "social_engagement", label: "Social eng." },
];

function AnalyticsAgent({ business }: { business: WorkforceBusiness }) {
  const [metrics, setMetrics] = useState<Record<string, number>>({
    visitors: 820,
    website_clicks: 240,
    leads: 42,
    conversions: 18,
    revenue: 65000,
    average_rating: 4.4,
    review_count: 37,
    social_engagement: 310,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<AnalyticsReport | null>(null);

  async function run() {
    setLoading(true);
    setError("");
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    try {
      const res = await runAgent<AnalyticsReport>(
        "/generate-analytics",
        {
          business_name: business.name,
          category: business.category,
          city: business.city,
          start_date: start.toISOString().slice(0, 10),
          end_date: end.toISOString().slice(0, 10),
          metrics,
        },
        { agentType: "analytics", businessId: business.id }
      );
      setOut(res);
    } catch {
      setError("Couldn't reach the agent. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel
      eyebrow="Analytics Agent"
      title="Weekly performance report"
      desc="Enter this week's numbers and get a summary, trend, and recommendations."
    >
      <div className="nb-metric-grid">
        {METRIC_FIELDS.map((f) => (
          <label key={f.key} style={{ display: "block" }}>
            <span style={{ ...META, display: "block", marginBottom: 5 }}>
              {f.label}
            </span>
            <input
              type="number"
              value={metrics[f.key]}
              onChange={(e) =>
                setMetrics((m) => ({ ...m, [f.key]: Number(e.target.value) }))
              }
              className="input"
              style={{ background: "var(--color-bg)" }}
            />
          </label>
        ))}
      </div>
      <div style={{ marginTop: 18 }}>
        <RunButton loading={loading} onClick={run}>
          Generate report
        </RunButton>
      </div>
      {error && <ErrorNote msg={error} />}
      {out && (
        <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
            <div>
              <p style={{ ...META, margin: 0 }}>Visitor growth</p>
              <p style={{ margin: "5px 0 0", fontFamily: "var(--font-heading)", fontSize: 20 }}>
                {out.visitor_growth_percentage}%{" "}
                <span style={{ color: "var(--color-accent-2-700)", fontSize: 15 }}>
                  {out.trend_direction}
                </span>
              </p>
            </div>
            <div>
              <p style={{ ...META, margin: 0 }}>Top channel</p>
              <p style={{ margin: "5px 0 0", fontFamily: "var(--font-heading)", fontSize: 20 }}>
                {out.best_performing_channel}
              </p>
            </div>
            <div>
              <p style={{ ...META, margin: 0 }}>Projected revenue</p>
              <p style={{ margin: "5px 0 0", fontFamily: "var(--font-heading)", fontSize: 20 }}>
                {out.currency} {out.projected_revenue?.toLocaleString()}
              </p>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65 }}>
            {out.weekly_summary}
          </p>
          {out.top_recommendations?.length > 0 && (
            <div>
              <span className="nb-kicker" style={{ margin: 0 }}>
                Recommendations
              </span>
              <Bullets items={out.top_recommendations} />
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
