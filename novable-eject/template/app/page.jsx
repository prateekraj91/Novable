import site from "../lib/site";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <p className="eyebrow">{site.category}</p>
        <h1>{site.name}</h1>
        {site.tagline && <p className="tagline">{site.tagline}</p>}
        {site.whatsapp && (
          <a className="cta" href={`https://wa.me/${site.whatsapp}`}>Message us on WhatsApp</a>
        )}
      </section>

      {/* ABOUT */}
      {site.about && (
        <section className="block">
          <h2>About</h2>
          <p>{site.about}</p>
        </section>
      )}

      {/* SERVICES */}
      {site.services.length > 0 && (
        <section className="block">
          <h2>What we offer</h2>
          <div className="grid">
            {site.services.map((s, i) => (
              <div className="card" key={i}>
                <h3>{s.name}</h3>
                {s.desc && <p>{s.desc}</p>}
                {s.price && <span className="price">{s.price}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/*
        ┌──────────────────────────────────────────────────────────────┐
        │  ADD YOUR CUSTOM FEATURE HERE.                                │
        │  This is the whole point of ejecting. e.g. an ordering page:  │
        │    - make app/order/page.jsx                                  │
        │    - a product list + cart form                               │
        │    - on submit -> insert into a Supabase `orders` table       │
        │      and fire a WhatsApp notification to the owner            │
        │  It's a normal Next.js project now — build anything.          │
        └──────────────────────────────────────────────────────────────┘
      */}

      {/* CONTACT */}
      <section className="block contact">
        <h2>Visit / Contact</h2>
        {site.phone && <p>Phone: {site.phone}</p>}
        {site.address && <p>{site.address}</p>}
        {site.mapsUrl && <a href={site.mapsUrl}>Open in Google Maps →</a>}
      </section>

      {/* Floating WhatsApp button */}
      {site.whatsapp && (
        <a className="wa-float" href={`https://wa.me/${site.whatsapp}`} aria-label="WhatsApp">
          WhatsApp
        </a>
      )}

      <footer>Built with Novable</footer>
    </main>
  );
}
