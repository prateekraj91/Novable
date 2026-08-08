"use client";

import { OnboardingData } from "@/types/onboarding";
import { SITE_THEME_OPTIONS } from "@/components/site/themes";

type Props = {
  data: OnboardingData;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="nb-review-row">
      <p className="nb-info-label">{label}</p>
      <p className="nb-review-value">{value || "—"}</p>
    </div>
  );
}

function ReviewCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-divider)",
        background: "var(--color-bg)",
        padding: "0 22px",
      }}
    >
      <h3
        className="nb-h3"
        style={{
          padding: "18px 0",
          borderBottom: "1px solid var(--color-divider)",
          fontSize: 19,
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function Step4({ data }: Props) {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "var(--color-accent-2-100)",
            marginBottom: 18,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 12.5L10.2 15.5L17 8.5"
              stroke="var(--color-accent-2-700)"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="nb-h2" style={{ fontSize: "clamp(26px, 3vw, 32px)" }}>
          Review your workspace
        </h2>

        <p className="nb-sub" style={{ fontSize: 15 }}>
          You&apos;re almost there. Review your business information before
          Novable creates your workspace.
        </p>
      </div>

      <ReviewCard title="Business Information">
        <Row label="Business Name" value={data.business_name} />
        <Row label="Category" value={data.category} />
        <Row label="City" value={data.city} />
        <Row label="Address" value={data.address} />
      </ReviewCard>

      <ReviewCard title="Brand Profile">
        <Row label="Description" value={data.description} />
        <Row label="Target Audience" value={data.target_audience} />
        <Row label="Brand Tone" value={data.tone} />
        <Row
          label="Site Theme"
          value={
            SITE_THEME_OPTIONS.find((o) => o.key === data.theme)?.label ?? ""
          }
        />
      </ReviewCard>

      <ReviewCard title="Contact Details">
        <Row label="Email" value={data.email} />
        <Row label="Phone" value={data.phone} />
        <Row label="Primary Link" value={data.social_link} />
      </ReviewCard>

      <p
        className="nb-note nb-note-ok"
        style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}
      >
        By creating your workspace, Novable will use this information to
        personalize your dashboard, generate AI recommendations, and connect
        future integrations. You can edit everything later from Settings.
      </p>
    </div>
  );
}
