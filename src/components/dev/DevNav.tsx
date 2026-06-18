import { NavLink } from "react-router";
import { type LucideIcon } from "lucide-react";
import {
  CheckCircle,
  CreditCard,
  FileQuestion,
  Users,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/dev/assessments", label: "Skill assessments", icon: FileQuestion },
  { to: "/dev/subscription-plans", label: "Subscription plans", icon: CreditCard },
  { to: "/dev/payments", label: "Payment approvals", icon: CheckCircle },
  { to: "/dev/subscribers", label: "Subscribers", icon: Users },
];

export function Brand() {
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

export function Nav() {
  return (
    <nav className="admin-nav">
      {NAV_ITEMS.map((it) => (
        <NavItemLink key={it.to} item={it} />
      ))}
    </nav>
  );
}

export function NavItemLink({ item }: { item: NavItem }) {
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