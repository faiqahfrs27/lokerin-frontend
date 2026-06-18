import { useState } from "react";
import { Link, useParams } from "react-router";
import { Rocket, Plus } from "lucide-react";
import {
  useAssessmentDetail,
  useDeleteQuestion,
  usePublishAssessment,
} from "../../hooks/useAssessmentDetail";
import DevHero from "../../components/dev/DevHero";
import QuestionCard from "../../components/assessment/QuestionCard";
import AddQuestionModal from "../../components/assessment/AddQuestionModal";
import EditQuestionModal from "../../components/assessment/EditQuestionModal";
import type { AssessmentQuestion } from "../../schemas/assessmentSchema";
import Spinner from "../../components/common/Spinner";

const REQUIRED = 25;

function AssessmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<AssessmentQuestion | null>(null);
  const {
    data: assessment,
    isLoading,
    isError,
    error,
  } = useAssessmentDetail(id);
  const deleteMutation = useDeleteQuestion(id ?? "");
  const publishMutation = usePublishAssessment(id ?? "");

  if (isLoading) return <Spinner text="Loading assessment..." />;
  if (isError)
    return (
      <div className="dev-state">
        Failed to load: {(error as Error).message}
      </div>
    );
  if (!assessment) return <div className="dev-state">Assessment not found</div>;

  const q = assessment.questions.length;
  const isReady = q === REQUIRED;

  return (
    <div className="dev-page">
      <Link to="/dev/assessments" className="detail-back">
        ← Back to list
      </Link>

      <DetailHeader
        assessment={assessment}
        isReady={isReady}
        onPublish={() => publishMutation.mutate()}
        publishLoading={publishMutation.isPending}
      />

      <ProgressCard questions={q} isReady={isReady} />

      <div className="questions-head">
        <h2>Questions</h2>
        {!assessment.isPublished && (
          <button className="dev-btn-primary" onClick={() => setAddOpen(true)}>
            <Plus size={16} strokeWidth={2.5} /> Add question
          </button>
        )}
      </div>

      <QuestionsList
        questions={assessment.questions}
        onEdit={(q) => setEditingQuestion(q)}
        onDelete={(qId) => deleteMutation.mutate(qId)}
      />

      {isAddOpen && id && (
        <AddQuestionModal assessmentId={id} onClose={() => setAddOpen(false)} />
      )}

      {editingQuestion && id && (
        <EditQuestionModal
          assessmentId={id}
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
        />
      )}
    </div>
  );
}

function DetailHeader({ assessment, isReady, onPublish, publishLoading }: any) {
  return (
    <div className="detail-header">
      <DevHero
        kicker={assessment.skillCategory}
        title={assessment.title}
        stats={[
          assessment.isPublished ? "Published" : "Draft",
          `Pass ≥${assessment.passingScore}`,
          `Duration ${assessment.durationMin}m`,
        ]}
      />
      {!assessment.isPublished && (
        <button
          className="btn-publish"
          onClick={onPublish}
          disabled={!isReady || publishLoading}
          title={!isReady ? `Butuh ${REQUIRED} soal dulu` : "Terbitkan"}
        >
          {publishLoading ? (
            "Publishing..."
          ) : (
            <>
              <Rocket size={16} strokeWidth={2} /> Publish
            </>
          )}{" "}
        </button>
      )}
    </div>
  );
}

function ProgressCard({
  questions,
  isReady,
}: {
  questions: number;
  isReady: boolean;
}) {
  const pct = Math.min(100, (questions / REQUIRED) * 100);
  const cls = isReady
    ? "progress-card__label--full"
    : questions > 0
      ? "progress-card__label--partial"
      : "progress-card__label--empty";
  const barColor = isReady ? "#059669" : "var(--brand-orange-500)";

  return (
    <div className="progress-card">
      <div className={`progress-card__label ${cls}`}>
        <span>Progress soal</span>
        <span>
          {questions}/{REQUIRED}
        </span>
      </div>
      <div className="progress-card__bar">
        <div style={{ width: `${pct}%`, background: barColor }} />
      </div>
      {!isReady && (
        <p className="progress-card__hint">
          Need {REQUIRED - questions} more questions to publish.
        </p>
      )}
    </div>
  );
}

function QuestionsList({
  questions,
  onEdit,
  onDelete,
}: {
  questions: AssessmentQuestion[];
  onEdit: (q: AssessmentQuestion) => void;
  onDelete: (id: string) => void;
}) {
  if (questions.length === 0) {
    return (
      <div className="questions-empty">
        No questions yet. Add the first one!
      </div>
    );
  }
  return (
    <div className="questions-list">
      {questions.map((qItem, idx) => (
        <QuestionCard
          key={qItem.id}
          question={qItem}
          index={idx}
          onEdit={() => onEdit(qItem)}
          onDelete={() => onDelete(qItem.id)}
        />
      ))}
    </div>
  );
}

export default AssessmentDetail;
