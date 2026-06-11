import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  ArrowRight,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Search,
} from "lucide-react";
import NewJobModal from "../../components/admin/NewJobModal";
import EditJobModal from "../../components/admin/EditJobModal";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useJobs } from "../../hooks/useJobs";
import type { Job } from "../../hooks/useJobs";
import { useJobCategories } from "../../hooks/useJobCategories";
import { useDeleteJob } from "../../hooks/useDeleteJob";
import { useTogglePublish } from "../../hooks/useTogglePublish";
import { useDebouncedValue } from "../../hooks/search/useDebouncedValue";

type Filter = "all" | "live" | "draft";

function Postings() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [openCreate, setOpenCreate] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deleteJob, setDeleteJob] = useState<Job | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const [sortBy, setSortBy] = useState<"createdAt" | "title">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [categoryId, setCategoryId] = useState("");
  const { data: categoriesData } = useJobCategories();
  const categories = categoriesData?.data ?? [];

  const isPublishedParam =
    filter === "live" ? "true" : filter === "draft" ? "false" : undefined;
  const { data, isLoading, isError, error } = useJobs({
    isPublished: isPublishedParam,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
    categoryId: categoryId || undefined,
  });

  const togglePublish = useTogglePublish();
  const deleteMutation = useDeleteJob(() => setDeleteJob(null));

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
          onClick={() => setOpenCreate(true)}
        >
          <Plus size={14} /> Post a job
        </button>
      </div>

      <div
        className="hstack"
        style={{ gap: 8, marginBottom: 12, flexWrap: "wrap" }}
      >
        <div className="input-wrap" style={{ flex: 1, minWidth: 200 }}>
          <Search size={16} />
          <input
            placeholder="Search by job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="input-wrap" style={{ minWidth: 160 }}>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c: { id: string; name: string }) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="input-wrap" style={{ minWidth: 180 }}>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split("-");
              setSortBy(sb as "createdAt" | "title");
              setSortOrder(so as "asc" | "desc");
            }}
          >
            <option value="createdAt-desc">Newest first</option>
            <option value="createdAt-asc">Oldest first</option>
            <option value="title-asc">Title A→Z</option>
            <option value="title-desc">Title Z→A</option>
          </select>
        </div>
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
              <th>Applicants</th>
              <th>Posted</th>
              <th>Deadline</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr className="empty-row">
                <td colSpan={7}>Loading...</td>
              </tr>
            )}
            {isError && (
              <tr className="empty-row">
                <td colSpan={7}>
                  Couldn't load jobs.{" "}
                  {(error as { message?: string })?.message ?? ""}
                </td>
              </tr>
            )}
            {!isLoading && !isError && jobs.length === 0 && (
              <tr className="empty-row">
                <td colSpan={7}>
                  No jobs yet. Click "Post a job" to create your first.
                </td>
              </tr>
            )}
            {jobs.map((p) => {
              const togglePending =
                togglePublish.isPending && togglePublish.variables === p.id;
              return (
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
                  <td>{p._count?.applications ?? 0}</td>
                  <td className="role-meta">
                    {new Date(p.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="role-meta">
                    {new Date(p.deadline).toLocaleDateString("id-ID")}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-ghost"
                        title={p.isPublished ? "Unpublish" : "Publish"}
                        style={{ padding: "6px 8px" }}
                        disabled={togglePending}
                        onClick={() => togglePublish.mutate(p.id)}
                      >
                        {togglePending ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : p.isPublished ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        title="Edit"
                        style={{ padding: "6px 8px" }}
                        onClick={() => setEditJob(p)}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        title="Delete"
                        style={{
                          padding: "6px 8px",
                          color: "var(--danger-600, #DC2626)",
                        }}
                        onClick={() => setDeleteJob(p)}
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ padding: "6px 10px", fontSize: 12 }}
                        onClick={() => navigate(`/admin/postings/${p.id}`)}
                      >
                        View <ArrowRight size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {openCreate && <NewJobModal onClose={() => setOpenCreate(false)} />}
      {editJob && (
        <EditJobModal job={editJob} onClose={() => setEditJob(null)} />
      )}
      {deleteJob && (
        <ConfirmModal
          title={`Delete "${deleteJob.title}"?`}
          message="This will permanently remove the job posting. This action cannot be undone."
          confirmLabel="Delete posting"
          tone="danger"
          isPending={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(deleteJob.id)}
          onClose={() => setDeleteJob(null)}
        />
      )}
    </>
  );
}

export default Postings;
