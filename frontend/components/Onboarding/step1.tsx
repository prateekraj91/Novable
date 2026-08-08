"use client";

import { OnboardingData, OnboardingErrors } from "@/types/onboarding";
import Field from "./Field";

type Props = {
  data: Pick<OnboardingData, "business_name" | "category" | "city" | "address">;
  errors: Pick<OnboardingErrors, "business_name" | "category" | "city" | "address">;
  update: (
    field: "business_name" | "category" | "city" | "address",
    value: string
  ) => void;
};

const businessCategories = [
  "Restaurant",
  "Cafe",
  "Retail Store",
  "Salon",
  "Clinic",
  "Gym",
  "Hotel",
  "Education",
  "Professional Services",
  "Real Estate",
  "E-commerce",
  "Technology",
  "Manufacturing",
  "Other",
];

export default function Step1({ data, update, errors }: Props) {
  return (
    <div className="nb-fields">
      <Field label="Business Name *" htmlFor="business_name" error={errors.business_name}>
        <input
          id="business_name"
          type="text"
          value={data.business_name}
          onChange={(e) => update("business_name", e.target.value)}
          placeholder="Acme Technologies Pvt. Ltd."
          className="input"
          style={{ minHeight: 44 }}
          aria-invalid={!!errors.business_name}
        />
      </Field>

      <Field label="Business Category *" htmlFor="category" error={errors.category}>
        <select
          id="category"
          value={data.category}
          onChange={(e) => update("category", e.target.value)}
          className="input"
          style={{ minHeight: 44 }}
          aria-invalid={!!errors.category}
        >
          <option value="">Select Category</option>
          {businessCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </Field>

      <Field label="City *" htmlFor="city" error={errors.city}>
        <input
          id="city"
          type="text"
          value={data.city}
          onChange={(e) => update("city", e.target.value)}
          placeholder="Mumbai"
          className="input"
          style={{ minHeight: 44 }}
          aria-invalid={!!errors.city}
        />
      </Field>

      <Field label="Business Address *" htmlFor="address" error={errors.address}>
        <textarea
          id="address"
          rows={3}
          value={data.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="Street, Area, City, State, PIN"
          className="input"
          style={{ resize: "none" }}
          aria-invalid={!!errors.address}
        />
      </Field>
    </div>
  );
}
