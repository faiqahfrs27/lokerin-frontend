import { Check } from "lucide-react";
import { Link } from "react-router";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { useSubscriptionPlans } from "../hooks/useSubscriptionPlans";
import type { SubscriptionPlan } from "../schemas/subscriptionPlanSchema";
import { useAuth } from "../stores/useAuth";

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


function PaidPlanCard({
  plan,
  user,
}: {
  plan: SubscriptionPlan;
  user: AuthUser;
}) {
  const isPopular = plan.name.toLowerCase().includes("standard");
  const to = user ? "/dashboard/subscribe" : "/login";

  return (
    <div
      className="card card-pad"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        border: isPopular ? "2px solid var(--brand)" : undefined,
        position: "relative",
      }}
    >
      {isPopular && <PopularBadge />}
      <PlanHeader name={plan.name} price={plan.price} />
      <FeatureList features={plan.features} />
      <Link
        to={to}
        className="btn btn-primary"
        style={{
          textDecoration: "none",
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        Get {plan.name} →
      </Link>
    </div>
  );
}

function PopularBadge() {
  return (
    <span
      style={{
        position: "absolute",
        top: -13,
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--brand)",
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 14px",
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}
    >
      Most popular
    </span>
  );
}

function PlanHeader({
  name,
  price,
  isFree,
}: {
  name: string;
  price: number;
  isFree?: boolean;
}) {
  return (
    <div>
      <h2
        style={{
          margin: "0 0 6px",
          fontSize: 22,
          fontWeight: 700,
          color: "var(--fg)",
        }}
      >
        {name}
      </h2>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: isFree ? "var(--fg)" : "var(--brand)",
            whiteSpace: "nowrap",
          }}
        >
          {isFree ? "Free" : `Rp ${price.toLocaleString("id-ID")}`}
        </span>
        <span style={{ fontSize: 13, color: "var(--fg-3)" }}>
          {isFree ? " forever" : " / bulan"}
        </span>
      </div>
    </div>
  );
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul
      style={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {features.map((f, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            fontSize: 14,
            color: "var(--fg-3)",
          }}
        >
          <Check
            size={15}
            style={{ color: "var(--brand)", marginTop: 2, flexShrink: 0 }}
          />
          {f}
        </li>
      ))}
    </ul>
  );
}

function PageFooterNote() {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: 40,
        display: "flex",
        justifyContent: "center",
        gap: 32,
        flexWrap: "wrap",
      }}
    >
      {[
        "Cancel anytime",
        "Pay with GoPay, OVO, DANA, or bank",
        "7-day money-back guarantee",
      ].map((note) => (
        <span
          key={note}
          style={{
            fontSize: 13,
            color: "var(--fg-3)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Check size={13} color="var(--brand)" /> {note}
        </span>
      ))}
    </div>
  );
}

export default Pricing;
