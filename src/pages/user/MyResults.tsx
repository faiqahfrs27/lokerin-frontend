import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useMyResults } from "../../hooks/useUserAssessments";
import type { AssessmentResult } from "../../schemas/userAssessmentSchema";
import MyResultsList from "../../components/assessment/MyResultsList";

function MyResults() {
  const { data: results, isLoading, error } = useMyResults();

  return (
    <div className="dashboard-content">
      <PageHeader />
      <PageBody results={results} isLoading={isLoading} error={error} />
    </div>
  );
}

function PageHeader() {
  return (
    <div style={{ marginBottom: 24 }}>
      <Link
        to="/dashboard"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "var(--fg-3)",
          textDecoration: "none",
          marginBottom: 12,
        }}
      >
        <ArrowLeft size={14} /> Back to dashboard
      </Link>
      <p className="t-kicker">History</p>
      <h1 className="t-h3" style={{ margin: "8px 0 4px" }}>
        My results
      </h1>
      <p style={{ color: "var(--fg-3)", fontSize: 14, margin: 0 }}>
        Track your assessment attempts and badges earned.
      </p>
    </div>
  );
}

function PageBody({
  results,
  isLoading,
  error,
}: {
  results?: AssessmentResult[];
  isLoading: boolean;
  error: unknown;
}) {
  if (isLoading) return <div className="dev-state">Loading results...</div>;
  if (error) return <div className="dev-state">Failed to load results.</div>;
  if (!results || results.length === 0) return <EmptyState />;
  return <MyResultsList results={results} />;
}

function EmptyState() {
  return (
    <div
      style={{
        border: "1.5px dashed var(--border-2)",
        borderRadius: 14,
        padding: "64px 20px",
        textAlign: "center",
        color: "var(--fg-3)",
        fontSize: 14,
      }}
    >
      <p style={{ margin: "0 0 8px" }}>No assessments taken yet.</p>
      <Link
        to="/dashboard/assessments"
        className="link"
        style={{ fontSize: 13 }}
      >
        Browse available assessments →
      </Link>
    </div>
  );
}

export default MyResults;