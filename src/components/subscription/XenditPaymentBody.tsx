const XENDIT_METHODS = ["QRIS", "BCA", "BNI", "OVO", "GoPay", "+10 more"];

export function XenditBody({
  onBack,
  onPay,
  isPending,
}: {
  onBack: () => void;
  onPay: () => void;
  isPending: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <XenditInfo />
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-secondary" onClick={onBack} disabled={isPending}>
          Back
        </button>
        <button onClick={onPay} disabled={isPending}
          style={{ flex: 1, padding: "12px 20px", borderRadius: 10,
            fontSize: 14, fontWeight: 700, cursor: "pointer",
            border: "none", background: "#0050C8", color: "#fff" }}>
          {isPending ? "Creating invoice..." : "Pay with Xendit"}
        </button>
      </div>
    </div>
  );
}

function XenditInfo() {
  return (
    <div style={{ background: "var(--surface-2)", borderRadius: 10,
      padding: "14px 16px", fontSize: 13, color: "var(--fg-3)", lineHeight: 1.7 }}>
      You'll be redirected to Xendit's secure payment page.
      Choose your preferred payment method there.
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        {XENDIT_METHODS.map((m) => (
          <span key={m} style={{ background: "var(--brand-soft)",
            color: "var(--brand)", fontSize: 11, fontWeight: 700,
            padding: "4px 10px", borderRadius: 999,
            border: "1px solid var(--brand-soft-2)" }}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}