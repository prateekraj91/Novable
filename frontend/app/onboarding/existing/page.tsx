"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandMark from "@/components/ui/BrandMark";
import Field from "@/components/Onboarding/Field";
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
    <main className="nb-onb-shell">
      <header className="nb-onb-head">
        <div className="nb-onb-head-inner">
          <BrandMark size={20} />
        </div>
      </header>

      <section className="nb-onb-body">
        <span className="nb-kicker">Growth only</span>
        <h1 className="nb-h2">Already have a website?</h1>
        <p className="nb-sub">
          Skip the site builder — just tell us about your business and put your
          AI growth agents to work.
        </p>

        <div
          className="card elev-sm"
          style={{ marginTop: 36, padding: "clamp(22px, 4vw, 34px)" }}
        >
          <div className="nb-fields">
            <Field label="Business name" htmlFor="business_name">
              <input
                id="business_name"
                value={form.business_name}
                onChange={(e) => set("business_name", e.target.value)}
                placeholder="Lumière Salon"
                className="input"
                style={{ minHeight: 44 }}
              />
            </Field>

            <div className="nb-info-grid">
              <Field label="Business type" htmlFor="category">
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="input"
                  style={{ minHeight: 44 }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="City" htmlFor="city">
                <input
                  id="city"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Bengaluru"
                  className="input"
                  style={{ minHeight: 44 }}
                />
              </Field>
            </div>

            <Field label="Ideal customer" htmlFor="target_audience">
              <input
                id="target_audience"
                value={form.target_audience}
                onChange={(e) => set("target_audience", e.target.value)}
                placeholder="Young professionals nearby"
                className="input"
                style={{ minHeight: 44 }}
              />
            </Field>

            <div className="nb-info-grid">
              <Field label="Phone" htmlFor="phone">
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="input"
                  style={{ minHeight: 44 }}
                />
              </Field>

              <Field label="Your website (optional)" htmlFor="existing_url">
                <input
                  id="existing_url"
                  value={form.existing_url}
                  onChange={(e) => set("existing_url", e.target.value)}
                  placeholder="yourbusiness.com"
                  className="input"
                  style={{ minHeight: 44 }}
                />
              </Field>
            </div>

            {error && (
              <p role="alert" className="nb-note nb-note-error" style={{ marginTop: 0 }}>
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="btn btn-primary btn-block"
              style={{ marginTop: 4, padding: 13, fontSize: 15 }}
            >
              {loading ? "Setting up…" : "Start growing →"}
            </button>
          </div>
        </div>

        <p
          className="nb-quiet"
          style={{ margin: "22px 0 0", textAlign: "center", fontSize: 14 }}
        >
          Want a website built too? <Link href="/onboarding">Generate one</Link>
        </p>
      </section>
    </main>
  );
}
