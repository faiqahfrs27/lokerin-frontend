import type { PublishedAssessment } from "../../schemas/userAssessmentSchema";
import AssessmentTimer from "./AssessmentTimer";
import QuestionViewer from "./QuestionViewer";

export type AnswerMap = Record<string, number>;

interface AttemptUIProps {
  assessment: PublishedAssessment;
  startedAt: string;
  answers: AnswerMap;
  onAnswer: (questionId: string, index: number) => void;
  onSubmit: () => void;
  onTimeUp: () => void;
  isSubmitting: boolean;
}

function TakeAttemptUI({
  assessment,
  startedAt,
  answers,
  onAnswer,
  onSubmit,
  onTimeUp,
  isSubmitting,
}: AttemptUIProps) {
  const questions = assessment.questions ?? [];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="dashboard-content">
      <AttemptHeader
        title={assessment.title}
        startedAt={startedAt}
        durationMin={assessment.durationMin}
        onTimeUp={onTimeUp}
      />
      <ProgressIndicator answered={answeredCount} total={questions.length} />
      {questions.map((q, idx) => (
        <QuestionViewer
          key={q.id}
          question={q}
          questionNumber={idx + 1}
          totalQuestions={questions.length}
          selectedIndex={answers[q.id]}
          onSelect={(index) => onAnswer(q.id, index)}
        />
      ))}
      <SubmitBar
        answeredCount={answeredCount}
        totalCount={questions.length}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function AttemptHeader({
  title,
  startedAt,
  durationMin,
  onTimeUp,
}: {
  title: string;
  startedAt: string;
  durationMin: number;
  onTimeUp: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <h1 className="t-h3" style={{ margin: 0 }}>
        {title}
      </h1>
      <AssessmentTimer
        startedAt={startedAt}
        durationMin={durationMin}
        onTimeUp={onTimeUp}
      />
    </div>
  );
}

function ProgressIndicator({
  answered,
  total,
}: {
  answered: number;
  total: number;
}) {
  const pct = total > 0 ? (answered / total) * 100 : 0;
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 13, color: "var(--fg-3)", margin: "0 0 6px" }}>
        Progress: {answered} / {total} answered
      </p>
      <div
        style={{
          height: 6,
          background: "var(--surface-2)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "var(--brand)",
            transition: "width 200ms",
          }}
        />
      </div>
    </div>
  );
}

function SubmitBar({
  answeredCount,
  totalCount,
  isSubmitting,
  onSubmit,
}: {
  answeredCount: number;
  totalCount: number;
  isSubmitting: boolean;
  onSubmit: () => void;
}) {
  const hasAnswers = answeredCount > 0;
  return (
    <div
      style={{
        position: "sticky",
        bottom: 16,
        marginTop: 24,
        padding: 16,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span style={{ color: "var(--fg-3)", fontSize: 13 }}>
        {answeredCount} of {totalCount} answered
      </span>
      <button
        type="button"
        className="btn btn-primary"
        onClick={onSubmit}
        disabled={!hasAnswers || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit assessment"}
      </button>
    </div>
  );
}

export default TakeAttemptUI;