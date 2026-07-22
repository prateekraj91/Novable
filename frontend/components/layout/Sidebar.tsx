"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import SignOutButton from "@/components/auth/SignOutButton";
import { createClient } from "@/lib/supabase/client";



const navItems = [
  {
    section: "Workspace",
    items: [
      {
        label: "Overview",
        icon: "grid",
        href: "/dashboard",
      },
      {
        label: "AI Workforce",
        icon: "plane",
        href: "/dashboard/agents",
      },
      {
        label: "Business Profile",
        icon: "building",
        href: "/dashboard/profile",
      },
    ],
  },

  {
    section: "Platform",
    items: [
      {
        label: "Marketplace(soon)",
        icon: "store",
        href: "/dashboard/marketplace",
      },
      {
        label: "Settings",
        icon: "gear",
        href: "/dashboard/settings",
      },
    ],
  },
];

function NavIcon({ name }: { name: string }) {
  const common = { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none" as const };
  switch (name) {
    case "grid":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3.5" y="3.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "plane":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 6.5V12L16 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "flask":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 20V10M11 20V4M18 20v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "card":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="6" width="18" height="13" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "gear":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M19.4 13.5a1.7 1.7 0 000-3l1-1.7-1.7-1-1.7 1a1.7 1.7 0 00-1.5-.9L15 5h-2l-.5 2.4a1.7 1.7 0 00-1.5.9l-1.7-1-1.7 1 1 1.7a1.7 1.7 0 000 3l-1 1.7 1.7 1 1.7-1c.4.5.9.8 1.5.9L13 19h2l.5-2.4c.6-.1 1.1-.4 1.5-.9l1.7 1 1.7-1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
      
      case "building":
      return (
        <svg {...common} aria-hidden="true">
        <path
        d="M5 20V5h9v15M14 10h5v10M8 8h2M8 11h2M8 14h2M16.5 13h1M16.5 16h1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      </svg>
       );

    case "store":
      return (
      <svg {...common} aria-hidden="true">
      <path
        d="M4 8l1-3h14l1 3v2a2 2 0 01-2 2H6a2 2 0 01-2-2V8zm1 4h14v8H5v-8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      </svg>
  );
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
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <Logo className="h-6 w-6" />
        <span className="font-mono text-sm text-cream">
          Catalyst
        </span>
      </div>

      <nav className="flex-1 px-3 py-2">
  {navItems.map((section) => (
    <div key={section.section} className="mb-7">

      <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">
        {section.section}
      </p>

      <ul className="space-y-1">

        {section.items.map((item) => (
          <li key={item.label}>
            <button
              onClick={() => go(item.href)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 font-mono text-xs uppercase tracking-[0.1em] transition-all ${
                pathname === item.href
                  ? "bg-amber/10 text-amber border border-amber/20"
                  : "text-muted hover:bg-surface/60 hover:text-cream"
              }`}
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

      <div className="border-t border-hairline px-4 py-4 space-y-4">

        <div className="flex items-center gap-3 rounded-sm px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface2 font-mono text-xs uppercase text-cream">
            {(me.email || "?").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-cream">
              {me.business ?? "Your business"}
            </p>
            <p className="truncate font-mono text-[0.65rem] text-muted">
              {me.email || "…"}
            </p>
          </div>
        </div>

        <SignOutButton className="w-full rounded-sm border border-hairline py-2 font-mono text-xs uppercase tracking-[0.12em] text-muted transition hover:border-amber hover:text-amber" />

      </div>
      
      </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-base px-4 py-3 md:hidden">
        <div className="flex items-center gap-2.5">
          <Logo className="h-5 w-5" />
          <span className="font-mono text-sm text-cream">
            Catalyst
          </span>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-sm border border-hairline text-cream"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-hairline bg-surface/30 md:flex">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-hairline bg-base">
            <div className="flex items-center justify-end px-4 py-4">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-hairline text-cream"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
