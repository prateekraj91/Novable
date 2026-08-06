"use client";

import { useState, type ReactNode } from "react";
import { runAgent } from "@/lib/agents";

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
    <section className="glass rounded-md p-6">
      <p className="eyebrow text-sage mb-2">{eyebrow}</p>
      <h2 className="font-display text-xl text-cream">{title}</h2>
      <p className="mt-1 text-sm text-muted">{desc}</p>
      <div className="mt-5">{children}</div>
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
      onClick={onClick}
      disabled={loading || disabled}
      className="rounded-sm bg-amber px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-base transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {loading ? "Working…" : children}
    </button>
  );
}

function ErrorNote({ msg }: { msg: string }) {
  return (
    <p className="mt-4 rounded-sm border border-amber/30 bg-amber/10 px-4 py-2.5 font-mono text-xs text-amber">
      {msg}
    </p>
  );
}

export default function AgentWorkforce({
  business,
}: {
  business: WorkforceBusiness;
}) {
  return (
    <div className="grid gap-6">
      <AskCatalyst business={business} />
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
        className="w-full rounded-sm border border-hairline bg-base/60 px-4 py-3 text-sm text-cream placeholder:text-muted/60 outline-none focus:border-amber"
      />
      <div className="mt-3 flex items-center gap-3">
        <RunButton loading={loading} disabled={!question.trim()} onClick={run}>
          Ask
        </RunButton>
        {!question.trim() && (
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted/70">
            Type a question first
          </span>
        )}
      </div>
      {error && <ErrorNote msg={error} />}
      {out && (
        <div className="mt-5 space-y-4">
          <p className="leading-relaxed text-cream">{out.answer}</p>
          {out.priority_actions?.length > 0 && (
            <div>
              <p className="eyebrow text-sage mb-2">Priority actions</p>
              <ul className="space-y-2">
                {out.priority_actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {out.alert && (
            <p className="rounded-sm border border-hairline bg-surface/40 px-4 py-3 text-sm text-muted">
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
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {posts.map((p, i) => (
            <div key={i} className="rounded-md border border-hairline bg-surface/40 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-sage">
                  {p.day} · {p.platform}
                </span>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted">
                  {p.post_type}
                </span>
              </div>
              <p className="mt-3 text-sm text-cream">{p.caption}</p>
              {p.hashtags?.length > 0 && (
                <p className="mt-2 text-xs text-amber">
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
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-sm border border-hairline bg-base/60 px-3 py-2.5 text-sm text-cream outline-none focus:border-amber"
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
        <div className="mt-5 space-y-4">
          {campaigns.map((c, i) => (
            <div key={i} className="rounded-md border border-hairline bg-surface/40 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-cream">{c.title}</h3>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-sage">
                  {c.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{c.message}</p>
              <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted">
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
        className="w-full rounded-sm border border-hairline bg-base/60 px-4 py-3 text-sm text-cream placeholder:text-muted/60 outline-none focus:border-amber"
      />
      <div className="mt-3">
        <RunButton loading={loading} onClick={run}>
          Draft replies
        </RunButton>
      </div>
      {error && <ErrorNote msg={error} />}
      {out && (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-muted">
            {out.summary}{" "}
            <span className="text-sage">
              Avg {out.average_rating?.toFixed(1)}★
            </span>
          </p>
          {out.replies?.map((r, i) => (
            <div
              key={i}
              className={`rounded-md border p-4 ${
                r.is_negative
                  ? "border-amber/40 bg-amber/5"
                  : "border-hairline bg-surface/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                  {r.reviewer_name}
                </span>
                {r.is_negative && (
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-amber">
                    Needs attention
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-cream">{r.suggested_reply}</p>
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {METRIC_FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted">
              {f.label}
            </span>
            <input
              type="number"
              value={metrics[f.key]}
              onChange={(e) =>
                setMetrics((m) => ({ ...m, [f.key]: Number(e.target.value) }))
              }
              className="mt-1 w-full rounded-sm border border-hairline bg-base/60 px-3 py-2 text-sm text-cream outline-none focus:border-amber"
            />
          </label>
        ))}
      </div>
      <div className="mt-4">
        <RunButton loading={loading} onClick={run}>
          Generate report
        </RunButton>
      </div>
      {error && <ErrorNote msg={error} />}
      {out && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted">
                Visitor growth
              </p>
              <p className="text-lg text-cream">
                {out.visitor_growth_percentage}%{" "}
                <span className="text-sage">{out.trend_direction}</span>
              </p>
            </div>
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted">
                Top channel
              </p>
              <p className="text-lg text-cream">{out.best_performing_channel}</p>
            </div>
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted">
                Projected revenue
              </p>
              <p className="text-lg text-cream">
                {out.currency} {out.projected_revenue?.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="leading-relaxed text-cream">{out.weekly_summary}</p>
          {out.top_recommendations?.length > 0 && (
            <div>
              <p className="eyebrow text-sage mb-2">Recommendations</p>
              <ul className="space-y-2">
                {out.top_recommendations.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
