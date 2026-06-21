import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useMySubscription, useSubscribe } from "../../hooks/useSubscription";
import { useSubscriptionPlans } from "../../hooks/useSubscriptionPlans";
import { PaymentStep } from "../../components/subscription/SubscribePaymentStep";
import type { SubscriptionPlan } from "../../schemas/subscriptionPlanSchema";

function Subscribe() {
  const { data: plans, isLoading } = useSubscriptionPlans();
  const { mutate: subscribe, isPending } = useSubscribe();
  const { data: sub, isLoading: subLoading } = useMySubscription();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [proof, setProof] = useState<File | null>(null);
  const [step, setStep] = useState<"plan" | "payment">("plan");

  if (!subLoading && sub?.status === "active") {
    navigate("/dashboard/subscription", { replace: true });
    return null;
  }

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setStep("payment");
  };

  const handleSubmit = () => {
    if (!selectedPlan || !proof) return;
    subscribe(
      { planId: selectedPlan.id, proof },
      { onSuccess: () => navigate("/dashboard/subscription") },
    );
  };

  if (isLoading) return <div className="dev-state">Loading plans...</div>;

  return (
    <div className="dashboard-content">
      <Header />
      {step === "plan" && (
        <PlanSelector plans={plans ?? []} onSelect={handleSelectPlan} />
      )}
      {step === "payment" && selectedPlan && (
        <PaymentStep
          plan={selectedPlan}
          proof={proof}
          onProofChange={setProof}
          onBack={() => setStep("plan")}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      )}
    </div>
  );
}

function Header() {
  return (
    <div style={{ marginBottom: 28 }}>
      <p className="t-kicker">Subscription</p>
      <h1 className="t-h3" style={{ margin: "8px 0 4px" }}>Choose a Plan</h1>
      <p style={{ color: "var(--fg-3)", fontSize: 14, margin: 0 }}>
        Unlock exclusive features with a subscription.
      </p>
    </div>
  );
}

function PlanSelector({
  plans,
  onSelect,
}: {
  plans: SubscriptionPlan[];
  onSelect: (plan: SubscriptionPlan) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 16,
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} onSelect={onSelect} />
      ))}
    </div>
  );
}

function PlanCard({
  plan,
  onSelect,
}: {
  plan: SubscriptionPlan;
  onSelect: (plan: SubscriptionPlan) => void;
}) {
  return (
    <div className="card card-pad"
      style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>
          {plan.name}
        </h2>
        <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "var(--brand)" }}>
          Rp {plan.price.toLocaleString("id-ID")}
          <span style={{ fontSize: 13, fontWeight: 400, color: "var(--fg-3)" }}>
            {" "}/ month
          </span>
        </p>
      </div>
      <ul style={{ margin: 0, padding: "0 0 0 16px",
        color: "var(--fg-3)", fontSize: 13, lineHeight: 1.8 }}>
        {plan.features?.map((f: string, i: number) => <li key={i}>{f}</li>)}
      </ul>
      <button className="btn btn-primary"
        onClick={() => onSelect(plan)} style={{ marginTop: "auto" }}>
        <CreditCard size={14} /> Get {plan.name}
      </button>
    </div>
  );
}

export default Subscribe;