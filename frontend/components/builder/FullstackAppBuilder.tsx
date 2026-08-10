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

type ProjectState = {
  project_id: string;
  app_name: string;
  description: string;
  stage: string; // planning | generating | workspace | dependencies | building | testing | repairing | ready | failed
  plan?: AppPlan | null;
  code?: { files: GeneratedFile[] } | null;
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
  { key: "testing", label: "Running Automated Test Suite" },
  { key: "repairing", label: "Repairing & Patching Failures" },
  { key: "ready", label: "Application Ready" },
];

export default function FullstackAppBuilder() {
  const [appName, setAppName] = useState("TaskMaster SaaS");
  const [prompt, setPrompt] = useState(
    "Build a task management SaaS with email/password authentication, projects, tasks, task status, priorities, a dashboard, PostgreSQL database, and CRUD operations."
  );
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectState, setProjectState] = useState<ProjectState | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState("");
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
        Autonomous AI Software Engineer
      </span>
      <h2 className="nb-h2" style={{ fontSize: 24 }}>
        Novable App Engine
      </h2>
      <p className="nb-quiet" style={{ margin: "6px 0 0", fontSize: 14 }}>
        Prompt → Plan → Architect → Generate → Workspace → Build → Test → Repair → Deploy.
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
          {isBuilding ? "⚡ Autonomous Engineering Pipeline Running…" : "🚀 Run Autonomous App Builder"}
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
              <h4 style={{ margin: 0, color: "var(--color-accent-2-800)", fontSize: 16 }}>
                🎉 Your application is ready.
              </h4>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--color-text)" }}>
                The application was generated, written to an isolated workspace, built, tested, and verified successfully!
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

          {/* System Log */}
          {projectState.error_log?.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--color-divider)", fontSize: 12, fontFamily: "monospace", opacity: 0.8 }}>
              <strong>Execution Log:</strong>
              <div style={{ maxHeight: 100, overflowY: "auto", marginTop: 4 }}>
                {projectState.error_log.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Code Explorer */}
      {files.length > 0 && (
        <div style={{ marginTop: 20, borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--color-divider)", background: "#1e1b18", color: "#f5ead8" }}>
          <div style={{ padding: "12px 18px", background: "#2e2b25", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 14 }}>Workspace Code Explorer</span>
            <span style={{ fontSize: 12, opacity: 0.6 }}>{files.length} Files Written</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 320 }}>
            {/* Sidebar File Tree */}
            <div style={{ borderRight: "1px solid rgba(255,255,255,0.1)", padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              {files.map((file, idx) => (
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
                {files[selectedFileIdx]?.filepath} ({files[selectedFileIdx]?.language})
              </div>
              <pre style={{ margin: 0, fontSize: 12, fontFamily: "monospace", lineHeight: 1.5, color: "#dcd3c4", whiteSpace: "pre-wrap" }}>
                {files[selectedFileIdx]?.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
