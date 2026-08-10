"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import CopyButton from "@/components/ui/CopyButton";
import QrCodeButton from "@/components/ui/QrCodeButton";
import UpgradeButton from "@/components/billing/UpgradeButton";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/time";

export type DashboardSite = {
  id: string;
  slug: string;
  content: { hero_title?: string };
  published: boolean;
  created_at: string;
};

/**
 * The dashboard's "Your sites" list. The rows are fetched by the server
 * component and handed down; this component owns them from there so a deleted
 * site can leave the list without a full page reload.
 *
 * On the free plan every site is unpublished — the database forces it — so the
 * rows offer a private preview and an upgrade instead of a live link.
 */
export default function SiteList({
  sites: initialSites,
  canPublish,
}: {
  sites: DashboardSite[];
  canPublish: boolean;
}) {
  const router = useRouter();
  const [sites, setSites] = useState(initialSites);
  const [pending, setPending] = useState<DashboardSite | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState<string | null>(null);
  const [publishError, setPublishError] = useState("");

  // The server stays the source of truth: whenever the page re-renders with
  // fresh rows (including after the router.refresh() below), adopt them.
  useEffect(() => setSites(initialSites), [initialSites]);

  useEffect(() => {
    if (!pending) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !busy) {
        setPending(null);
        setError("");
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pending, busy]);

  function closeDialog() {
    setPending(null);
    setError("");
  }

  /**
   * Paid-only. The publish trigger in Postgres silently forces `published` back
   * to false for free accounts, so we read the row back and trust what the
   * database says rather than what we asked for.
   */
  async function togglePublished(site: DashboardSite) {
    setPublishing(site.id);
    setPublishError("");

    try {
      const supabase = createClient();
      const { data, error: upErr } = await supabase
        .from("sites")
        .update({
          published: !site.published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", site.id)
        .select("published")
        .single();

      if (upErr) throw upErr;

      if (data.published !== !site.published) {
        setPublishError(
          "Publishing is part of the Standard plan — upgrade to take this site live."
        );
        return;
      }

      setSites((prev) =>
        prev.map((s) =>
          s.id === site.id ? { ...s, published: data.published } : s
        )
      );
      router.refresh();
    } catch {
      setPublishError("Couldn't update that site. Try again.");
    } finally {
      setPublishing(null);
    }
  }

  async function confirmDelete() {
    if (!pending) return;
    setBusy(true);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Your session has expired. Sign in again to delete this site.");
        return;
      }

      // Ownership is enforced by the "own sites" RLS policy in the database.
      // The explicit user_id filter is a second guard, and `count` tells us a
      // row actually went away — a policy refusal deletes zero rows without
      // reporting an error, which would otherwise look like success.
      const { error: deleteError, count } = await supabase
        .from("sites")
        .delete({ count: "exact" })
        .eq("id", pending.id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      if (!count) {
        setError("That site couldn't be deleted — it may no longer be yours.");
        return;
      }

      setSites((prev) => prev.filter((s) => s.id !== pending.id));
      setPending(null);
      router.refresh(); // re-syncs the "Sites published" stat above the list
    } catch {
      setError("Couldn't delete that site. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sites.length === 0) {
    return (
      <div className="card elev-sm" style={{ padding: 26 }}>
        <p className="nb-quiet" style={{ margin: 0, fontSize: 15 }}>
          No sites yet. <Link href="/onboarding">Generate your first one</Link>.
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "grid", gap: 12 }}>
        {sites.map((s) => (
          <div
            key={s.id}
            className="card elev-sm nb-row"
            style={{ padding: "18px 22px" }}
          >
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-heading)",
                  fontSize: 16,
                }}
              >
                {s.content?.hero_title ?? "Generated site"}
              </p>
              <p className="nb-quiet" style={{ margin: "4px 0 0", fontSize: 13 }}>
                /site/{s.slug} · {timeAgo(s.created_at)}
              </p>
              <span
                className={s.published ? "tag tag-accent-2" : "tag tag-outline"}
                style={{ marginTop: 8 }}
              >
                {s.published ? "Live" : "Not live"}
              </span>
            </div>

            <div className="nb-row-actions">
              {s.published && (
                <>
                  <CopyButton
                    path={`/site/${s.slug}`}
                    className="btn btn-secondary"
                  />
                  <QrCodeButton
                    path={`/site/${s.slug}`}
                    title={s.slug}
                    className="btn btn-secondary"
                  />
                </>
              )}
              <Link
                href={`/dashboard/edit/${s.slug}`}
                className="btn btn-secondary"
              >
                Edit
              </Link>
              <a
                href={`/site/${s.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                {s.published ? "View live →" : "Preview →"}
              </a>

              {canPublish ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={publishing === s.id}
                  onClick={() => togglePublished(s)}
                >
                  {publishing === s.id
                    ? "Saving…"
                    : s.published
                      ? "Unpublish"
                      : "Publish"}
                </button>
              ) : (
                <UpgradeButton label="Upgrade to publish" />
              )}

              <button
                type="button"
                className="btn btn-danger-quiet"
                onClick={() => setPending(s)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {publishError && (
        <p role="alert" className="nb-note nb-note-error">
          {publishError}
        </p>
      )}

      {pending && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-site-heading"
          onClick={() => !busy && closeDialog()}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(20, 16, 12, 0.55)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            className="card elev-md"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 400, padding: 28, gap: 12 }}
          >
            <h3 id="delete-site-heading" className="nb-h3" style={{ margin: 0 }}>
              Delete this site?
            </h3>

            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
              <strong>{pending.content?.hero_title ?? "Generated site"}</strong>{" "}
              at <span className="nb-quiet">/site/{pending.slug}</span> will be
              permanently removed, and its public link will stop working.
            </p>

            <p className="nb-quiet" style={{ margin: 0, fontSize: 13 }}>
              Are you sure? This can&apos;t be undone.
            </p>

            {error && (
              <p
                role="alert"
                className="nb-note nb-note-error"
                style={{ marginTop: 4 }}
              >
                {error}
              </p>
            )}

            <div
              style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}
            >
              <button
                type="button"
                className="btn btn-danger"
                disabled={busy}
                onClick={confirmDelete}
              >
                {busy ? "Deleting…" : "Delete site"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={busy}
                onClick={closeDialog}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
