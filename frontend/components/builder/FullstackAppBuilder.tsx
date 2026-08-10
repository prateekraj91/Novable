"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/config";

type GeneratedFile = {
  filepath: string;
  language: string;
  content: string;
};

type AppPlan = {
  app_name: string;
  architecture_overview: string;
  tech_stack: string[];
  features: string[];
  implementation_steps: string[];
};

type GeneratedCode = {
  app_name: string;
  summary: string;
  database_sql: string;
  files: GeneratedFile[];
};

export default function FullstackAppBuilder() {
  const [appName, setAppName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [stage, setStage] = useState<"idle" | "planning" | "generating" | "complete">("idle");
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<AppPlan | null>(null);
  const [code, setCode] = useState<GeneratedCode | null>(null);
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);

  async function handleBuild() {
    if (!prompt.trim() || !appName.trim()) return;
    setStage("planning");
    setError("");
    setPlan(null);
    setCode(null);

    try {
      // Step 1: Planning
      const planRes = await fetch(`${API_BASE_URL}/generate-fullstack-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_name: appName,
          description: prompt,
          requires_auth: true,
          requires_database: true,
        }),
      });

      if (!planRes.ok) throw new Error("Planning failed");
      const planData = (await planRes.json()) as AppPlan;
      setPlan(planData);

      // Step 2: Full-Stack Code Generation
      setStage("generating");
      const codeRes = await fetch(`${API_BASE_URL}/generate-fullstack-app`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData),
      });

      if (!codeRes.ok) throw new Error("Code generation failed");
      const codeData = (await codeRes.json()) as GeneratedCode;
      setCode(codeData);
      setStage("complete");
    } catch {
      setError("Couldn't complete full-stack generation. Is the backend running?");
      setStage("idle");
    }
  }

  return (
    <section className="card elev-sm" style={{ padding: 28, marginTop: 24 }}>
      <span className="nb-kicker" style={{ color: "var(--color-accent-700)" }}>
        Novable Engine 2.0 (12-Month Vision)
      </span>
      <h2 className="nb-h2" style={{ fontSize: 24 }}>
        Full-Stack App Generator
      </h2>
      <p className="nb-quiet" style={{ margin: "6px 0 0", fontSize: 14 }}>
        Transform natural language app ideas into complete SaaS applications (Frontend + Backend + Database SQL).
      </p>

      <div style={{ marginTop: 20, display: "grid", gap: 14 }}>
        <label style={{ display: "block" }}>
          <span style={{ fontSize: 12, display: "block", marginBottom: 5, color: "var(--color-text)" }}>
            App Name:
          </span>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g. DentCare Pro SaaS"
            className="input"
            style={{ background: "var(--color-bg)" }}
          />
        </label>

        <label style={{ display: "block" }}>
          <span style={{ fontSize: 12, display: "block", marginBottom: 5, color: "var(--color-text)" }}>
            Natural Language App Prompt:
          </span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="e.g. Build an appointment booking SaaS for dental clinics with patient medical records, doctor scheduling, and UPI payment receipt tracking."
            className="input"
            style={{ background: "var(--color-bg)" }}
          />
        </label>

        <button
          type="button"
          onClick={handleBuild}
          disabled={stage === "planning" || stage === "generating" || !prompt.trim() || !appName.trim()}
          className="btn btn-primary"
          style={{ padding: "12px 24px", alignSelf: "flex-start" }}
        >
          {stage === "planning"
            ? "🤖 Step 1/2: Architecting Plan…"
            : stage === "generating"
            ? "⚡ Step 2/2: Generating Full-Stack Code…"
            : "🚀 Build Full-Stack Application"}
        </button>
      </div>

      {error && <p role="alert" className="nb-note nb-note-error" style={{ marginTop: 14 }}>{error}</p>}

      {/* Output Stage Results */}
      {plan && (
        <div style={{ marginTop: 24, padding: 20, borderRadius: "var(--radius-lg)", background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}>
          <div className="nb-row">
            <span className="tag tag-accent">Plan Ready</span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>{plan.tech_stack?.join(" • ")}</span>
          </div>

          <h3 className="nb-h3" style={{ marginTop: 10, fontSize: 18 }}>{plan.app_name}</h3>
          <p className="nb-quiet" style={{ margin: "4px 0 0", fontSize: 14 }}>{plan.architecture_overview}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            {plan.features?.map((f, i) => (
              <span key={i} className="tag tag-neutral" style={{ fontSize: 11 }}>✓ {f}</span>
            ))}
          </div>
        </div>
      )}

      {/* Code Explorer */}
      {code && code.files?.length > 0 && (
        <div style={{ marginTop: 20, borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--color-divider)", background: "#1e1b18", color: "#f5ead8" }}>
          <div style={{ padding: "12px 18px", background: "#2e2b25", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 14 }}>Generated Code Files</span>
            <span style={{ fontSize: 12, opacity: 0.6 }}>{code.files.length} Files Generated</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 320 }}>
            {/* Sidebar File Tree */}
            <div style={{ borderRight: "1px solid rgba(255,255,255,0.1)", padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              {code.files.map((file, idx) => (
                <button
                  key={file.filepath}
                  type="button"
                  onClick={() => setSelectedFileIdx(idx)}
                  style={{
                    textAlign: "left",
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: 0,
                    background: idx === selectedFileIdx ? "var(--color-accent)" : "transparent",
                    color: idx === selectedFileIdx ? "#fff" : "#eee7db",
                    fontSize: 12,
                    fontFamily: "monospace",
                    cursor: "pointer",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  📄 {file.filepath}
                </button>
              ))}
            </div>

            {/* Code Viewport */}
            <div style={{ padding: 16, overflowX: "auto" }}>
              <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8 }}>
                {code.files[selectedFileIdx]?.filepath} ({code.files[selectedFileIdx]?.language})
              </div>
              <pre style={{ margin: 0, fontSize: 12, fontFamily: "monospace", lineHeight: 1.5, color: "#dcd3c4", whiteSpace: "pre-wrap" }}>
                {code.files[selectedFileIdx]?.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
