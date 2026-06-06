import { Award, Calendar, ChevronRight, XCircle } from "lucide-react";
import { Link } from "react-router";
import type { AssessmentResult } from "../../schemas/userAssessmentSchema";

interface Props {
  results: AssessmentResult[];
}

function MyResultsList({ results }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {results.map((r) => (
        <ResultRow key={r.id} result={r} />
      ))}
    </div>
  );
}

function ResultRow({ result }: { result: AssessmentResult }) {
  return (
    <Link
      to={`/dashboard/results/${result.id}`}
      className="card card-pad"
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 16,
        cursor: "pointer",
      }}
    >
      <StatusIcon passed={result.passed} />
      <ResultInfo result={result} />
      <ResultScore score={result.score} passed={result.passed} />
      <ChevronRight size={16} color="var(--fg-4)" />
    </Link>
  );
}

function StatusIcon({ passed }: { passed: boolean }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: passed ? "var(--success-bg)" : "var(--surface-2)",
        color: passed ? "var(--success-fg)" : "var(--fg-3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {passed ? <Award size={20} /> : <XCircle size={20} />}
    </div>
  );
}

function ResultInfo({ result }: { result: AssessmentResult }) {
  const title = result.assessment?.title ?? "Assessment";
  const date = formatDate(result.completedAt ?? result.startedAt);

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 600,
          color: "var(--fg)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: "4px 0 0",
          fontSize: 12,
          color: "var(--fg-3)",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Calendar size={12} /> {date}
      </p>
    </div>
  );
}

function ResultScore({
  score,
  passed,
}: {
  score: number | null;
  passed: boolean;
}) {
  const display = score ?? "—";
  return (
    <div style={{ textAlign: "right", flexShrink: 0 }}>
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 800,
          color: passed ? "var(--success-fg)" : "var(--fg-2)",
          lineHeight: 1,
        }}
      >
        {display}
      </p>
      <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--fg-3)" }}>
        Score
      </p>
    </div>
  );
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default MyResultsList;