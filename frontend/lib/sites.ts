import { createClient } from "@/lib/supabase/client";
import type { GenerateWebsitePayload, GeneratedWebsite } from "@/types/website";
import { DEFAULT_SITE_TEMPLATE } from "@/components/site/themes";
import { FREE_PLAN_SITE_LIMIT } from "@/lib/plan-errors";

export type BusinessInput = {
  business_name: string;
  category: string;
  city: string;
  target_audience: string;
  phone: string;
  existing_url?: string;
};

/**
 * Saves just a business (no generated site) — used by the "I already have a
 * website" growth-only flow. Returns the new business id, or null if no user.
 */
export async function saveBusinessOnly(
  input: BusinessInput
): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("businesses")
    .insert({
      user_id: user.id,
      name: input.business_name,
      category: input.category,
      city: input.city,
      target_audience: input.target_audience,
      phone: input.phone,
      social_links: input.existing_url ? [input.existing_url] : [],
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "site";
}

/**
 * Persists a generated website (and its business) to Supabase for the signed-in
 * user. Returns the new site's id + public slug, or null if no user is signed in.
 */
export async function saveGeneratedSite(
  input: GenerateWebsitePayload,
  content: GeneratedWebsite,
  /**
   * Visual theme key chosen during onboarding. Omitted or unknown values fall
   * back to the original design when the published site renders.
   */
  theme?: string
): Promise<{ id: string; slug: string } | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // The one-site rule is enforced by a trigger on public.sites, but the site
  // row is only written after the business row. Asking first means a blocked
  // save doesn't leave an orphaned business behind — and the caller gets the
  // same marker either way.
  const [{ data: profile }, { count: siteCount }] = await Promise.all([
    supabase.from("profiles").select("is_paid").eq("id", user.id).maybeSingle(),
    supabase
      .from("sites")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  if (profile?.is_paid !== true && (siteCount ?? 0) >= 1) {
    throw new Error(`${FREE_PLAN_SITE_LIMIT}: the free plan includes one website`);
  }

  const { data: business, error: bizErr } = await supabase
    .from("businesses")
    .insert({
      user_id: user.id,
      name: input.business_name,
      category: input.category,
      city: input.city,
      target_audience: input.target_audience,
      tone: input.tone,
      phone: input.phone,
      email: input.email,
      address: input.address,
      description: input.description,
      social_links: input.social_links,
    })
    .select("id")
    .single();
  if (bizErr) throw bizErr;

  const slug = `${slugify(input.business_name)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  // Embed public contact info in the content so published site pages can render
  // it without reading the owner-only businesses table.
  const enrichedContent = {
    ...content,
    _business: {
      name: input.business_name,
      phone: input.phone,
      email: input.email,
      address: input.address,
      city: input.city,
      // Used as a fallback for the social share description; sites saved
      // before this field existed simply fall back to the generated copy.
      description: input.description,
    },
    _images: input.reference_images ?? [],
    _theme: theme || DEFAULT_SITE_TEMPLATE,
  };

  const { data: site, error: siteErr } = await supabase
    .from("sites")
    .insert({
      business_id: business.id,
      user_id: user.id,
      slug,
      content: enrichedContent,
      published: true,
    })
    .select("id, slug")
    .single();
  if (siteErr) throw siteErr;

  return { id: site.id as string, slug: site.slug as string };
}
