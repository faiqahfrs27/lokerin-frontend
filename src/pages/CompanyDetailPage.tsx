import { ArrowLeft, Briefcase, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import Pagination from "../components/common/Pagination";
import { usePublicCompanyDetail } from "../hooks/company/usePublicCompanyDetail";
import type { CompanyJob } from "../types/company.types";
import { CompanyReviewSection } from "../components/company/CompanyReviewSection";

const COMPANY_COLORS = ["#0D9488", "#7C3AED", "#DC2626", "#2563EB", "#EA580C"];
function getColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return COMPANY_COLORS[Math.abs(hash) % COMPANY_COLORS.length];
}

function formatSalary(salary: number | string | null) {
  if (!salary) return null;
  return `Rp ${(Number(salary) / 1_000_000).toFixed(0)}M`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function JobItem({ job }: { job: CompanyJob }) {
  return (
    <Link to={`/jobs/${job.id}`} style={{ textDecoration: "none" }}>
      <div className="card card-pad interactive" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: "0 0 4px", fontWeight: "var(--fw-semibold)", color: "var(--fg)", fontSize: "var(--fs-sm)" }}>
            {job.title}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {job.city && (
              <span style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)", display: "flex", alignItems: "center", gap: 3 }}>
                <MapPin size={11} />{job.city}
              </span>
            )}
            {formatSalary(job.salary) && (
              <span style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)" }}>
                {formatSalary(job.salary)}
              </span>
            )}
            {job.hasTest && (
              <span className="badge badge-info" style={{ fontSize: 10 }}>Has test</span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)" }}>{formatDate(job.createdAt)}</span>
          <span className="badge badge-stone">{job.category.name}</span>
        </div>
      </div>
    </Link>
  );
}

function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<"about" | "jobs" | "reviews">("jobs");
  const [jobPage, setJobPage] = useState(1);

  const { data: company, isLoading, isError } = usePublicCompanyDetail(id, {
    jobPage,
    jobLimit: 2,
  });

  if (isLoading)
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "96px 24px", color: "var(--fg-3)" }}>
          Loading...
        </div>
      </>
    );

  if (isError || !company)
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "96px 24px" }}>
          <p style={{ fontSize: 40, margin: "0 0 12px" }}>😕</p>
          <h2 style={{ margin: "0 0 8px" }}>Company not found</h2>
          <Link to="/companies" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Browse companies
          </Link>
        </div>
      </>
    );

  const color = getColor(company.name);

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "32px 24px 64px" }}>
        <Link
          to="/companies"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "var(--fs-sm)", color: "var(--fg-3)", textDecoration: "none", marginBottom: 24 }}
        >
          <ArrowLeft size={14} /> Back to companies
        </Link>

        {/* Header */}
        <div className="card card-pad" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} style={{ width: 80, height: 80, borderRadius: "var(--radius-lg)", objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: "var(--radius-lg)", background: color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 28, flexShrink: 0 }}>
                {company.name.charAt(0)}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: "0 0 8px", fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)" }}>
                {company.name}
              </h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {company.city && (
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "var(--fs-sm)", color: "var(--fg-3)" }}>
                    <MapPin size={14} />{company.city}
                  </span>
                )}
                {company.phone && (
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "var(--fs-sm)", color: "var(--fg-3)" }}>
                    <Phone size={14} />{company.phone}
                  </span>
                )}
                {company.email && (
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "var(--fs-sm)", color: "var(--fg-3)" }}>
                    <Mail size={14} />{company.email}
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "var(--fs-sm)", color: "var(--fg-3)" }}>
                  <Briefcase size={14} />{company.jobsMeta?.total ?? company.jobs.length} open positions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
          {(["jobs", "about", "reviews"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: tab === t ? "var(--fw-semibold)" : "var(--fw-medium)",
                fontSize: "var(--fs-sm)",
                color: tab === t ? "var(--brand-fg)" : "var(--fg-3)",
                borderBottom: tab === t ? "2px solid var(--brand)" : "2px solid transparent",
                marginBottom: -1,
                transition: "all 150ms",
              }}
            >
              {t === "jobs"
                ? `Open positions (${company.jobsMeta?.total ?? company.jobs.length})`
                : t === "about"
                  ? "About"
                  : "Reviews"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "jobs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {company.jobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 24px" }}>
                <p style={{ fontSize: 32, margin: "0 0 8px" }}>📭</p>
                <p style={{ color: "var(--fg-3)" }}>No open positions at the moment.</p>
              </div>
            ) : (
              <>
                {company.jobs.map((job) => <JobItem key={job.id} job={job} />)}
                <Pagination
                  page={jobPage}
                  totalPages={company.jobsMeta?.totalPages ?? 1}
                  onPageChange={(p) => { setJobPage(p); }}
                />
              </>
            )}
          </div>
        )}

        {tab === "about" && (
          <div className="card card-pad">
            {company.descriptionRte ? (
              <div
                style={{ fontSize: "var(--fs-base)", lineHeight: 1.7, color: "var(--fg-2)" }}
                dangerouslySetInnerHTML={{ __html: company.descriptionRte }}
              />
            ) : (
              <p style={{ color: "var(--fg-3)", fontStyle: "italic" }}>No description available.</p>
            )}
          </div>
        )}

        {tab === "reviews" && <CompanyReviewSection companyId={company.id} />}
      </main>
      <Footer />
    </>
  );
}

export default CompanyDetailPage;