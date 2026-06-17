import { Link } from "react-router";
import JobCard from "../components/jobs/JobCard";
import { useSavedJobs, useUnsaveJob } from "../hooks/jobs/useSavedJobs";

function SavedJobs() {
  const { data: savedJobs, isLoading } = useSavedJobs();
  const { mutate: unsave } = useUnsaveJob();

  const jobs = savedJobs ?? [];

  return (
    <div className="dashboard-content">
      <div style={{ marginBottom: 24 }}>
        <p className="t-kicker">Dashboard</p>
        <h1 className="t-h3" style={{ margin: "8px 0 4px" }}>
          Saved jobs
        </h1>
        <p style={{ color: "var(--fg-3)", fontSize: "var(--fs-sm)" }}>
          Jobs you've bookmarked for later.
        </p>
      </div>

      {isLoading ? (
        <p style={{ color: "var(--fg-3)" }}>Loading...</p>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "56px 24px" }}>
          <p style={{ fontSize: 40, margin: "0 0 12px" }}>🔖</p>
          <h3 style={{ margin: "0 0 8px" }}>No saved jobs yet</h3>
          <p style={{ color: "var(--fg-3)", marginBottom: 24 }}>
            Bookmark jobs you're interested in to find them later.
          </p>
          <Link
            to="/jobs"
            className="btn btn-primary"
            style={{ textDecoration: "none" }}
          >
            Browse jobs
          </Link>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((saved) => (
            <JobCard
              key={saved.id}
              job={saved.job}
              saved={true}
              onSave={() => unsave(saved.jobId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedJobs;
