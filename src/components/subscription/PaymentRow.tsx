import { Check, X } from "lucide-react";
import type { Payment } from "../../schemas/subscriptionSchema";
import { useApprovePayment, useRejectPayment } from "../../hooks/useSubscription";

function PaymentStatusChip({ status }: { status: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "badge-warning" },
    approved: { label: "Approved", cls: "badge-success" },
    rejected: { label: "Rejected", cls: "badge-danger" },
  };
  const c = config[status] ?? { label: status, cls: "badge-stone" };
  return (
    <span className={`badge ${c.cls}`}>
      <span className="dot" /> {c.label}
    </span>
  );
}

function PaymentRow({ payment }: { payment: Payment }) {
  const approve = useApprovePayment();
  const reject = useRejectPayment();
  const isPending = payment.status === "pending";
  const loading = approve.isPending || reject.isPending;
  const name = payment.user.profile?.fullName ?? payment.user.email;
  const date = new Date(payment.createdAt).toLocaleDateString("id-ID");

  return (
    <tr>
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="applicant-avatar">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{name}</div>
            <div className="role-meta">{payment.user.email}</div>
          </div>
        </div>
      </td>
      <td>{payment.subscription.plan.name}</td>
      <td>IDR {payment.amount.toLocaleString("id-ID")}</td>
      <td><PaymentStatusChip status={payment.status} /></td>
      <td className="role-meta">{date}</td>
      <td>
        {payment.proofUrl && (
          <a href={payment.proofUrl} target="_blank" rel="noreferrer"
            style={{ fontSize: 12, color: "var(--brand)" }}>
            View proof →
          </a>
        )}
      </td>
      <td style={{ textAlign: "right" }}>
        {isPending && (
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button className="btn btn-primary" disabled={loading}
              onClick={() => approve.mutate(payment.id)}
              style={{ padding: "6px 10px", fontSize: 12 }}>
              <Check size={12} /> Approve
            </button>
            <button className="btn btn-ghost" disabled={loading}
              onClick={() => reject.mutate(payment.id)}
              style={{ padding: "6px 10px", fontSize: 12 }}>
              <X size={12} /> Reject
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default PaymentRow;