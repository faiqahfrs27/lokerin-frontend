import { Clock, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { PublishedAssessment } from "../../schemas/userAssessmentSchema";

interface Props {
  assessment: PublishedAssessment;
}

function UserAssessmentCard({ assessment }: Props) {
  return (
    <Link
      to={`/dashboard/assessments/${assessment.id}/take`}
      className="card card-pad"
      style={{
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        cursor: "pointer",
      }}
    >
      <CardHeader category={assessment.skillCategory} />
      <CardTitle title={assessment.title} />
      <CardMeta
        durationMin={assessment.durationMin}
        passingScore={assessment.passingScore}
      />
      <CardCTA />
    </Link>
  );
}

function CardHeader({ category }: { category: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--brand-fg)",
          background: "var(--brand-soft)",
          padding: "4px 10px",
          borderRadius: 999,
          letterSpacing: "0.02em",
        }}
      >
        {category}
      </span>
    </div>
  );
}

function CardTitle({ title }: { title: string }) {
  return (
    <h3
      className="t-h4"
      style={{ margin: 0, color: "var(--fg)", lineHeight: 1.3 }}
    >
      {title}
    </h3>
  );
}

function CardMeta({
  durationMin,
  passingScore,
}: {
  durationMin: number;
  passingScore: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        paddingTop: 12,
        borderTop: "1px solid var(--border)",
        fontSize: 13,
        color: "var(--fg-3)",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Clock size={14} /> {durationMin} min
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Award size={14} /> Pass ≥ {passingScore}
      </span>
    </div>
  );
}

function CardCTA() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 4,
      }}
    >
      <span
        style={{
          color: "var(--brand-fg)",
          fontSize: 13,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        Start assessment <ArrowRight size={14} />
      </span>
    </div>
  );
}

export default UserAssessmentCard;