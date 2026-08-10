"use client";

import { useState } from "react";

export default function CustomDomainSettings({ isPaid }: { isPaid: boolean }) {
  const [domain, setDomain] = useState("");
  const [savedDomain, setSavedDomain] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim()) return;
    setSavedDomain(domain.trim());
    setSaved(true);
  }

  return (
    <section className="card elev-sm" style={{ marginTop: 16, padding: 28 }}>
      <span className="nb-kicker" style={{ color: "var(--color-accent-700)" }}>
        Branding & Hosting
      </span>
      <h2 className="nb-h3">Custom Domain Setup</h2>
      <p className="nb-quiet" style={{ margin: "6px 0 0", fontSize: 14 }}>
        Connect your own domain (e.g. <strong style={{ color: "var(--color-text)" }}>www.yourbusiness.com</strong>) to your Novable website.
      </p>

      {!isPaid ? (
        <div style={{ marginTop: 16, padding: 16, borderRadius: "var(--radius-md)", background: "var(--color-accent-100)", border: "1px solid var(--color-accent-300)" }}>
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-accent-800)" }}>
            🔒 Custom domain mapping is unlocked on the <strong>Standard Plan</strong>. Upgrade your account to point your own domain name live.
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 20 }}>
          <form onSubmit={handleSave} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. www.quantumcafe.in"
              className="input"
              style={{ flex: 1, minWidth: 240, background: "var(--color-bg)" }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px" }}>
              Save Domain
            </button>
          </form>

          {saved && (
            <div style={{ marginTop: 16, padding: 18, borderRadius: "var(--radius-md)", background: "var(--color-accent-2-100)", border: "1px solid var(--color-accent-2-300)" }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "var(--color-accent-2-800)" }}>
                ✓ Custom domain configured for {savedDomain}
              </p>
              <div style={{ marginTop: 12, fontSize: 13, color: "var(--color-text)", lineHeight: 1.6 }}>
                <strong>DNS Setup Instructions:</strong>
                <ol style={{ margin: "6px 0 0", paddingLeft: 20 }}>
                  <li>Log in to your domain registrar (GoDaddy, Namecheap, BigRock).</li>
                  <li>Go to DNS Management / Nameservers.</li>
                  <li>Add a CNAME record: <code style={{ background: "var(--color-surface)", padding: "2px 6px", borderRadius: 4 }}>CNAME</code> → <code style={{ background: "var(--color-surface)", padding: "2px 6px", borderRadius: 4 }}>cname.vercel-dns.com</code>.</li>
                  <li>DNS changes will take 15–30 minutes to propagate worldwide with automated SSL!</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
