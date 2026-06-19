import { Banknote, Bookmark, BookmarkCheck, MapPin } from "lucide-react";
import { Link } from "react-router";
import type { Job } from "../../types/job.types";

const COMPANY_COLORS: Record<string, string> = {
  Tokopedia: "#0F766E",
  Gojek: "#0F766E",
  Bukalapak: "#DC2626",
  Traveloka: "#1E40AF",
  Shopee: "#EA580C",
  Bibit: "#10B981",
  Ruangguru: "#1E40AF",
  Halodoc: "#DC2626",
  Dana: "#0EA5E9",
  OVO: "#7C3AED",
  Blibli: "#0EA5E9",
  Grab: "#10B981",
};

const FALLBACK_COLORS = [
  "#0D9488",
  "#7C3AED",
  "#DC2626",
  "#2563EB",
  "#EA580C",
  "#0891B2",
];

function getColor(name: string) {
  if (COMPANY_COLORS[name]) return COMPANY_COLORS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

function formatSalary(salary: number | string | null) {
  if (!salary) return null;
  return `Rp ${(Number(salary) / 1_000_000).toFixed(0)}M`;
}

function formatPostedAgo(createdAt: string) {
  const days = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / 86400000,
  );
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function isNew(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < 3 * 86400000;
}

interface JobCardProps {
  job: Job;
  saved?: boolean;
  onSave?: (job: Job) => void;
}

function JobCard({ job, saved = false, onSave }: JobCardProps) {
  const companyName = job.company?.name ?? "Company";
  const color = getColor(companyName);

  return (
    <Link to={`/jobs/${job.id}`} style={{ textDecoration: "none" }}>
      <div
        className="card interactive card-pad fade-in"
        style={{ cursor: "pointer" }}
      >
        {/* Header */}
        <div className="hstack" style={{ marginBottom: 12 }}>
          {job.company?.logoUrl ? (
            <img
              src={job.company.logoUrl}
              alt={companyName}
              className="job-logo"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              className="job-logo"
              style={{
                background: color,
                color: "white",
                fontWeight: 800,
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {companyName.charAt(0)}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "var(--fg)",
                lineHeight: 1.25,
              }}
            >
              {job.title}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: "var(--fg-3)",
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {companyName}
              {job.city && (
                <>
                  <span>·</span>
                  <MapPin size={11} style={{ display: "inline" }} />
                  {job.city}
                </>
              )}
            </div>
          </div>
          {isNew(job.createdAt) && <span className="badge badge-new">NEW</span>}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span className="badge badge-stone">{job.category.name}</span>
          {job.hasTest && <span className="badge badge-info">Has test</span>}
          {job.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="badge badge-stone">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px dashed var(--border)",
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: 14,
              color: "var(--brand-fg)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {formatSalary(job.salary) ? (
              <>
                <Banknote size={14} />
                {formatSalary(job.salary)}
              </>
            ) : (
              <span style={{ color: "var(--fg-4)", fontWeight: 400 }}>
                Salary not listed
              </span>
            )}
          </span>
          <div className="hstack" style={{ gap: 8 }}>
            <span style={{ fontSize: 11.5, color: "var(--fg-3)" }}>
              {formatPostedAgo(job.createdAt)}
            </span>
            <button
              className="btn btn-icon btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                onSave?.(job);
              }}
              aria-label="Save job"
              style={{ width: 32, height: 32 }}
            >
              {saved ? (
                <BookmarkCheck size={15} style={{ color: "var(--brand)" }} />
              ) : (
                <Bookmark size={15} />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default JobCard;
