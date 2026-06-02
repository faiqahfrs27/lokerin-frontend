import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import NewJobModal from "../../components/admin/NewJobModal";
import { useJobs } from "../../hooks/useJobs";

type Filter = "all" | "live" | "draft";

function Postings() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState(false);

  const isPublishedParam =
    filter === "live" ? "true" : filter === "draft" ? "false" : undefined;
  const { data, isLoading, isError, error } = useJobs({
    isPublished: isPublishedParam,
  });

  const jobs = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const liveCount = jobs.filter((j) => j.isPublished).length;

  return (
    <>
      <div className="admin-top">
        <div>
          <span className="kicker">Postings</span>
          <h1>Job postings</h1>
          <p className="sub">
            {total} total · {liveCount} live
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOpen(true)}
        >
          <Plus size={14} /> Post a job
        </button>
      </div>

      <div
        className="hstack"
        style={{ gap: 8, marginBottom: 16, flexWrap: "wrap" }}
      >
        {(["all", "live", "draft"] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={"chip " + (filter === f ? "active" : "")}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-card">
        <table className="tbl">
          <thead>
            <tr>
              <th>Job</th>
              <th>City</th>
              <th>Status</th>
              <th>Posted</th>
              <th>Deadline</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr className="empty-row">
                <td colSpan={6}>Loading...</td>
              </tr>
            )}
            {isError && (
              <tr className="empty-row">
                <td colSpan={6}>
                  Couldn't load jobs.{" "}
                  {(error as { message?: string })?.message ?? ""}
                </td>
              </tr>
            )}
            {!isLoading && !isError && jobs.length === 0 && (
              <tr className="empty-row">
                <td colSpan={6}>
                  No jobs yet. Click "Post a job" to create your first.
                </td>
              </tr>
            )}
            {jobs.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{p.title}</div>
                  <div className="role-meta">{p.category?.name ?? "—"}</div>
                </td>
                <td>{p.city}</td>
                <td>
                  <span
                    className={
                      "badge " +
                      (p.isPublished ? "badge-success" : "badge-stone")
                    }
                  >
                    <span className="dot" />
                    {p.isPublished ? "Live" : "Draft"}
                  </span>
                </td>
                <td className="role-meta">
                  {new Date(p.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="role-meta">
                  {new Date(p.deadline).toLocaleDateString("id-ID")}
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: "6px 10px", fontSize: 12 }}
                  >
                    View <ArrowRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && <NewJobModal onClose={() => setOpen(false)} />}
    </>
  );
}

export default Postings;