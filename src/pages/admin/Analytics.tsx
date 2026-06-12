import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAnalytics } from "../../hooks/useAnalytics";

const COLORS = ["#F97316", "#0EA5E9", "#10B981", "#A855F7", "#F59E0B", "#EF4444"];

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card card-pad">
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1,
          color: "var(--fg-3)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          marginTop: 6,
          fontFamily: "var(--font-display)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card card-pad">
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function ListCard({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string | number }[];
}) {
  return (
    <div className="card card-pad">
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
        {title}
      </div>
      {items.length === 0 ? (
        <div style={{ color: "var(--fg-3)", fontSize: 13 }}>No data yet</div>
      ) : (
        items.map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid var(--border-1)",
              fontSize: 13,
            }}
          >
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))
      )}
    </div>
  );
}

function Analytics() {
  const { data, isLoading, isError, error } = useAnalytics();

  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--fg-3)" }}>
        Loading analytics...
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div style={{ padding: 40, color: "var(--danger-fg)" }}>
        Couldn't load analytics.{" "}
        {(error as { message?: string })?.message ?? ""}
      </div>
    );
  }

  const salaryItems = data.avgSalaryByCategory.map((s) => ({
    label: s.category,
    value: `Rp ${s.avgExpectedSalary.toLocaleString("id-ID")}`,
  }));
  const cityItems = data.topCities.map((c) => ({
    label: c.city,
    value: c.count,
  }));

  return (
    <>
      <div className="admin-top">
        <div>
          <span className="kicker">Analytics</span>
          <h1>Company insights</h1>
          <p className="sub">
            Demographics, trends, and applicant interests
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <StatCard label="Total Jobs" value={data.summary.totalJobs} />
        <StatCard
          label="Total Applicants"
          value={data.summary.totalApplicants}
        />
        <StatCard label="Accepted" value={data.summary.acceptedCount} />
        <StatCard
          label="Interviews"
          value={data.summary.interviewsCount}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <ChartCard title="Gender Distribution">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data.genderDistribution}
                dataKey="count"
                nameKey="gender"
                outerRadius={80}
                label
              >
                {data.genderDistribution.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Age Distribution">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#F97316" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Education Distribution">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.educationDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="education" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0EA5E9" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Applicants by Category">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.applicantsByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fontSize: 11 }}
                width={100}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        <ListCard
          title="Avg Expected Salary by Category"
          items={salaryItems}
        />
        <ListCard title="Top Cities" items={cityItems} />
      </div>
    </>
  );
}

export default Analytics;