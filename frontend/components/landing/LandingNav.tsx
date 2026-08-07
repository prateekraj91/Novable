"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { label: "How it Works", id: "how" },
  { label: "Agents", id: "agents" },
  { label: "Pricing", id: "pricing" },
  { label: "Compare", id: "compare" },
  { label: "FAQ", id: "faq" },
];

export default function LandingNav() {
  const [activeSection, setActiveSection] = useState("how");
  const [open, setOpen] = useState(false);

  // Scroll spy: the link for whichever section owns the middle of the
  // viewport reads as active.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="nb-header">
      <nav className="nb-edge nb-nav">
        <a href="#" className="nb-brand">
          <span className="nb-brand-mark" />
          Novable
        </a>

        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className="nb-navlink"
            data-active={activeSection === l.id}
          >
            {l.label}
          </a>
        ))}

        <div className="nb-nav-actions">
          <Link
            href="/login"
            className="nb-navlink"
            data-active="false"
            style={{ marginLeft: 8, marginRight: 8 }}
          >
            Sign In
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="nb-burger"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {open && (
        <div className="nb-edge">
          <div className="nb-mobile-menu">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="nb-navlink"
                data-active={activeSection === l.id}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/login"
              className="nb-navlink"
              data-active="false"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn btn-primary"
              style={{ alignSelf: "flex-start", padding: "12px 24px" }}
              onClick={() => setOpen(false)}
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
