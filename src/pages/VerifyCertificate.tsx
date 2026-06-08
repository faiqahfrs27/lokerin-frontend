import { BadgeCheck, XCircle } from "lucide-react";
import { useParams } from "react-router";
import { useVerifyCertificate } from "../hooks/certificate/useVerifyCertificate";
import type { VerifyResult } from "../types/verify";

function VerifyCertificate() {
  const { code } = useParams<{ code: string }>();
  const { data, isLoading, error } = useVerifyCertificate(code);

  return (
    <div style={pageStyle}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <Logo />
        {isLoading && <StateText text="Verifying certificate..." />}
        {error && <InvalidCard />}
        {data && <ValidCard data={data} />}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: 24,
        fontWeight: 800,
        fontSize: 22,
        color: "var(--brand)",
      }}
    >
      lokerin
    </div>
  );
}

function StateText({ text }: { text: string }) {
  return (
    <p style={{ textAlign: "center", color: "var(--fg-3)", fontSize: 14 }}>
      {text}
    </p>
  );
}

function ValidCard({ data }: { data: VerifyResult }) {
  return (
    <div className="card card-pad" style={{ textAlign: "center" }}>
      <SealIcon valid />
      <h1
        className="t-h4"
        style={{ margin: "12px 0 4px", color: "var(--success-700)" }}
      >
        Certificate Verified
      </h1>
      <p style={{ fontSize: 13, color: "var(--fg-3)", marginBottom: 20 }}>
        This certificate is authentic and issued by Lokerin.
      </p>
      <DetailRows data={data} />
    </div>
  );
}

function InvalidCard() {
  return (
    <div className="card card-pad" style={{ textAlign: "center" }}>
      <SealIcon valid={false} />
      <h1
        className="t-h4"
        style={{ margin: "12px 0 4px", color: "var(--danger-700)" }}
      >
        Certificate Not Found
      </h1>
      <p style={{ fontSize: 13, color: "var(--fg-3)" }}>
        This certificate code is invalid or does not exist in our records.
      </p>
    </div>
  );
}

function SealIcon({ valid }: { valid: boolean }) {
  const Icon = valid ? BadgeCheck : XCircle;
  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: valid ? "var(--success-50)" : "var(--danger-50)",
        color: valid ? "var(--success-600)" : "var(--danger-600)",
      }}
    >
      <Icon size={32} />
    </div>
  );
}

function DetailRows({ data }: { data: VerifyResult }) {
  const date = new Date(data.issuedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        textAlign: "left",
      }}
    >
      <Row label="Name" value={data.holderName} />
      <Row label="Skill" value={`${data.skillTitle} — ${data.skillCategory}`} />
      <Row label="Score" value={`${data.score} / 100`} />
      <Row label="Issued" value={date} />
      <Row label="Code" value={data.code} mono />
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        borderBottom: "1px solid var(--border)",
        paddingBottom: 10,
      }}
    >
      <span style={{ fontSize: 13, color: "var(--fg-3)" }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--fg)",
          textAlign: "right",
          fontFamily: mono ? "var(--font-mono)" : "inherit",
        }}
      >
        {value}
      </span>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  background: "var(--bg)",
};

export default VerifyCertificate;