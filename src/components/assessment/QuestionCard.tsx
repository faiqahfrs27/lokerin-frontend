import type { AssessmentQuestion } from "../../schemas/assessmentSchema";

interface QuestionCardProps {
  question: AssessmentQuestion;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

function QuestionCard({ question, index, onEdit, onDelete }: QuestionCardProps) {
  const handleDelete = () => {
    if (confirm(`Hapus soal #${index + 1}?`)) {
      onDelete();
    }
  };

  return (
    <div className="question-card">
      <QuestionHeader index={index} onEdit={onEdit} onDelete={handleDelete} />
      <p className="question-card__text">{question.question}</p>
      <QuestionOptions options={question.options} correctIndex={question.correctIndex} />
    </div>
  );
}

function QuestionHeader({
  index,
  onEdit,
  onDelete,
}: {
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="question-card__head">
      <span className="question-card__number">Soal #{index + 1}</span>
      <div className="question-card__actions">
        <button className="question-card__edit" onClick={onEdit} type="button">
          Edit
        </button>
        <button className="question-card__delete" onClick={onDelete} type="button">
          Hapus
        </button>
      </div>
    </div>
  );
}

function QuestionOptions({ options, correctIndex }: { options: string[]; correctIndex: number }) {
  return (
    <div className="question-card__options">
      {options.map((opt, i) => (
        <QuestionOption key={i} text={opt} letter={String.fromCharCode(65 + i)} isCorrect={i === correctIndex} />
      ))}
    </div>
  );
}

function QuestionOption({ text, letter, isCorrect }: { text: string; letter: string; isCorrect: boolean }) {
  const cls = isCorrect ? "question-option question-option--correct" : "question-option";
  return (
    <div className={cls}>
      <span className="question-option__letter">{letter}.</span>
      <span>{text}</span>
      {isCorrect && <span className="question-option__check">✓ Benar</span>}
    </div>
  );
}

export default QuestionCard;