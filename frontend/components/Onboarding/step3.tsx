"use client";

import { OnboardingData, OnboardingErrors } from "@/types/onboarding";
import Field from "./Field";

type Props = {
  data: Pick<OnboardingData, "email" | "phone" | "social_link">;
  errors: Pick<OnboardingErrors, "email" | "phone" | "social_link">;
  update: (field: "email" | "phone" | "social_link", value: string) => void;
};

export default function Step3({ data, errors, update }: Props) {
  return (
    <div className="nb-fields">
      <div>
        <h3 className="nb-h3">Contact Information</h3>
        <p className="nb-quiet" style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.5 }}>
          This helps Novable connect your workspace and contact you when needed.
        </p>
      </div>

      <Field label="Business Email *" htmlFor="email" error={errors.email}>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="hello@company.com"
          className="input"
          style={{ minHeight: 44 }}
          aria-invalid={!!errors.email}
        />
      </Field>

      <Field label="Business Phone *" htmlFor="phone" error={errors.phone}>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+91 98765 43210"
          className="input"
          style={{ minHeight: 44 }}
          aria-invalid={!!errors.phone}
        />
      </Field>

      <div style={{ borderTop: "1px solid var(--color-divider)", paddingTop: 22 }}>
        <h3 className="nb-h3">Online Presence</h3>
        <p className="nb-quiet" style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.5 }}>
          Share one link that best represents your business online. This could be
          your website, Instagram, Facebook, LinkedIn or Google Business Profile.
        </p>
      </div>

      <Field
        label="Primary Business Link *"
        htmlFor="social_link"
        error={errors.social_link}
        hint="You can connect additional platforms from your dashboard later."
      >
        <input
          id="social_link"
          type="url"
          inputMode="url"
          autoComplete="url"
          value={data.social_link}
          onChange={(e) => update("social_link", e.target.value)}
          placeholder="https://yourbusiness.com"
          className="input"
          style={{ minHeight: 44 }}
          aria-invalid={!!errors.social_link}
        />
      </Field>
    </div>
  );
}
