import { useState } from "react";
import { useSubscribers, useSubscriberStats } from "../../hooks/useSubscription";
import { useDebouncedValue } from "../../hooks/search/useDebouncedValue";
import { SubscriberStatsCards } from "../../components/subscription/SubscriberStats";
import { SubscriberRow } from "../../components/subscription/SubscriberRow";
import Spinner from "../../components/common/Spinner";
import type { Subscriber } from "../../schemas/subscriberSchema";

type PlanFilter = "all" | "standard" | "professional";

function filterSubscribers(
  subscribers: Subscriber[] | undefined,
  planFilter: PlanFilter,
  search: string,
) {
  if (!subscribers) return [];
  return subscribers.filter((s) => {
    const matchPlan =
      planFilter === "all" ||
      (planFilter === "standard" && s.plan.toLowerCase().includes("standard")) ||
      (planFilter === "professional" && s.plan.toLowerCase().includes("professional"));
    const matchSearch =
      !search ||
      s.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.user.email.toLowerCase().includes(search.toLowerCase());
    return matchPlan && matchSearch;
  });
}

function Subscribers() {
  const { data: subscribers, isLoading } = useSubscribers();
  const { data: stats } = useSubscriberStats();
  const [planFilter, setPlanFilter] = useState<PlanFilter>("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const filtered = filterSubscribers(subscribers, planFilter, debouncedSearch);

  return (
    <>
      <div className="admin-top">
        <div>
          <span className="kicker">Developer</span>
          <h1>Subscribers</h1>
          <p className="sub">Monitor all active subscribers and their payment history.</p>
        </div>
      </div>

      <SubscriberStatsCards stats={stats} />
      <FilterBar
        planFilter={planFilter}
        onPlanFilter={setPlanFilter}
        search={search}
        onSearch={setSearch}
      />
      <SubscriberList subscribers={filtered} isLoading={isLoading} />
    </>
  );
}

function FilterBar({
  planFilter, onPlanFilter, search, onSearch,
}: {
  planFilter: PlanFilter;
  onPlanFilter: (f: PlanFilter) => void;
  search: string;
  onSearch: (s: string) => void;
}) {
  return (
    <div className="subscriber-filter-bar">
      <FilterBtn active={planFilter === "all"} onClick={() => onPlanFilter("all")}>All</FilterBtn>
      <FilterBtn active={planFilter === "standard"} onClick={() => onPlanFilter("standard")}>Standard</FilterBtn>
      <FilterBtn active={planFilter === "professional"} onClick={() => onPlanFilter("professional")}>Professional</FilterBtn>
      <input
        className="subscriber-search"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by name or email..."
      />
    </div>
  );
}

function FilterBtn({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} style={{ padding: "7px 14px", borderRadius: 8,
      fontSize: 12, fontWeight: 600, cursor: "pointer",
      border: active ? "1px solid var(--brand)" : "1px solid var(--border)",
      background: active ? "var(--brand-soft)" : "var(--surface-2)",
      color: active ? "var(--brand)" : "var(--fg-3)" }}>
      {children}
    </button>
  );
}

function SubscriberList({ subscribers, isLoading }: {
  subscribers: Subscriber[]; isLoading: boolean;
}) {
  if (isLoading) return <Spinner text="Loading subscribers..." />;
  if (subscribers.length === 0) return <div className="dev-state">No subscribers found.</div>;

  return (
    <div>
      {subscribers.map((s) => <SubscriberRow key={s.id} subscriber={s} />)}
    </div>
  );
}

export default Subscribers;