import { FileText } from "lucide-react";
import { Link } from "react-router";
import { useMySubscription } from "../../hooks/useSubscription";

export function CvGeneratorSection() {
  const { data: sub } = useMySubscription();
  const hasActive = sub?.status === "active";
  const to = hasActive ? "/dashboard/cv-generator" : "/dashboard/subscribe";

  return (
    <div style={{ display: "flex", alignItems: "center",
      justifyContent: "space-between" }}>
      <div>
        <p style={{ margin: "0 0 4px", fontWeight: 600,
          color: "var(--fg)", fontSize: 14 }}>
          Generate your ATS-friendly CV
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "var(--fg-3)" }}>
          {hasActive
            ? "Auto-filled with your profile data and verified skills."
            : "Subscribe to unlock CV Generator."}
        </p>
      </div>
      <Link to={to} className="btn btn-primary"
        style={{ textDecoration: "none", display: "inline-flex",
          alignItems: "center", gap: 8, fontSize: 13, whiteSpace: "nowrap" }}>
        <FileText size={14} />
        {hasActive ? "Generate CV" : "Subscribe"}
      </Link>
    </div>
  );
}