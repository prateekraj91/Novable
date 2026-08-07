export default function Freelancers() {
  return (
    <section
      id="freelancers"
      className="nb-edge nb-split"
      style={{ paddingBottom: 96 }}
    >
      <figure className="washed">
        {/* Stands in for the design's image slot until real photography lands. */}
        <div className="nb-figure">
          <span>Freelancer at work</span>
        </div>
      </figure>

      <div>
        <span className="nb-kicker">
          For Freelancers
          <span
            className="tag tag-outline"
            style={{ marginLeft: 8, verticalAlign: "middle" }}
          >
            Coming soon
          </span>
        </span>

        <h2 className="nb-h2" style={{ maxWidth: "22ch" }}>
          Local business leads, straight to WhatsApp.
        </h2>

        <p className="nb-sub">
          Designers and developers join the Novable marketplace for ₹299/month —
          a fraction of Upwork&apos;s 20% cut — and get matched to real local
          projects.
        </p>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: 20, padding: "12px 24px" }}
        >
          + Join the waitlist
        </button>
      </div>
    </section>
  );
}
