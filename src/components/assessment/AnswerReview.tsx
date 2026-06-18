import type { ResultQuestion } from "../../schemas/userAssessmentSchema";

interface Props {
  questions: ResultQuestion[];
  answers: Record<string, number> | null;
}

function AnswerReview({ questions, answers }: Props) {
  if (questions.length === 0) return null;
  return (
    <div style={{ marginTop: 28, marginBottom: 20 }}>
      <h2 className="t-h4" style={{ margin: "0 0 12px" }}>
        Review your answers
      </h2>
      {questions.map((q, idx) => (
        <ReviewCard
          key={q.id}
          question={q}
          number={idx + 1}
          total={questions.length}
          selectedIndex={answers?.[q.id]}
        />
      ))}
    </div>
  );
}

function ReviewCard({
  question,
  number,
  total,
  selectedIndex,
}: {
  question: ResultQuestion;
  number: number;
  total: number;
  selectedIndex: number | undefined;
}) {
  return (
    <article className="card card-pad" style={{ marginBottom: 16 }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--fg-4)",
          letterSpacing: "0.04em",
        }}
      >
        QUESTION {number} / {total}
      </span>
      <h3
        style={{
          margin: "10px 0 16px",
          fontSize: 16,
          fontWeight: 600,
          color: "var(--fg)",
          lineHeight: 1.4,
        }}
      >
        {question.question}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {question.options.map((option, idx) => (
          <ReviewOption
            key={idx}
            text={option}
            letter={String.fromCharCode(65 + idx)}
            isCorrect={idx === question.correctIndex}
            isYourPick={idx === selectedIndex}
          />
        ))}
      </div>
      {selectedIndex === undefined && (
        <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "var(--fg-3)" }}>
          You didn't answer this question.
        </p>
      )}
    </article>
  );
}

function ReviewOption({
  text,
  letter,
  isCorrect,
  isYourPick,
}: {
  text: string;
  letter: string;
  isCorrect: boolean;
  isYourPick: boolean;
}) {
  let cls = "question-option";
  if (isCorrect) cls += " question-option--correct";
  else if (isYourPick) cls += " question-option--incorrect";

  return (
    <div className={cls}>
      <span className="question-option__letter">{letter}.</span>
      <span style={{ flex: 1 }}>{text}</span>
      {isCorrect && <span className="question-option__check">✓ Correct</span>}
      {isYourPick && !isCorrect && (
        <span
          className="question-option__check"
          style={{ color: "var(--danger-fg)" }}
        >
          ✗ Your answer
        </span>
      )}
    </div>
  );
}

export default AnswerReview;
