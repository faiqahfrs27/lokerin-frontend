import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ChevronLeft, MapPin, Calendar, DollarSign, Tag, Briefcase,
  CheckCircle, Edit3, Trash2, Eye, EyeOff, Loader2,
} from "lucide-react";
import { useJob } from "../../hooks/useJob";
import { useApplicants } from "../../hooks/useApplicants";
import { useDeleteJob } from "../../hooks/useDeleteJob";
import { useTogglePublish } from "../../hooks/useTogglePublish";
import EditJobModal from "../../components/admin/EditJobModal";
import ConfirmModal from "../../components/admin/ConfirmModal";
import ApplicantDetailDrawer from "../../components/admin/ApplicantDetailDrawer";
import Spinner from "../../components/common/Spinner";

function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);

  const { data: job, isLoading, isError } = useJob(id);
  const { data: applicantsData } = useApplicants({ jobId: id, limit: 50 });
  const togglePublish = useTogglePublish();
  const deleteMutation = useDeleteJob(() => navigate("/admin/postings"));

  const applicants = applicantsData?.data ?? [];
  const formatRupiah = (n: number | null | undefined) =>
    n ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n) : "—";

  if (isLoading) {
    return <Spinner text="Loading job details..." fullPage />;
  }

  if (isError || !job) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "var(--fg-3)", marginBottom: 12 }}>Couldn't load this job posting.</p>
        <Link to="/admin/postings" className="btn btn-secondary">
          <ChevronLeft size={14} /> Back to postings
        </Link>
      </div>
    );
  }

  const tags = Array.isArray(job.tags) ? (job.tags as string[]) : [];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link to="/admin/postings" className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 10px" }}>
          <ChevronLeft size={14} /> Back to postings
        </Link>
      </div>

      <div className="admin-top">
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="kicker">Job posting</span>
          <h1>{job.title}</h1>
          <p className="sub">{job.category?.name ?? "Uncategorized"} · {job.city}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="btn btn-secondary" disabled={togglePublish.isPending} onClick={() => togglePublish.mutate(job.id)}>
            {togglePublish.isPending ? <Loader2 size={14} className="animate-spin" /> : job.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
            {job.isPublished ? "Unpublish" : "Publish"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setOpenEdit(true)}>
            <Edit3 size={14} /> Edit
          </button>
          <button type="button" className="btn btn-secondary" style={{ color: "var(--danger-600, #DC2626)" }} onClick={() => setOpenDelete(true)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="job-detail-grid">
        <div className="job-detail-card">
          <div className="job-detail-info">
            <InfoItem icon={<Briefcase size={14} />} label="Status">
              <span className={"badge " + (job.isPublished ? "badge-success" : "badge-stone")}>
                <span className="dot" />
                {job.isPublished ? "Live" : "Draft"}
              </span>
            </InfoItem>
            <InfoItem icon={<MapPin size={14} />} label="Location">{job.city}</InfoItem>
            <InfoItem icon={<DollarSign size={14} />} label="Salary">{formatRupiah(job.salary)}</InfoItem>
            <InfoItem icon={<Calendar size={14} />} label="Deadline">
              {new Date(job.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </InfoItem>
            <InfoItem icon={<CheckCircle size={14} />} label="Pre-selection Test">
              {job.hasTest ? "Required" : "Not required"}
            </InfoItem>
          </div>

          {tags.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 700, marginBottom: 8 }}>
                <Tag size={11} style={{ display: "inline", marginRight: 4 }} />
                Tags
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {tags.map((t) => (
                  <span key={t} className="chip" style={{ pointerEvents: "none" }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 700, marginBottom: 8 }}>
              Description
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-line" }}>{job.description}</p>
          </div>
        </div>
      </div>

      <h2 style={{ margin: "32px 0 12px", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800 }}>
        Applicants for this job
        <span style={{ marginLeft: 10, fontSize: 13, color: "var(--fg-3)", fontWeight: 500 }}>({applicants.length})</span>
      </h2>

      <div className="table-card">
        <table className="tbl">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Status</th>
              <th>Education</th>
              <th>Applied at</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applicants.length === 0 ? (
              <tr className="empty-row"><td colSpan={5}>No applicants yet for this job posting.</td></tr>
            ) : (
              applicants.map((a) => (
                <tr key={a.id} onClick={() => setSelectedApplicantId(a.id)} style={{ cursor: "pointer" }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="applicant-avatar">
                        {(a.user.profile?.fullName ?? a.user.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{a.user.profile?.fullName ?? "—"}</div>
                        <div className="role-meta">{a.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={"badge " + (a.status === "accepted" ? "badge-success" : a.status === "rejected" ? "badge-danger" : a.status === "reviewed" ? "badge-warning" : "badge-stone")}>
                      <span className="dot" />
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </td>
                  <td className="role-meta">{a.user.profile?.education ?? "—"}</td>
                  <td className="role-meta">{new Date(a.appliedAt).toLocaleDateString("id-ID")}</td>
                  <td style={{ textAlign: "right" }}>
                    <button type="button" className="btn btn-ghost" style={{ padding: "6px 10px", fontSize: 12 }}>Review</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {openEdit && <EditJobModal job={job} onClose={() => setOpenEdit(false)} />}
      {openDelete && (
        <ConfirmModal
          title={`Delete "${job.title}"?`}
          message="This will permanently remove the job posting. This action cannot be undone."
          confirmLabel="Delete posting"
          tone="danger"
          isPending={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(job.id)}
          onClose={() => setOpenDelete(false)}
        />
      )}
      {selectedApplicantId && (
        <ApplicantDetailDrawer applicantId={selectedApplicantId} onClose={() => setSelectedApplicantId(null)} />
      )}
    </>
  );
}

function InfoItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{children}</div>
    </div>
  );
}

export default JobDetail;