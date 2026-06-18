import {
  CheckCircle,
  CreditCard,
  FileQuestion,
  LogOut,
  Menu,
  Users,
  X,
  type LucideIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { useAuth } from "../../stores/useAuth";
import ThemeToggle from "./ThemeToggle";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dev/assessments", label: "Skill assessments", icon: FileQuestion },
  {
    to: "/dev/subscription-plans",
    label: "Subscription plans",
    icon: CreditCard,
  },
  {
    to: "/dev/payments",
    label: "Payment approvals",
    icon: CheckCircle,
  },
  { to: "/dev/subscribers", label: "Subscribers", icon: Users },
];

function LogoutModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "var(--overlay)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className="card"
        style={{ width: "100%", maxWidth: 400, overflow: "hidden" }}
      >
        <div style={{ padding: "24px 24px 0" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--danger-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <LogOut size={20} style={{ color: "var(--danger-fg)" }} />
          </div>
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "var(--fs-lg)",
              fontWeight: "var(--fw-bold)",
            }}
          >
            Sign out?
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "var(--fs-sm)",
              color: "var(--fg-3)",
            }}
          >
            You'll need to sign in again to access your dashboard.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, padding: 24 }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            style={{ flex: 1 }}
            onClick={onConfirm}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function DevSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className="admin-hamburger"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      )}

      <div
        className={`admin-side-backdrop ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`admin-side ${isOpen ? "is-open" : ""}`}>
        <button
          type="button"
          className="admin-side__close"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
        <Brand />
        <Nav />
        <Footer />
      </aside>
    </>
  );
}

function Brand() {
  return (
    <div className="admin-brand">
      <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden>
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
      <span>lokerin</span>
      <span className="role-pill">DEV</span>
    </div>
  );
}

function Nav() {
  return (
    <nav className="admin-nav">
      {NAV_ITEMS.map((it) => (
        <NavItemLink key={it.to} item={it} />
      ))}
    </nav>
  );
}

function NavItemLink({ item }: { item: NavItem }) {
  const disabled = !!item.badge;

  if (disabled) {
    return (
      <span className="side-link side-link--disabled">
        <item.icon size={18} strokeWidth={2} />
        <span style={{ flex: 1 }}>{item.label}</span>
        <span className="soon-pill">{item.badge}</span>
      </span>
    );
  }

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        "side-link " + (isActive ? "side-link--active" : "")
      }
    >
      <item.icon size={18} strokeWidth={2} />
      <span style={{ flex: 1 }}>{item.label}</span>
    </NavLink>
  );
}

function Footer() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const [showModal, setShowModal] = useState(false);

  const displayName =
    user?.profile?.fullName ?? user?.email?.split("@")[0] ?? "—";
  const email = user?.email ?? "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <div className="admin-side__footer" style={{ marginTop: "auto" }}>
        <div className="dashboard-user">
          <div className="dashboard-avatar initials">{initial}</div>
          <div className="dashboard-user-info">
            <span className="dashboard-user-name">{displayName}</span>
            <span className="dashboard-user-email">{email}</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 4px",
          }}
        >
          <button
            className="dashboard-logout"
            onClick={() => setShowModal(true)}
            style={{ width: "auto" }}
          >
            <LogOut size={16} strokeWidth={1.75} /> Sign out
          </button>
          <ThemeToggle />
        </div>
      </div>

      {showModal && (
        <LogoutModal
          onConfirm={() => {
            setShowModal(false);
            logout();
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default DevSidebar;