import { Briefcase, BookmarkCheck, BadgeCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../stores/useAuth";

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", color: "var(--fg)", lineHeight: 1 }}>{value}</p>
        <p style={{ margin: "4px 0 0", fontSize: "var(--fs-sm)", color: "var(--fg-3)" }}>{label}</p>
      </div>
    </div>
  );
}

function DashboardOverview() {
  const user = useAuth((s) => s.user);
  const displayName = user?.profile?.fullName?.split(" ")[0] ?? "there";

  const isProfileComplete = !!(
    user?.profile?.fullName &&
    user?.profile?.birthDate &&
    user?.profile?.gender &&
    user?.profile?.education &&
    user?.profile?.address
  );

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p className="t-kicker">Dashboard</p>
        <h1 className="t-h3" style={{ margin: "8px 0 4px" }}>
          Welcome back, {displayName} 👋
        </h1>
        <p style={{ color: "var(--fg-3)", fontSize: "var(--fs-sm)" }}>
          Here's what's happening with your job search.
        </p>
      </div>

      {/* Profile incomplete banner */}
      {!isProfileComplete && (
        <div style={{ background: "var(--warning-bg)", border: "1px solid var(--warning-fg)", borderRadius: "var(--radius-md)", padding: "14px 18px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <p style={{ margin: 0, fontSize: "var(--fs-sm)", color: "var(--warning-fg)", fontWeight: "var(--fw-medium)" }}>
            ⚠️ Complete your profile to unlock all features and improve your chances.
          </p>
          <Link to="/dashboard/profile" className="btn btn-secondary" style={{ textDecoration: "none", fontSize: "var(--fs-sm)", flexShrink: 0 }}>
            Complete profile <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard icon={Briefcase} label="Applications" value={0} color="#F97316" />
        <StatCard icon={BookmarkCheck} label="Saved jobs" value={0} color="#7C3AED" />
        <StatCard icon={BadgeCheck} label="Assessments passed" value={0} color="#0D9488" />
      </div>

      {/* Quick links */}
      <div>
        <h2 className="t-h4" style={{ marginBottom: 16 }}>Quick actions</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/jobs" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Find jobs <ArrowRight size={14} />
          </Link>
          <Link to="/dashboard/profile" className="btn btn-secondary" style={{ textDecoration: "none" }}>
            Edit profile
          </Link>
          <Link to="/dashboard/assessments" className="btn btn-secondary" style={{ textDecoration: "none" }}>
            Take assessment
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;