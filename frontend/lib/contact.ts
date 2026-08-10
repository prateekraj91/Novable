// Where "Get started" / sales enquiries go.
// Change these two values to update every contact CTA on the site.

export const CONTACT_EMAIL = "prateekrajcric18@gmail.com";

// Set to a number in international format, digits only (e.g. "919876543210")
// to send people to WhatsApp instead of email. Leave "" to use email.
export const CONTACT_WHATSAPP = "919142250799";

/** Opens WhatsApp with a message ready to send. */
export function whatsappLink(message: string): string {
  if (CONTACT_WHATSAPP) {
    return `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(
      message
    )}`;
  }

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Novable"
  )}&body=${encodeURIComponent(message)}`;
}

// The two things anyone can buy. Both the landing pricing section and the
// in-app paywall use these, so the offer can only ever be stated once.
export const STANDARD_PRICE = "₹500";

export const STANDARD_PLAN_MESSAGE =
  "Hi, I want the Novable Standard plan (₹500).";

export const CUSTOM_PLAN_MESSAGE =
  "Hi, I'm interested in a custom Novable plan.";

export const standardPlanLink = () => whatsappLink(STANDARD_PLAN_MESSAGE);
export const customPlanLink = () => whatsappLink(CUSTOM_PLAN_MESSAGE);

export function contactLink(planName: string): string {
  const msg = `Hi! I'd like to get started with Novable (${planName} plan).`;

  if (CONTACT_WHATSAPP) {
    return `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  }

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Novable — ${planName} plan`
  )}&body=${encodeURIComponent(msg)}`;
}
