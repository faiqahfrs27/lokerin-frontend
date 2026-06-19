import type { SubscriptionPlan } from "../../schemas/subscriptionPlanSchema";
import PlanCard from "./PlanCard";

interface Props {
  plans: SubscriptionPlan[];
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
}

function PlanList({ plans, onEdit, onDelete }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
      }}
    >
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default PlanList;