"use client";

import { useEffect, useState } from "react";

const STEPS = [
  {
    id: 1,
    label: "1. Business Info",
    title: "Quantum Café",
    category: "Specialty Coffee & Bakery",
    badge: "Inputting Info",
    badgeColor: "tag-neutral",
  },
  {
    id: 2,
    label: "2. AI Generation",
    title: "Website Generated",
    subtitle: "Artisanal Coffee & Fresh Pastries",
    badge: "Generated",
    badgeColor: "tag-accent",
  },
  {
    id: 3,
    label: "3. AI Restyle",
    title: "Warm Studio Theme",
    subtitle: "Custom Palette & Typography Applied",
    badge: "Restyled",
    badgeColor: "tag-accent-2",
  },
  {
    id: 4,
    label: "4. Growth Agent",
    title: "Automated Marketing",
    insight: "WhatsApp Campaign: +42 customer leads this week. Review responder active.",
    badge: "Growing",
    badgeColor: "tag-accent",
  },
];

export default function HeroDemoVisual() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Respect reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches || isPaused) return;

    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 2400);

    return () => clearInterval(timer);
  }, [isPaused]);

  const currentStep = STEPS[activeStepIndex];

  return (
    <div
      className="card elev-lg"
      style={{
        padding: 0,
        overflow: "hidden",
        background: "var(--color-bg)",
        border: "1px solid var(--color-divider)",
        minHeight: 330,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-divider)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: activeStepIndex === 3 ? "var(--color-accent)" : "var(--color-accent-2)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 400,
              fontSize: 16,
            }}
          >
            {currentStep.label}
          </span>
        </div>
        <span className={`tag ${currentStep.badgeColor}`}>{currentStep.badge}</span>
      </div>

      {/* Main Stage Content */}
      <div
        style={{
          padding: "24px 20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            activeStepIndex === 2
              ? "linear-gradient(135deg, var(--color-neutral-900) 0%, #1e1b18 100%)"
              : "transparent",
          color: activeStepIndex === 2 ? "#f5ead8" : "var(--color-text)",
          transition: "background 0.4s ease, color 0.4s ease",
        }}
      >
        {activeStepIndex === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.6 }}>
              Step 1: Business Profile
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: 22 }}>
              {currentStep.title}
            </div>
            <div style={{ fontSize: 14, opacity: 0.85 }}>
              Category: <span style={{ fontWeight: 600 }}>{currentStep.category}</span>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 4,
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 999,
                background: "var(--color-surface)",
                width: "fit-content",
                border: "1px solid var(--color-divider)",
              }}
            >
              ✨ Tone: <span style={{ fontWeight: 600 }}>Modern & Warm</span>
            </div>
          </div>
        )}

        {activeStepIndex === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.6 }}>
              Step 2: AI Instant Builder
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: 20 }}>
              {currentStep.subtitle}
            </div>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
              Handcrafted espresso, artisan sourdough, and local pastries served daily.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <div
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  background: "var(--color-accent)",
                  color: "var(--color-bg)",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                View Menu
              </div>
              <div
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  border: "1px solid var(--color-divider)",
                  fontSize: 12,
                }}
              >
                Visit Us
              </div>
            </div>
          </div>
        )}

        {activeStepIndex === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#f6a06b" }}>
              Step 3: AI Restyled Studio
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, color: "#f5ead8" }}>
              Quantum Café
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#eee7db", fontStyle: "italic" }}>
              "Where every cup tells a story of craft & community."
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <span className="tag tag-accent">Dark Palette</span>
              <span className="tag tag-accent-2">Caprasimo Font</span>
            </div>
          </div>
        )}

        {activeStepIndex === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  color: "var(--color-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-heading)",
                  fontSize: 13,
                }}
              >
                AI
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 16 }}>
                Step 4: AI Growth Engine
              </div>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.5,
                color: "var(--color-accent-800)",
                background: "var(--color-accent-100)",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
              }}
            >
              {currentStep.insight}
            </p>
          </div>
        )}
      </div>

      {/* Step Progress Navigation */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 4,
          padding: "8px 12px",
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-divider)",
        }}
      >
        {STEPS.map((step, idx) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveStepIndex(idx)}
            style={{
              background: idx === activeStepIndex ? "var(--color-accent)" : "transparent",
              color: idx === activeStepIndex ? "var(--color-bg)" : "var(--color-text)",
              border: 0,
              borderRadius: 999,
              padding: "5px 2px",
              fontSize: 11,
              fontFamily: "var(--font-body)",
              fontWeight: idx === activeStepIndex ? 700 : 400,
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Step {step.id}
          </button>
        ))}
      </div>
    </div>
  );
}
