"use client";

import {
  OnboardingData,
  OnboardingErrors,
} from "@/types/onboarding";

type Props = {
  data: Pick<
    OnboardingData,
    "description" | "target_audience" | "tone"
  >;

  errors: Pick<
    OnboardingErrors,
    "description" | "target_audience" | "tone"
  >;

  update: (
    field:
      | "description"
      | "target_audience"
      | "tone",
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

export default function Step2({
  data,
  update,
  errors,
}: Props) {

  const remaining = DESCRIPTION_LIMIT - data.description.length;

  return (
    <div className="space-y-7">

      {/* Business Description */}

      <div>
        <div className="flex items-center justify-between">
          <label className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
            Business Description *
          </label>

          <span
            className={`font-mono text-xs ${
              remaining < 0 ? "text-amber" : "text-muted"
            }`}
          >
            {remaining}
          </span>
        </div>

        <textarea
          rows={6}
          value={data.description}
          maxLength={DESCRIPTION_LIMIT}
          onChange={(e) =>
            update("description", e.target.value)
          }
          placeholder="Tell us what your business does, the products or services you offer, and what makes you different."
          className={`mt-2 w-full resize-none rounded-md border bg-surface/60 px-4 py-3 text-cream outline-none transition-colors focus:border-amber ${
            errors.description
              ? "border-amber"
              : "border-hairline"
          }`}
        />

        {errors.description && (
          <p className="mt-2 text-xs text-amber">
            {errors.description}
          </p>
        )}
      </div>

      {/* Target Audience */}

      <div>
        <label className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
          Target Audience *
        </label>

        <input
          type="text"
          value={data.target_audience}
          onChange={(e) =>
            update("target_audience", e.target.value)
          }
          placeholder="College students, working professionals, pet owners..."
          className={`mt-2 w-full rounded-md border bg-surface/60 px-4 py-3 text-cream outline-none transition-colors focus:border-amber ${
            errors.target_audience
              ? "border-amber"
              : "border-hairline"
          }`}
        />

        {errors.target_audience && (
          <p className="mt-2 text-xs text-amber">
            {errors.target_audience}
          </p>
        )}
      </div>

      {/* Brand Tone */}

      <div>
        <label className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
          Brand Tone *
        </label>

        <select
          value={data.tone}
          onChange={(e) =>
            update("tone", e.target.value)
          }
          className={`mt-2 w-full rounded-md border bg-surface/60 px-4 py-3 text-cream outline-none focus:border-amber ${
            errors.tone
              ? "border-amber"
              : "border-hairline"
          }`}
        >
          <option value="">Select Tone</option>

          {tones.map((tone) => (
            <option
              key={tone}
              value={tone}
              className="bg-surface"
            >
              {tone}
            </option>
          ))}
        </select>

        {errors.tone && (
          <p className="mt-2 text-xs text-amber">
            {errors.tone}
          </p>
        )}

        <p className="mt-3 text-sm text-muted">
          Novable uses this to generate marketing content, customer
          communication, and recommendations that match your brand.
        </p>
      </div>

    </div>
  );
}