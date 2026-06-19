import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { useSubscriptionPlans } from "../hooks/useSubscriptionPlans";
import type { SubscriptionPlan } from "../schemas/subscriptionPlanSchema";
import { useAuth } from "../stores/useAuth";
import { PaidPlanCard, PageFooterNote } from "../components/pricing/PlanCard";

type AuthUser = { id: string } | null;

function Pricing() {
  const { data: plans, isLoading } = useSubscriptionPlans();
  const user = useAuth((s) => s.user);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <main style={{ flex: 1, padding: "80px 20px" }}>
        <PageHeader />
        <PlanGrid plans={plans ?? []} isLoading={isLoading} user={user} />
        <PageFooterNote />
      </main>
      <Footer />
    </div>
  );
}

function PageHeader() {
  return (
    <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
      <p
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--brand)",
          marginBottom: 12,
        }}
      >
        PRICING
      </p>
      <h1
        style={{
          fontSize: 48,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "var(--fg)",
          margin: "0 0 16px",
          lineHeight: 1.1,
        }}
      >
        Pay less than a kopi.
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--fg-3)",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        Subscriptions made for Indonesian wallets. Cancel anytime. No drama.
      </p>
    </div>
  );
}

function PlanGrid({
  plans,
  isLoading,
  user,
}: {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  user: AuthUser;
}) {
  if (isLoading)
    return (
      <div
        style={{ textAlign: "center", color: "var(--fg-3)", padding: "40px 0" }}
      >
        Loading plans...
      </div>
    );

  return (
    <div
      style={{
        display: "grid",
        gap: 24,
        maxWidth: 900,
        margin: "0 auto",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      }}
    >
      {plans.map((plan) => (
        <PaidPlanCard key={plan.id} plan={plan} user={user} />
      ))}
    </div>
  );
}

export default Pricing;