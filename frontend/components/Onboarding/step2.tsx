"use client";

import { OnboardingData, OnboardingErrors } from "@/types/onboarding";
import Field from "./Field";

type Props = {
  data: Pick<OnboardingData, "description" | "target_audience" | "tone">;
  errors: Pick<OnboardingErrors, "description" | "target_audience" | "tone">;
  update: (
    field: "description" | "target_audience" | "tone",
    value: string
  ) => void;
};

const tones = [
  "Professional",
  "Friendly",
  "Luxury",
  "Modern",
  "Minimal",
  "Playful",
  "Bold",
  "Premium",
];

const DESCRIPTION_LIMIT = 400;

export default function Step2({ data, update, errors }: Props) {
  const remaining = DESCRIPTION_LIMIT - data.description.length;

  return (
    <div className="nb-fields">
      <Field
        label="Business Description *"
        htmlFor="description"
        error={errors.description}
        trailing={
          <span
            className="nb-quiet"
            style={{
              fontSize: 12,
              color: remaining < 40 ? "var(--color-accent-700)" : undefined,
            }}
          >
            {remaining}
          </span>
        }
      >
        <textarea
          id="description"
          rows={6}
          value={data.description}
          maxLength={DESCRIPTION_LIMIT}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Tell us what your business does, the products or services you offer, and what makes you different."
          className="input"
          style={{ resize: "none" }}
          aria-invalid={!!errors.description}
        />
      </Field>

      <Field
        label="Target Audience *"
        htmlFor="target_audience"
        error={errors.target_audience}
      >
        <input
          id="target_audience"
          type="text"
          value={data.target_audience}
          onChange={(e) => update("target_audience", e.target.value)}
          placeholder="College students, working professionals, pet owners..."
          className="input"
          style={{ minHeight: 44 }}
          aria-invalid={!!errors.target_audience}
        />
      </Field>

      <Field
        label="Brand Tone *"
        htmlFor="tone"
        error={errors.tone}
        hint="Novable uses this to generate marketing content, customer communication, and recommendations that match your brand."
      >
        <select
          id="tone"
          value={data.tone}
          onChange={(e) => update("tone", e.target.value)}
          className="input"
          style={{ minHeight: 44 }}
          aria-invalid={!!errors.tone}
        >
          <option value="">Select Tone</option>
          {tones.map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}
