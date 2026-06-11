import { Building2, Zap } from "lucide-react";
import { useState } from "react";
import { useCreateXenditInvoice } from "../../hooks/useSubscription";
import type { SubscriptionPlan } from "../../schemas/subscriptionPlanSchema";
import { ManualBody } from "./ManualPaymentBody";
import { XenditBody } from "./XenditPaymentBody";

type PaymentMethod = "manual" | "xendit";

export function PaymentStep({
  plan,
  proof,
  onProofChange,
  onBack,
  onSubmit,
  isPending,
}: {
  plan: SubscriptionPlan;
  proof: File | null;
  onProofChange: (f: File | null) => void;
  onBack: () => void;
  onSubmit: () => void;
  isPending: boolean;
}) {
  const [method, setMethod] = useState<PaymentMethod>("xendit");
  const { mutate: createInvoice, isPending: xenditPending } =
    useCreateXenditInvoice();

  const handleXendit = () => {
    createInvoice(plan.id, {
      onSuccess: (data) => {
        window.location.href = data.invoiceUrl;
      },
    });
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <PlanSummary plan={plan} />
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em",
        textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 12 }}>
        Payment Method
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <MethodCard
          id="manual"
          selected={method === "manual"}
          onSelect={() => setMethod("manual")}
          icon={<Building2 size={18} />}
          title="Manual Transfer"
          desc="Transfer to bank account, upload proof"
        >
          <ManualBody
            plan={plan}
            proof={proof}
            onProofChange={onProofChange}
            onBack={onBack}
            onSubmit={onSubmit}
            isPending={isPending}
          />
        </MethodCard>
        <MethodCard
          id="xendit"
          selected={method === "xendit"}
          onSelect={() => setMethod("xendit")}
          icon={<Zap size={18} />}
          title="Pay with Xendit"
          desc="Instant payment, subscription activated immediately"
        >
          <XenditBody
            onBack={onBack}
            onPay={handleXendit}
            isPending={xenditPending}
          />
        </MethodCard>
      </div>
    </div>
  );
}

function PlanSummary({ plan }: { plan: SubscriptionPlan }) {
  return (
    <div className="card card-pad"
      style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 20 }}>
      <div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{plan.name}</p>
        <p style={{ margin: 0, fontSize: 12, color: "var(--fg-3)" }}>per month</p>
      </div>
      <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--brand)" }}>
        Rp {plan.price.toLocaleString("id-ID")}
      </p>
    </div>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
      border: `2px solid ${selected ? "var(--brand)" : "var(--fg-3)"}`,
      background: selected ? "var(--brand)" : "transparent",
      display: "grid", placeItems: "center" }}>
      {selected && (
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />
      )}
    </div>
  );
}

function MethodCard({
  selected,
  onSelect,
  icon,
  title,
  desc,
  children,
}: {
  id: string;
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div onClick={onSelect} className="card card-pad"
      style={{ cursor: "pointer",
        border: selected ? "1.5px solid var(--brand)" : "1.5px solid var(--border)",
        background: selected ? "var(--brand-soft)" : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <RadioDot selected={selected} />
        <div style={{ width: 36, height: 36, borderRadius: 8,
          background: "var(--brand-soft)", color: "var(--brand)",
          display: "grid", placeItems: "center", flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{title}</p>
          <p style={{ margin: 0, fontSize: 12, color: "var(--fg-3)" }}>{desc}</p>
        </div>
      </div>
      {selected && (
        <div style={{ marginTop: 16, paddingTop: 16,
          borderTop: "1px solid var(--border)" }}>
          {children}
        </div>
      )}
    </div>
  );
}