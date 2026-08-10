"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

// Pill inputs need room on the right for the show/hide control.
const PASSWORD_INPUT_PADDING = 44;

export default function LoginForm({
  mode = "signin",
  /**
   * Where to land once authenticated — /pricing for "Get Started", /onboarding
   * for "Try for free". Already validated as a local path by the page.
   */
  next = "/dashboard",
}: {
  mode?: Mode;
  next?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "sent" | "reset-sent"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [forgot, setForgot] = useState(false);

  async function handleReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setErrorMsg("Enter your email to reset your password.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    setStatus("reset-sent");
  }

  function backToSignIn() {
    setForgot(false);
    setStatus("idle");
    setErrorMsg("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !password) {
      setStatus("error");
      setErrorMsg("Enter your email and password to continue.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setStatus("error");
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setStatus("error");
        setErrorMsg(error.message);
        return;
      }
      // If email confirmation is enabled, there's no session yet.
      if (!data.session) {
        setStatus("sent");
        return;
      }
      router.push(next);
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  // Keep the destination attached when someone crosses between sign in and
  // sign up, so the intent they arrived with survives the detour.
  const withNext = (path: string) =>
    next === "/dashboard" ? path : `${path}?next=${encodeURIComponent(next)}`;

  if (forgot) {
    if (status === "reset-sent") {
      return (
        <div>
          <p className="nb-note nb-note-ok" style={{ marginTop: 0 }}>
            If an account exists for <strong>{email}</strong>, we&apos;ve sent a
            password reset link. Check your inbox.
          </p>
          <button
            type="button"
            onClick={backToSignIn}
            className="btn btn-ghost"
            style={{ marginTop: 18 }}
          >
            ← Back to sign in
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={handleReset}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, margin: 0 }}>
          Reset your password
        </h2>
        <p className="nb-quiet" style={{ margin: "6px 0 0", fontSize: 14 }}>
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="reset-email">Email</label>
          <input
            id="reset-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="input"
            style={{ minHeight: 44 }}
          />
        </div>

        {status === "error" && (
          <p role="alert" className="nb-note nb-note-error">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn btn-primary btn-block"
          style={{ marginTop: 24, padding: 13 }}
        >
          {status === "loading" ? "Sending…" : "Send reset link"}
        </button>

        <button
          type="button"
          onClick={backToSignIn}
          className="btn btn-ghost btn-block"
          style={{ marginTop: 10 }}
        >
          ← Back to sign in
        </button>
      </form>
    );
  }

  if (status === "sent") {
    return (
      <div>
        <p className="nb-note nb-note-ok" style={{ marginTop: 0 }}>
          Almost there — we sent a confirmation link to <strong>{email}</strong>.
          Confirm it, then <Link href={withNext("/login")}>sign in</Link>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="input"
          style={{ minHeight: 44 }}
        />
      </div>

      <div className="field" style={{ marginTop: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <label htmlFor="password" style={{ marginBottom: 5 }}>
            Password
          </label>
          {mode === "signin" && (
            <button
              type="button"
              onClick={() => {
                setForgot(true);
                setStatus("idle");
                setErrorMsg("");
              }}
              className="btn btn-ghost"
              style={{ fontSize: 12, marginBottom: 5, padding: "0 4px" }}
            >
              Forgot?
            </button>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input"
            style={{ minHeight: 44, paddingRight: PASSWORD_INPUT_PADDING }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="btn btn-ghost"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 4,
              width: 36,
              padding: 0,
              color: "color-mix(in srgb, var(--color-text) 60%, transparent)",
            }}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 3l18 18M10.6 10.7a2.2 2.2 0 003 3M7.4 7.5C5.2 8.9 3.6 10.8 3 12c1.4 2.8 4.9 7 9 7 1.6 0 3.1-.4 4.4-1.2M16.7 16.8C18.7 15.4 20.4 13.4 21 12c-1-2-3.1-4.9-6-6.4" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 12c1.4-2.8 4.9-7 9-7s7.6 4.2 9 7c-1.4 2.8-4.9 7-9 7s-7.6-4.2-9-7z" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="2.75" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mode === "signin" && (
        <label
          className="radio"
          style={{ marginTop: 18, color: "var(--color-text)" }}
        >
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="checkbox"
          />
          Remember this device
        </label>
      )}

      {status === "error" && (
        <p role="alert" className="nb-note nb-note-error">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-primary btn-block"
        style={{ marginTop: 24, padding: 13, fontSize: 15 }}
      >
        {status === "loading" ? (
          <>
            <svg className="nb-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.75" strokeOpacity="0.3" />
              <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
            </svg>
            {mode === "signup" ? "Creating account" : "Signing in"}
          </>
        ) : mode === "signup" ? (
          "Create account"
        ) : (
          "Sign in"
        )}
      </button>

      <p
        className="nb-quiet"
        style={{ margin: "26px 0 0", textAlign: "center", fontSize: 14 }}
      >
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href={withNext("/login")}>Sign in</Link>
          </>
        ) : (
          <>
            New to Novable?{" "}
            <Link href={withNext("/signup")}>Create an account</Link>
          </>
        )}
      </p>
    </form>
  );
}
