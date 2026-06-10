import type { SubscriptionPlan } from "../../schemas/subscriptionPlanSchema";

const BANK_INFO = {
  bank: "BCA",
  account: "1234567890",
  name: "PT Lokerin Indonesia",
};

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
  return (
    <div style={{ maxWidth: 480 }}>
      <BankInfo plan={plan} />
      <ProofUpload proof={proof} onChange={onProofChange} />
      <ActionButtons
        onBack={onBack}
        onSubmit={onSubmit}
        disabled={!proof || isPending}
        isPending={isPending}
      />
    </div>
  );
}

function BankInfo({ plan }: { plan: SubscriptionPlan }) {
  return (
    <div className="card card-pad" style={{ marginBottom: 16 }}>
      <p className="t-kicker" style={{ marginBottom: 12 }}>Transfer Details</p>
      <InfoRow label="Bank" value={BANK_INFO.bank} />
      <InfoRow label="Account number" value={BANK_INFO.account} />
      <InfoRow label="Account name" value={BANK_INFO.name} />
      <InfoRow
        label="Amount"
        value={`Rp ${plan.price.toLocaleString("id-ID")}`}
        highlight
      />
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between",
      padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: 13, color: "var(--fg-3)" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: highlight ? 800 : 600,
        color: highlight ? "var(--brand)" : "var(--fg)" }}>
        {value}
      </span>
    </div>
  );
}

function ProofUpload({
  proof,
  onChange,
}: {
  proof: File | null;
  onChange: (f: File | null) => void;
}) {
  return (
    <div className="card card-pad" style={{ marginBottom: 16 }}>
      <p className="t-kicker" style={{ marginBottom: 12 }}>Upload Payment Proof</p>
      <div className="ff">
        <label className="ff-label">Transfer receipt (JPG, PNG · Max 2MB)</label>
        <div className="ff-input">
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>
      {proof && (
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--success-fg)" }}>
          ✓ {proof.name} selected
        </p>
      )}
    </div>
  );
}

function ActionButtons({
  onBack,
  onSubmit,
  disabled,
  isPending,
}: {
  onBack: () => void;
  onSubmit: () => void;
  disabled: boolean;
  isPending: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button className="btn btn-secondary" onClick={onBack} disabled={isPending}>
        Back
      </button>
      <button className="btn btn-primary" onClick={onSubmit} disabled={disabled}>
        {isPending ? "Submitting..." : "Submit Payment"}
      </button>
    </div>
  );
}