interface AuthPanelProps {
  quote: string;
}

function AuthPanel({ quote }: AuthPanelProps) {
  return (
    <aside className="auth-right">
      <div className="auth-glow" />

      {/* Lokerin logo */}
      <div style={{ position: "relative", zIndex: 1, marginBottom: 40 }}>
        <a className="nav-brand" href="/" style={{ textDecoration: "none" }}>
          <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true">
            <rect x="2" y="2" width="60" height="60" rx="16" fill="#F97316" />
            <path
              d="M22 16 L22 44 L42 44"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="44" cy="20" r="5" fill="white" />
          </svg>
          lokerin
        </a>
      </div>

      {/* Quote */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 400,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.4rem, 2.5vw, 1.875rem)",
            fontWeight: "var(--fw-bold)",
            color: "var(--fg)",
            lineHeight: "var(--lh-snug)",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          {quote}
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          gap: 32,
          marginBottom: 40,
        }}
      >
        {[
          { value: "12K+", label: "Lowongan aktif" },
          { value: "5K+", label: "Perusahaan" },
          { value: "48rb", label: "User terdaftar" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-2xl)",
                fontWeight: "var(--fw-bold)",
                color: "var(--brand)",
                letterSpacing: "var(--tracking-tight)",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "var(--fs-xs)",
                color: "var(--fg-3)",
                marginTop: 4,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Testimonial */}
      <div className="testimonial" style={{ position: "relative", zIndex: 1 }}>
        <div className="t-avatar">RA</div>
        <div>
          <div className="t-stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="#F97316"
                stroke="#F97316"
              >
                <polygon points="12 2 15 9 22 9 17 14 19 22 12 17 5 22 7 14 2 9 9 9 12 2" />
              </svg>
            ))}
          </div>
          <p className="t-quote">
            "Dapet kerjaan di Tokopedia lewat Lokerin, 11 hari dari apply ke
            offer. Tanpa drama."
          </p>
          <div className="t-attrib">
            Rina A. · Product Designer · hired May 2025
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AuthPanel;
