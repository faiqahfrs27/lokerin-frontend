import type { PublishedQuestion } from "../../schemas/userAssessmentSchema";

interface Props {
  question: PublishedQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedIndex: number | undefined;
  onSelect: (index: number) => void;
}

function QuestionViewer({
  question,
  questionNumber,
  totalQuestions,
  selectedIndex,
  onSelect,
}: Props) {
  return (
    <article className="card card-pad" style={{ marginBottom: 16 }}>
      <QuestionHeader number={questionNumber} total={totalQuestions} />
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
      <OptionList
        options={question.options}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
      />
    </article>
  );
}

function QuestionHeader({
  number,
  total,
}: {
  number: number;
  total: number;
}) {
  return (
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
  );
}

function OptionList({
  options,
  selectedIndex,
  onSelect,
}: {
  options: string[];
  selectedIndex: number | undefined;
  onSelect: (index: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {options.map((option, idx) => (
        <OptionButton
          key={idx}
          option={option}
          index={idx}
          isSelected={selectedIndex === idx}
          onClick={() => onSelect(idx)}
        />
      ))}
    </div>
  );
}

function OptionButton({
  option,
  index,
  isSelected,
  onClick,
}: {
  option: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const letter = String.fromCharCode(65 + index);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`question-option ${
        isSelected ? "question-option--selected" : ""
      }`}
    >
      <span className="question-option__letter">{letter}.</span>
      <span style={{ textAlign: "left", flex: 1 }}>{option}</span>
    </button>
  );
}

export default QuestionViewer;