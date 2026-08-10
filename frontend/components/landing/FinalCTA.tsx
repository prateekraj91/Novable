import Link from "next/link";

export default function FinalCTA() {
  return (
    <section
      id="get-started"
      className="nb-edge"
      style={{ paddingBottom: 104, textAlign: "center", position: "relative" }}
    >
      <div
        className="nb-dot"
        style={{
          width: 160,
          height: 160,
          background: "var(--color-accent-100)",
          top: 0,
          left: "calc(50% - 380px)",
        }}
      />
      <div
        className="nb-dot"
        style={{
          width: 100,
          height: 100,
          background: "var(--color-accent-2-100)",
          bottom: 10,
          right: "calc(50% - 360px)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 className="nb-h2" style={{ maxWidth: "24ch", margin: "0 auto" }}>
          Give your business an AI growth team today.
        </h2>

        <p className="nb-sub" style={{ margin: "16px auto 0" }}>
          Five questions. Two minutes. A full growth engine, running for you.
        </p>

        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            marginTop: 32,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/signup?next=/pricing"
            className="btn btn-primary"
            style={{ padding: "14px 28px", fontSize: 15 }}
          >
            Get started →
          </Link>
          <Link
            href="/signup?next=/onboarding"
            className="btn btn-secondary"
            style={{ padding: "14px 28px", fontSize: 15 }}
          >
            Try for free
          </Link>
        </div>
      </div>
    </section>
  );
}
