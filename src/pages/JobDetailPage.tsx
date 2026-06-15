import {
  ArrowLeft,
  Banknote,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import ShareButtons from "../components/jobs/ShareButtons";
import { useJobDetail } from "../hooks/jobs/useJobDetail";
import { useAuth } from "../stores/useAuth";
import ApplyModal from "../components/jobs/ApplyModal";
import { useTestForJob } from "../hooks/useTestForJob";
import { usePublicJobs } from "../hooks/jobs/usePublicJobs";
import JobCard from "../components/jobs/JobCard";

function formatSalary(salary: number | string | null) {
  if (!salary) return null;
  return `Rp ${(Number(salary) / 1_000_000).toFixed(0)}M / bulan`;
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return null;
  return new Date(deadline).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function daysLeft(deadline: string | null) {
  if (!deadline) return null;
  const days = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / 86400000,
  );
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  return `${days} days left`;
}

const COMPANY_COLORS = ["#0D9488", "#7C3AED", "#DC2626", "#2563EB", "#EA580C"];
function getColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return COMPANY_COLORS[Math.abs(hash) % COMPANY_COLORS.length];
}

function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const { data: job, isLoading, isError } = useJobDetail(jobId);
  const [saved, setSaved] = useState(false);
  const [showApply, setShowApply] = useState(false);

  const { data: testData } = useTestForJob(
    user && job?.hasTest ? jobId : undefined,
  );
  const myAttempt = testData?.myAttempt ?? null;
  const hasPassedTest = myAttempt?.passed === true;

  // Related jobs — pekerjaan lain dari perusahaan yang sama
  const { data: relatedData } = usePublicJobs({
    companyId: job?.companyId,
    excludeJobId: job?.id,
    limit: 3,
  });
  const relatedJobs = relatedData?.data ?? [];

  if (isLoading)
    return (
      <>
        <Navbar />
        <div
          style={{
            textAlign: "center",
            padding: "96px 24px",
            color: "var(--fg-3)",
          }}
        >
          Loading...
        </div>
      </>
    );

  if (isError || !job)
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "96px 24px" }}>
          <p style={{ fontSize: 40, margin: "0 0 12px" }}>😕</p>
          <h2 style={{ margin: "0 0 8px" }}>Job not found</h2>
          <p style={{ color: "var(--fg-3)", marginBottom: 24 }}>
            This job may have been removed.
          </p>
          <Link
            to="/jobs"
            className="btn btn-primary"
            style={{ textDecoration: "none" }}
          >
            Browse all jobs
          </Link>
        </div>
      </>
    );

  const companyName = job.company?.name ?? "Company";
  const color = getColor(companyName);
  const jobUrl = window.location.href;

  const handleApply = () => {
    if (!user) {
      navigate("/login", { state: { from: `/jobs/${jobId}` } });
      return;
    }
    if (!user.isVerified) {
      navigate("/verify-email");
      return;
    }
    setShowApply(true);
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "32px 24px 64px" }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost"
          style={{ marginBottom: 24, fontSize: 14 }}
        >
          <ArrowLeft size={16} /> Back to jobs
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* Main */}
          <div>
            {/* Header card */}
            <div className="card card-pad" style={{ marginBottom: 24 }}>
              <div
                style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
              >
                {job.company?.logoUrl ? (
                  <img
                    src={job.company.logoUrl}
                    alt={companyName}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "var(--radius-md)",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "var(--radius-md)",
                      background: color,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    {companyName.charAt(0)}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: "var(--fs-sm)",
                      fontWeight: "var(--fw-bold)",
                      color: "var(--fg-3)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {companyName.toUpperCase()}
                  </p>
                  <h1
                    style={{
                      margin: "0 0 12px",
                      fontSize: "var(--fs-2xl)",
                      fontWeight: "var(--fw-bold)",
                      color: "var(--fg)",
                      lineHeight: 1.2,
                    }}
                  >
                    {job.title}
                  </h1>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {job.city && (
                      <span className="badge badge-stone">
                        <MapPin size={11} />
                        {job.city}
                      </span>
                    )}
                    <span className="badge badge-stone">
                      <Briefcase size={11} />
                      {job.category.name}
                    </span>
                    {job.hasTest && (
                      <span className="badge badge-info">
                        Has pre-selection test
                      </span>
                    )}
                    {formatSalary(job.salary) && (
                      <span className="badge badge-stone">
                        <Banknote size={11} />
                        {formatSalary(job.salary)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginTop: 20,
                  paddingTop: 20,
                  borderTop: "1px solid var(--border)",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "var(--fs-sm)",
                    color: "var(--fg-3)",
                  }}
                >
                  <Calendar size={14} /> Posted {formatDate(job.createdAt)}
                </span>
                {job.deadline && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "var(--fs-sm)",
                      color: "var(--fg-3)",
                    }}
                  >
                    <Clock size={14} /> Deadline {formatDeadline(job.deadline)}{" "}
                    ·{" "}
                    <span
                      style={{
                        color:
                          daysLeft(job.deadline) === "Closed"
                            ? "var(--danger-fg)"
                            : "var(--warning-fg)",
                        fontWeight: "var(--fw-semibold)",
                      }}
                    >
                      {daysLeft(job.deadline)}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Banner */}
            {job.bannerUrl && (
              <img
                src={job.bannerUrl}
                alt="Job banner"
                style={{
                  width: "100%",
                  borderRadius: "var(--radius-lg)",
                  marginBottom: 24,
                  objectFit: "cover",
                  maxHeight: 300,
                }}
              />
            )}

            {/* Description */}
            <div className="card card-pad" style={{ marginBottom: 24 }}>
              <h2
                style={{
                  margin: "0 0 16px",
                  fontSize: "var(--fs-lg)",
                  fontWeight: "var(--fw-semibold)",
                }}
              >
                Job description
              </h2>
              <div
                style={{
                  fontSize: "var(--fs-base)",
                  lineHeight: 1.7,
                  color: "var(--fg-2)",
                }}
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            {/* Tags */}
            {job.tags &&
              Array.isArray(job.tags) &&
              (job.tags as string[]).length > 0 && (
                <div className="card card-pad" style={{ marginBottom: 24 }}>
                  <h2
                    style={{
                      margin: "0 0 12px",
                      fontSize: "var(--fs-lg)",
                      fontWeight: "var(--fw-semibold)",
                    }}
                  >
                    Skills & tags
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {(job.tags as string[]).map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Related jobs */}
            {relatedJobs.length > 0 && (
              <div className="card card-pad">
                <h2
                  style={{
                    margin: "0 0 16px",
                    fontSize: "var(--fs-lg)",
                    fontWeight: "var(--fw-semibold)",
                  }}
                >
                  More jobs from {companyName}
                </h2>
                <div style={{ display: "grid", gap: 12 }}>
                  {relatedJobs.map((j) => (
                    <JobCard key={j.id} job={j} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              position: "sticky",
              top: 88,
            }}
          >
            <div className="card card-pad">
              {job.hasTest && !hasPassedTest ? (
                myAttempt && testData?.allowRetake === false ? (
                  <div
                    style={{
                      padding: 12,
                      background: "var(--danger-bg)",
                      color: "var(--danger-fg)",
                      borderRadius: "var(--radius-md)",
                      marginBottom: 10,
                      fontSize: 13,
                    }}
                  >
                    ❌ You scored {myAttempt.score}/100 (need{" "}
                    {testData?.passingScore ?? 75}). This test doesn't allow
                    retakes. You cannot apply to this job.
                  </div>
                ) : (
                  <>
                    {myAttempt ? (
                      <div
                        style={{
                          padding: 12,
                          background: "var(--danger-bg)",
                          color: "var(--danger-fg)",
                          borderRadius: "var(--radius-md)",
                          marginBottom: 10,
                          fontSize: 13,
                        }}
                      >
                        ⚠️ You scored {myAttempt.score}/100 (need{" "}
                        {testData?.passingScore ?? 75}). You can retake the
                        test.
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: 12,
                          background: "var(--warning-bg)",
                          color: "var(--warning-fg)",
                          borderRadius: "var(--radius-md)",
                          marginBottom: 10,
                          fontSize: 13,
                        }}
                      >
                        🎯 This job requires a pre-selection test.
                        {testData?.allowRetake === false &&
                          " You have only one attempt."}
                      </div>
                    )}
                    <Link
                      to={`/jobs/${jobId}/test`}
                      className="btn btn-primary"
                      style={{
                        width: "100%",
                        marginBottom: 10,
                        padding: "14px",
                        fontSize: 15,
                        textDecoration: "none",
                        display: "block",
                        textAlign: "center",
                      }}
                    >
                      {myAttempt
                        ? "Retake Pre-Selection Test"
                        : "Take Pre-Selection Test"}
                    </Link>
                  </>
                )
              ) : (
                <>
                  {hasPassedTest && myAttempt && (
                    <div
                      style={{
                        padding: 8,
                        background: "var(--success-bg)",
                        color: "var(--success-fg)",
                        borderRadius: "var(--radius-md)",
                        marginBottom: 10,
                        fontSize: 13,
                        textAlign: "center",
                      }}
                    >
                      ✓ Pre-selection test passed ({myAttempt.score}/100)
                    </div>
                  )}
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      marginBottom: 10,
                      padding: "14px",
                      fontSize: 15,
                    }}
                    onClick={handleApply}
                  >
                    Apply now
                  </button>
                </>
              )}
              <button
                className="btn btn-secondary"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onClick={() => setSaved(!saved)}
              >
                {saved ? (
                  <BookmarkCheck size={16} style={{ color: "var(--brand)" }} />
                ) : (
                  <Bookmark size={16} />
                )}
                {saved ? "Saved" : "Save job"}
              </button>
            </div>

            <div className="card card-pad">
              <h3
                style={{
                  margin: "0 0 14px",
                  fontSize: "var(--fs-base)",
                  fontWeight: "var(--fw-semibold)",
                }}
              >
                About the company
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                {job.company?.logoUrl ? (
                  <img
                    src={job.company.logoUrl}
                    alt={companyName}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-md)",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-md)",
                      background: color,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 16,
                    }}
                  >
                    {companyName.charAt(0)}
                  </div>
                )}
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "var(--fw-semibold)",
                      color: "var(--fg)",
                      fontSize: "var(--fs-sm)",
                    }}
                  >
                    {companyName}
                  </p>
                  {job.company?.city && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: "var(--fs-xs)",
                        color: "var(--fg-3)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Building2 size={11} />
                      {job.company.city}
                    </p>
                  )}
                </div>
              </div>
              <Link
                to={`/companies/${job.companyId}`}
                className="btn btn-secondary"
                style={{ width: "100%", textDecoration: "none", fontSize: 13 }}
              >
                View company profile
              </Link>
            </div>

            <div className="card card-pad">
              <h3
                style={{
                  margin: "0 0 14px",
                  fontSize: "var(--fs-base)",
                  fontWeight: "var(--fw-semibold)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Share2 size={16} /> Share this job
              </h3>
              <ShareButtons title={job.title} url={jobUrl} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showApply && (
        <ApplyModal
          jobId={job.id}
          jobTitle={job.title}
          hasTest={job.hasTest}
          testAttemptId={myAttempt?.id}
          onClose={() => setShowApply(false)}
        />
      )}
    </>
  );
}

export default JobDetailPage;