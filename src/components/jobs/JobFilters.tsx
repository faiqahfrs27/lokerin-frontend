const CATEGORIES = ["All", "Engineering", "Design", "Data", "Product", "Marketing", "Finance", "HR", "Operations", "Sales"];

const SORT_OPTIONS = [
  { label: "Latest", value: "createdAt_desc" },
  { label: "Oldest", value: "createdAt_asc" },
  { label: "Highest salary", value: "salary_desc" },
  { label: "Deadline soon", value: "deadline_asc" },
];

interface JobFiltersProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center",
        padding: "8px 12px", borderRadius: "var(--radius-md)",
        background: active ? "var(--brand-soft)" : "none",
        color: active ? "var(--brand-fg)" : "var(--fg-2)",
        fontWeight: active ? "var(--fw-semibold)" : "var(--fw-regular)",
        border: "none", cursor: "pointer", fontSize: "var(--fs-sm)",
        fontFamily: "inherit", textAlign: "left", transition: "all 150ms", width: "100%",
      }}
    >
      {label}
    </button>
  );
}

function JobFilters({ activeCategory, onCategoryChange, sort, onSortChange }: JobFiltersProps) {
  return (
    <aside>
      <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <p className="t-caption" style={{ margin: "0 0 10px", letterSpacing: "var(--tracking-wider)", textTransform: "uppercase" }}>Category</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {CATEGORIES.map((cat) => (
              <FilterButton key={cat} label={cat} active={activeCategory === cat} onClick={() => onCategoryChange(cat)} />
            ))}
          </div>
        </div>
        <div>
          <p className="t-caption" style={{ margin: "0 0 10px", letterSpacing: "var(--tracking-wider)", textTransform: "uppercase" }}>Sort by</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {SORT_OPTIONS.map((opt) => (
              <FilterButton key={opt.value} label={opt.label} active={sort === opt.value} onClick={() => onSortChange(opt.value)} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default JobFilters;
export { CATEGORIES, SORT_OPTIONS };