"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import ProgressBar from "./ProgressBar";

import {
  OnboardingData,
  OnboardingErrors,
  initialOnboardingData,
} from "@/types/onboarding";
import { GenerateWebsitePayload, GeneratedWebsite } from "@/types/website";
import { API_BASE_URL } from "@/lib/config";
import { saveGeneratedSite } from "@/lib/sites";
import { createClient } from "@/lib/supabase/client";

const TOTAL_STEPS = 4;

const GENERATING_MESSAGES = [
  "Writing your content…",
  "Choosing your colours…",
  "Almost done…",
];

const stepTitles = [
  "Business",
  "Strategy",
  "Contact",
  "Review",
];

export default function OnboardingForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [form, setForm] =
    useState<OnboardingData>(initialOnboardingData);

  const [errors, setErrors] =
    useState<OnboardingErrors>({});

  const [loading, setLoading] =
    useState(false);

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [msgIndex, setMsgIndex] = useState(0);

  // Rotate the status messages while the site is generating (~14s), holding on
  // the final "Almost done…" until the request resolves.
  useEffect(() => {
    if (!loading) {
      setMsgIndex(0);
      return;
    }
    const id = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, GENERATING_MESSAGES.length - 1));
    }, 4500);
    return () => clearInterval(id);
  }, [loading]);

  async function uploadImages(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();
    const urls: string[] = [];
    for (const file of Array.from(files).slice(0, 4)) {
      const path = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error } = await supabase.storage
        .from("references")
        .upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("references").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    setImages((prev) => [...prev, ...urls].slice(0, 4));
    setUploading(false);
  }

  function update(
    field: keyof OnboardingData,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }

  function validateCurrentStep() {
    const nextErrors: OnboardingErrors = {};

    switch (step) {
      case 1:
        if (!form.business_name.trim())
          nextErrors.business_name =
            "Business name is required.";

        if (!form.category.trim())
          nextErrors.category =
            "Select a category.";

        if (!form.city.trim())
          nextErrors.city =
            "Enter your city.";

        if (!form.address.trim())
          nextErrors.address =
            "Enter your address.";

        break;

      case 2:
        if (!form.description.trim())
          nextErrors.description =
            "Tell us about your business.";

        if (!form.target_audience.trim())
          nextErrors.target_audience =
            "Who is your ideal customer?";

        if (!form.tone.trim())
          nextErrors.tone =
            "Choose your preferred tone.";

        break;

      case 3:
        if (!form.email.trim())
          nextErrors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
          nextErrors.email = "Enter a valid email address.";

        if (!form.phone.trim())
          nextErrors.phone = "Phone number is required.";
        else {
          const digits = form.phone.replace(/\D/g, "");
          if (digits.length < 8 || digits.length > 15)
            nextErrors.phone = "Enter a valid phone number.";
        }

        if (!form.social_link.trim())
          nextErrors.social_link = "Add one social link.";
        else if (
          !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/.test(
            form.social_link.trim()
          )
        )
          nextErrors.social_link =
            "Enter a valid link (e.g. instagram.com/yourbiz).";

        break;
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;

    setStep((prev) =>
      Math.min(prev + 1, TOTAL_STEPS)
    );
  }

  function previousStep() {
    setStep((prev) =>
      Math.max(prev - 1, 1)
    );
  }

  async function handleSubmit() {
    setSubmitError(null);
    setLoading(true);

    try {
      const payload: GenerateWebsitePayload = {
        business_name: form.business_name,
        category: form.category,
        city: form.city,
        target_audience: form.target_audience,
        tone: form.tone,
        phone: form.phone,
        email: form.email,
        address: form.address,
        description: form.description,
        social_links: [form.social_link].filter(Boolean),
        reference_images: images,
      };

      const res = await fetch(`${API_BASE_URL}/generate-website`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const site: GeneratedWebsite = await res.json();
      sessionStorage.setItem("growthpilot_site", JSON.stringify(site));

      // Persist to the user's account if signed in; otherwise just preview.
      try {
        const saved = await saveGeneratedSite(payload, site);
        if (saved) {
          router.push(`/result?slug=${saved.slug}`);
          return;
        }
      } catch (saveErr) {
        console.error("Could not save generated site:", saveErr);
      }

      router.push("/result");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong.";

      setSubmitError(
        msg.includes("Failed to fetch")
          ? "Couldn't reach the server. Check that the backend is running and reachable."
          : msg
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <svg
          className="h-10 w-10 animate-spin text-amber"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeOpacity="0.25"
          />
          <path
            d="M21 12a9 9 0 00-9-9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <div aria-live="polite">
          <p className="font-display text-xl text-cream">Generating your site</p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-sage">
            {GENERATING_MESSAGES[msgIndex]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProgressBar
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        titles={stepTitles}
      />

      {step === 1 && (
        <Step1
          data={{
            business_name: form.business_name,
            category: form.category,
            city: form.city,
            address: form.address,
          }}
          errors={{
            business_name: errors.business_name,
            category: errors.category,
            city: errors.city,
            address: errors.address,
          }}
          update={update}
        />
      )}

      {step === 2 && (
        <Step2
          data={{
            description: form.description,
            target_audience: form.target_audience,
            tone: form.tone,
          }}
          errors={{
            description: errors.description,
            target_audience: errors.target_audience,
            tone: errors.tone,
          }}
          update={update}
        />
      )}

      {step === 2 && (
        <div className="mt-8">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
            Reference images (optional)
          </p>
          <p className="mt-1 text-xs text-muted/70">
            Add up to 4 photos of your space, logo, or products — the AI matches
            your look &amp; colours.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative h-16 w-16 overflow-hidden rounded-md border border-hairline"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    setImages((p) => p.filter((_, j) => j !== i))
                  }
                  className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center bg-base/80 text-xs text-cream"
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < 4 && (
              <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border border-dashed border-hairline text-2xl text-muted transition hover:border-amber hover:text-amber">
                {uploading ? "…" : "+"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => uploadImages(e.target.files)}
                />
              </label>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <Step3
          data={{
            email: form.email,
            phone: form.phone,
            social_link: form.social_link,
          }}
          errors={{
            email: errors.email,
            phone: errors.phone,
            social_link: errors.social_link,
          }}
          update={update}
        />
      )}

      {step === 4 && (
        <Step4 data={form} />
      )}

      {submitError && (
        <div className="mt-6 rounded-md border border-amber/30 bg-amber/5 p-4 text-sm text-amber">
          {submitError}
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={previousStep}
            className="rounded-sm border border-hairline px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-cream transition hover:border-muted"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={nextStep}
            className="rounded-sm bg-amber px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-base transition-transform hover:-translate-y-0.5"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-sm bg-amber px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-base transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Generating your site..." : "Create Workspace"}
          </button>
        )}
      </div>
    </>
  );
}
