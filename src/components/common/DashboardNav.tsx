import {
  BadgeCheck,
  Bookmark,
  CalendarDays,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  Trophy,
  User,
} from "lucide-react";
import { Link } from "react-router";
import { useMySubscription } from "../../hooks/useSubscription";

export function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/profile", label: "My Profile", icon: User },
  { to: "/dashboard/applications", label: "Applications", icon: FileText },
  { to: "/dashboard/my-interviews", label: "My Interviews", icon: CalendarDays },
  { to: "/dashboard/saved", label: "Saved Jobs", icon: Bookmark },
  { to: "/dashboard/subscribe", label: "Subscription", icon: CreditCard },
  { to: "/dashboard/assessments", label: "Assessments", icon: BadgeCheck },
  { to: "/dashboard/my-results", label: "My Results", icon: Trophy },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function SmartSubscriptionLink({ isActive }: { isActive: boolean }) {
  const { data: sub } = useMySubscription();
  const hasActive = sub?.status === "active";
  const to = hasActive ? "/dashboard/subscription" : "/dashboard/subscribe";

  return (
    <Link
      to={to}
      className={`dashboard-nav-item${isActive ? " active" : ""}`}
      style={{ textDecoration: "none" }}
    >
      <CreditCard size={18} strokeWidth={1.75} />
      <span>Subscription</span>
      {isActive && (
        <ChevronRight
          size={14}
          style={{ marginLeft: "auto", color: "var(--brand)" }}
        />
      )}
    </Link>
  );
}