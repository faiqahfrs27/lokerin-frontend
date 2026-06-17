import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Subscriber } from "../../schemas/subscriberSchema";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function isExpiringSoon(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  return diff > 0 && diff < 86400000;
}

export function SubscriberRow({ subscriber }: { subscriber: Subscriber }) {
  const [open, setOpen] = useState(false);
  const isPro = subscriber.plan.toLowerCase().includes("professional");
  const expiringSoon = subscriber.status === "active" && isExpiringSoon(subscriber.endDate);

  return (
    <div className="card" style={{ marginBottom: 10, overflow: "hidden" }}>
      <div className="subscriber-row-grid" onClick={() => setOpen((v) => !v)}>
        <div className="subscriber-user-cell">
          <UserCell name={subscriber.user.fullName} email={subscriber.user.email} />
        </div>
        <div className="subscriber-meta">
          <Cell label="Plan"><PlanBadge isPro={isPro} /></Cell>
          <Cell label="Started">{formatDate(subscriber.startDate)}</Cell>
          <Cell label="Expires">{formatDate(subscriber.endDate)}</Cell>
          <Cell label="Status">
            <StatusBadge status={subscriber.status} expiringSoon={expiringSoon} />
          </Cell>
        </div>
        <ChevronDown size={16} style={{ color: "var(--fg-3)",
          transition: "transform 0.2s",
          transform: open ? "rotate(180deg)" : "none", marginLeft: "auto" }} />
      </div>
      {open && <PaymentHistory history={subscriber.paymentHistory} />}
    </div>
  );
}

function UserCell({ name, email }: { name: string; email: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%",
        background: "linear-gradient(135deg,#F97316,#EA580C)", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
        {getInitials(name)}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{name}</p>
        <p style={{ margin: 0, fontSize: 11, color: "var(--fg-3)" }}>{email}</p>
      </div>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ margin: "0 0 2px", fontSize: 10, color: "var(--fg-3)" }}>{label}</p>
      <div style={{ fontSize: 13 }}>{children}</div>
    </div>
  );
}

function PlanBadge({ isPro }: { isPro: boolean }) {
  return (
    <span style={{ display: "inline-block", padding: "3px 10px",
      borderRadius: 999, fontSize: 11, fontWeight: 700,
      background: isPro ? "var(--brand-soft)" : "rgba(14,165,233,.12)",
      color: isPro ? "var(--brand)" : "#0ea5e9" }}>
      {isPro ? "Professional" : "Standard"}
    </span>
  );
}

function StatusBadge({ status, expiringSoon }: { status: string; expiringSoon: boolean }) {
  const isActive = status === "active";
  const label = expiringSoon ? "Expiring soon" : isActive ? "Active" : "Expired";
  const color = expiringSoon ? "#fbbf24" : isActive ? "var(--success-fg)" : "var(--fg-3)";
  const bg = expiringSoon ? "rgba(251,191,36,.12)" : isActive ? "var(--success-bg)" : "var(--surface-2)";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
      background: bg, color }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

function PaymentHistory({ history }: { history: Subscriber["paymentHistory"] }) {
  if (history.length === 0) {
    return (
      <div style={{ borderTop: "1px solid var(--border)", padding: "14px 18px",
        fontSize: 12, color: "var(--fg-3)" }}>
        No payment history yet.
      </div>
    );
  }

  return (
    <div style={{ borderTop: "1px solid var(--border)",
      background: "var(--surface-2)", padding: "14px 18px" }}>
      <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700,
        color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 0.4 }}>
        Payment History ({history.length})
      </p>
      {history.map((h) => (
        <div key={h.id} className="subscriber-history-grid">
          <span>{formatDate(h.createdAt)}</span>
          <span>Rp {h.amount.toLocaleString("id-ID")}</span>
          <span style={{ color: "var(--fg-3)" }}>
            {h.method === "xendit" ? "⚡ Xendit" : "🏦 Manual transfer"}
          </span>
          <span style={{ color: "var(--success-fg)", fontWeight: 600 }}>
            {h.status}
          </span>
        </div>
      ))}
    </div>
  );
}