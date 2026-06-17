import type { SubscriberStats } from "../../schemas/subscriberSchema";

export function SubscriberStatsCards({ stats }: { stats?: SubscriberStats }) {
  return (
    <div className="stat-card-grid" style={{ marginBottom: 20 }}>
      <StatCard label="Total Subscribers" value={stats?.total ?? 0} />
      <StatCard label="Active Now" value={stats?.active ?? 0} color="var(--success-fg)" />
      <StatCard label="Standard Plan" value={stats?.standardCount ?? 0} />
      <StatCard label="Professional Plan" value={stats?.professionalCount ?? 0} color="var(--brand)" />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="card card-pad">
      <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--fg-3)" }}>{label}</p>
      <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: color ?? "var(--fg)" }}>
        {value}
      </p>
    </div>
  );
}