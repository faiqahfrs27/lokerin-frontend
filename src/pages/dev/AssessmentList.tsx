import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { useAssessments } from "../../hooks/useAssessments";
import DevHero from "../../components/dev/DevHero";
import AssessmentCard from "../../components/assessment/AssessmentCard";
import CreateAssessmentModal from "../../components/assessment/CreateAssessmentModal";
import type { Assessment } from "../../schemas/assessmentSchema";

function AssessmentList() {
  const { data: assessments, isLoading, isError, error } = useAssessments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const stats = useMemo(() => computeStats(assessments), [assessments]);
  const filtered = useMemo(
    () => filterBySearch(assessments, search),
    [assessments, search],
  );

  if (isLoading) return <div className="dev-state">Memuat assessment...</div>;
  if (isError)
    return (
      <div className="dev-state">Gagal memuat: {(error as Error).message}</div>
    );

  return (
    <div className="dev-page">
      <DevHero
        kicker="Bank soal"
        title="Skill assessments"
        stats={[
          `${stats.total} total`,
          `${stats.published} terbit`,
          `${stats.draft} draft`,
        ]}
        action={
          <button
            className="dev-btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} strokeWidth={2.5} /> Buat assessment
          </button>
        }
      />
      <SearchBar value={search} onChange={setSearch} />
      <AssessmentGrid
        items={filtered}
        onCardClick={(id) => navigate(`/dev/assessments/${id}`)}
      />
      {isModalOpen && (
        <CreateAssessmentModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
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
    <div className="dev-toolbar">
      <div className="dev-search">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari assessment..."
        />
      </div>
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
      <div className="dev-state">Belum ada assessment. Buat yang pertama!</div>
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
