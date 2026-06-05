import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useApplicants } from "../../hooks/useApplicants";
import type { ApplicantStatus } from "../../hooks/useApplicants";
import ApplicantDetailDrawer from "../../components/admin/ApplicantDetailDrawer";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const statusParam = filter === "all" ? undefined : filter;
  const { data, isLoading, isError, error } = useApplicants({
    status: statusParam,
    search: search.trim() || undefined,
  });

  const applicants = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const calcAge = (birthDate: string | null | undefined) => {
    if (!birthDate) return null;
    return Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
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
      </div>

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
                  {search || filter !== "all"
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