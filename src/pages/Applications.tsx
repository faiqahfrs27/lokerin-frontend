import { ArrowLeft, ArrowRight, Briefcase, Calendar, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useMyApplications } from "../hooks/jobs/useMyApplications";

const STATUS_MAP = {
  pending: { label: "Pending", class: "badge-stone" },
  reviewed: { label: "Reviewed", class: "badge-info" },
  accepted: { label: "Accepted", class: "badge-success" },
  rejected: { label: "Rejected", class: "badge-danger" },
};

const STATUS_FILTERS = ["All", "pending", "reviewed", "accepted", "rejected"];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function Applications() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("All");

  const { data, isLoading } = useMyApplications({
    page,
    limit: 10,
    status: status === "All" ? undefined : status,
  });

  const applications = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="dashboard-content">
      <div style={{ marginBottom: 24 }}>
        <p className="t-kicker">My Applications</p>
        <h1 className="t-h3" style={{ margin: "8px 0 4px" }}>Application tracker</h1>
        <p style={{ color: "var(--fg-3)", fontSize: "var(--fs-sm)" }}>Track all your job applications in one place.</p>
      </div>

      {/* Status filter */}
      <div className="cat-row" style={{ marginBottom: 20 }}>
        {STATUS_FILTERS.map((s) => (
          <button key={s} className={`chip${status === s ? " active" : ""}`} onClick={() => { setStatus(s); setPage(1); }}>
            {s === "All" ? "All" : STATUS_MAP[s as keyof typeof STATUS_MAP].label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p style={{ color: "var(--fg-3)" }}>Loading...</p>
      ) : applications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "56px 24px" }}>
          <p style={{ fontSize: 40, margin: "0 0 12px" }}>📋</p>
          <h3 style={{ margin: "0 0 8px" }}>No applications yet</h3>
          <p style={{ color: "var(--fg-3)", marginBottom: 24 }}>Start applying to jobs you're interested in.</p>
          <Link to="/jobs" className="btn btn-primary" style={{ textDecoration: "none" }}>Browse jobs</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {applications.map((app) => (
            <Link key={app.id} to={`/dashboard/applications/${app.id}`} style={{ textDecoration: "none" }}>
              <div className="card card-pad interactive" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "var(--brand-soft)", color: "var(--brand-fg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Briefcase size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 2px", fontWeight: "var(--fw-semibold)", color: "var(--fg)", fontSize: "var(--fs-sm)" }}>{app.job.title}</p>
                  <p style={{ margin: 0, fontSize: "var(--fs-xs)", color: "var(--fg-3)" }}>{app.job.company.name} {app.job.city ? `· ${app.job.city}` : ""}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <span style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)", display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} /> {formatDate(app.appliedAt)}
                  </span>
                  <span className={`badge ${STATUS_MAP[app.status].class}`}>{STATUS_MAP[app.status].label}</span>
                  <ChevronRight size={16} style={{ color: "var(--fg-4)" }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 24 }}>
          <button className="btn btn-secondary btn-icon" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            <ArrowLeft size={14} />
          </button>
          <span style={{ fontSize: "var(--fs-sm)", color: "var(--fg-2)" }}>Page {page} of {meta.totalPages}</span>
          <button className="btn btn-secondary btn-icon" disabled={page === meta.totalPages} onClick={() => setPage((p) => p + 1)}>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Applications;