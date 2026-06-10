import { BadgeCheck, Clock, XCircle } from "lucide-react";
import { Link } from "react-router";
import { useMySubscription } from "../../hooks/useSubscription";
import type { MySubscription } from "../../schemas/subscriptionSchema";

function SubscriptionStatus() {
  const { data: sub, isLoading, error } = useMySubscription();

  return (
    <div className="dashboard-content">
      <Header />
      <Body sub={sub} isLoading={isLoading} error={error} />
    </div>
  );
}

function Header() {
  return (
    <div style={{ marginBottom: 28 }}>
      <p className="t-kicker">Subscription</p>
      <h1 className="t-h3" style={{ margin: "8px 0 4px" }}>
        My Subscription
      </h1>
      <p style={{ color: "var(--fg-3)", fontSize: 14, margin: 0 }}>
        Manage your active plan and payment status.
      </p>
    </div>
  );
}

function Body({
  sub,
  isLoading,
  error,
}: {
  sub?: MySubscription | null;
  isLoading: boolean;
  error: unknown;
}) {
  if (isLoading) return <div className="dev-state">Loading...</div>;
  if (error) return <div className="dev-state">Failed to load subscription.</div>;
  if (!sub) return <EmptyState />;
  return <SubscriptionCard sub={sub} />;
}

function EmptyState() {
  return (
    <div style={{ border: "1.5px dashed var(--border-2)", borderRadius: 14,
      padding: "64px 20px", textAlign: "center", color: "var(--fg-3)", fontSize: 14 }}>
      <p style={{ margin: "0 0 12px" }}>You don't have an active subscription.</p>
      <Link to="/dashboard/subscribe" className="btn btn-primary"
        style={{ textDecoration: "none" }}>
        Choose a Plan
      </Link>
    </div>
  );
}

function SubscriptionCard({ sub }: { sub: MySubscription }) {
  const lastPayment = sub.payments?.[0];
  const endDate = new Date(sub.endDate).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const isPendingApproval =
    sub.status === "expired" && lastPayment?.status === "pending";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 520 }}>
      <StatusBanner status={sub.status} isPendingApproval={isPendingApproval} />
      <PlanInfo sub={sub} endDate={endDate} />
      {lastPayment && <PaymentInfo payment={lastPayment} />}
      <SubscribeAgainButton
        status={sub.status}
        isPendingApproval={isPendingApproval}
      />
    </div>
  );
}

function StatusBanner({
  status,
  isPendingApproval,
}: {
  status: string;
  isPendingApproval: boolean;
}) {
  if (isPendingApproval) {
    return (
      <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span className="badge badge-warning" style={{ fontSize: 13, padding: "6px 14px" }}>
          <Clock size={14} /> Waiting for Approval
        </span>
      </div>
    );
  }

  const config: Record<string, { icon: React.ElementType; label: string; cls: string }> = {
    active: { icon: BadgeCheck, label: "Active", cls: "badge-success" },
    expired: { icon: Clock, label: "Expired", cls: "badge-warning" },
    cancelled: { icon: XCircle, label: "Cancelled", cls: "badge-danger" },
  };
  const { icon: Icon, label, cls } = config[status] ?? config.expired;
  return (
    <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span className={`badge ${cls}`} style={{ fontSize: 13, padding: "6px 14px" }}>
        <Icon size={14} /> {label}
      </span>
    </div>
  );
}

function PlanInfo({ sub, endDate }: { sub: MySubscription; endDate: string }) {
  return (
    <div className="card card-pad">
      <p className="t-kicker" style={{ marginBottom: 12 }}>Plan Details</p>
      <InfoRow label="Plan" value={sub.plan.name} />
      <InfoRow label="Price" value={`Rp ${sub.plan.price.toLocaleString("id-ID")} / month`} />
      <InfoRow label="Valid until" value={endDate} />
    </div>
  );
}

function PaymentInfo({ payment }: { payment: MySubscription["payments"][0] }) {
  const paymentDate = new Date(payment.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
  return (
    <div className="card card-pad">
      <p className="t-kicker" style={{ marginBottom: 12 }}>Payment Status</p>
      <InfoRow label="Status" value={payment.status} highlight={payment.status === "approved"} />
      <InfoRow label="Submitted" value={paymentDate} />
      {payment.proofUrl && (
        <div style={{ marginTop: 8 }}>
          <a href={payment.proofUrl} target="_blank" rel="noreferrer"
            style={{ fontSize: 13, color: "var(--brand)" }}>
            View payment proof →
          </a>
        </div>
      )}
    </div>
  );
}

function SubscribeAgainButton({
  status,
  isPendingApproval,
}: {
  status: string;
  isPendingApproval: boolean;
}) {
  if (status === "active" || isPendingApproval) return null;
  return (
    <Link
      to="/dashboard/subscribe"
      className="btn btn-primary"
      style={{ textDecoration: "none", alignSelf: "flex-start" }}
    >
      Subscribe Again
    </Link>
  );
}

function InfoRow({ label, value, highlight }: {
  label: string; value: string; highlight?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between",
      padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: 13, color: "var(--fg-3)" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600,
        color: highlight ? "var(--success-fg)" : "var(--fg)" }}>{value}</span>
    </div>
  );
}

export default SubscriptionStatus;