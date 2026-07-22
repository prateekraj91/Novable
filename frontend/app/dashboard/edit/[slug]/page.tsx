import { notFound } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";
import SiteEditManager from "@/components/site/SiteEditManager";
import type { GeneratedWebsite } from "@/types/website";

export default async function EditSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: site } = await supabase
    .from("sites")
    .select("slug, content")
    .eq("slug", slug)
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!site) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-base text-cream md:flex-row">
      <Sidebar />
      <main className="flex-1">
        <div className="px-6 pt-8 pb-16 md:px-10">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/dashboard"
              className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-amber"
            >
              ← Dashboard
            </Link>
            <h1 className="mt-3 font-display text-3xl leading-tight text-cream md:text-4xl">
              Edit your site
            </h1>
            <p className="mt-2 text-muted">
              Describe changes in plain English — the AI rewrites your site, live.
            </p>

            <div className="mt-8">
              <SiteEditManager
                slug={site.slug}
                initialContent={site.content as GeneratedWebsite}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
