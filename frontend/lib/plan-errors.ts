// The gating triggers in supabase/schema.sql raise errors carrying these
// markers. Matching on them lets the UI turn a Postgres exception into an
// upgrade prompt instead of "something went wrong".

export const FREE_PLAN_SITE_LIMIT = "FREE_PLAN_SITE_LIMIT";
export const FREE_PLAN_AGENTS_LOCKED = "FREE_PLAN_AGENTS_LOCKED";

function messageOf(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message ?? "");
  }
  return "";
}

/** True when the database refused a write because the account is on the free plan. */
export function isPlanLimitError(err: unknown, marker: string): boolean {
  return messageOf(err).includes(marker);
}
