import { useState } from "react";
import { Search, ArrowRight, SlidersHorizontal } from "lucide-react";
import { useApplicants } from "../../hooks/useApplicants";
import type { ApplicantStatus } from "../../hooks/useApplicants";
import ApplicantDetailDrawer from "../../components/admin/ApplicantDetailDrawer";
import { useDebouncedValue } from "../../hooks/search/useDebouncedValue";

type Filter = "all" | ApplicantStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "reviewed", label: "Reviewed" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
];

function Applicants() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Advanced filters
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [minSalary, setMinSalary] = useState<string>("");
  const [maxSalary, setMaxSalary] = useState<string>("");

  const statusParam = filter === "all" ? undefined : filter;
  const parseNum = (s: string) => (s.trim() ? Number(s) : undefined);

  const { data, isLoading, isError, error } = useApplicants({
    status: statusParam,
    search: debouncedSearch.trim() || undefined,
    minAge: parseNum(minAge),
    maxAge: parseNum(maxAge),
    minSalary: parseNum(minSalary),
    maxSalary: parseNum(maxSalary),
  });

  const applicants = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const calcAge = (birthDate: string | null | undefined) => {
    if (!birthDate) return null;
    return Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  };

  const activeAdvancedCount = [minAge, maxAge, minSalary, maxSalary].filter((v) => v.trim()).length;

  const clearAdvanced = () => {
    setMinAge("");
    setMaxAge("");
    setMinSalary("");
    setMaxSalary("");
  };

  return (
    <>
      <div className="admin-top">
        <div>
          <span className="kicker">Applicants</span>
          <h1>Applicants</h1>
          <p className="sub">{total} total · {filter === "all" ? "all statuses" : filter}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div className="input-wrap" style={{ flex: "1 1 280px", minWidth: 220, maxWidth: 400 }}>
          <Search size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..." />
        </div>

        <div className="hstack" style={{ gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={"chip " + (filter === f.id ? "active" : "")}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={"chip " + (showAdvanced || activeAdvancedCount > 0 ? "active" : "")}
          onClick={() => setShowAdvanced((s) => !s)}
          title="More filters"
        >
          <SlidersHorizontal size={12} /> Filters
          {activeAdvancedCount > 0 && (
            <span
              style={{
                marginLeft: 4,
                background: "var(--brand)",
                color: "white",
                borderRadius: "999px",
                fontSize: 10,
                padding: "1px 6px",
                fontWeight: 700,
              }}
            >
              {activeAdvancedCount}
            </span>
          )}
        </button>
      </div>

      {showAdvanced && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            padding: 14,
            border: "1px solid var(--border-2, #D6D3D1)",
            borderRadius: 12,
            flexWrap: "wrap",
            alignItems: "flex-end",
            background: "var(--surface-2, #FAFAF9)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 700 }}>
              Age range
            </label>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="number"
                min={15}
                max={100}
                placeholder="Min"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                style={{
                  width: 70,
                  padding: "6px 10px",
                  border: "1px solid var(--border-2, #D6D3D1)",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <span style={{ color: "var(--fg-3)" }}>—</span>
              <input
                type="number"
                min={15}
                max={100}
                placeholder="Max"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                style={{
                  width: 70,
                  padding: "6px 10px",
                  border: "1px solid var(--border-2, #D6D3D1)",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <span style={{ fontSize: 12, color: "var(--fg-3)" }}>years</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 700 }}>
              Expected salary (Rp)
            </label>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="number"
                min={0}
                step={500000}
                placeholder="Min"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                style={{
                  width: 130,
                  padding: "6px 10px",
                  border: "1px solid var(--border-2, #D6D3D1)",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <span style={{ color: "var(--fg-3)" }}>—</span>
              <input
                type="number"
                min={0}
                step={500000}
                placeholder="Max"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                style={{
                  width: 130,
                  padding: "6px 10px",
                  border: "1px solid var(--border-2, #D6D3D1)",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
            </div>
          </div>

          {activeAdvancedCount > 0 && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={clearAdvanced}
              style={{ marginLeft: "auto", fontSize: 12 }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="table-card">
        <table className="tbl">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Job applied</th>
              <th>Status</th>
              <th>Education</th>
              <th>Applied at</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (<tr className="empty-row"><td colSpan={6}>Loading...</td></tr>)}
            {isError && (
              <tr className="empty-row">
                <td colSpan={6}>Couldn't load applicants. {(error as { message?: string })?.message ?? ""}</td>
              </tr>
            )}
            {!isLoading && !isError && applicants.length === 0 && (
              <tr className="empty-row">
                <td colSpan={6}>
                  {search || filter !== "all" || activeAdvancedCount > 0
                    ? "No applicants match your filters."
                    : "No applicants yet. Once people apply, they'll show up here."}
                </td>
              </tr>
            )}
            {applicants.map((a) => {
              const age = calcAge(a.user.profile?.birthDate);
              return (
                <tr key={a.id} onClick={() => setSelectedId(a.id)} style={{ cursor: "pointer" }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="applicant-avatar">
                        {a.user.profile?.photoUrl ? (
                          <img src={a.user.profile.photoUrl} alt="" />
                        ) : (
                          (a.user.profile?.fullName ?? a.user.email).charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{a.user.profile?.fullName ?? "—"}</div>
                        <div className="role-meta">
                          {a.user.email}
                          {age !== null && <> · {age}y</>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{a.job.title}</td>
                  <td>
                    <ApplicantStatusChip status={a.status} />
                  </td>
                  <td className="role-meta">{a.user.profile?.education ?? "—"}</td>
                  <td className="role-meta">{new Date(a.appliedAt).toLocaleDateString("id-ID")}</td>
                  <td style={{ textAlign: "right" }}>
                    <button type="button" className="btn btn-ghost" style={{ padding: "6px 10px", fontSize: 12 }}>
                      Open <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedId && (
        <ApplicantDetailDrawer applicantId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
}

function ApplicantStatusChip({ status }: { status: ApplicantStatus }) {
  const config: Record<ApplicantStatus, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "badge-stone" },
    reviewed: { label: "Reviewed", cls: "badge-warning" },
    accepted: { label: "Accepted", cls: "badge-success" },
    rejected: { label: "Rejected", cls: "badge-danger" },
  };
  const c = config[status];
  return (
    <span className={"badge " + c.cls}>
      <span className="dot" />
      {c.label}
    </span>
  );
}

export default Applicants;