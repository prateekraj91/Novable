"use client";

import { useState } from "react";

type Agent = {
  name: string;
  tagline: string;
  soon: boolean;
  bullets: string[];
};

const allAgents: Agent[] = [
  {
    name: "Website Agent",
    tagline: "Creates & maintains the site",
    soon: false,
    bullets: [
      "Generates full site from 5 inputs",
      "Updates services & pricing",
      "Improves on-page SEO",
      "Mobile-responsive layout",
    ],
  },
  {
    name: "Google Business Agent",
    tagline: "Maximises local search",
    soon: true,
    bullets: [
      "Optimises Google Business Profile",
      "Suggests photos & descriptions",
      "Improves category tags",
      "Tracks weekly ranking changes",
    ],
  },
  {
    name: "Review Agent",
    tagline: "Builds trust",
    soon: false,
    bullets: [
      "Monitors new Google reviews (soon)",
      "Drafts personalised replies",
      "Sends review-request campaigns (soon)",
      "Flags negative reviews for the owner",
    ],
  },
  {
    name: "WhatsApp Campaign Agent",
    tagline: "Drives repeat business",
    soon: false,
    bullets: [
      "Generates festival/seasonal offers",
      "Creates re-engagement campaigns",
      "Produces ready-to-send messages",
      "Schedules & tracks performance (soon)",
    ],
  },
  {
    name: "Social Media Agent",
    tagline: "Consistent brand presence",
    soon: false,
    bullets: [
      "Instagram & Facebook post drafts",
      "Captions & hashtag sets",
      "Weekly content calendars",
      "Adapts content per platform",
    ],
  },
  {
    name: "Analytics Agent",
    tagline: "Makes impact visible",
    soon: false,
    bullets: [
      "Tracks visitors & enquiries (soon)",
      "Measures WhatsApp click-through (soon)",
      "Estimates revenue influenced",
      "Weekly performance reports",
    ],
  },
  {
    name: "Account Manager Agent",
    tagline: "AI chief of staff",
    soon: false,
    bullets: [
      "Summarises performance across agents (soon)",
      "Identifies highest-priority actions",
      "Proactively alerts to risks (soon)",
      "Answers owner questions",
    ],
  },
  {
    name: "Marketplace Agent",
    tagline: "Connects businesses with freelancers",
    soon: true,
    bullets: [
      "Matches projects to freelancers",
      "Sends WhatsApp lead notifications",
      "Tracks project status",
      "Handles ratings & reviews",
    ],
  },
];

const filters = ["All", "Live", "Coming soon"] as const;
type Filter = (typeof filters)[number];

export default function Agents() {
  const [filter, setFilter] = useState<Filter>("All");

  const agents = allAgents.filter((a) => {
    if (filter === "Live") return !a.soon;
    if (filter === "Coming soon") return a.soon;
    return true;
  });

  return (
    <section id="agents" className="nb-edge" style={{ paddingBottom: 96 }}>
      <span className="nb-kicker">The AI Agents</span>

      <h2 className="nb-h2" style={{ maxWidth: "26ch" }}>
        A coordinated system of AI agents.
      </h2>

      <p className="nb-sub">
        Seven specialised growth agents plus a marketplace agent, sharing one
        memory layer.
      </p>

      <div className="seg" style={{ marginTop: 24, width: "fit-content" }}>
        {filters.map((f) => (
          <label key={f} className="seg-opt">
            <input
              type="radio"
              name="agentFilter"
              checked={filter === f}
              onChange={() => setFilter(f)}
            />
            {f}
          </label>
        ))}
      </div>

      <div className="nb-grid-4" style={{ marginTop: 24 }}>
        {agents.map((a) => (
          <div key={a.name} className="card elev-sm" style={{ padding: 22, gap: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 400,
                  fontSize: 17,
                  margin: 0,
                }}
              >
                {a.name}
              </h3>
              {a.soon && (
                <span className="tag tag-outline" style={{ flex: "none" }}>
                  Soon
                </span>
              )}
            </div>

            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 700,
                color: "var(--color-accent-700)",
              }}
            >
              {a.tagline}
            </p>

            <ul
              style={{
                margin: "4px 0 0",
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {a.bullets.map((b) => (
                <li
                  key={b}
                  className="nb-quiet"
                  style={{
                    fontSize: 13,
                    lineHeight: 1.4,
                    paddingLeft: 16,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 5,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--color-accent-2)",
                    }}
                  />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
