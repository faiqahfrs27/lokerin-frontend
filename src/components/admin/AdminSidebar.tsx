import { NavLink } from "react-router";
import {
  Briefcase,
  Home,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Power,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../../stores/useAuth";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/admin/overview", label: "Overview", icon: Home, badge: "Soon" },
  { to: "/admin/postings", label: "Job postings", icon: Briefcase },
  { to: "/admin/applicants", label: "Applicants", icon: Users },
  {
    to: "/admin/interviews",
    label: "Interviews",
    icon: Calendar,
    badge: "Soon",
  },
  {
    to: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    badge: "Soon",
  },
  { to: "/admin/settings", label: "Settings", icon: Settings, badge: "Soon" },
];

function AdminSidebar() {
  return (
    <aside className="admin-side">
      <Brand />
      <Nav />
      <Footer />
    </aside>
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
      <span className="role-pill">HR</span>
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

  const displayName = user?.company?.name ?? user?.email ?? "—";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="admin-side__footer">
      <div className="admin-side__user">
        <div className="admin-side__avatar">{initial}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="admin-side__user-name">{displayName}</div>
          <div className="admin-side__user-email">{user?.email ?? ""}</div>
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
    </div>
  );
}

export default AdminSidebar;
