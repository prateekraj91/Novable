// types/onboarding.ts

import { DEFAULT_SITE_TEMPLATE } from "@/components/site/themes";

export type OnboardingData = {
  business_name: string;
  category: string;
  city: string;
  address: string;

  description: string;
  target_audience: string;
  tone: string;
  /** Visual theme key for the generated site. "classic" is the original look. */
  theme: string;

  email: string;
  phone: string;

  social_link: string;
};

export type OnboardingErrors = Partial<
  Record<keyof OnboardingData, string>
>;

export const initialOnboardingData: OnboardingData = {
  business_name: "",
  category: "",
  city: "",
  address: "",

  description: "",
  target_audience: "",
  tone: "",
  theme: DEFAULT_SITE_TEMPLATE,

  email: "",
  phone: "",

  social_link: "",
};