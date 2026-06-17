import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import Spinner from "../../components/common/Spinner";
import { useTestForJob, type UserTest } from "../../hooks/useTestForJob";
import {
  useSubmitAttempt,
  type AttemptResult,
} from "../../hooks/useSubmitAttempt";

function TakeTest() {
  const { id: jobId } = useParams<{ id: string }>();
  const { data: test, isLoading, isError } = useTestForJob(jobId);

  if (isLoading) return <Spinner text="Loading test..." fullPage />;
  if (isError || !test) return <StateMessage text="Test not found." />;

  return <ActiveTest test={test} />;
}

function ActiveTest({ test }: { test: UserTest }) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const submittedRef = useRef(false);
  const submitMutation = useSubmitAttempt(test.id);

  const handleSubmit = async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const payload = {
      answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({
        questionId,
        selectedIndex,
      })),
    };
    const data = await submitMutation.mutateAsync(payload);
    setResult(data);
  };

  // Countdown timer
  useEffect(() => {
    if (result) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          if (!submittedRef.current) {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  if (result) {
    return <ResultView result={result} onBack={() => navigate(`/jobs`)} />;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft <= 60;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      {/* Sticky countdown timer */}
      <div
        style={{
          position: "sticky",
          top: 12,
          zIndex: 50,
          background: isLowTime ? "var(--danger-bg, #FEF2F2)" : "var(--surface-1, #fff)",
          color: isLowTime ? "var(--danger-fg, #B91C1C)" : "var(--fg-1, #111)",
          border: `2px solid ${isLowTime ? "var(--danger-fg, #B91C1C)" : "var(--brand, #F97316)"}`,
          borderRadius: 12,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={18} />
          <span style={{ fontWeight: 700, fontSize: 13 }}>Time remaining</span>
        </div>
        <span
          style={{
            fontVariantNumeric: "tabular-nums",
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: 1,
          }}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>

      <span className="kicker">Pre-Selection Test</span>
      <h1 style={{ margin: "8px 0 4px" }}>{test.title}</h1>
      {test.description && (
        <p style={{ color: "var(--ink-soft)", margin: "0 0 8px" }}>
          {test.description}
        </p>
      )}
      <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
        For: <strong>{test.job.title}</strong> · Passing score:{" "}
        {test.passingScore} · {test.questions.length} questions
      </p>

      <div style={{ marginTop: 24 }}>
        {test.questions.map((q, idx) => (
          <div
            key={q.id}
            className="table-card"
            style={{ padding: 16, marginBottom: 12 }}
          >
            <strong>
              {idx + 1}. {q.questionText}
            </strong>
            <div style={{ marginTop: 10 }}>
              {q.options.map((opt, optIdx) => (
                <label
                  key={optIdx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 0",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === optIdx}
                    onChange={() => setAnswers({ ...answers, [q.id]: optIdx })}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-primary"
        disabled={submitMutation.isPending}
        onClick={handleSubmit}
        style={{ marginTop: 16 }}
      >
        {submitMutation.isPending && <Loader2 size={14} className="spin" />}
        Submit test
      </button>
      <p style={{ color: "var(--ink-soft)", marginTop: 8, fontSize: 13 }}>
        Unanswered questions count as 0 points. Test auto-submits when time runs out.
      </p>
    </div>
  );
}

function ResultView({
  result,
  onBack,
}: {
  result: AttemptResult;
  onBack: () => void;
}) {
  return (
    <div
      className="table-card"
      style={{
        maxWidth: 600,
        margin: "80px auto",
        padding: "32px 24px",
        textAlign: "center",
      }}
    >
      {result.passed ? (
        <CheckCircle2
          size={64}
          style={{ color: "#16a34a", margin: "0 auto" }}
        />
      ) : (
        <XCircle size={64} style={{ color: "#dc2626", margin: "0 auto" }} />
      )}
      <h1 style={{ marginTop: 16 }}>
        {result.passed ? "You passed! 🎉" : "Not passed"}
      </h1>
      <p style={{ fontSize: 32, fontWeight: 800, margin: "16px 0" }}>
        {result.score} / 100
      </p>
      <p style={{ color: "var(--ink-soft)" }}>
        {result.correctAnswers} of {result.totalQuestions} correct · Passing
        score: {result.passingScore}
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={onBack}
        style={{ marginTop: 24 }}
      >
        {result.passed ? "Back to jobs (you can now apply!)" : "Back to jobs"}
      </button>
    </div>
  );
}

function StateMessage({ text }: { text: string }) {
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "80px auto",
        textAlign: "center",
        color: "var(--ink-soft)",
      }}
    >
      {text}
    </div>
  );
}

export default TakeTest;