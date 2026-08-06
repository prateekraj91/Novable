"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

const links = [
  { label: "How it Works", href: "#features" },
  { label: "Agents", href: "#agents" },
  { label: "Pricing", href: "#pricing" },
  { label: "Compare", href: "#compare" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-base/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <a
          href="#"
          className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105"
        >
          <Logo className="h-9 w-9" />

          <span className="font-display text-xl tracking-tight text-cream">
            Novable
          </span>
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors duration-300 hover:text-cream"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
          href="/login"
        className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-cream"
            >
           Sign In
            </Link>

          <a
            href="#pricing"
            className="rounded-md border border-amber bg-amber px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            See pricing
          </a>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`h-px w-6 bg-cream transition-transform ${
              open ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-cream transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-cream transition-transform ${
              open ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-hairline bg-base px-6 py-5 md:hidden">
          <ul className="flex flex-col gap-5">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-cream"
                >
                  {l.label}
                </a>
              </li>
            ))}

            <li>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-cream"
              >
                Sign In
              </Link>
            </li>

            <li className="pt-2">
              <a
                href="#pricing"
                onClick={() => setOpen(false)}
                className="inline-block rounded-md border border-amber bg-amber px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-base"
              >
                See pricing
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}