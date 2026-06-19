import { useState } from "react";
import { Plus } from "lucide-react";
import {
  useCreatePlan,
  useDeletePlan,
  useSubscriptionPlans,
  useUpdatePlan,
} from "../../hooks/useSubscriptionPlans";
import {
  toApiPayload,
  type PlanFormValues,
  type SubscriptionPlan,
} from "../../schemas/subscriptionPlanSchema";
import PlanFormModal from "../../components/subscription/PlanFormModal";
import DeletePlanDialog from "../../components/subscription/DeletePlanDialog";
import PlanList from "../../components/subscription/PlanList";
import Spinner from "../../components/common/Spinner";

function SubscriptionPlans() {
  const { data: plans, isLoading, error } = useSubscriptionPlans();
  const createMutation = useCreatePlan();
  const updateMutation = useUpdatePlan();
  const deleteMutation = useDeletePlan();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);
  const [deleting, setDeleting] = useState<SubscriptionPlan | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (plan: SubscriptionPlan) => {
    setEditing(plan);
    setFormOpen(true);
  };

  const handleSubmit = async (values: PlanFormValues) => {
    const payload = toApiPayload(values);
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, body: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteMutation.mutateAsync(deleting.id);
    setDeleting(null);
  };

  return (
    <>
      <PageHeader onCreate={openCreate} />
      <PageContent
        plans={plans}
        isLoading={isLoading}
        error={error}
        onEdit={openEdit}
        onDelete={setDeleting}
      />

      <PlanFormModal
        open={formOpen}
        plan={editing}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <DeletePlanDialog
        plan={deleting}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

function PageHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="admin-top">
      <div>
        <p className="kicker">Dashboard</p>
        <h1 style={{ margin: "6px 0 4px", letterSpacing: "-0.02em" }}>
          Subscription plans
        </h1>
        <p className="muted" style={{ fontSize: 14, margin: 0 }}>
          Manage available subscription tiers for users.
        </p>
      </div>
      <button type="button" className="btn btn-primary" onClick={onCreate}>
        <Plus size={16} strokeWidth={2.5} /> New plan
      </button>
    </div>
  );
}

function PageContent({
  plans,
  isLoading,
  error,
  onEdit,
  onDelete,
}: {
  plans?: SubscriptionPlan[];
  isLoading: boolean;
  error: unknown;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
}) {
  if (isLoading) return <Spinner text="Loading plans..." />;
  if (error) return <div className="dev-state">Failed to load plans.</div>;
  if (!plans || plans.length === 0) return <EmptyState />;
  return <PlanList plans={plans} onEdit={onEdit} onDelete={onDelete} />;
}

function EmptyState() {
  return (
    <div
      className="dev-state"
      style={{ border: "1.5px dashed var(--border-2)", borderRadius: 14 }}
    >
      No plans yet. Click "New plan" to create your first one.
    </div>
  );
}

export default SubscriptionPlans;