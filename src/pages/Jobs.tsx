import { ArrowLeft, ArrowRight, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import JobCard from "../components/jobs/JobCard";
import LocationBanner from "../components/home/LocationBanner";
import { useGeolocation } from "../hooks/useGeolocation";
import type { Job } from "../types/job.types";

const CATEGORIES = ["All", "Engineering", "Design", "Data", "Product", "Marketing", "Finance", "HR", "Operations", "Sales"];

const HARDCODED_JOBS: Job[] = [
  { id: "1", title: "Frontend Engineer", description: "", city: "Jakarta", salary: 20000000, deadline: "2026-07-01", isPublished: true, hasTest: false, bannerUrl: null, tags: ["React", "TypeScript"], createdAt: new Date().toISOString(), companyId: "1", categoryId: "1", category: { id: "1", name: "Engineering" }, company: { id: "1", name: "Tokopedia", logoUrl: null, city: "Jakarta" } },
  { id: "2", title: "Product Designer", description: "", city: "Jakarta", salary: 25000000, deadline: "2026-07-15", isPublished: true, hasTest: true, bannerUrl: null, tags: ["Figma", "UX"], createdAt: new Date(Date.now() - 86400000).toISOString(), companyId: "2", categoryId: "2", category: { id: "2", name: "Design" }, company: { id: "2", name: "Gojek", logoUrl: null, city: "Jakarta" } },
  { id: "3", title: "Data Analyst", description: "", city: "Jakarta", salary: 15000000, deadline: "2026-06-30", isPublished: true, hasTest: false, bannerUrl: null, tags: ["SQL", "Python"], createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), companyId: "3", categoryId: "3", category: { id: "3", name: "Data" }, company: { id: "3", name: "Shopee", logoUrl: null, city: "Jakarta" } },
  { id: "4", title: "Backend Engineer", description: "", city: "Bali", salary: 30000000, deadline: "2026-07-20", isPublished: true, hasTest: true, bannerUrl: null, tags: ["Node.js", "PostgreSQL"], createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), companyId: "4", categoryId: "1", category: { id: "1", name: "Engineering" }, company: { id: "4", name: "Traveloka", logoUrl: null, city: "Bali" } },
  { id: "5", title: "Product Manager", description: "", city: "Bandung", salary: 35000000, deadline: "2026-08-01", isPublished: true, hasTest: false, bannerUrl: null, tags: ["Agile", "Roadmap"], createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), companyId: "5", categoryId: "4", category: { id: "4", name: "Product" }, company: { id: "5", name: "Bukalapak", logoUrl: null, city: "Bandung" } },
  { id: "6", title: "UI/UX Designer", description: "", city: "Surabaya", salary: 18000000, deadline: "2026-07-10", isPublished: true, hasTest: false, bannerUrl: null, tags: ["Figma", "Research"], createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), companyId: "6", categoryId: "2", category: { id: "2", name: "Design" }, company: { id: "6", name: "Blibli", logoUrl: null, city: "Surabaya" } },
  { id: "7", title: "DevOps Engineer", description: "", city: "Jakarta", salary: 28000000, deadline: "2026-07-25", isPublished: true, hasTest: true, bannerUrl: null, tags: ["Docker", "AWS"], createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), companyId: "7", categoryId: "1", category: { id: "1", name: "Engineering" }, company: { id: "7", name: "Grab", logoUrl: null, city: "Jakarta" } },
  { id: "8", title: "Marketing Manager", description: "", city: "Jakarta", salary: 22000000, deadline: "2026-07-05", isPublished: true, hasTest: false, bannerUrl: null, tags: ["SEO", "Growth"], createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), companyId: "8", categoryId: "5", category: { id: "5", name: "Marketing" }, company: { id: "8", name: "OVO", logoUrl: null, city: "Jakarta" } },
];

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { city, isLoading, isDenied, requestLocation } = useGeolocation();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [cityInput, setCityInput] = useState(searchParams.get("city") ?? "");
  const [cat, setCat] = useState(searchParams.get("category") ?? "All");
  const [date, setDate] = useState("Anytime");
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    if (city && !searchParams.get("city")) setCityInput(city);
  }, [city]);

  const applySearch = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cityInput) params.set("city", cityInput);
    if (cat !== "All") params.set("category", cat);
    setSearchParams(params);
    setPage(1);
  };

  const filtered = HARDCODED_JOBS.filter((job) => {
    const matchQ = !q || job.title.toLowerCase().includes(q.toLowerCase()) || (job.company?.name ?? "").toLowerCase().includes(q.toLowerCase());
    const matchCity = !cityInput || job.city?.toLowerCase().includes(cityInput.toLowerCase());
    const matchCat = cat === "All" || job.category.name === cat;
    return matchQ && matchCity && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / 10);

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "32px 24px 64px" }}>
        {/* Head */}
        <div className="jobs-head">
          <div>
            <span className="kicker">All jobs</span>
            <h1 className="t-h2" style={{ margin: "8px 0 4px" }}>Find your loker</h1>
            <p className="muted t-small" style={{ margin: 0 }}>{filtered.length} of {HARDCODED_JOBS.length} matches</p>
          </div>
          <div className="hstack" style={{ gap: 8 }}>
            <span className="t-small muted hide-mobile">Sort</span>
            <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option>Newest</option>
              <option>Salary high → low</option>
              <option>Deadline soon</option>
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
          <div className="input-wrap" style={{ flex: 1, minWidth: 140 }}>
            <select value={date} onChange={(e) => setDate(e.target.value)} style={{ flex: 1, border: "none", outline: "none", background: "transparent", font: "inherit", color: "var(--fg)", cursor: "pointer" }}>
              <option>Anytime</option>
              <option>Last 24h</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={applySearch}>
            Search <ArrowRight size={14} />
          </button>
        </div>

        {/* Location banner */}
        <div style={{ marginBottom: 16 }}>
          <LocationBanner city={city} isLoading={isLoading} isDenied={isDenied} requestLocation={requestLocation} />
        </div>

        {/* Category chips */}
        <div className="cat-row" style={{ marginBottom: 24 }}>
          {CATEGORIES.map((c) => (
            <button key={c} className={`chip${c === cat ? " active" : ""}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        {/* Jobs grid */}
        <div className="jobs-grid">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              saved={saved.includes(job.id)}
              onSave={(j) => setSaved((s) => s.includes(j.id) ? s.filter((id) => id !== j.id) : [...s, j.id])}
            />
          ))}
          {filtered.length === 0 && (
            <div className="empty">
              <p style={{ fontSize: 40, margin: "0 0 12px" }}>🔍</p>
              <h3 className="t-h4" style={{ margin: "0 0 4px" }}>No matches</h3>
              <p className="muted t-small" style={{ margin: 0 }}>Try a broader title or change category.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 32 }}>
            <button className="btn btn-secondary btn-icon" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ArrowLeft size={14} />
            </button>
            <span style={{ fontSize: "var(--fs-sm)", color: "var(--fg-2)" }}>Page {page} of {totalPages}</span>
            <button className="btn btn-secondary btn-icon" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
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