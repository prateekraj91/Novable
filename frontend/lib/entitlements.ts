import { createClient } from "@/lib/supabase/server";

// What the free plan includes. The matching rule is enforced by a trigger on
// public.sites — this constant only drives the copy and the disabled states.
export const FREE_SITE_LIMIT = 1;

export type Entitlements = {
  /** profiles.is_paid — set by hand in the Supabase dashboard after payment. */
  isPaid: boolean;
  siteCount: number;
  /** Free users get one site; paid users are unlimited. */
  canCreateSite: boolean;
  /** Publishing live and every marketing agent are paid-only. */
  canPublish: boolean;
  canUseAgents: boolean;
};

const FREE: Entitlements = {
  isPaid: false,
  siteCount: 0,
  canCreateSite: false,
  canPublish: false,
  canUseAgents: false,
};

/**
 * Reads the signed-in user's plan for Server Components. Anything unexpected —
 * no session, no profile row, a project that hasn't run the latest schema yet —
 * resolves to the free plan, so a failure locks features rather than giving
 * them away.
 */
export async function getEntitlements(): Promise<Entitlements> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return FREE;

  const [profileRes, sitesRes] = await Promise.all([
    supabase.from("profiles").select("is_paid").eq("id", user.id).maybeSingle(),
    supabase
      .from("sites")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const isPaid = profileRes.data?.is_paid === true;
  const siteCount = sitesRes.count ?? 0;

  return {
    isPaid,
    siteCount,
    canCreateSite: isPaid || siteCount < FREE_SITE_LIMIT,
    canPublish: isPaid,
    canUseAgents: isPaid,
  };
}
