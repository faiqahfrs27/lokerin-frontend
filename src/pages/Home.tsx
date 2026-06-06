import { ArrowRight, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import JobCard from "../components/jobs/JobCard";
import LocationBanner from "../components/home/LocationBanner";
import { useGeolocation } from "../hooks/useGeolocation";
import type { Job } from "../types/job.types";

const SAMPLE_JOBS: Job[] = [
  { id: "1", title: "Frontend Engineer", description: "", city: "Jakarta", salary: 20000000, deadline: "2026-07-01", isPublished: true, hasTest: false, bannerUrl: null, tags: null, createdAt: new Date().toISOString(), companyId: "1", categoryId: "1", category: { id: "1", name: "Engineering" }, company: { id: "1", name: "Tokopedia", logoUrl: null, city: "Jakarta" } },
  { id: "2", title: "Product Designer", description: "", city: "Jakarta", salary: 25000000, deadline: "2026-07-15", isPublished: true, hasTest: true, bannerUrl: null, tags: null, createdAt: new Date().toISOString(), companyId: "2", categoryId: "2", category: { id: "2", name: "Design" }, company: { id: "2", name: "Gojek", logoUrl: null, city: "Jakarta" } },
  { id: "3", title: "Data Analyst", description: "", city: "Jakarta", salary: 15000000, deadline: "2026-06-30", isPublished: true, hasTest: false, bannerUrl: null, tags: null, createdAt: new Date().toISOString(), companyId: "3", categoryId: "3", category: { id: "3", name: "Data" }, company: { id: "3", name: "Shopee", logoUrl: null, city: "Jakarta" } },
  { id: "4", title: "Backend Engineer", description: "", city: "Bali", salary: 30000000, deadline: "2026-07-20", isPublished: true, hasTest: true, bannerUrl: null, tags: null, createdAt: new Date().toISOString(), companyId: "4", categoryId: "1", category: { id: "1", name: "Engineering" }, company: { id: "4", name: "Traveloka", logoUrl: null, city: "Bali" } },
  { id: "5", title: "Product Manager", description: "", city: "Bandung", salary: 35000000, deadline: "2026-08-01", isPublished: true, hasTest: false, bannerUrl: null, tags: null, createdAt: new Date().toISOString(), companyId: "5", categoryId: "4", category: { id: "4", name: "Product" }, company: { id: "5", name: "Bukalapak", logoUrl: null, city: "Bandung" } },
];

const SAMPLE_LOCATIONS = [
  { city: "Jakarta", count: 1240 },
  { city: "Bandung", count: 480 },
  { city: "Surabaya", count: 390 },
  { city: "Yogyakarta", count: 210 },
  { city: "Bali", count: 175 },
  { city: "Medan", count: 140 },
];

const CATEGORIES = [
  "Engineering", "Design", "Product", "Data", "Marketing",
  "Finance", "HR", "Operations", "Sales", "Legal",
];

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const { city, isLoading, isDenied, requestLocation } = useGeolocation();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (locationInput) params.set("city", locationInput);
    else if (city) params.set("city", city);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <>
      <Navbar />
      <main>

        {/* HERO */}
        <section className="landing-hero">
          <div className="container">
            <div className="hero-copy">
              <span className="kicker">Built for Gen Z. Made in Indonesia.</span>
              <h1 className="t-h1 hero-h1">
                Find your next <span className="orange-word">loker</span>.
              </h1>
              <p className="hero-sub">
                Smart, location-based job discovery. Skill assessments with real certificates.
                CV that lands the call back. Tanpa drama.
              </p>
              <div className="hero-search">
                <div className="input-wrap" style={{ flex: 2 }}>
                  <Search size={18} />
                  <input
                    placeholder="Job title — try 'Frontend', 'Designer', 'PM'"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="input-wrap" style={{ flex: 1 }}>
                  <MapPin size={18} />
                  <input
                    placeholder={city ?? "Jakarta, Bandung…"}
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <button className="btn btn-primary btn-hero" onClick={handleSearch}>
                  Search <ArrowRight size={16} />
                </button>
              </div>
              <LocationBanner city={city} isLoading={isLoading} isDenied={isDenied} requestLocation={requestLocation} />
              <div className="hero-stats">
                <div><strong>2,148</strong> open roles</div>
                <div><strong>340</strong> companies</div>
                <div><strong>15,000+</strong> alumni hired</div>
              </div>
            </div>
          </div>
        </section>

        {/* LATEST JOBS */}
        <section className="container section">
          <div className="section-head">
            <div>
              <span className="kicker">Fresh today</span>
              <h2 className="t-h3" style={{ margin: "8px 0 0" }}>Latest jobs</h2>
            </div>
            <Link to="/jobs" className="btn btn-ghost" style={{ textDecoration: "none" }}>
              See all jobs <ArrowRight size={14} />
            </Link>
          </div>
          <div className="latest-grid">
            {SAMPLE_JOBS.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`} style={{ textDecoration: "none" }}>
                <JobCard key={job.id} job={job} />
              </Link>
            ))}
          </div>
        </section>

        {/* LOCATION DISCOVERY */}
        <section className="container section">
          <div className="section-head">
            <div>
              <span className="kicker">Discover by location</span>
              <h2 className="t-h3" style={{ margin: "8px 0 0" }}>Jobs near you</h2>
            </div>
            <span className="muted t-small">Tap a city to filter</span>
          </div>
          <div className="loc-grid">
            {SAMPLE_LOCATIONS.map((loc) => (
              <button key={loc.city} className="loc-card" onClick={() => navigate(`/jobs?city=${loc.city}`)}>
                <div className="loc-icon"><MapPin size={18} /></div>
                <div className="loc-text">
                  <div className="loc-city">{loc.city}</div>
                  <div className="loc-count">{loc.count.toLocaleString("id-ID")} jobs</div>
                </div>
                <ArrowRight size={16} className="loc-arrow" />
              </button>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="container section">
          <span className="kicker">Browse</span>
          <h2 className="t-h3" style={{ margin: "8px 0 18px" }}>By category</h2>
          <div className="cat-row">
            {CATEGORIES.map((cat) => (
              <button key={cat} className="chip" onClick={() => navigate(`/jobs?category=${cat}`)}>
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="container section">
          <div className="cta-strip">
            <div>
              <span className="kicker" style={{ color: "rgba(255,255,255,0.85)" }}>Pro features</span>
              <h2 className="t-h2" style={{ color: "white", margin: "8px 0 8px" }}>Build a CV in 4 minutes.</h2>
              <p style={{ color: "rgba(255,255,255,0.85)", margin: 0, maxWidth: 480 }}>
                Templates designed for Indonesian companies. Auto-fills from your profile. Export to PDF, no watermark.
              </p>
            </div>
            <Link to="/pricing" className="btn btn-hero" style={{ background: "white", color: "var(--brand-press)", textDecoration: "none", flexShrink: 0 }}>
              Start free <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

export default Home;