import { NavLink } from "react-router";
import {
  FileQuestion,
  CreditCard,
  CheckCircle,
  Users,
  Power,
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

const NAV_ITEMS: NavItem[] = [
  { to: "/dev/assessments", label: "Skill assessments", icon: FileQuestion },
  { to: "/dev/subscription-plans", label: "Subscription plans", icon: CreditCard, badge: "Soon" },
  { to: "/dev/payments", label: "Payment approvals", icon: CheckCircle, badge: "Soon" },
  { to: "/dev/subscribers", label: "Subscribers", icon: Users, badge: "Soon" },
];

function DevSidebar() {
  return (
    <aside className="dev-sidebar">
      <SidebarBrand />
      <SidebarNav />
      <SidebarFooter />
    </aside>
  );
}

function SidebarBrand() {
  return (
    <div className="dev-sidebar__brand">
      <div className="dev-sidebar__brand-mark">L</div>
      <span className="dev-sidebar__brand-name">lokerin</span>
      <span className="dev-sidebar__brand-tag">DEV</span>
    </div>
  );
}

function SidebarNav() {
  return (
    <nav className="dev-sidebar__nav">
      {NAV_ITEMS.map((item) => (
        <NavItemLink key={item.to} item={item} />
      ))}
    </nav>
  );
}

function NavItemLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `dev-sidebar__link ${isActive ? "dev-sidebar__link--active" : ""}`
      }
    >
      <item.icon className="dev-sidebar__icon" size={18} strokeWidth={2} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && <span className="dev-sidebar__nav-badge">{item.badge}</span>}
    </NavLink>
  );
}

function SidebarFooter() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  return (
    <div className="dev-sidebar__footer">
      <ThemeToggle />
      <div className="dev-sidebar__user">
        <div className="dev-sidebar__avatar">D</div>
        <div className="dev-sidebar__user-info">
          <div className="dev-sidebar__user-name">{user?.email ?? "Developer"}</div>
          <div className="dev-sidebar__user-role">role · {user?.role}</div>
        </div>
        <button onClick={logout} className="dev-sidebar__logout" title="Logout">
          <Power size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default DevSidebar;