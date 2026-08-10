import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requestOrigin, siteMetadata } from "@/lib/seo";
import PublishedSite, {
  type PublishedContent,
} from "@/components/site/PublishedSite";

/**
 * Row-level security decides who sees what here, which is what makes the
 * private preview work: the "public read published sites" policy only exposes
 * published rows to visitors, while "own sites" lets the owner open their own
 * unpublished draft. A free user can preview their site; nobody else can find
 * it until they upgrade and it goes live.
 */
async function getSite(slug: string): Promise<PublishedContent | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sites")
    .select("content")
    .eq("slug", slug)
    .maybeSingle();
  return (data?.content as PublishedContent) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSite(slug);
  if (!content) return { title: "Site not found" };
  return siteMetadata(content, slug, await requestOrigin());
}

export default async function SitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getSite(slug);
  if (!content) notFound();
  return <PublishedSite content={content} />;
}
