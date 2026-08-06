"use client";

import {
  OnboardingData,
  OnboardingErrors,
} from "@/types/onboarding";

type Props = {
  data: Pick<
    OnboardingData,
    "email" | "phone" | "social_link"
  >;

  errors: Pick<
    OnboardingErrors,
    "email" | "phone" | "social_link"
  >;

  update: (
    field:
      | "email"
      | "phone"
      | "social_link",
    value: string
  ) => void;
};

export default function Step3({
  data,
  errors,
  update,
}: Props) {
  return (
    <div className="space-y-7">

      {/* Contact Information */}

      <div>
        <h3 className="font-display text-xl text-cream">
          Contact Information
        </h3>

        <p className="mt-1 text-sm text-muted">
          This helps Novable connect your workspace and contact you when
          needed.
        </p>
      </div>

      {/* Email */}

      <div>
        <label className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
          Business Email *
        </label>

        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="hello@company.com"
          className={`mt-2 w-full rounded-md border bg-surface/60 px-4 py-3 text-cream outline-none transition-colors focus:border-amber ${
            errors.email ? "border-amber" : "border-hairline"
          }`}
        />

        {errors.email && (
          <p className="mt-2 text-xs text-amber">{errors.email}</p>
        )}
      </div>

      {/* Phone */}

      <div>
        <label className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
          Business Phone *
        </label>

        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+91 98765 43210"
          className={`mt-2 w-full rounded-md border bg-surface/60 px-4 py-3 text-cream outline-none transition-colors focus:border-amber ${
            errors.phone ? "border-amber" : "border-hairline"
          }`}
        />

        {errors.phone && (
          <p className="mt-2 text-xs text-amber">{errors.phone}</p>
        )}
      </div>

      {/* Divider */}

<div className="border-t border-hairline pt-6">
  <h3 className="font-display text-xl text-cream">
    Online Presence
  </h3>

  <p className="mt-1 text-sm text-muted">
    Share one link that best represents your business online. This could be
    your website, Instagram, Facebook, LinkedIn or Google Business Profile.
  </p>
</div>

{/* Primary Business Link */}

<div>
  <label className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
    Primary Business Link *
  </label>

  <input
    type="url"
    inputMode="url"
    autoComplete="url"
    value={data.social_link}
    onChange={(e) => update("social_link", e.target.value)}
    placeholder="https://yourbusiness.com"
    className={`mt-2 w-full rounded-md border bg-surface/60 px-4 py-3 text-cream outline-none transition-colors focus:border-amber ${
      errors.social_link ? "border-amber" : "border-hairline"
    }`}
  />

  {errors.social_link && (
    <p className="mt-2 text-xs text-amber">
      {errors.social_link}
    </p>
  )}

  <p className="mt-2 text-sm text-muted">
    You can connect additional platforms from your dashboard later.
  </p>
</div>

    </div>
  );
}