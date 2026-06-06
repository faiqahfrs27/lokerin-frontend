import { useParams } from "react-router";
import { useResultById } from "../../hooks/useUserAssessments";
import ResultDisplay from "../../components/assessment/ResultDisplay";

function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const { data: result, isLoading, error } = useResultById(id);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!result) return <NotFoundState />;

  return <ResultDisplay result={result} />;
}

function LoadingState() {
  return <div className="dev-state">Loading your result...</div>;
}

function ErrorState() {
  return (
    <div className="dev-state">Failed to load result. Please try again.</div>
  );
}

function NotFoundState() {
  return <div className="dev-state">Result not found.</div>;
}

export default ResultPage;