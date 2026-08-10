const DEFAULT_DESTINATION = "/dashboard";

/**
 * Where to send someone after they sign in or sign up. The two landing CTAs
 * differ only in this value — "Get Started" carries ?next=/pricing, "Try for
 * free" carries ?next=/onboarding.
 *
 * Only same-origin paths are honoured, so the parameter can't be used to bounce
 * a freshly signed-in user off to another site.
 */
export function safeNext(
  next: string | string[] | undefined,
  fallback: string = DEFAULT_DESTINATION
): string {
  const value = Array.isArray(next) ? next[0] : next;
  if (!value) return fallback;
  // "//evil.com" and "/\evil.com" are protocol-relative URLs, not local paths.
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
