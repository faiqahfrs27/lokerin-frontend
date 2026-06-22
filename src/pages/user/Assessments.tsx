import { ArrowLeft, Lock, Trophy } from "lucide-react";
import { Link } from "react-router";
import { usePublishedAssessments } from "../../hooks/useUserAssessments";
import { useAssessmentUsage } from "../../hooks/useAssessments";
import { useMySubscription } from "../../hooks/useSubscription";
import type { PublishedAssessment } from "../../schemas/userAssessmentSchema";
import UserAssessmentCard from "../../components/assessment/UserAssessmentCard";
import Spinner from "../../components/common/Spinner";

function Assessments() {
  const { data: assessments, isLoading, error } = usePublishedAssessments();
  const { data: sub, isLoading: subLoading } = useMySubscription();
  const { data: usage, isLoading: usageLoading } = useAssessmentUsage();

  const isLoading2 = isLoading || subLoading || usageLoading;

  return (
    <div className="dashboard-content">
      <PageHeader />
      <PageBody
        assessments={assessments}
        isLoading={isLoading2}
        error={error}
        sub={sub}
        usage={usage}
      />
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
      >
        <div>
          <p className="t-kicker">Skill assessment</p>
          <h1 className="t-h3" style={{ margin: "8px 0 4px" }}>
            Test your skills
          </h1>
          <p style={{ color: "var(--fg-3)", fontSize: 14, margin: 0 }}>
            Pick an assessment, complete it within the time limit, and earn a
            badge.
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
  sub,
  usage,
}: {
  assessments?: PublishedAssessment[];
  isLoading: boolean;
  error: unknown;
  sub?: { status: string } | null;
  usage?: {
    count: number;
    limit: number | null;
    canTake: boolean;
    reason: string;
  } | null;
}) {
  if (isLoading) return <Spinner text="Loading assessments..." />;
  if (error)
    return <div className="dev-state">Failed to load assessments.</div>;

  if (!sub || sub.status !== "active") {
    return <SubscribeGate />;
  }

  if (!assessments || assessments.length === 0) return <EmptyState />;

  return <AssessmentGrid assessments={assessments} usage={usage} />;
}

function SubscribeGate() {
  return (
    <div
      style={{
        border: "1.5px dashed var(--border-2)",
        borderRadius: 14,
        padding: "64px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "var(--brand-soft)",
          color: "var(--brand)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <Lock size={20} />
      </div>
      <p
        style={{
          fontWeight: 700,
          fontSize: 16,
          margin: "0 0 8px",
          color: "var(--fg)",
        }}
      >
        Subscription required
      </p>
      <p style={{ color: "var(--fg-3)", fontSize: 14, margin: "0 0 20px" }}>
        Subscribe to Standard or Professional to access skill assessments.
      </p>
      <Link
        to="/dashboard/subscribe"
        className="btn btn-primary"
        style={{ textDecoration: "none", display: "inline-flex" }}
      >
        View Plans
      </Link>
    </div>
  );
}

function AssessmentGrid({
  assessments,
  usage,
}: {
  assessments: PublishedAssessment[];
  usage?: { count: number; limit: number | null; canTake: boolean } | null;
}) {
  return (
    <div>
      {usage && usage.limit !== null && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 16px",
            borderRadius: 10,
            background: usage.canTake
              ? "var(--brand-soft)"
              : "var(--danger-bg)",
            fontSize: 13,
            fontWeight: 600,
            color: usage.canTake ? "var(--brand)" : "var(--danger-fg)",
          }}
        >
          {usage.canTake
            ? `${usage.count}/${usage.limit} assessments used this cycle`
            : `Slot penuh (${usage.count}/${usage.limit}) — you can still retake assessments you've done before`}
        </div>
      )}
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
