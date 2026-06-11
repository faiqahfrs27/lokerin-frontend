import { ArrowLeft, Lock } from "lucide-react";
import { Link } from "react-router";
import { useMyResults } from "../../hooks/useUserAssessments";
import { useMySubscription } from "../../hooks/useSubscription";
import type { AssessmentResult } from "../../schemas/userAssessmentSchema";
import MyResultsList from "../../components/assessment/MyResultsList";

function MyResults() {
  const { data: results, isLoading, error } = useMyResults();
  const { data: sub, isLoading: subLoading } = useMySubscription();

  return (
    <div className="dashboard-content">
      <PageHeader />
      <PageBody
        results={results}
        isLoading={isLoading || subLoading}
        error={error}
        sub={sub}
      />
    </div>
  );
}

function PageHeader() {
  return (
    <div style={{ marginBottom: 24 }}>
      <Link to="/dashboard" style={{ display: "inline-flex",
        alignItems: "center", gap: 6, fontSize: 13,
        color: "var(--fg-3)", textDecoration: "none", marginBottom: 12 }}>
        <ArrowLeft size={14} /> Back to dashboard
      </Link>
      <p className="t-kicker">Skill Assessment</p>
      <h1 className="t-h3" style={{ margin: "8px 0 4px" }}>My Results</h1>
      <p style={{ color: "var(--fg-3)", fontSize: 14, margin: 0 }}>
        View all your assessment attempts and certificates.
      </p>
    </div>
  );
}

function PageBody({
  results,
  isLoading,
  error,
  sub,
}: {
  results?: AssessmentResult[];
  isLoading: boolean;
  error: unknown;
  sub?: { status: string } | null;
}) {
  if (isLoading) return <div className="dev-state">Loading...</div>;
  if (error) return <div className="dev-state">Failed to load results.</div>;

  // Guard: belum subscribe
  if (!sub || sub.status !== "active") {
    return <SubscribeGate />;
  }

  if (!results || results.length === 0) return <EmptyState />;

  return <MyResultsList results={results} />;
}

function SubscribeGate() {
  return (
    <div style={{ border: "1.5px dashed var(--border-2)", borderRadius: 14,
      padding: "64px 20px", textAlign: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%",
        background: "var(--brand-soft)", color: "var(--brand)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 16px" }}>
        <Lock size={20} />
      </div>
      <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 8px",
        color: "var(--fg)" }}>
        Subscription required
      </p>
      <p style={{ color: "var(--fg-3)", fontSize: 14, margin: "0 0 20px" }}>
        Subscribe to Standard or Professional to access your results.
      </p>
      <Link to="/dashboard/subscribe" className="btn btn-primary"
        style={{ textDecoration: "none", display: "inline-flex" }}>
        View Plans
      </Link>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ border: "1.5px dashed var(--border-2)", borderRadius: 14,
      padding: "64px 20px", textAlign: "center",
      color: "var(--fg-3)", fontSize: 14 }}>
      No results yet.{" "}
      <Link to="/dashboard/assessments"
        style={{ color: "var(--brand)", textDecoration: "none" }}>
        Take an assessment
      </Link>{" "}
      to earn your first badge.
    </div>
  );
}

export default MyResults;