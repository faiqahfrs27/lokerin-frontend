import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search } from "lucide-react";
import { useAssessments } from "../../hooks/useAssessments";
import { useDebouncedValue } from "../../hooks/search/useDebouncedValue";
import AssessmentCard from "../../components/assessment/AssessmentCard";
import CreateAssessmentModal from "../../components/assessment/CreateAssessmentModal";
import type { Assessment } from "../../schemas/assessmentSchema";
import Spinner from "../../components/common/Spinner";

function AssessmentList() {
  const { data: assessments, isLoading, isError, error } = useAssessments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const stats = useMemo(() => computeStats(assessments), [assessments]);
  const debouncedSearch = useDebouncedValue(search, 400);
  const filtered = useMemo(
    () => filterBySearch(assessments, debouncedSearch),
    [assessments, debouncedSearch],
  );

  if (isLoading) return <Spinner text="Loading assessments..." />;
  if (isError)
    return (
      <div className="dev-state">
        Failed to load: {(error as Error).message}
      </div>
    );

  return (
    <>
      <div className="admin-top">
        <div>
          <span className="kicker">Skill Assessment</span>
          <h1>Skill assessments</h1>
          <p className="sub">
            {stats.total} total · {stats.published} publish · {stats.draft}{" "}
            draft
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} strokeWidth={2.5} /> Create assessment
        </button>
      </div>
      <SearchBar value={search} onChange={setSearch} />
      <AssessmentGrid
        items={filtered}
        onCardClick={(id) => navigate(`/dev/assessments/${id}`)}
      />
      {isModalOpen && (
        <CreateAssessmentModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="input-wrap" style={{ marginBottom: 20, maxWidth: 400 }}>
      <Search size={16} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search assessment..."
      />
    </div>
  );
}

function AssessmentGrid({
  items,
  onCardClick,
}: {
  items: Assessment[];
  onCardClick: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="dev-state">
        No assessments yet. Create your first one!
      </div>
    );
  }
  return (
    <div className="assessment-grid">
      {items.map((a) => (
        <AssessmentCard
          key={a.id}
          assessment={a}
          onClick={() => onCardClick(a.id)}
        />
      ))}
    </div>
  );
}

function computeStats(items?: Assessment[]) {
  if (!items) return { total: 0, published: 0, draft: 0 };
  const published = items.filter((a) => a.isPublished).length;
  return {
    total: items.length,
    published,
    draft: items.length - published,
  };
}

function filterBySearch(items?: Assessment[], search = "") {
  if (!items) return [];
  const q = search.toLowerCase();
  return items.filter((a) => a.title.toLowerCase().includes(q));
}

export default AssessmentList;
