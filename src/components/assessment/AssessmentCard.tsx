import type { Assessment } from "../../schemas/assessmentSchema";

const REQUIRED = 25;

interface AssessmentCardProps {
  assessment: Assessment;
  onClick: () => void;
}

function AssessmentCard({ assessment, onClick }: AssessmentCardProps) {
  const q = assessment._count.questions;
  const pct = Math.min(100, Math.round((q / REQUIRED) * 100));
  const progressClass = getProgressClass(q);

  return (
    <button className="assessment-card" onClick={onClick} type="button">
      <CardTop category={assessment.skillCategory} isPublished={assessment.isPublished} />
      <h3 className="assessment-card__title">{assessment.title}</h3>
      <CardProgress questions={q} pct={pct} progressClass={progressClass} />
      <CardMeta passingScore={assessment.passingScore} durationMin={assessment.durationMin} />
    </button>
  );
}

function CardTop({ category, isPublished }: { category: string; isPublished: boolean }) {
  const statusClass = isPublished
    ? "assessment-card__status--published"
    : "assessment-card__status--draft";
  return (
    <div className="assessment-card__top">
      <span className="assessment-card__category">{category}</span>
      <span className={`assessment-card__status ${statusClass}`}>
        {isPublished ? "Terbit" : "Draft"}
      </span>
    </div>
  );
}

function CardProgress({
  questions,
  pct,
  progressClass,
}: {
  questions: number;
  pct: number;
  progressClass: string;
}) {
  const full = questions >= REQUIRED;
  return (
    <div>
      <div className={`assessment-card__progress-label ${progressClass}`}>
        <span>Progress</span>
        <span>{questions}/{REQUIRED} soal</span>
      </div>
      <div className="assessment-card__progress-bar">
        <div style={{ width: `${pct}%`, background: full ? "#059669" : "var(--brand-orange-500)" }} />
      </div>
    </div>
  );
}

function CardMeta({ passingScore, durationMin }: { passingScore: number; durationMin: number }) {
  return (
    <div className="assessment-card__meta">
      <span>Lulus <strong>≥{passingScore}</strong></span>
      <span>Durasi <strong>{durationMin}m</strong></span>
    </div>
  );
}

function getProgressClass(questions: number) {
  if (questions >= REQUIRED) return "assessment-card__progress-label--full";
  if (questions > 0) return "assessment-card__progress-label--partial";
  return "assessment-card__progress-label--empty";
}

export default AssessmentCard;