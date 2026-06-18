import { useState } from "react";
import { Search } from "lucide-react";
import { useSubscribers, useSubscriberStats } from "../../hooks/useSubscription";
import { useSubscriptionPlans } from "../../hooks/useSubscriptionPlans";
import { useDebouncedValue } from "../../hooks/search/useDebouncedValue";
import { SubscriberStatsCards } from "../../components/subscription/SubscriberStats";
import { SubscriberRow } from "../../components/subscription/SubscriberRow";
import Spinner from "../../components/common/Spinner";
import type { Subscriber } from "../../schemas/subscriberSchema";

function filterSubscribers(
  subscribers: Subscriber[] | undefined,
  planFilter: string,
  search: string,
) {
  if (!subscribers) return [];
  return subscribers.filter((s) => {
    const matchPlan = planFilter === "all" || s.plan === planFilter;
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
  const { data: plans } = useSubscriptionPlans();
  const [planFilter, setPlanFilter] = useState("all");
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
        plans={plans ?? []}
      />
      <SubscriberList subscribers={filtered} isLoading={isLoading} />
    </>
  );
}

function FilterBar({
  planFilter, onPlanFilter, search, onSearch, plans,
}: {
  planFilter: string;
  onPlanFilter: (f: string) => void;
  search: string;
  onSearch: (s: string) => void;
  plans: { id: string; name: string }[];
}) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
      <div className="input-wrap" style={{ flex: "1 1 280px", minWidth: 220, maxWidth: 400 }}>
        <Search size={16} />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by name or email..."
        />
      </div>
      <div className="hstack" style={{ gap: 6, flexWrap: "wrap" }}>
        <button
          type="button"
          className={"chip " + (planFilter === "all" ? "active" : "")}
          onClick={() => onPlanFilter("all")}
        >
          All
        </button>
        {plans.map((p) => (
          <button
            key={p.id}
            type="button"
            className={"chip " + (planFilter === p.name ? "active" : "")}
            onClick={() => onPlanFilter(p.name)}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
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