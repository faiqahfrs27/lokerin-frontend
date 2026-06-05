import { AlertTriangle } from "lucide-react";
import type { SubscriptionPlan } from "../../schemas/subscriptionPlanSchema";

interface Props {
  plan: SubscriptionPlan | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeletePlanDialog({ plan, isDeleting, onClose, onConfirm }: Props) {
  if (!plan) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogBody planName={plan.name} />
        <DialogFoot
          isDeleting={isDeleting}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      </div>
    </div>
  );
}

function DialogBody({ planName }: { planName: string }) {
  return (
    <div className="modal__body" style={{ alignItems: "center", paddingTop: 28 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--danger-bg)",
          color: "var(--danger-fg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
        }}
      >
        <AlertTriangle size={26} strokeWidth={2} />
      </div>

      <h2 className="modal__title" style={{ textAlign: "center" }}>
        Delete plan?
      </h2>

      <p
        style={{
          margin: 0,
          color: "var(--fg-3)",
          fontSize: 14,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Are you sure you want to delete{" "}
        <strong style={{ color: "var(--fg)" }}>{planName}</strong>? This action
        cannot be undone.
      </p>
    </div>
  );
}

function DialogFoot({
  isDeleting,
  onClose,
  onConfirm,
}: {
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="modal__foot">
      <button
        type="button"
        className="modal__btn-cancel"
        onClick={onClose}
        disabled={isDeleting}
      >
        Cancel
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={onConfirm}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete plan"}
      </button>
    </div>
  );
}

export default DeletePlanDialog;