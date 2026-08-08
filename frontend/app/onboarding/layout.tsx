import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Server-side guard: anyone not signed in is bounced to /login before any
// onboarding page renders (covers /onboarding and /onboarding/existing).
export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // `organic` scopes both onboarding routes to the Organic design system,
  // matching the landing, auth and dashboard pages.
  return <div className="organic">{children}</div>;
}
