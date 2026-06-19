import { Link } from "react-router";

const FOOTER_LINKS = {
  "For job seekers": [
    { label: "Find jobs", to: "/jobs" },
    { label: "My applications", to: "/dashboard/applications" },
    { label: "CV builder", to: "/pricing" },
    { label: "Skill assessments", to: "/pricing" },
  ],
  "For companies": [
    { label: "Post a job", to: "/register/company" },
    { label: "Browse candidates", to: "/register/company" },
    { label: "Pricing", to: "/pricing" },
  ],
  "Lokerin": [
    { label: "About", to: "/" },
    { label: "Careers (yes, really)", to: "/" },
    { label: "Blog", to: "/" },
    { label: "Press", to: "/" },
  ],
};

function Footer() {
  return (
    <footer className="foot">
      <div className="container foot-inner">
        <div className="foot-brand">
          <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>
            <svg width="32" height="32" viewBox="0 0 64 64">
              <rect x="2" y="2" width="60" height="60" rx="16" fill="#F97316" />
              <path d="M22 16 L22 44 L42 44" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="44" cy="20" r="5" fill="white" />
            </svg>
            lokerin
          </Link>
          <p className="muted t-small" style={{ margin: "12px 0 0", maxWidth: 260 }}>
            Find your next loker. Built by Gen Z, made in Indonesia.
          </p>
        </div>

        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title} className="foot-col">
            <div className="foot-h">{title}</div>
            {links.map((link) => (
              <Link key={link.label} to={link.to} style={{ textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="container foot-legal">
        <span className="muted">© 2026 Lokerin. Made with ❤️ in Jakarta.</span>
        <div className="hstack" style={{ gap: 20, fontSize: 12 }}>
          <Link to="/terms" className="muted" style={{ textDecoration: "none" }}>Terms</Link>
          <Link to="/privacy" className="muted" style={{ textDecoration: "none" }}>Privacy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;