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
    <div className="nb-app">
      <Sidebar />
      <main className="nb-app-main">
        <div className="nb-page nb-page-wide">
          <div className="nb-page-inner">
            <Link href="/dashboard" className="btn btn-ghost" style={{ marginLeft: -4 }}>
              ← Dashboard
            </Link>
            <h1 className="nb-h2" style={{ marginTop: 10 }}>
              Edit your site
            </h1>
            <p className="nb-sub">
              Describe changes in plain English — the AI rewrites your site, live.
            </p>

            <div style={{ marginTop: 32 }}>
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
