import Logo from "@/components/ui/Logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#features" },
      { label: "Agents", href: "/#agents" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Compare", href: "/#compare" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Start free", href: "/onboarding" },
      { label: "Sign in", href: "/login" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.8fr_1fr_1fr]">
          <div>
            <div className="group flex items-center gap-2.5">
              <Logo className="h-6 w-6" />
              <span className="font-mono text-sm text-cream">
                Novable
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Your AI co-pilot for growth — diagnose, automate, and compound,
              one flight plan at a time.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-cream/80 transition-colors hover:text-amber">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 md:flex-row">
          <p className="font-mono text-[0.65rem] text-muted">
            © {new Date().getFullYear()} Novable. All systems nominal.
          </p>
          <div className="flex gap-6 font-mono text-[0.65rem] text-muted">
            <a href="/privacy" className="transition-colors hover:text-amber">
              Privacy
            </a>
            <a href="/terms" className="transition-colors hover:text-amber">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
