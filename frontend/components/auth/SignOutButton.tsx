"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton({
  className = "btn btn-secondary",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut} className={className} style={style}>
      Sign out
    </button>
  );
}
