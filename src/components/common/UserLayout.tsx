import {
  BadgeCheck,
  Bookmark,
  CalendarDays,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Trophy,
  User,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import React from "react";
import { Link, Outlet, useLocation } from "react-router";
import ThemeToggle from "../register/ThemeToggle";
import { useAuth } from "../../stores/useAuth";
import { useMySubscription } from "../../hooks/useSubscription";

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const NAV_ITEMS = [
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

function SmartSubscriptionLink({ isActive }: { isActive: boolean }) {
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

function UserLayout() {
  const location = useLocation();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const displayName = user?.profile?.fullName ?? user?.email ?? "User";
  const photoUrl = user?.profile?.photoUrl;

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        {/* Logo */}
        <Link
          to="/"
          className="dashboard-brand"
          style={{ textDecoration: "none" }}
        >
          <svg width="28" height="28" viewBox="0 0 64 64">
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
        </Link>

        {/* Nav */}
        <nav className="dashboard-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            if (to === "/dashboard/subscribe") return null;

            const isAssessments = to === "/dashboard/assessments";
            const isActive =
              location.pathname === to ||
              (to === "/dashboard/assessments" &&
                location.pathname.startsWith("/dashboard/assessments")) ||
              (to === "/dashboard/my-results" &&
                location.pathname.startsWith("/dashboard/results"));

            return (
              <React.Fragment key={to}>
                {isAssessments && (
                  <SmartSubscriptionLink
                    isActive={
                      location.pathname === "/dashboard/subscribe" ||
                      location.pathname === "/dashboard/subscription"
                    }
                  />
                )}
                <Link
                  to={to}
                  className={`dashboard-nav-item${isActive ? " active" : ""}`}
                  style={{ textDecoration: "none" }}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  <span>{label}</span>
                  {isActive && (
                    <ChevronRight
                      size={14}
                      style={{ marginLeft: "auto", color: "var(--brand)" }}
                    />
                  )}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="dashboard-sidebar-footer">
          <div className="dashboard-user">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={displayName}
                className="dashboard-avatar"
              />
            ) : (
              <div className="dashboard-avatar initials">
                {getInitials(user?.profile?.fullName)}
              </div>
            )}
            <div className="dashboard-user-info">
              <span className="dashboard-user-name">{displayName}</span>
              <span className="dashboard-user-email">{user?.email}</span>
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
              onClick={() => setShowLogoutModal(true)}
              style={{ width: "auto" }}
            >
              <LogOut size={16} strokeWidth={1.75} />
              Sign out
            </button>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        <Outlet />
      </main>

      {/* Logout modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => {
            setShowLogoutModal(false);
            logout();
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
}

export default UserLayout;
