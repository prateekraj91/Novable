"use client";

import { OnboardingData } from "@/types/onboarding";

type Props = {
  data: OnboardingData;
};

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-hairline py-4 md:flex-row md:items-start md:justify-between">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
        {label}
      </p>

      <p className="max-w-md text-right text-cream whitespace-pre-wrap">
        {value || "-"}
      </p>
    </div>
  );
}

export default function Step4({ data }: Props) {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sage/10 border border-sage/20">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7 12.5L10.2 15.5L17 8.5"
              stroke="#6FCF97"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="font-display text-3xl text-cream">
          Review your workspace
        </h2>

        <p className="mt-2 text-muted max-w-lg">
          You're almost there. Review your business information before
          Novable creates your workspace.
        </p>

      </div>

      {/* Business */}

      <div className="rounded-md border border-hairline bg-surface/40 px-6">

        <h3 className="border-b border-hairline py-5 font-display text-xl text-cream">
          Business Information
        </h3>

        <Row
          label="Business Name"
          value={data.business_name}
        />

        <Row
          label="Category"
          value={data.category}
        />

        <Row
          label="City"
          value={data.city}
        />

        <Row
          label="Address"
          value={data.address}
        />

      </div>

      {/* Brand */}

      <div className="rounded-md border border-hairline bg-surface/40 px-6">

        <h3 className="border-b border-hairline py-5 font-display text-xl text-cream">
          Brand Profile
        </h3>

        <Row
          label="Description"
          value={data.description}
        />

        <Row
          label="Target Audience"
          value={data.target_audience}
        />

        <Row
          label="Brand Tone"
          value={data.tone}
        />

      </div>

      {/* Contact */}

      <div className="rounded-md border border-hairline bg-surface/40 px-6">

        <h3 className="border-b border-hairline py-5 font-display text-xl text-cream">
          Contact Details
        </h3>

        <Row
          label="Email"
          value={data.email}
        />

        <Row
          label="Phone"
          value={data.phone}
        />

        <Row
          label="Primary Link"
          value={data.social_link}
        />

      </div>

      {/* Notice */}

      <div className="rounded-md border border-amber/20 bg-amber/5 p-5">

        <p className="text-sm text-muted leading-relaxed">
          By creating your workspace, Novable will use this information to
          personalize your dashboard, generate AI recommendations, and connect
          future integrations. You can edit everything later from Settings.
        </p>

      </div>

    </div>
  );
}