import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import ThemeToggle from "../register/ThemeToggle";
import { useAuth } from "../../stores/useAuth";

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Find jobs" },
  { to: "/companies", label: "Companies" },
  { to: "/pricing", label: "Pricing" },
];

function Navbar() {
  const location = useLocation();
  const user = useAuth((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const links = user
    ? [...NAV_LINKS, { to: "/dashboard/applications", label: "My applications" }]
    : NAV_LINKS;

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>
          <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true">
            <rect x="2" y="2" width="60" height="60" rx="16" fill="#F97316" />
            <path d="M22 16 L22 44 L42 44" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="44" cy="20" r="5" fill="white" />
          </svg>
          lokerin
        </Link>

        <nav className="nav-links">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link${location.pathname === link.to ? " active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-spacer" />

        <div className="nav-actions">
          <ThemeToggle />
          {user ? (
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#F97316,#EA580C)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, boxShadow: "var(--shadow-sm)", cursor: "pointer" }}>
                {getInitials(user.profile?.fullName ?? user.email)}
              </div>
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost hide-mobile" style={{ textDecoration: "none" }}>Log in</Link>
              <Link to="/register" className="btn btn-primary" style={{ textDecoration: "none" }}>Sign up</Link>
            </>
          )}
          <button
            className="nav-hamburger"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      <div
        className={`nav-mobile-backdrop${isOpen ? " is-open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`nav-mobile-drawer${isOpen ? " is-open" : ""}`}>
        <button
          className="nav-mobile-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <X size={22} />
        </button>

        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link${location.pathname === link.to ? " active" : ""}`}
            style={{ textDecoration: "none" }}
          >
            {link.label}
          </Link>
        ))}

        {!user && (
          <div className="nav-mobile-actions">
            <Link to="/login" className="btn btn-secondary" style={{ textDecoration: "none", textAlign: "center" }}>
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ textDecoration: "none", textAlign: "center" }}>
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;