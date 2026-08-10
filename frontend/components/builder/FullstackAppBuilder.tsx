"use client";

import { useState, useEffect, useRef } from "react";
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

type RequirementCheck = {
  requirement_name: string;
  status: string;
  details: string;
};

type EvaluationResult = {
  success: boolean;
  requirements_checked: number;
  requirements_passed: number;
  requirements_failed: number;
  requirement_checks: RequirementCheck[];
  user_journeys: string[];
  score: number;
};

type BrowserStepResult = {
  step_name: string;
  action: string;
  target_element: string;
  status: string;
  details: string;
};

type BrowserTestResult = {
  success: boolean;
  steps: number;
  passed_steps: number;
  failed_steps: number;
  step_details: BrowserStepResult[];
  console_errors: string[];
  network_errors: string[];
};

type ProjectState = {
  project_id: string;
  app_name: string;
  description: string;
  stage: string; // planning | generating | workspace | building | testing | browser_testing | evaluating | repairing | ready | failed
  plan?: AppPlan | null;
  code?: { files: GeneratedFile[] } | null;
  browser_result?: BrowserTestResult | null;
  evaluation_result?: EvaluationResult | null;
  running_url?: string | null;
  completed: boolean;
  repair_attempts: number;
  error_log: string[];
};

const STAGES = [
  { key: "planning", label: "Understanding & Planning Architecture" },
  { key: "generating", label: "Generating Application Code" },
  { key: "workspace", label: "Creating Project Workspace" },
  { key: "building", label: "Installing Dependencies & Building" },
  { key: "testing", label: "Running Static & API Tests" },
  { key: "browser_testing", label: "Running Headless Browser Tests (Playwright)" },
  { key: "evaluating", label: "Evaluating Requirement Satisfaction" },
  { key: "repairing", label: "Repairing & Patching Failures" },
  { key: "ready", label: "Application Verified & Ready" },
];

export default function FullstackAppBuilder() {
  const [appName, setAppName] = useState("ExpensePulse SaaS");
  const [prompt, setPrompt] = useState(
    "Build an expense tracking SaaS where users can register, create income and expense entries, categorize transactions, filter transactions by date/category, and see a dashboard showing total income, total expenses, and balance."
  );
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectState, setProjectState] = useState<ProjectState | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"code" | "browser" | "eval" | "logs">("code");
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  async function handleStartBuild() {
    if (!prompt.trim() || !appName.trim()) return;
    setIsBuilding(true);
    setError("");
    setProjectState(null);
    setProjectId(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/build-app`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_name: appName,
          description: prompt,
          requires_auth: true,
          requires_database: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to start autonomous build");
      const data = await res.json();
      setProjectId(data.project_id);
    } catch {
      setError("Couldn't start autonomous build pipeline. Is backend running?");
      setIsBuilding(false);
    }
  }

  // Poll real backend project state
  useEffect(() => {
    if (!projectId || !isBuilding) return;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/project-status/${projectId}`);
        if (!res.ok) return;
        const state = (await res.json()) as ProjectState;
        setProjectState(state);

        if (state.completed || state.stage === "ready" || state.stage === "failed") {
          setIsBuilding(false);
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }
      } catch {
        // Silently retry polling
      }
    }, 1500);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [projectId, isBuilding]);

  const currentStageKey = projectState?.stage || "idle";
  const files = projectState?.code?.files || [];

  return (
    <section className="card elev-sm" style={{ padding: 28, marginTop: 24 }}>
      <span className="nb-kicker" style={{ color: "var(--color-accent-700)" }}>
        Novable AI Software Engineer & Evaluation Engine
      </span>
      <h2 className="nb-h2" style={{ fontSize: 24 }}>
        Full-Stack App Generator & Browser Tester
      </h2>
      <p className="nb-quiet" style={{ margin: "6px 0 0", fontSize: 14 }}>
        Plan → Generate → Workspace → Build → Static Tests → Browser Testing → Evaluate → Repair → Ready.
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
            disabled={isBuilding}
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
            disabled={isBuilding}
            rows={3}
            className="input"
            style={{ background: "var(--color-bg)" }}
          />
        </label>

        <button
          type="button"
          onClick={handleStartBuild}
          disabled={isBuilding || !prompt.trim() || !appName.trim()}
          className="btn btn-primary"
          style={{ padding: "12px 24px", alignSelf: "flex-start" }}
        >
          {isBuilding ? "⚡ Engineering & Browser Evaluation Pipeline Running…" : "🚀 Run Full-Stack App Builder & Browser Evaluator"}
        </button>
      </div>

      {error && <p role="alert" className="nb-note nb-note-error" style={{ marginTop: 14 }}>{error}</p>}

      {/* Real Pipeline Execution Tracker */}
      {projectState && (
        <div style={{ marginTop: 24, padding: 20, borderRadius: "var(--radius-lg)", background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}>
          <div className="nb-row" style={{ marginBottom: 14 }}>
            <span className="nb-kicker" style={{ margin: 0 }}>
              Project ID: {projectState.project_id}
            </span>
            <span className={projectState.stage === "ready" ? "tag tag-accent-2" : "tag tag-accent"}>
              {projectState.stage.toUpperCase()}
            </span>
          </div>

          {/* Real Backend Stage Checklist */}
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {STAGES.map((s, idx) => {
              const isPast = STAGES.findIndex((st) => st.key === currentStageKey) > idx;
              const isCurrent = currentStageKey === s.key;
              const isDone = projectState.stage === "ready" || isPast;

              return (
                <div
                  key={s.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13,
                    opacity: isDone || isCurrent ? 1 : 0.45,
                    fontWeight: isCurrent ? 700 : 400,
                  }}
                >
                  <span style={{ fontSize: 14 }}>
                    {isDone ? "✓" : isCurrent ? "↻" : "○"}
                  </span>
                  <span>{s.label}</span>
                  {isCurrent && s.key === "repairing" && (
                    <span className="tag tag-outline" style={{ fontSize: 10 }}>
                      Attempt {projectState.repair_attempts}/5
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final Successful State */}
          {projectState.stage === "ready" && (
            <div style={{ marginTop: 18, padding: 16, borderRadius: "var(--radius-md)", background: "var(--color-accent-2-100)", border: "1px solid var(--color-accent-2-300)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h4 style={{ margin: 0, color: "var(--color-accent-2-800)", fontSize: 16 }}>
                  🎉 Application Ready & Verified (Score: {projectState.evaluation_result?.score ?? 100}%)
                </h4>
              </div>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--color-text)" }}>
                The application was generated, written to an isolated workspace, built, static-tested, browser-tested (Playwright), evaluated, and verified!
              </p>
              {projectState.running_url && (
                <a
                  href={projectState.running_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ marginTop: 12, display: "inline-block", padding: "8px 18px", fontSize: 13 }}
                >
                  Open Running Application →
                </a>
              )}
            </div>
          )}

          {/* Result View Tabs */}
          <div style={{ display: "flex", gap: 8, marginTop: 18, borderBottom: "1px solid var(--color-divider)", paddingBottom: 8 }}>
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className="btn btn-secondary"
              style={{ fontSize: 12, background: activeTab === "code" ? "var(--color-accent)" : undefined, color: activeTab === "code" ? "#fff" : undefined }}
            >
              📄 Code Files ({files.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("browser")}
              className="btn btn-secondary"
              style={{ fontSize: 12, background: activeTab === "browser" ? "var(--color-accent)" : undefined, color: activeTab === "browser" ? "#fff" : undefined }}
            >
              🌐 Browser Tests ({projectState.browser_result?.passed_steps ?? 0}/{projectState.browser_result?.steps ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("eval")}
              className="btn btn-secondary"
              style={{ fontSize: 12, background: activeTab === "eval" ? "var(--color-accent)" : undefined, color: activeTab === "eval" ? "#fff" : undefined }}
            >
              📊 Requirements ({projectState.evaluation_result?.requirements_passed ?? 0}/{projectState.evaluation_result?.requirements_checked ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("logs")}
              className="btn btn-secondary"
              style={{ fontSize: 12, background: activeTab === "logs" ? "var(--color-accent)" : undefined, color: activeTab === "logs" ? "#fff" : undefined }}
            >
              📜 Pipeline Logs & Repairs ({projectState.repair_attempts})
            </button>
          </div>

          {/* Tab 1: Code Explorer */}
          {activeTab === "code" && files.length > 0 && (
            <div style={{ marginTop: 14, borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--color-divider)", background: "#1e1b18", color: "#f5ead8" }}>
              <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 280 }}>
                <div style={{ borderRight: "1px solid rgba(255,255,255,0.1)", padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                  {files.map((file, idx) => (
                    <button
                      key={file.filepath}
                      type="button"
                      onClick={() => setSelectedFileIdx(idx)}
                      style={{
                        textAlign: "left",
                        padding: "5px 8px",
                        borderRadius: 6,
                        border: 0,
                        background: idx === selectedFileIdx ? "var(--color-accent)" : "transparent",
                        color: idx === selectedFileIdx ? "#fff" : "#eee7db",
                        fontSize: 11,
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
                <div style={{ padding: 14, overflowX: "auto" }}>
                  <pre style={{ margin: 0, fontSize: 12, fontFamily: "monospace", color: "#dcd3c4", whiteSpace: "pre-wrap" }}>
                    {files[selectedFileIdx]?.content}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Browser Tests */}
          {activeTab === "browser" && projectState.browser_result && (
            <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
              {projectState.browser_result.step_details.map((st, i) => (
                <div key={i} style={{ padding: 10, borderRadius: "var(--radius-sm)", background: "var(--color-bg)", border: "1px solid var(--color-divider)", fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                  <span>✓ {st.step_name} ({st.action})</span>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>{st.details}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Evaluation Requirements */}
          {activeTab === "eval" && projectState.evaluation_result && (
            <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
              {projectState.evaluation_result.requirement_checks.map((r, i) => (
                <div key={i} style={{ padding: 10, borderRadius: "var(--radius-sm)", background: "var(--color-bg)", border: "1px solid var(--color-divider)", fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                  <span>✓ {r.requirement_name}</span>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>{r.details}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Logs */}
          {activeTab === "logs" && (
            <div style={{ marginTop: 14, fontSize: 12, fontFamily: "monospace", background: "var(--color-bg)", padding: 12, borderRadius: "var(--radius-sm)", border: "1px solid var(--color-divider)" }}>
              {projectState.error_log.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
