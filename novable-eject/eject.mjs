#!/usr/bin/env node
/**
 * Novable — Eject a single generated site into a standalone, editable project.
 *
 * WHAT IT DOES
 *   Pulls one site's content row out of Supabase and writes a self-contained
 *   Next.js project into ./ejected/<slug>/ that renders that content. From then
 *   on it is a normal codebase: open it, add the custom feature (ordering,
 *   booking, gallery, whatever the AI template can't do), push to GitHub,
 *   deploy to Vercel.
 *
 * USAGE
 *   # real run (needs env vars, see below):
 *   node eject.mjs <SITE_ID>
 *
 *   # dry test with a local sample row, no network:
 *   node eject.mjs demo --from-file ./sample-row.json
 *
 * ENV VARS (real run)
 *   SUPABASE_URL          e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_KEY  the service_role key (server-side only — never ship this)
 *   NOVABLE_TABLE         optional, defaults to "sites"
 */

import { readFile, writeFile, mkdir, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---- tiny arg parser ---------------------------------------------------------
const argv = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith("--")) {
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) { flags[key] = next; i++; }
    else flags[key] = true;
  } else positional.push(a);
}

const SITE_ID = positional[0];
const FROM_FILE = flags["from-file"];
const TABLE = process.env.NOVABLE_TABLE || "sites";

if (!SITE_ID) {
  console.error("Usage: node eject.mjs <SITE_ID> [--from-file sample-row.json]");
  process.exit(1);
}

// ---- fetch the row -----------------------------------------------------------
async function fetchRow(id) {
  if (FROM_FILE) {
    return JSON.parse(await readFile(FROM_FILE, "utf8"));
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_KEY (or use --from-file).");
  }
  const endpoint = `${url}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}&select=*`;
  const res = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error(`No row in "${TABLE}" with id=${id}`);
  }
  return rows[0];
}

// ---- main --------------------------------------------------------------------
function slugify(s) {
  return String(s || "site")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "site";
}

async function main() {
  console.log(`→ Fetching site ${SITE_ID} from "${TABLE}"...`);
  const row = await fetchRow(SITE_ID);

  const slug = slugify(row.slug || row.name || row.business_name || SITE_ID);
  const outDir = path.join(__dirname, "ejected", slug);
  const templateDir = path.join(__dirname, "template");

  if (existsSync(outDir)) {
    console.error(`✗ ${outDir} already exists. Remove it or pick another slug.`);
    process.exit(1);
  }

  console.log(`→ Scaffolding project at ejected/${slug}/ ...`);
  await mkdir(path.dirname(outDir), { recursive: true });
  await cp(templateDir, outDir, { recursive: true });

  // Inject the raw content row. lib/site.js normalizes it into the render shape;
  // that mapRow() is the ONE place you edit to match your real column names.
  await mkdir(path.join(outDir, "data"), { recursive: true });
  await writeFile(
    path.join(outDir, "data", "site.json"),
    JSON.stringify(row, null, 2),
  );

  console.log(`\n✓ Ejected "${slug}".\n`);
  console.log("Next steps:");
  console.log(`  cd ejected/${slug}`);
  console.log("  npm install");
  console.log("  npm run dev            # confirm it looks like the original");
  console.log("  # ...build your custom feature in app/ ...");
  console.log("  git init && git add -A && git commit -m 'Eject site'");
  console.log("  # create repo + push, then import to Vercel (see README).\n");
}

main().catch((e) => { console.error("✗", e.message); process.exit(1); });
