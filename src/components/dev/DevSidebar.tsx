import { NavLink } from "react-router";
import {
  FileQuestion,
  CreditCard,
  CheckCircle,
  Users,
  Power,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../../stores/useAuth";
import ThemeToggle from "./ThemeToggle";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

interface DevSidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
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
    badge: "Soon",
  },
  { to: "/dev/subscribers", label: "Subscribers", icon: Users, badge: "Soon" },
];

function DevSidebar({ isMobileOpen, onClose }: DevSidebarProps) {
  return (
    <aside className={`admin-side ${isMobileOpen ? "admin-side--open" : ""}`}>
      <Header onClose={onClose} />
      <Nav />
      <Footer />
    </aside>
  );
}

function Header({ onClose }: { onClose: () => void }) {
  return (
    <div className="admin-side__header">
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
      <button
        className="admin-side__close"
        onClick={onClose}
        type="button"
        aria-label="Tutup menu"
      >
        <X size={20} strokeWidth={2} />
      </button>
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

  const displayName =
    user?.profile?.fullName ?? user?.email?.split("@")[0] ?? "—";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="admin-side__footer">
      <div className="admin-side__user">
        <div className="admin-side__avatar">{initial}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="admin-side__user-name">{displayName}</div>
          <div className="admin-side__user-email">role · {user?.role}</div>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-secondary"
        style={{
          width: "100%",
          marginTop: 10,
          fontSize: 12,
          padding: "7px 12px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
        onClick={() => logout()}
      >
        <Power size={13} /> Sign out
      </button>

      <div className="admin-side__theme-row">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default DevSidebar;
