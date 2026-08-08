"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import BrandMark from "@/components/ui/BrandMark";
import SignOutButton from "@/components/auth/SignOutButton";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  {
    section: "Workspace",
    items: [
      { label: "Overview", icon: "grid", href: "/dashboard" },
      { label: "AI Workforce", icon: "plane", href: "/dashboard/agents" },
      { label: "Business Profile", icon: "building", href: "/dashboard/profile" },
    ],
  },
  {
    section: "Platform",
    items: [
      { label: "Marketplace (soon)", icon: "store", href: "/dashboard/marketplace" },
      { label: "Settings", icon: "gear", href: "/dashboard/settings" },
    ],
  },
];

// Stroke 2.75 is the Organic system's icon weight — rounder, heavier.
function NavIcon({ name }: { name: string }) {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
        </svg>
      );
    case "plane":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6.5V12L16 14.5" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <path d="M5 20V5h9v15M14 10h5v10M8 8h2M8 11h2M8 14h2M16.5 13h1M16.5 16h1" />
        </svg>
      );
    case "store":
      return (
        <svg {...common}>
          <path d="M4 8l1-3h14l1 3v2a2 2 0 01-2 2H6a2 2 0 01-2-2V8zm1 4h14v8H5v-8z" />
        </svg>
      );
    case "gear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 13.5a1.7 1.7 0 000-3l1-1.7-1.7-1-1.7 1a1.7 1.7 0 00-1.5-.9L15 5h-2l-.5 2.4a1.7 1.7 0 00-1.5.9l-1.7-1-1.7 1 1 1.7a1.7 1.7 0 000 3l-1 1.7 1.7 1 1.7-1c.4.5.9.8 1.5.9L13 19h2l.5-2.4c.6-.1 1.1-.4 1.5-.9l1.7 1 1.7-1z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [me, setMe] = useState<{ email: string; business: string | null }>({
    email: "",
    business: null,
  });

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: biz } = await supabase
        .from("businesses")
        .select("name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setMe({ email: user.email ?? "", business: biz?.name ?? null });
    })();
  }, []);

  // Close the drawer on Escape and lock body scroll while it's open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Navigate and always dismiss the mobile drawer.
  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const content = (
    <div className="nb-side-inner">
      <div style={{ padding: "22px 18px" }}>
        <BrandMark size={22} />
      </div>

      <nav style={{ flex: 1, padding: "4px 10px" }}>
        {navItems.map((section) => (
          <div key={section.section} className="nb-side-section">
            <span className="nb-side-label">{section.section}</span>
            <ul className="nb-list">
              {section.items.map((item) => (
                <li key={item.label} style={{ borderTop: 0 }}>
                  <button
                    type="button"
                    onClick={() => go(item.href)}
                    className="nb-navbtn"
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    <NavIcon name={item.icon} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="nb-side-foot">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            marginBottom: 14,
          }}
        >
          <div className="nb-avatar">{(me.email || "?").slice(0, 2)}</div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {me.business ?? "Your business"}
            </p>
            <p
              className="nb-quiet"
              style={{
                margin: 0,
                fontSize: 12,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {me.email || "…"}
            </p>
          </div>
        </div>

        <SignOutButton className="btn btn-secondary btn-block" />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="nb-topbar">
        <BrandMark size={20} />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="btn btn-secondary btn-icon"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Desktop rail */}
      <aside className="nb-side">{content}</aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="nb-scrim"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="nb-drawer organic">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "14px 14px 0",
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="btn btn-secondary btn-icon"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {content}
          </aside>
        </>
      )}
    </>
  );
}
