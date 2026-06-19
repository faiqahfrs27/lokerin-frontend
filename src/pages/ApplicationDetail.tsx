import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CalendarCheck,
  Clock,
  ExternalLink,
  MapPin,
  StickyNote,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router";
import { axiosInstance } from "../lib/axios";
import Spinner from "../components/common/Spinner";
import { useApplicationDetail } from "../hooks/jobs/useApplicationDetail";

const STATUS_MAP = {
  pending: {
    label: "Pending review",
    class: "badge-stone",
    desc: "Your application is being reviewed.",
  },
  reviewed: {
    label: "Under review",
    class: "badge-info",
    desc: "The company is reviewing your application.",
  },
  accepted: {
    label: "Accepted 🎉",
    class: "badge-success",
    desc: "Congratulations! You've been accepted.",
  },
  rejected: {
    label: "Not selected",
    class: "badge-danger",
    desc: "Unfortunately you were not selected.",
  },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateOnly(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTimeOnly(date: string) {
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: app, isLoading, isError } = useApplicationDetail(id);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [isLoadingCv, setIsLoadingCv] = useState(false);

  const handleViewCv = async () => {
    if (cvUrl) {
      window.open(cvUrl, "_blank");
      return;
    }
    try {
      setIsLoadingCv(true);
      const res = await axiosInstance.get(`/applications/${id}/cv`);
      const url = res.data.url;
      setCvUrl(url);
      window.open(url, "_blank");
    } catch (err) {
      console.error("CV error:", err);
      toast.error("Failed to load CV.");
    } finally {
      setIsLoadingCv(false);
    }
  };

  if (isLoading) return <Spinner text="Loading application..." fullPage />;

  if (isError || !app)
    return (
      <div
        className="dashboard-content"
        style={{ textAlign: "center", padding: "56px 0" }}
      >
        <p style={{ fontSize: 40, margin: "0 0 12px" }}>😕</p>
        <h3 style={{ margin: "0 0 8px" }}>Application not found</h3>
        <Link
          to="/dashboard/applications"
          className="btn btn-primary"
          style={{ textDecoration: "none" }}
        >
          Back to applications
        </Link>
      </div>
    );

  const status = STATUS_MAP[app.status];

  return (
    <div className="dashboard-content">
      <Link
        to="/dashboard/applications"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: "var(--fs-sm)",
          color: "var(--fg-3)",
          textDecoration: "none",
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={14} /> Back to applications
      </Link>

      {/* Status card */}
      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 4px",
                fontSize: "var(--fs-lg)",
                fontWeight: "var(--fw-bold)",
              }}
            >
              {app.job.title}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "var(--fs-sm)",
                color: "var(--fg-3)",
              }}
            >
              {app.job.company.name} {app.job.city ? `· ${app.job.city}` : ""}
            </p>
          </div>
          <span
            className={`badge ${status.class}`}
            style={{ fontSize: "var(--fs-sm)", padding: "6px 14px" }}
          >
            {status.label}
          </span>
        </div>
        <p
          style={{
            margin: "12px 0 0",
            fontSize: "var(--fs-sm)",
            color: "var(--fg-2)",
          }}
        >
          {status.desc}
        </p>

        {app.status === "rejected" && app.rejectionReason && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "var(--danger-bg)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--fs-sm)",
              color: "var(--danger-fg)",
            }}
          >
            <strong>Feedback:</strong> {app.rejectionReason}
          </div>
        )}
      </div>

      {/* Interview schedule — Naila's version */}
      {app.status === "accepted" && app.interview && (
        <div
          className="card card-pad"
          style={{
            marginBottom: 20,
            borderLeft: "4px solid var(--success-500, #16A34A)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <CalendarCheck size={20} style={{ color: "var(--success-fg)" }} />
            <h3 style={{ margin: 0, fontSize: "var(--fs-base)", fontWeight: "var(--fw-bold)", color: "var(--success-fg)" }}>
              Interview Scheduled
            </h3>
          </div>

          <div style={{ padding: "16px 18px", background: "var(--success-bg, #F0FDF4)", borderRadius: "var(--radius-md)", marginBottom: 14 }}>
            <div style={{ fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--success-fg)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              When
            </div>
            <div style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)", color: "var(--fg)", marginBottom: 2 }}>
              {formatTimeOnly(app.interview.scheduledAt)} WIB
            </div>
            <div style={{ fontSize: "var(--fs-sm)", color: "var(--fg-2)" }}>
              {formatDateOnly(app.interview.scheduledAt)}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {app.interview.location && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", background: "var(--surface-2)", borderRadius: 8 }}>
                <MapPin size={16} style={{ color: "var(--fg-3)", flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)", marginBottom: 2 }}>Location</div>
                  <div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-medium)", color: "var(--fg)" }}>{app.interview.location}</div>
                </div>
              </div>
            )}

            {app.interview.notes && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", background: "var(--surface-2)", borderRadius: 8 }}>
                <StickyNote size={16} style={{ color: "var(--fg-3)", flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)", marginBottom: 2 }}>Notes from recruiter</div>
                  <div style={{ fontSize: "var(--fs-sm)", color: "var(--fg-2)", whiteSpace: "pre-wrap" }}>{app.interview.notes}</div>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 14, padding: "8px 12px", background: "rgba(0,0,0,0.03)", borderRadius: 6, fontSize: "var(--fs-xs)", color: "var(--fg-3)", display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={11} /> A reminder email will be sent 1 day before your interview.
          </div>
        </div>
      )}

      {app.status === "accepted" && !app.interview && (
        <div
          className="card card-pad"
          style={{ marginBottom: 20, background: "var(--success-bg)" }}
        >
          <p style={{ margin: 0, fontSize: "var(--fs-sm)", color: "var(--success-fg)" }}>
            🎉 You've been accepted! Interview schedule will be sent soon.
          </p>
        </div>
      )}

      {/* Application info */}
      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <h3
          style={{
            margin: "0 0 16px",
            fontSize: "var(--fs-base)",
            fontWeight: "var(--fw-semibold)",
          }}
        >
          Application details
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "var(--fs-sm)" }}>
            <Calendar size={16} style={{ color: "var(--fg-3)" }} />
            <span style={{ color: "var(--fg-3)" }}>Applied on</span>
            <span style={{ color: "var(--fg)", fontWeight: "var(--fw-medium)" }}>
              {formatDate(app.appliedAt)}
            </span>
          </div>
          {app.expectedSalary && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "var(--fs-sm)" }}>
              <Briefcase size={16} style={{ color: "var(--fg-3)" }} />
              <span style={{ color: "var(--fg-3)" }}>Expected salary</span>
              <span style={{ color: "var(--fg)", fontWeight: "var(--fw-medium)" }}>
                Rp {(Number(app.expectedSalary) / 1_000_000).toFixed(1)}M / bulan
              </span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "var(--fs-sm)" }}>
            <ExternalLink size={16} style={{ color: "var(--fg-3)" }} />
            <span style={{ color: "var(--fg-3)" }}>CV</span>
            <button
              onClick={handleViewCv}
              disabled={isLoadingCv}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "var(--brand-fg)",
                fontWeight: "var(--fw-medium)",
                fontSize: "var(--fs-sm)",
              }}
            >
              {isLoadingCv ? "Loading..." : "View CV"}
            </button>
          </div>
        </div>
      </div>

      {/* Company info */}
      <div className="card card-pad">
        <h3
          style={{
            margin: "0 0 16px",
            fontSize: "var(--fs-base)",
            fontWeight: "var(--fw-semibold)",
          }}
        >
          Company
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "var(--radius-md)",
              background: "var(--brand-soft)",
              color: "var(--brand-fg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            {app.job.company.name.charAt(0)}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: "var(--fw-semibold)", color: "var(--fg)", fontSize: "var(--fs-sm)" }}>
              {app.job.company.name}
            </p>
            {app.job.company.city && (
              <p style={{ margin: 0, fontSize: "var(--fs-xs)", color: "var(--fg-3)", display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={11} />
                {app.job.company.city}
              </p>
            )}
          </div>
        </div>
        <Link
          to={`/jobs/${app.jobId}`}
          className="btn btn-secondary"
          style={{
            marginTop: 16,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: "var(--fs-sm)",
          }}
        >
          <Building2 size={14} /> View job posting
        </Link>
      </div>
    </div>
  );
}

export default ApplicationDetail;