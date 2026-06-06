import { ArrowLeft, Trophy } from "lucide-react";
import { Link } from "react-router";
import { usePublishedAssessments } from "../../hooks/useUserAssessments";
import type { PublishedAssessment } from "../../schemas/userAssessmentSchema";
import UserAssessmentCard from "../../components/assessment/UserAssessmentCard";

function Assessments() {
  const { data: assessments, isLoading, error } = usePublishedAssessments();

  return (
    <div className="dashboard-content">
      <PageHeader />
      <PageBody assessments={assessments} isLoading={isLoading} error={error} />
    </div>
  );
}

function PageHeader() {
  return (
    <div style={{ marginBottom: 32 }}>
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 16,
          flexWrap: "wrap",
        }}
      ><div>
          <p className="t-kicker">Skill assessment</p>
          <h1 className="t-h3" style={{ margin: "8px 0 4px" }}>
            Test your skills
          </h1>
          <p style={{ color: "var(--fg-3)", fontSize: 14, margin: 0 }}>
            Pick an assessment, complete it within the time limit, and earn a badge.
          </p>
        </div>
        <Link
          to="/dashboard/my-results"
          className="btn btn-secondary"
          style={{ textDecoration: "none", flexShrink: 0 }}
        >
          <Trophy size={14} /> View my results
        </Link>
      </div>
    </div>
  );
}

function PageBody({
  assessments,
  isLoading,
  error,
}: {
  assessments?: PublishedAssessment[];
  isLoading: boolean;
  error: unknown;
}) {
  if (isLoading) {
    return <div className="dev-state">Loading assessments...</div>;
  }

  if (error) {
    return <div className="dev-state">Failed to load assessments.</div>;
  }

  if (!assessments || assessments.length === 0) {
    return <EmptyState />;
  }

  return <AssessmentGrid assessments={assessments} />;
}

function AssessmentGrid({ assessments }: { assessments: PublishedAssessment[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
      }}
    >
      {assessments.map((a) => (
        <UserAssessmentCard key={a.id} assessment={a} />
      ))}
    </div>
  );
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
      No assessments available yet. Check back soon!
    </div>
  );
}

export default Assessments;