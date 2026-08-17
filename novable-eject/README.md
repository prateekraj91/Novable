# Novable — Site Eject Tool

Turn one AI-generated site (a row in Supabase) into a standalone, editable
Next.js project. Use this whenever a paying customer needs a feature your AI
template can't generate (ordering, booking, gallery, login, custom pages).

## Why this exists

Your generated sites are **not code sitting anywhere** — they're content rows
in Supabase rendered by one shared template. So "edit site #47" is impossible:
site #47 has no files. Ejecting **turns the row back into a real project folder.**
That folder is the code access you were missing.

## The mental model

```
Novable (managed)                         Ejected (custom)
────────────────────                      ────────────────────
Supabase row  ──►  shared template   ─►   eject.mjs  ─►  ejected/<slug>/  ─►  GitHub ─► Vercel
(content)          (renders live)         (one-time)     (real Next.js)         (your domain)
```

Once ejected, that site leaves Novable's system: the dashboard and marketing
agents no longer manage it. That's correct — it's a custom, code-maintained
site now. Charge Custom-tier for it (₹3k–10k+ depending on scope).

## One-time setup

```bash
cd novable-eject
# needed only for real runs (not for --from-file testing):
export SUPABASE_URL="https://xxxx.supabase.co"
export SUPABASE_SERVICE_KEY="your-service-role-key"   # server-side secret, never ship it
export NOVABLE_TABLE="sites"                           # optional, defaults to "sites"
```

## Everyday workflow

```bash
# 1. Eject the customer's site by its id
node eject.mjs <SITE_ID>

# 2. Open it and confirm it matches the original
cd ejected/<slug>
npm install
npm run dev            # http://localhost:3000

# 3. Build the custom feature (this is the actual job)
#    e.g. an ordering page: create app/order/page.jsx with a product list +
#    cart form; on submit, insert into a Supabase `orders` table and fire a
#    WhatsApp notification to the owner. Same stack you already use.

# 4. Ship it
git init && git add -A && git commit -m "Eject <slug> + custom feature"
```

## Adapting to your real schema (the one file you edit)

The eject script dumps the **entire row** into `data/site.json`. The template
reads it through `lib/site.js` → `mapRow()`. That function is the only place you
touch your real column names. If you store content in a `content` jsonb column
it already unwraps it; if you use flat columns, map them there. Edit `mapRow()`
once, and every ejected site renders correctly.

## Push to GitHub + deploy to Vercel

**Manual (do this for your first few — 15 min each):**
1. Create an empty repo on GitHub (personal for now; a Novable **org** once you
   have several, to avoid clutter and free-tier caps).
2. `git remote add origin git@github.com:<you>/<slug>.git && git push -u origin main`
3. On Vercel: New Project → import the repo → deploy → add the customer's domain.

**Automated (build this only after you've done ~3 by hand):**
- Repo: `POST https://api.github.com/user/repos` with a GitHub token, then push.
- Deploy: Vercel API — create a project from the repo and trigger a deployment.
- Wrap both into an "Eject to repo" button in your dashboard.
- Store GitHub/Vercel tokens as **backend env vars only** (Render), never in the
  frontend or the generated repo. Prefer a scoped GitHub App over a broad PAT.

Don't build the automation before a customer has paid for a custom site twice —
that's the "keep building instead of selling" trap. Manual first, automate the
pattern once it's actually recurring.

## Files

```
novable-eject/
├── eject.mjs            # the tool: fetch row -> scaffold project
├── sample-row.json      # a fake row for offline testing (--from-file)
├── template/            # the standalone Next.js project that gets copied
│   ├── app/             # layout, page (baseline sections + where you add features)
│   ├── lib/site.js      # mapRow(): adapt to your schema HERE
│   └── data/site.json   # overwritten with the real row on each eject
└── ejected/             # output — one folder per ejected site
```

## Test without touching Supabase

```bash
node eject.mjs demo --from-file ./sample-row.json
```
