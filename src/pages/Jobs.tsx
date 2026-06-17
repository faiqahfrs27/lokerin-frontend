import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Loader,
  MapPin,
  Search,
} from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import LocationBanner from "../components/home/LocationBanner";
import JobCard from "../components/jobs/JobCard";
import { usePublicJobs } from "../hooks/jobs/usePublicJobs";
import {
  useSavedJobs,
  useSaveJob,
  useUnsaveJob,
} from "../hooks/jobs/useSavedJobs";
import { useDebouncedValue } from "../hooks/search/useDebouncedValue";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAuth } from "../stores/useAuth";

const CATEGORIES = [
  "All",
  "Engineering",
  "Design",
  "Data",
  "Product",
  "Marketing",
  "Finance",
  "HR",
  "Operations",
  "Sales",
];

const SORT_MAP: Record<string, { sortBy: string; sortOrder: string }> = {
  Newest: { sortBy: "createdAt", sortOrder: "desc" },
  Oldest: { sortBy: "createdAt", sortOrder: "asc" },
  "Salary high → low": { sortBy: "salary", sortOrder: "desc" },
  "Deadline soon": { sortBy: "deadline", sortOrder: "asc" },
};

const DATE_FILTERS = [
  "All time",
  "Last 7 days",
  "Last 30 days",
  "Custom range",
];

function toISODate(date: Date) {
  return date.toISOString().split("T")[0];
}

function Jobs() {
  const navigate = useNavigate();
  const {
    city,
    isLoading: isLocLoading,
    isDenied,
    requestLocation,
  } = useGeolocation();

  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [cityInput, setCityInput] = useQueryState(
    "city",
    parseAsString.withDefault(""),
  );
  const [cat, setCat] = useQueryState(
    "category",
    parseAsString.withDefault("All"),
  );
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault("Newest"),
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  // Date filter
  const [dateFilter, setDateFilter] = useQueryState(
    "date",
    parseAsString.withDefault("All time"),
  );
  const [customFrom, setCustomFrom] = useQueryState(
    "from",
    parseAsString.withDefault(""),
  );
  const [customTo, setCustomTo] = useQueryState(
    "to",
    parseAsString.withDefault(""),
  );

  const debouncedQ = useDebouncedValue(q, 500);
  const debouncedCity = useDebouncedValue(cityInput, 500);

  // Saved jobs
  const user = useAuth((s) => s.user);
  const { data: savedJobs } = useSavedJobs();
  const { mutate: saveJob } = useSaveJob();
  const { mutate: unsaveJob } = useUnsaveJob();
  const savedJobIds = savedJobs?.map((s) => s.jobId) ?? [];

  // Apply geolocation sebagai default city
  useEffect(() => {
    if (city && !cityInput) {
      setCityInput(city);
    }
  }, [city]);

  const { sortBy, sortOrder } = SORT_MAP[sort] ?? SORT_MAP["Newest"];

  // Hitung dateFrom/dateTo berdasarkan dateFilter
  let dateFrom: string | undefined;
  let dateTo: string | undefined;

  if (dateFilter === "Last 7 days") {
    const from = new Date();
    from.setDate(from.getDate() - 7);
    dateFrom = toISODate(from);
  } else if (dateFilter === "Last 30 days") {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    dateFrom = toISODate(from);
  } else if (dateFilter === "Custom range") {
    dateFrom = customFrom || undefined;
    dateTo = customTo || undefined;
  }

  const { data, isLoading, isFetching } = usePublicJobs({
    page,
    limit: 12,
    search: debouncedQ || undefined,
    city: debouncedCity || undefined,
    sortBy,
    sortOrder,
    dateFrom,
    dateTo,
  });

  const jobs = data?.data ?? [];
  const meta = data?.meta;

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "32px 24px 64px" }}>
        {/* Head */}
        <div className="jobs-head">
          <div>
            <span className="kicker">All jobs</span>
            <h1 className="t-h2" style={{ margin: "8px 0 4px" }}>
              Find your loker
            </h1>
            <p className="muted t-small" style={{ margin: 0 }}>
              {meta ? `${meta.total} jobs found` : "Loading..."}
            </p>
          </div>
          <div className="hstack" style={{ gap: 8 }}>
            <span className="t-small muted hide-mobile">Sort</span>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              {Object.keys(SORT_MAP).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <div className="input-wrap" style={{ flex: 2 }}>
            <Search size={18} />
            <input
              placeholder="Title or company"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="input-wrap" style={{ flex: 1 }}>
            <MapPin size={18} />
            <input
              placeholder={city ?? "Location"}
              value={cityInput}
              onChange={(e) => {
                setCityInput(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Date filter row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
            marginBottom: 16,
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
            <Calendar size={14} /> Posted
          </span>
          <select
            className="sort-select"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
          >
            {DATE_FILTERS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          {dateFilter === "Custom range" && (
            <>
              <div className="input-wrap" style={{ maxWidth: 160 }}>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => {
                    setCustomFrom(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <span style={{ color: "var(--fg-3)", fontSize: "var(--fs-sm)" }}>
                to
              </span>
              <div className="input-wrap" style={{ maxWidth: 160 }}>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => {
                    setCustomTo(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Location banner */}
        <div style={{ marginBottom: 16 }}>
          <LocationBanner
            city={city}
            isLoading={isLocLoading}
            isDenied={isDenied}
            requestLocation={requestLocation}
          />
        </div>

        {/* Category chips */}
        <div className="cat-row" style={{ marginBottom: 24 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip${c === cat ? " active" : ""}`}
              onClick={() => {
                setCat(c);
                setPage(1);
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Jobs grid */}
        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 24px",
              color: "var(--fg-3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Loader
              size={20}
              style={{ animation: "spin 1s linear infinite" }}
            />{" "}
            Loading jobs...
          </div>
        ) : (
          <div
            className="jobs-grid"
            style={{
              opacity: isFetching ? 0.6 : 1,
              transition: "opacity 200ms",
            }}
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                saved={savedJobIds.includes(job.id)}
                onSave={(j) => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  savedJobIds.includes(j.id) ? unsaveJob(j.id) : saveJob(j.id);
                }}
              />
            ))}
            {jobs.length === 0 && (
              <div className="empty">
                <p style={{ fontSize: 40, margin: "0 0 12px" }}>🔍</p>
                <h3 className="t-h4" style={{ margin: "0 0 4px" }}>
                  No matches
                </h3>
                <p className="muted t-small" style={{ margin: 0 }}>
                  Try a broader title or change category.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              marginTop: 32,
            }}
          >
            <button
              className="btn btn-secondary btn-icon"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ArrowLeft size={14} />
            </button>
            <span style={{ fontSize: "var(--fs-sm)", color: "var(--fg-2)" }}>
              Page {page} of {meta.totalPages}
            </span>
            <button
              className="btn btn-secondary btn-icon"
              disabled={page === meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
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
