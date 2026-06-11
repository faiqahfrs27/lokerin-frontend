import { ArrowLeft, ArrowRight, Building2, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { useDebouncedValue } from "../hooks/search/useDebouncedValue";
import { usePublicCompanies } from "../hooks/company/usePublicCompanies";

const COMPANY_COLORS = ["#0D9488", "#7C3AED", "#DC2626", "#2563EB", "#EA580C"];
function getColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return COMPANY_COLORS[Math.abs(hash) % COMPANY_COLORS.length];
}

function Companies() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const debouncedCity = useDebouncedValue(city, 500);
  const [sort, setSort] = useState("name-asc");
  const [page, setPage] = useState(1);

  const sortMap: Record<string, { sortBy: string; sortOrder: string }> = {
    "name-asc": { sortBy: "name", sortOrder: "asc" },
    "name-desc": { sortBy: "name", sortOrder: "desc" },
  };

  const { data, isLoading, isFetching } = usePublicCompanies({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    city: debouncedCity || undefined,
    ...sortMap[sort],
  });

  const companies = data?.data ?? [];
  const meta = data?.meta;

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "32px 24px 64px" }}>
        {/* Head */}
        <div className="jobs-head">
          <div>
            <span className="kicker">Discover</span>
            <h1 className="t-h2" style={{ margin: "8px 0 4px" }}>All companies</h1>
            <p className="muted t-small" style={{ margin: 0 }}>
              {meta ? `${meta.total} companies found` : "Loading..."}
            </p>
          </div>
          <div className="hstack" style={{ gap: 8 }}>
            <span className="t-small muted hide-mobile">Sort</span>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
            >
              <option value="name-asc">Name A → Z</option>
              <option value="name-desc">Name Z → A</option>
            </select>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <div className="input-wrap" style={{ flex: 2 }}>
            <Search size={18} />
            <input
              placeholder="Search company name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="input-wrap" style={{ flex: 1 }}>
            <MapPin size={18} />
            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--fg-3)" }}>
            Loading...
          </div>
        ) : companies.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 24px" }}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>🏢</p>
            <h3 style={{ margin: "0 0 8px" }}>No companies found</h3>
            <p style={{ color: "var(--fg-3)" }}>Try a different search or city.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: 8, opacity: isFetching ? 0.6 : 1, transition: "opacity 200ms" }}>
            {companies.map((company) => (
              <Link key={company.id} to={`/companies/${company.id}`} style={{ textDecoration: "none" }}>
                <div className="card card-pad interactive" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} style={{ width: 52, height: 52, borderRadius: "var(--radius-md)", objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 52, height: 52, borderRadius: "var(--radius-md)", background: getColor(company.name), color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, flexShrink: 0 }}>
                        {company.name.charAt(0)}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: "0 0 4px", fontWeight: "var(--fw-semibold)", color: "var(--fg)", fontSize: "var(--fs-base)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {company.name}
                      </p>
                      {company.city && (
                        <p style={{ margin: 0, fontSize: "var(--fs-xs)", color: "var(--fg-3)", display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={11} />{company.city}
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--fs-xs)", color: "var(--fg-3)", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                    <Building2 size={13} />
                    {company._count.jobs} open {company._count.jobs === 1 ? "position" : "positions"}
                  </div>
                </div>
              </Link>
            ))}
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

export default Companies;