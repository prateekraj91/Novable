"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { API_BASE_URL } from "@/lib/config";

// Starts a Razorpay checkout for a plan. If the visitor isn't signed in, sends
// them to sign up first.
export default function SubscribeButton({
  amount,
  className = "",
  children,
}: {
  amount: number;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function go() {
    setLoading(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/signup");
      return;
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("name, phone")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    try {
      const res = await fetch(`${API_BASE_URL}/create-payment-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          business_name: business?.name ?? "Novable customer",
          phone: business?.phone ?? "",
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { payment_url } = await res.json();
      window.location.href = payment_url;
    } catch {
      setError("Couldn't start checkout — is payments configured?");
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={go} disabled={loading} className={className}>
        {loading ? "Starting…" : children}
      </button>
      {error && (
        <p className="mt-2 text-center font-mono text-[0.6rem] text-amber">
          {error}
        </p>
      )}
    </>
  );
}
