import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import {
  usePublishedAssessments,
  useStartAttempt,
  useSubmitAnswers,
} from "../../hooks/useUserAssessments";
import type {
  AttemptStart,
  PublishedAssessment,
} from "../../schemas/userAssessmentSchema";
import TakeAttemptUI, {
  type AnswerMap,
} from "../../components/assessment/TakeAttemptUI";

function TakeAssessment() {
  const { id: assessmentId } = useParams<{ id: string }>();
  const { data: assessments, isLoading } = usePublishedAssessments();
  const assessment = assessments?.find((a) => a.id === assessmentId);

  if (isLoading) return <LoadingState />;
  if (!assessment) return <NotFoundState />;
  return <ActiveAttempt assessment={assessment} />;
}

function ActiveAttempt({ assessment }: { assessment: PublishedAssessment }) {
  const navigate = useNavigate();
  const startMutation = useStartAttempt();
  const submitMutation = useSubmitAnswers();

  const [attemptData, setAttemptData] = useState<AttemptStart | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});

  useEffect(() => {
    if (attemptData || startMutation.isPending) return;
    startMutation.mutate(assessment.id, {
      onSuccess: (data) => setAttemptData(data),
    });
  }, [assessment.id, attemptData, startMutation]);

  const handleSubmit = async () => {
    if (!attemptData) return;
    const result = await submitMutation.mutateAsync({
      attemptId: attemptData.resultId,
      body: { answers },
    });
    toast.success(result.passed ? "Passed! 🎉" : "Submitted");
    navigate(`/dashboard/results/${result.id}`);
  };

  const handleTimeUp = () => {
    if (!attemptData || submitMutation.isPending) return;
    toast("Time's up — submitting...", { icon: "⏰" });
    handleSubmit();
  };

  if (!attemptData) return <LoadingState />;

  return (
    <TakeAttemptUI
      assessment={{
        ...attemptData.assessment,
        questions: attemptData.questions,
        durationMin: attemptData.durationMin,
      }}
      startedAt={attemptData.startedAt}
      answers={answers}
      onAnswer={(qId, idx) => setAnswers({ ...answers, [qId]: idx })}
      onSubmit={handleSubmit}
      onTimeUp={handleTimeUp}
      isSubmitting={submitMutation.isPending}
    />
  );
}

function LoadingState() {
  return <div className="dev-state">Loading assessment...</div>;
}

function NotFoundState() {
  return (
    <div className="dev-state">
      Assessment not found or no longer available.
    </div>
  );
}

export default TakeAssessment;