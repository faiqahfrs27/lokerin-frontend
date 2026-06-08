import { useState } from "react";
import {
  X,
  Mail,
  GraduationCap,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  Check,
  XCircle,
  Eye,
} from "lucide-react";
import { useApplicant } from "../../hooks/useApplicant";
import { useUpdateApplicantStatus } from "../../hooks/useUpdateApplicantStatus";
import type { ApplicantStatus } from "../../hooks/useApplicants";

interface ApplicantDetailDrawerProps {
  applicantId: string;
  onClose: () => void;
}

function ApplicantDetailDrawer({
  applicantId,
  onClose,
}: ApplicantDetailDrawerProps) {
  const { data: applicant, isLoading, isError } = useApplicant(applicantId);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const updateStatus = useUpdateApplicantStatus(applicantId, () => {
    setShowRejectForm(false);
    setRejectReason("");
  });

  const formatRupiah = (n: number | null) =>
    n
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(n)
      : "—";

  const calcAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    const diff = Date.now() - new Date(birthDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const handleStatusUpdate = (status: ApplicantStatus) => {
    if (status === "rejected") {
      setShowRejectForm(true);
      return;
    }
    updateStatus.mutate({ status });
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) return;
    updateStatus.mutate({ status: "rejected", rejectionReason: rejectReason });
  };

  if (!applicant) {
    return (
      <div className="drawer-backdrop" onClick={onClose}>
        <div className="drawer-shell" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-head">
            <div>
              <span className="kicker">Applicant</span>
              <h2
                style={{
                  margin: "6px 0 0",
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                Loading...
              </h2>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <div className="drawer-body">
            {isLoading && (
              <div
                style={{
                  textAlign: "center",
                  padding: 40,
                  color: "var(--fg-3)",
                }}
              >
                Loading applicant details...
              </div>
            )}
            {isError && (
              <div
                style={{
                  textAlign: "center",
                  padding: 40,
                  color: "var(--danger-600)",
                }}
              >
                Couldn't load applicant data.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const profile = applicant.user.profile;
  const age = calcAge(profile?.birthDate ?? null);

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-shell" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <span className="kicker">Applicant</span>
            <h2
              style={{
                margin: "6px 0 0",
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              {profile?.fullName ?? applicant.user.email}
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          <ApplicantStatusBadge status={applicant.status} />

          <div className="drawer-section">
            <div className="drawer-section__label">Applied for</div>
            <div className="drawer-section__value">{applicant.job.title}</div>
          </div>

          <div className="drawer-section">
            <div className="drawer-section__label">Contact</div>
            <div className="drawer-section__row">
              <Mail size={14} />
              <span>{applicant.user.email}</span>
            </div>
          </div>

          {profile?.education && (
            <div className="drawer-section">
              <div className="drawer-section__label">Education</div>
              <div className="drawer-section__row">
                <GraduationCap size={14} />
                <span>{profile.education}</span>
              </div>
            </div>
          )}

          <div className="drawer-section drawer-section--grid">
            <div>
              <div className="drawer-section__label">Age</div>
              <div className="drawer-section__row">
                <Calendar size={14} />
                <span>{age ?? "—"}</span>
              </div>
            </div>
            <div>
              <div className="drawer-section__label">Expected Salary</div>
              <div className="drawer-section__row">
                <DollarSign size={14} />
                <span>{formatRupiah(applicant.expectedSalary)}</span>
              </div>
            </div>
          </div>

          {profile?.address && (
            <div className="drawer-section">
              <div className="drawer-section__label">Address</div>
              <div className="drawer-section__row">
                <MapPin size={14} />
                <span>{profile.address}</span>
              </div>
            </div>
          )}

          <div className="drawer-section">
            <div className="drawer-section__label">Applied On</div>
            <div className="drawer-section__value" style={{ fontSize: 13 }}>
              {new Date(applicant.appliedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="drawer-section">
            <div className="drawer-section__label">CV Document</div>

            <a
              href={applicant.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <FileText size={14} />
              <span>Preview CV</span>
              <Eye size={14} />
            </a>
          </div>

          {applicant.job.hasTest && (
            <div className="drawer-section">
              <div className="drawer-section__label">Pre-Selection Test</div>
              {applicant.testAttempt ? (
                <div
                  style={{
                    padding: 12,
                    background: applicant.testAttempt.passed
                      ? "var(--success-50, #F0FDF4)"
                      : "var(--danger-50, #FEF2F2)",
                    color: applicant.testAttempt.passed
                      ? "var(--success-700, #15803D)"
                      : "var(--danger-700, #B91C1C)",
                    borderRadius: 8,
                    fontSize: 13.5,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    {applicant.testAttempt.passed ? (
                      <Check size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    <strong>
                      {applicant.testAttempt.passed ? "Passed" : "Not passed"}
                    </strong>
                    <span style={{ marginLeft: "auto", fontWeight: 700 }}>
                      {applicant.testAttempt.score} / 100
                    </span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>
                    Passing score: {applicant.testAttempt.test.passingScore} ·
                    Submitted:{" "}
                    {new Date(
                      applicant.testAttempt.attemptedAt,
                    ).toLocaleDateString("id-ID")}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: 12,
                    background: "var(--surface-2, #FAFAF9)",
                    color: "var(--fg-3)",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                >
                  Applicant hasn't taken the pre-selection test yet.
                </div>
              )}
            </div>
          )}

          {applicant.status === "rejected" && applicant.rejectionReason && (
            <div className="drawer-section">
              <div className="drawer-section__label">Rejection Reason</div>
              <div
                style={{
                  padding: 12,
                  background: "var(--danger-50, #FEF2F2)",
                  color: "var(--danger-700, #B91C1C)",
                  borderRadius: 8,
                  fontSize: 13.5,
                }}
              >
                {applicant.rejectionReason}
              </div>
            </div>
          )}

          {showRejectForm && (
            <div className="drawer-section">
              <div className="drawer-section__label">Reason for rejection</div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Skills don't match the role requirement..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-2, #D6D3D1)",
                  borderRadius: 8,
                  fontFamily: "inherit",
                  fontSize: 13.5,
                  resize: "vertical",
                }}
              />
            </div>
          )}
        </div>

        <div className="drawer-foot">
          {showRejectForm ? (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectReason("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!rejectReason.trim() || updateStatus.isPending}
                onClick={handleRejectSubmit}
                style={{
                  background: "var(--danger-600, #DC2626)",
                  color: "white",
                }}
              >
                {updateStatus.isPending && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                Reject Applicant
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleStatusUpdate("reviewed")}
                disabled={
                  updateStatus.isPending || applicant.status === "reviewed"
                }
              >
                <Eye size={14} /> Mark Reviewed
              </button>
              <span style={{ flex: 1 }} />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleStatusUpdate("rejected")}
                disabled={
                  updateStatus.isPending || applicant.status === "rejected"
                }
                style={{
                  color: "var(--danger-600, #DC2626)",
                  borderColor: "var(--danger-200, #FECACA)",
                }}
              >
                <XCircle size={14} /> Reject
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleStatusUpdate("accepted")}
                disabled={
                  updateStatus.isPending || applicant.status === "accepted"
                }
              >
                {updateStatus.isPending && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                <Check size={14} /> Accept
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ApplicantStatusBadge({ status }: { status: ApplicantStatus }) {
  const config: Record<ApplicantStatus, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "badge-stone" },
    reviewed: { label: "Reviewed", cls: "badge-warning" },
    accepted: { label: "Accepted", cls: "badge-success" },
    rejected: { label: "Rejected", cls: "badge-danger" },
  };
  const c = config[status];
  return (
    <div style={{ marginBottom: 20 }}>
      <span className={"badge " + c.cls}>
        <span className="dot" />
        {c.label}
      </span>
    </div>
  );
}

export default ApplicantDetailDrawer;
