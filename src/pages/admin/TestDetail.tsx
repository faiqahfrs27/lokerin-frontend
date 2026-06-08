import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Loader2, Trash2, Plus, Check } from "lucide-react";
import { useTest } from "../../hooks/useTest";
import { useAddQuestion } from "../../hooks/useAddQuestion";
import { useDeleteQuestion } from "../../hooks/useDeleteQuestion";

function TestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: test, isLoading, isError } = useTest(id);

  if (isLoading) {
    return <div className="empty-row">Loading...</div>;
  }
  if (isError || !test) {
    return <div className="empty-row">Test not found.</div>;
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate("/admin/tests")}
            style={{ marginBottom: 8 }}
          >
            <ArrowLeft size={14} /> Back to tests
          </button>
          <span className="kicker">For "{test.job.title}"</span>
          <h1>{test.title}</h1>
          <p className="sub">
            Passing score: {test.passingScore} · Duration: {test.durationMinutes} min ·{" "}
            {test.questions.length} question(s) · {test._count.attempts} attempt(s)
          </p>
        </div>
      </div>

      {test.description && (
        <div className="table-card" style={{ padding: 16, marginBottom: 16 }}>
          <strong>Description</strong>
          <p style={{ margin: "6px 0 0", color: "var(--ink-soft)" }}>
            {test.description}
          </p>
        </div>
      )}

      <QuestionsList testId={test.id} questions={test.questions} />
      <AddQuestionForm testId={test.id} />
    </>
  );
}

function QuestionsList({
  testId,
  questions,
}: {
  testId: string;
  questions: { id: string; questionText: string; options: string[]; correctIndex: number }[];
}) {
  const deleteMutation = useDeleteQuestion(testId);

  if (questions.length === 0) {
    return (
      <div className="table-card empty-row" style={{ marginBottom: 16 }}>
        No questions yet. Add the first one below.
      </div>
    );
  }

  return (
    <div className="table-card" style={{ marginBottom: 16, padding: 16 }}>
      <h3 style={{ margin: "0 0 12px" }}>Questions ({questions.length})</h3>
      {questions.map((q, idx) => (
        <div
          key={q.id}
          style={{
            padding: 12,
            borderTop: idx > 0 ? "1px solid var(--line)" : "none",
          }}
        >
          <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 8 }}>
            <strong>
              {idx + 1}. {q.questionText}
            </strong>
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={() => deleteMutation.mutate(q.id)}
              disabled={deleteMutation.isPending}
              title="Delete question"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {q.options.map((opt, optIdx) => (
              <li
                key={optIdx}
                style={{
                  color: optIdx === q.correctIndex ? "var(--success, #16a34a)" : "var(--ink-soft)",
                  fontWeight: optIdx === q.correctIndex ? 600 : 400,
                }}
              >
                {opt} {optIdx === q.correctIndex && <Check size={12} style={{ display: "inline" }} />}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function AddQuestionForm({ testId }: { testId: string }) {
  const { form, onSubmit, isPending } = useAddQuestion(testId);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const options = watch("options") ?? ["", "", "", ""];
  const correctIndex = watch("correctIndex");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="table-card" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 12px" }}>Add question</h3>
      <label style={{ display: "block", marginBottom: 12 }}>
        Question text
        <div className="input-wrap">
          <input
            {...register("questionText")}
            placeholder="What is the output of console.log(typeof null)?"
          />
        </div>
        {errors.questionText && (
          <span className="ff-err">{errors.questionText.message}</span>
        )}
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        Options (mark the correct one)
      </label>
      {options.map((_, idx) => (
        <div key={idx} className="hstack" style={{ gap: 8, marginBottom: 8 }}>
          <input
            type="radio"
            checked={Number(correctIndex) === idx}
            onChange={() => form.setValue("correctIndex", idx)}
          />
          <div className="input-wrap" style={{ flex: 1 }}>
            <input {...register(`options.${idx}` as const)} placeholder={`Option ${idx + 1}`} />
          </div>
        </div>
      ))}
      {errors.options && (
        <span className="ff-err">
          {errors.options.message || "Check your options"}
        </span>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isPending}
        style={{ marginTop: 12 }}
      >
        {isPending ? <Loader2 size={14} className="spin" /> : <Plus size={14} />}{" "}
        Add question
      </button>
    </form>
  );
}

export default TestDetail;