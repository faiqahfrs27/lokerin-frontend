import { Pencil, Trash2 } from "lucide-react";
import type { SubscriptionPlan } from "../../schemas/subscriptionPlanSchema";

interface Props {
  plan: SubscriptionPlan;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
}

function PlanCard({ plan, onEdit, onDelete }: Props) {
  return (
    <article className="card card-pad plan-card">
      <CardHeader plan={plan} onEdit={onEdit} onDelete={onDelete} />
      <PriceTag price={plan.price} />
      <FeatureList features={plan.features} />
    </article>
  );
}

function CardHeader({ plan, onEdit, onDelete }: Props) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 4,
      }}
    >
      <h3 className="t-h4" style={{ margin: 0 }}>
        {plan.name}
      </h3>
      <div style={{ display: "flex", gap: 4 }}>
        <IconButton
          label="Edit"
          icon={<Pencil size={14} />}
          onClick={() => onEdit(plan)}
        />
        <IconButton
          label="Delete"
          icon={<Trash2 size={14} />}
          onClick={() => onDelete(plan)}
          danger
        />
      </div>
    </header>
  );
}

function IconButton({
  label,
  icon,
  onClick,
  danger,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="btn btn-ghost"
      style={{
        padding: 6,
        color: danger ? "var(--danger-fg)" : "var(--fg-3)",
      }}
    >
      {icon}
    </button>
  );
}

function PriceTag({ price }: { price: number }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: "-0.02em",
          color: "var(--fg)",
        }}
      >
        IDR {price.toLocaleString("id-ID")}
      </span>
      <span style={{ color: "var(--fg-3)", fontSize: 13 }}>/ month</span>
    </div>
  );
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul
      style={{
        margin: "8px 0 0",
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {features.map((f, idx) => (
        <li
          key={idx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            fontSize: 13.5,
            color: "var(--fg-2)",
          }}
        >
          <span style={{ color: "var(--brand)", marginTop: 2 }}>✓</span>
          {f}
        </li>
      ))}
    </ul>
  );
}

export default PlanCard;