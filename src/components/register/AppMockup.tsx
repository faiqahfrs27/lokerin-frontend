// AppMockup — rendered UI mockup, theme-aware via CSS variables

const jobs = [
  {
    initial: "K",
    color: "#0D9488",
    company: "KOPINUSA",
    industry: "CONSUMER",
    title: "Senior Product Designer",
    city: "Jakarta",
    type: "Hybrid",
    salary: "Rp 18–25M",
    saved: false,
  },
  {
    initial: "H",
    color: "#16A34A",
    company: "HALOFRESH",
    industry: "GROCERY",
    title: "UI/UX Designer",
    city: "Jakarta",
    type: "Hybrid",
    salary: "Rp 9–13M",
    saved: true,
  },
  {
    initial: "S",
    color: "#7C3AED",
    company: "SENTRALIN",
    industry: "FINTECH",
    title: "Mobile Developer",
    city: "Jakarta",
    type: "Hybrid",
    salary: "Rp 15–22M",
    saved: false,
  },
];

const chartBars = [60, 45, 75, 55, 80, 50, 90];
const chartDays = ["M", "T", "W", "T", "F", "S", "S"];

function AppMockup() {
  return (
    <div className="mockup-shell">
      {/* Window chrome */}
      <div className="mockup-chrome">
        <div className="mockup-dots">
          <span style={{ background: "#FF5F57" }} />
          <span style={{ background: "#FEBC2E" }} />
          <span style={{ background: "#28C840" }} />
        </div>
        <div className="mockup-bar">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>
            lokerin.id / <strong>jobs</strong>
          </span>
        </div>
        <div className="mockup-winbtns">
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* App body */}
      <div className="mockup-body">
        {/* Sidebar */}
        <aside className="mockup-sidebar">
          <p className="mockup-section-label">DISCOVER</p>
          <nav className="mockup-nav">
            <a className="mockup-nav-item active">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
              For you
              <span className="mockup-badge">12</span>
            </a>
            <a className="mockup-nav-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Saved
              <span className="mockup-count">8</span>
            </a>
            <a className="mockup-nav-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Applied
              <span className="mockup-count">4</span>
            </a>
          </nav>
          <p className="mockup-section-label" style={{ marginTop: 16 }}>
            CATEGORIES
          </p>
          <nav className="mockup-nav">
            {["Design", "Engineering", "Data", "Product"].map((cat, i) => (
              <a key={cat} className="mockup-nav-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {i === 0 && (
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  )}
                  {i === 1 && (
                    <>
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </>
                  )}
                  {i === 3 && (
                    <>
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </>
                  )}
                </svg>
                {cat}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main feed */}
        <main className="mockup-feed">
          {/* Search */}
          <div className="mockup-search">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Search jobs, skills, companies...</span>
            <kbd>⌘K</kbd>
          </div>

          {/* Filter chips */}
          <div className="mockup-chips">
            <span className="mockup-chip">All</span>
            <span className="mockup-chip active">Design</span>
            <span className="mockup-chip">Engineering</span>
          </div>

          {/* Job cards */}
          <div className="mockup-jobs">
            {jobs.map((job) => (
              <div key={job.company} className="mockup-job-card">
                <div className="mockup-job-header">
                  <div
                    className="mockup-avatar"
                    style={{ background: job.color }}
                  >
                    {job.initial}
                  </div>
                  <div className="mockup-job-meta">
                    <span className="mockup-company">
                      {job.company} · {job.industry}
                    </span>
                    <strong className="mockup-job-title">{job.title}</strong>
                  </div>
                  <button className="mockup-save">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill={job.saved ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </div>
                <div className="mockup-job-tags">
                  <span className="mockup-tag">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {job.city}
                  </span>
                  <span className="mockup-tag">{job.type}</span>
                  <span className="mockup-tag">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    {job.salary}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right panel */}
        <aside className="mockup-right">
          {/* Match score */}
          <div className="mockup-widget">
            <p className="mockup-widget-label">Your match score</p>
            <div className="mockup-score">
              88<span>%</span>
            </div>
            <div className="mockup-score-bar">
              <div className="mockup-score-fill" style={{ width: "88%" }} />
            </div>
            <div className="mockup-score-stats">
              <div>
                <strong>12</strong>
                <span>Active matches</span>
              </div>
              <div>
                <strong>4</strong>
                <span>Applied</span>
              </div>
            </div>
          </div>

          {/* Profile views */}
          <div className="mockup-widget">
            <div className="mockup-widget-row">
              <p className="mockup-widget-label">Profile views</p>
              <span className="mockup-widget-period">7D</span>
            </div>
            <div className="mockup-chart">
              {chartBars.map((h, i) => (
                <div
                  key={i}
                  className="mockup-bar"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mockup-chart-labels">
              {chartDays.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className="mockup-views-count">
              <strong>429</strong>
              <span className="mockup-views-delta">+18%</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AppMockup;
