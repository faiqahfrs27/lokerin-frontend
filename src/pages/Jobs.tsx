import { ArrowLeft, ArrowRight, Loader, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import JobCard from "../components/jobs/JobCard";
import LocationBanner from "../components/home/LocationBanner";
import { useGeolocation } from "../hooks/useGeolocation";
import { usePublicJobs } from "../hooks/jobs/usePublicJobs";

const CATEGORIES = ["All", "Engineering", "Design", "Data", "Product", "Marketing", "Finance", "HR", "Operations", "Sales"];

const SORT_MAP: Record<string, { sortBy: string; sortOrder: string }> = {
  "Newest": { sortBy: "createdAt", sortOrder: "desc" },
  "Oldest": { sortBy: "createdAt", sortOrder: "asc" },
  "Salary high → low": { sortBy: "salary", sortOrder: "desc" },
  "Deadline soon": { sortBy: "deadline", sortOrder: "asc" },
};

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { city, isLoading: isLocLoading, isDenied, requestLocation } = useGeolocation();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [cityInput, setCityInput] = useState(searchParams.get("city") ?? "");
  const [cat, setCat] = useState(searchParams.get("category") ?? "All");
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<string[]>([]);

  // Apply geolocation as default city
  useEffect(() => {
    if (city && !searchParams.get("city")) setCityInput(city);
  }, [city]);

  const { sortBy, sortOrder } = SORT_MAP[sort];

  const { data, isLoading, isFetching } = usePublicJobs({
    page,
    limit: 12,
    search: searchParams.get("q") ?? undefined,
    city: searchParams.get("city") ?? undefined,
    sortBy,
    sortOrder,
  });

  const jobs = data?.data ?? [];
  const meta = data?.meta;

  const applySearch = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cityInput) params.set("city", cityInput);
    if (cat !== "All") params.set("category", cat);
    setSearchParams(params);
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "32px 24px 64px" }}>
        {/* Head */}
        <div className="jobs-head">
          <div>
            <span className="kicker">All jobs</span>
            <h1 className="t-h2" style={{ margin: "8px 0 4px" }}>Find your loker</h1>
            <p className="muted t-small" style={{ margin: 0 }}>
              {meta ? `${meta.total} jobs found` : "Loading..."}
            </p>
          </div>
          <div className="hstack" style={{ gap: 8 }}>
            <span className="t-small muted hide-mobile">Sort</span>
            <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.keys(SORT_MAP).map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <div className="input-wrap" style={{ flex: 2 }}>
            <Search size={18} />
            <input placeholder="Title or company" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applySearch()} />
          </div>
          <div className="input-wrap" style={{ flex: 1 }}>
            <MapPin size={18} />
            <input placeholder={city ?? "Location"} value={cityInput} onChange={(e) => setCityInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applySearch()} />
          </div>
          <button className="btn btn-primary" onClick={applySearch}>
            Search <ArrowRight size={14} />
          </button>
        </div>

        {/* Location banner */}
        <div style={{ marginBottom: 16 }}>
          <LocationBanner city={city} isLoading={isLocLoading} isDenied={isDenied} requestLocation={requestLocation} />
        </div>

        {/* Category chips */}
        <div className="cat-row" style={{ marginBottom: 24 }}>
          {CATEGORIES.map((c) => (
            <button key={c} className={`chip${c === cat ? " active" : ""}`} onClick={() => { setCat(c); setPage(1); }}>
              {c}
            </button>
          ))}
        </div>

        {/* Jobs grid */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--fg-3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Loader size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading jobs...
          </div>
        ) : (
          <div className="jobs-grid" style={{ opacity: isFetching ? 0.6 : 1, transition: "opacity 200ms" }}>
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                saved={saved.includes(job.id)}
                onSave={(j) => setSaved((s) => s.includes(j.id) ? s.filter((id) => id !== j.id) : [...s, j.id])}
              />
            ))}
            {jobs.length === 0 && (
              <div className="empty">
                <p style={{ fontSize: 40, margin: "0 0 12px" }}>🔍</p>
                <h3 className="t-h4" style={{ margin: "0 0 4px" }}>No matches</h3>
                <p className="muted t-small" style={{ margin: 0 }}>Try a broader title or change category.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 32 }}>
            <button className="btn btn-secondary btn-icon" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ArrowLeft size={14} />
            </button>
            <span style={{ fontSize: "var(--fs-sm)", color: "var(--fg-2)" }}>Page {page} of {meta.totalPages}</span>
            <button className="btn btn-secondary btn-icon" disabled={page === meta.totalPages} onClick={() => setPage((p) => p + 1)}>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Jobs;