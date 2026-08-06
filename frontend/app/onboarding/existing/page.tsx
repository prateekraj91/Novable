"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { saveBusinessOnly } from "@/lib/sites";

const CATEGORIES = [
  "Cafe / Restaurant",
  "Salon / Spa",
  "Retail / Shop",
  "Fitness / Gym",
  "Clinic / Healthcare",
  "Services / Freelance",
  "Other",
];

export default function ExistingBusinessPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    business_name: "",
    category: CATEGORIES[0],
    city: "",
    target_audience: "",
    phone: "",
    existing_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    if (!form.business_name.trim() || !form.city.trim() || !form.target_audience.trim()) {
      setError("Fill in your business name, city, and ideal customer.");
      return;
    }
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) {
      setError("Enter a valid phone number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const id = await saveBusinessOnly(form);
      if (!id) {
        router.push("/signup");
        return;
      }
      router.push("/dashboard/agents");
    } catch {
      setError("Couldn't save. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-base text-cream bg-grain">
      <header className="border-b border-hairline px-6 py-5">
        <Link href="/" className="mx-auto flex max-w-2xl items-center gap-2.5">
          <Logo className="h-5 w-5" />
          <span className="font-mono text-sm text-cream">Novable</span>
        </Link>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-14">
        <p className="eyebrow text-amber mb-3">Growth only</p>
        <h1 className="font-display text-3xl leading-tight text-cream md:text-4xl">
          Already have a website?
        </h1>
        <p className="mt-3 text-muted">
          Skip the site builder — just tell us about your business and put your
          AI growth agents to work.
        </p>

        <div className="mt-10 grid gap-5">
          <Field label="Business name">
            <input
              value={form.business_name}
              onChange={(e) => set("business_name", e.target.value)}
              placeholder="Lumière Salon"
              className={inputCls}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Business type">
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="City">
              <input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Bengaluru"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Ideal customer">
            <input
              value={form.target_audience}
              onChange={(e) => set("target_audience", e.target.value)}
              placeholder="Young professionals nearby"
              className={inputCls}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone">
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className={inputCls}
              />
            </Field>
            <Field label="Your website (optional)">
              <input
                value={form.existing_url}
                onChange={(e) => set("existing_url", e.target.value)}
                placeholder="yourbusiness.com"
                className={inputCls}
              />
            </Field>
          </div>

          {error && (
            <p className="rounded-sm border border-amber/30 bg-amber/10 px-4 py-2.5 font-mono text-xs text-amber">
              {error}
            </p>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="mt-2 w-full rounded-sm bg-amber px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-base transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Setting up…" : "Start growing →"}
          </button>

          <p className="text-center text-sm text-muted">
            Want a website built too?{" "}
            <Link href="/onboarding" className="text-amber hover:text-sage">
              Generate one
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

const inputCls =
  "w-full rounded-sm border border-hairline bg-surface/60 px-4 py-3 text-cream placeholder:text-muted/60 outline-none transition-colors focus:border-amber";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
