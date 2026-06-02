import { useMemo, useState } from "react";
import { useAssessments } from "../../hooks/useAssessments";
import DevHero from "../../components/dev/DevHero";
import AssessmentCard from "../../components/assessment/AssessmentCard";
import CreateAssessmentModal from "../../components/assessment/CreateAssessmentModal";

function AssessmentList() {
  const { data: assessments, isLoading, isError, error } = useAssessments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const stats = useMemo(() => computeStats(assessments), [assessments]);
  const filtered = useMemo(() => filterBySearch(assessments, search), [assessments, search]);

  if (isLoading) return <div className="dev-state">Loading assessments...</div>;
  if (isError) return <div className="dev-state">Failed to load: {(error as Error).message}</div>;

  return (
    <div className="dev-page">
      <DevHero
        kicker="Question bank"
        title="Skill assessments"
        stats={[`${stats.total} total`, `${stats.published} terbit`, `${stats.draft} draft`]}
        action={
          <button className="dev-btn-primary" onClick={() => setIsModalOpen(true)}>
            + Create assessment
          </button>
        }
      />
      <SearchBar value={search} onChange={setSearch} />
      <AssessmentGrid items={filtered} />
      {isModalOpen && <CreateAssessmentModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="dev-toolbar">
      <div className="dev-search">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search assessments..."
        />
      </div>
    </div>
  );
}

function AssessmentGrid({ items }: { items: import("../../schemas/assessmentSchema").Assessment[] }) {
  if (items.length === 0) {
    return <div className="dev-state">No assessments yet. Create the first one!</div>;
  }
  return (
    <div className="assessment-grid">
      {items.map((a) => (
        <AssessmentCard key={a.id} assessment={a} onClick={() => console.log("klik", a.id)} />
      ))}
    </div>
  );
}

function computeStats(items?: import("../../schemas/assessmentSchema").Assessment[]) {
  if (!items) return { total: 0, published: 0, draft: 0 };
  const published = items.filter((a) => a.isPublished).length;
  return { total: items.length, published, draft: items.length - published };
}

function filterBySearch(items?: import("../../schemas/assessmentSchema").Assessment[], search = "") {
  if (!items) return [];
  const q = search.toLowerCase();
  return items.filter((a) => a.title.toLowerCase().includes(q));
}

export default AssessmentList;