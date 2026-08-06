"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function LoginForm({ mode = "signin" }: { mode?: Mode }) {
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
      router.push("/dashboard");
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
    router.push("/dashboard");
    router.refresh();
  }

  if (forgot) {
    if (status === "reset-sent") {
      return (
        <div className="w-full max-w-sm">
          <p className="rounded-sm border border-sage/30 bg-sage/10 px-4 py-3 text-sm text-cream">
            If an account exists for{" "}
            <span className="text-sage">{email}</span>, we&apos;ve sent a
            password reset link. Check your inbox.
          </p>
          <button
            type="button"
            onClick={backToSignIn}
            className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-amber transition-colors hover:text-sage"
          >
            ← Back to sign in
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={handleReset} className="w-full max-w-sm">
        <h2 className="font-display text-xl text-cream">Reset your password</h2>
        <p className="mt-1 text-sm text-muted">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <div className="mt-5">
          <label
            htmlFor="reset-email"
            className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted"
          >
            Email
          </label>
          <input
            id="reset-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="mt-2 w-full rounded-sm border border-hairline bg-surface/60 px-4 py-3 text-cream placeholder:text-muted/60 outline-none transition-colors focus:border-amber"
          />
        </div>

        {status === "error" && (
          <p
            role="alert"
            className="mt-4 rounded-sm border border-amber/30 bg-amber/10 px-4 py-2.5 font-mono text-xs text-amber"
          >
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-amber px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-base transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:-translate-y-0"
        >
          {status === "loading" ? "Sending…" : "Send reset link"}
        </button>

        <button
          type="button"
          onClick={backToSignIn}
          className="mt-4 block w-full text-center font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted transition-colors hover:text-amber"
        >
          ← Back to sign in
        </button>
      </form>
    );
  }

  if (status === "sent") {
    return (
      <div className="w-full max-w-sm">
        <p className="rounded-sm border border-sage/30 bg-sage/10 px-4 py-3 text-sm text-cream">
          Almost there — we sent a confirmation link to{" "}
          <span className="text-sage">{email}</span>. Confirm it, then{" "}
          <Link href="/login" className="text-amber hover:text-sage">
            sign in
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div>
        <label
          htmlFor="email"
          className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="mt-2 w-full rounded-sm border border-hairline bg-surface/60 px-4 py-3 text-cream placeholder:text-muted/60 outline-none transition-colors focus:border-amber"
        />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted"
          >
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
              className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted transition-colors hover:text-amber"
            >
              Forgot?
            </button>
          )}
        </div>

        <div className="relative mt-2">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-sm border border-hairline bg-surface/60 px-4 py-3 pr-11 text-cream placeholder:text-muted/60 outline-none transition-colors focus:border-amber"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted transition-colors hover:text-cream"
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 3l18 18M10.6 10.7a2.2 2.2 0 003 3M7.4 7.5C5.2 8.9 3.6 10.8 3 12c1.4 2.8 4.9 7 9 7 1.6 0 3.1-.4 4.4-1.2M16.7 16.8C18.7 15.4 20.4 13.4 21 12c-1-2-3.1-4.9-6-6.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 12c1.4-2.8 4.9-7 9-7s7.6 4.2 9 7c-1.4 2.8-4.9 7-9 7s-7.6-4.2-9-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mode === "signin" && (
        <label className="mt-5 flex items-center gap-2.5 text-sm text-muted">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded-sm border border-hairline bg-surface/60 accent-[#34d399]"
          />
          Remember this device
        </label>
      )}

      {status === "error" && (
        <p
          role="alert"
          className="mt-4 rounded-sm border border-amber/30 bg-amber/10 px-4 py-2.5 font-mono text-xs text-amber"
        >
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-amber px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-base transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:-translate-y-0"
      >
        {status === "loading" ? (
          <>
            <svg className="h-3.5 w-3.5 spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
              <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            {mode === "signup" ? "Creating account" : "Signing in"}
          </>
        ) : mode === "signup" ? (
          "Create account"
        ) : (
          "Sign in"
        )}
      </button>

      <p className="mt-7 text-center text-sm text-muted">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-amber transition-colors hover:text-sage">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to Novable?{" "}
            <Link href="/signup" className="text-amber transition-colors hover:text-sage">
              Start your trial
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
