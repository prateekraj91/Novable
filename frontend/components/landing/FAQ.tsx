"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How does the AI actually build my website?",
    a: "You answer five quick questions — business name, type, location, services, and phone. The Website Agent turns those into a full site with hero copy, services, FAQs, testimonials, SEO metadata, and branding, generated in about two minutes.",
  },
  {
    q: "What do all the agents actually do?",
    a: "Each agent owns one growth job: the Website Agent builds your site, the Google Business and Review agents handle local search and reputation, the WhatsApp and Social agents drive repeat business, the Analytics agent measures impact, and the Account Manager ties it all together.",
  },
  {
    q: "Is it really autonomous, or do I have to approve things?",
    a: "You stay in control. Agents draft and recommend — replies, campaigns, posts — and you approve before anything goes live. As you build trust, you can hand more over to run on autopilot.",
  },
  {
    q: "How do WhatsApp and Google integrations work?",
    a: "Today Novable writes everything for you — ready-to-send WhatsApp campaigns, social posts, and drafted replies to reviews you paste in — and you post them. Direct connections that publish automatically are coming soon.",
  },
  {
    q: "What does pricing look like?",
    a: "It's a one-time ₹500 — no subscription, no lock-in. That covers your AI website, live publishing, and every growth agent. Everything we build for you is yours to keep.",
  },
  {
    q: "Do I own my site and content?",
    a: "Yes. Your site, content, and customer data are yours. You can export them or take them with you whenever you like.",
  },
];

export default function FAQ() {
  // One panel open at a time; the first is open on arrival.
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="nb-edge" style={{ paddingBottom: 104 }}>
      <span className="nb-kicker">FAQ</span>

      <h2 className="nb-h2">Common questions.</h2>

      <div
        style={{
          marginTop: 28,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {faqs.map((qa, i) => {
          const open = openIndex === i;
          return (
            <div key={qa.q} className="card elev-sm" style={{ padding: "20px 24px" }}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : i)}
                aria-expanded={open}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  width: "100%",
                  padding: 0,
                  margin: 0,
                  border: 0,
                  background: "none",
                  color: "inherit",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 400,
                    fontSize: 18,
                  }}
                >
                  {qa.q}
                </span>
                <span
                  aria-hidden
                  style={{ fontSize: 20, color: "var(--color-accent)", flex: "none" }}
                >
                  {open ? "–" : "+"}
                </span>
              </button>

              {open && (
                <p
                  className="nb-quiet"
                  style={{
                    margin: "14px 0 0",
                    fontSize: 15,
                    lineHeight: 1.6,
                    maxWidth: "70ch",
                  }}
                >
                  {qa.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
