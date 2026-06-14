import { Building2, Calendar, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import {
  useMyInterviews,
  type MyInterview,
} from "../../hooks/useMyInterviews";

type ColumnKey = "today" | "thisWeek" | "upcoming" | "past";

const COLUMN_META: Record<ColumnKey, { title: string; emptyMsg: string }> = {
  today: { title: "Today", emptyMsg: "Nothing today — enjoy your day!" },
  thisWeek: { title: "This Week", emptyMsg: "Nothing else this week" },
  upcoming: { title: "Upcoming", emptyMsg: "No upcoming interviews" },
  past: { title: "Past", emptyMsg: "No past interviews yet" },
};

function groupByTime(items: MyInterview[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()));

  const groups: Record<ColumnKey, MyInterview[]> = {
    today: [],
    thisWeek: [],
    upcoming: [],
    past: [],
  };
  for (const itv of items) {
    const t = new Date(itv.scheduledAt);
    if (t < today) groups.past.push(itv);
    else if (t < tomorrow) groups.today.push(itv);
    else if (t < endOfWeek) groups.thisWeek.push(itv);
    else groups.upcoming.push(itv);
  }
  return groups;
}

function InterviewCard({ itv }: { itv: MyInterview }) {
  const logo = itv.application.job.company.logoUrl;
  const companyName = itv.application.job.company.name;
  return (
    <Link
      to={`/dashboard/applications/${itv.application.id}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="card card-pad interactive"
        style={{
          padding: 14,
          background: "var(--surface-1)",
          border: "1px solid var(--border-1)",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {logo ? (
            <img
              src={logo}
              alt={companyName}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                objectFit: "cover",
                background: "var(--surface-2)",
              }}
            />
          ) : (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "var(--surface-2)",
                color: "var(--fg-3)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Building2 size={16} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: "var(--fw-bold)",
                fontSize: "var(--fs-sm)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {itv.application.job.title}
            </div>
            <div
              style={{
                fontSize: "var(--fs-xs)",
                color: "var(--fg-3)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {companyName}
            </div>
          </div>
          <ChevronRight size={14} style={{ color: "var(--fg-3)" }} />
        </div>
        <div
          style={{
            marginTop: 10,
            padding: 8,
            background: "var(--surface-2)",
            borderRadius: 8,
            fontSize: "var(--fs-xs)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "var(--fg-2)",
            }}
          >
            <Calendar size={12} />
            {new Date(itv.scheduledAt).toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </div>
          {itv.location && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "var(--fg-2)",
              }}
            >
              <MapPin size={12} />
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {itv.location}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function KanbanColumn({
  columnKey,
  items,
  isToday,
}: {
  columnKey: ColumnKey;
  items: MyInterview[];
  isToday?: boolean;
}) {
  const { title, emptyMsg } = COLUMN_META[columnKey];
  return (
    <div
      style={{
        background: isToday
          ? "linear-gradient(180deg, var(--brand-soft, #ffedd5) 0%, var(--surface-2) 100%)"
          : "var(--surface-2)",
        border: isToday ? "1px solid var(--brand-soft, #fed7aa)" : "none",
        borderRadius: 14,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 320,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <span
          style={{
            fontWeight: "var(--fw-bold)",
            fontSize: "var(--fs-sm)",
            color: isToday ? "var(--brand)" : "var(--fg)",
          }}
        >
          {title}
        </span>
        <span
          style={{
            background: "var(--surface-1)",
            padding: "2px 10px",
            borderRadius: 999,
            fontSize: "var(--fs-xs)",
            fontWeight: "var(--fw-bold)",
            color: "var(--fg-2)",
          }}
        >
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <div
          style={{
            padding: 20,
            textAlign: "center",
            color: "var(--fg-3)",
            fontSize: "var(--fs-xs)",
            fontStyle: "italic",
          }}
        >
          {emptyMsg}
        </div>
      ) : (
        items.map((it) => <InterviewCard key={it.id} itv={it} />)
      )}
    </div>
  );
}

function MyInterviews() {
  const { data, isLoading, isError } = useMyInterviews();
  const interviews = data?.data ?? [];
  const total = interviews.length;
  const upcomingCount = interviews.filter(
    (it) => new Date(it.scheduledAt) > new Date(),
  ).length;
  const groups = groupByTime(interviews);

  return (
    <div className="dashboard-content">
      <div style={{ marginBottom: 24 }}>
        <p className="t-kicker">My Interviews</p>
        <h1 className="t-h3" style={{ margin: "8px 0 4px" }}>
          Interview schedule
        </h1>
        <p style={{ color: "var(--fg-3)", fontSize: "var(--fs-sm)" }}>
          {total} total · {upcomingCount} upcoming
        </p>
      </div>

      {isLoading && (
        <p style={{ color: "var(--fg-3)" }}>Loading interviews...</p>
      )}
      {isError && (
        <p style={{ color: "var(--danger-fg)" }}>
          Couldn't load interviews. Please try again.
        </p>
      )}

      {!isLoading && !isError && total === 0 && (
        <div style={{ textAlign: "center", padding: "56px 24px" }}>
          <p style={{ fontSize: 40, margin: "0 0 12px" }}>📅</p>
          <h3 style={{ margin: "0 0 8px" }}>No interviews yet</h3>
          <p style={{ color: "var(--fg-3)", marginBottom: 24 }}>
            Once a company schedules an interview after accepting your
            application, it will appear here.
          </p>
          <Link
            to="/dashboard/applications"
            className="btn btn-secondary"
            style={{ textDecoration: "none" }}
          >
            View my applications
          </Link>
        </div>
      )}

      {!isLoading && !isError && total > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          <KanbanColumn columnKey="today" items={groups.today} isToday />
          <KanbanColumn columnKey="thisWeek" items={groups.thisWeek} />
          <KanbanColumn columnKey="upcoming" items={groups.upcoming} />
          <KanbanColumn columnKey="past" items={groups.past} />
        </div>
      )}
    </div>
  );
}

export default MyInterviews;