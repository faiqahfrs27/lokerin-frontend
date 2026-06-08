import { Medal, Download, FileCheck, XCircle } from "lucide-react";
import { Link } from "react-router";
import type { AssessmentResult } from "../../schemas/userAssessmentSchema";
import { downloadCertificate } from "../../utils/downloadCertificate";

interface Props {
  result: AssessmentResult;
}

function ResultDisplay({ result }: Props) {
  return (
    <div className="dashboard-content">
      <ResultHero result={result} />
      {result.passed ? <PassedSection result={result} /> : <FailedSection />}
      <ActionButtons />
    </div>
  );
}

function ResultHero({ result }: { result: AssessmentResult }) {
  const score = result.score ?? 0;
  return (
    <div
      className="card card-pad"
      style={{ textAlign: "center", marginBottom: 20 }}
    >
      <p className="t-kicker" style={{ marginBottom: 12 }}>
        Your score
      </p>
      <ScoreBlock score={score} />
      <StatusPill passed={result.passed} />
    </div>
  );
}

function ScoreBlock({ score }: { score: number }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-display)",
        fontSize: 72,
        fontWeight: 800,
        letterSpacing: "-0.04em",
        color: "var(--fg)",
        lineHeight: 1,
        marginBottom: 12,
      }}
    >
      {score}
      <span style={{ color: "var(--fg-4)", fontSize: 32 }}>/100</span>
    </div>
  );
}

function StatusPill({ passed }: { passed: boolean }) {
  return (
    <span
      className={`badge ${passed ? "badge-success" : "badge-stone"}`}
      style={{ fontSize: 13, padding: "6px 14px" }}
    >
      {passed ? (
        <>
          <FileCheck size={14} /> Passed
        </>
      ) : (
        <>
          <XCircle size={14} /> Not passed
        </>
      )}
    </span>
  );
}

function PassedSection({ result }: { result: AssessmentResult }) {
  return (
    <div
      className="card card-pad"
      style={{
        textAlign: "center",
        marginBottom: 20,
        background: "var(--brand-soft)",
        borderColor: "var(--brand-soft-2)",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "var(--brand)",
          color: "white",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <Medal size={36} strokeWidth={2} />
      </div>
      <h2 className="t-h4" style={{ margin: 0, color: "var(--fg)" }}>
        Congratulations!
      </h2>
      <p
        style={{
          color: "var(--fg-2)",
          fontSize: 14,
          margin: "8px 0 16px",
        }}
      >
        You've earned a badge and your certificate is being prepared.
      </p>
      <CertificateButton certificateId={result.certificate?.id} />
    </div>
  );
}

function CertificateButton({ certificateId }: { certificateId?: string }) {
  const isReady = !!certificateId;

  const handleDownload = () => {
    if (certificateId) downloadCertificate(certificateId);
  };

  return (
    <button
      type="button"
      className="btn btn-primary"
      disabled={!isReady}
      onClick={handleDownload}
      title={isReady ? "Download certificate" : "Certificate not ready yet"}
    >
      <Download size={14} />
      {isReady ? "Download certificate" : "Certificate coming soon"}
    </button>
  );
}

function FailedSection() {
  return (
    <div
      className="card card-pad"
      style={{ textAlign: "center", marginBottom: 20 }}
    >
      <h2 className="t-h4" style={{ margin: "0 0 8px" }}>
        Keep practicing
      </h2>
      <p style={{ color: "var(--fg-3)", fontSize: 14, margin: 0 }}>
        You can retake this assessment anytime to improve your score.
      </p>
    </div>
  );
}

function ActionButtons() {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Link
        to="/dashboard/assessments"
        className="btn btn-secondary"
        style={{ textDecoration: "none" }}
      >
        Back to assessments
      </Link>
      <Link
        to="/dashboard/my-results"
        className="btn btn-ghost"
        style={{ textDecoration: "none" }}
      >
        View all results
      </Link>
    </div>
  );
}

export default ResultDisplay;
