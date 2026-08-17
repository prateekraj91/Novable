import raw from "../data/site.json";

/**
 * mapRow(): the ONLY place you adapt to your real Supabase schema.
 *
 * `raw` is the exact row pulled from `public.sites`.
 * In Novable, `raw.content` contains the WebsiteOutput JSON schema:
 * - hero_title, hero_subtitle, about, services [{title, description}], primary_color, etc.
 */
function mapRow(r) {
  if (!r) return getDefaultSite();

  // Unwrap content JSONB column if present
  const c = r.content && typeof r.content === "object" ? r.content : r;

  return {
    name: c.hero_title || c.name || c.business_name || "Your Business",
    tagline: c.hero_subtitle || c.tagline || "",
    category: c.category || c.business_type || "",
    about: c.about || c.description || "",
    phone: c.phone || c.contact_phone || "",
    whatsapp: (c.whatsapp || c.phone || "").toString().replace(/[^0-9]/g, ""),
    address: c.address || c.location || "",
    mapsUrl: c.maps_url || c.google_maps_url || "",
    services: normalizeServices(c.services),
    theme: {
      primary: (c.theme && c.theme.primary) || c.primary_color || "#b5502e",
      ink: (c.theme && c.theme.ink) || "#1f2a37",
    },
    socials: c.socials || {},
    faqs: Array.isArray(c.faq) ? c.faq : [],
    testimonials: Array.isArray(c.testimonials) ? c.testimonials : [],
  };
}

function normalizeServices(s) {
  if (!Array.isArray(s)) return [];
  return s.map((x) =>
    typeof x === "string"
      ? { name: x, desc: "", price: "" }
      : {
          name: x.name || x.title || "",
          desc: x.desc || x.description || "",
          price: x.price || "",
        }
  );
}

function getDefaultSite() {
  return {
    name: "Your Business",
    tagline: "",
    category: "",
    about: "",
    phone: "",
    whatsapp: "",
    address: "",
    mapsUrl: "",
    services: [],
    theme: { primary: "#b5502e", ink: "#1f2a37" },
    socials: {},
    faqs: [],
    testimonials: [],
  };
}

const site = mapRow(raw);
export default site;

