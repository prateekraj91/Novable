import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import type { PublishedContent } from "@/components/site/PublishedSite";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function isHex(v: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim());
}

/**
 * Fallback share card for businesses that uploaded no photos: the business
 * name, its tagline and city on the site's own brand colour. Rendered
 * server-side with next/og, so nothing leaves the app — no external service.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("sites")
    .select("content")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  const content = (data?.content ?? null) as PublishedContent | null;
  if (!content) return new Response("Not found", { status: 404 });

  const biz = content._business ?? {};
  const accent = isHex(content.primary_color || "")
    ? content.primary_color.trim()
    : "#16a34a";
  const name = (biz.name || content.hero_title || "Website").slice(0, 60);
  const tagline = (content.hero_subtitle || content.meta_description || "").slice(
    0,
    140
  );
  const city = biz.city || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: `linear-gradient(135deg, ${accent} 0%, #111111 140%)`,
          color: "#ffffff",
        }}
      >
        {city ? (
          <div style={{ fontSize: 30, opacity: 0.85, marginBottom: 24 }}>
            {city}
          </div>
        ) : null}
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>
          {name}
        </div>
        {tagline ? (
          <div
            style={{
              fontSize: 36,
              opacity: 0.9,
              marginTop: 28,
              lineHeight: 1.35,
            }}
          >
            {tagline}
          </div>
        ) : null}
      </div>
    ),
    size
  );
}
