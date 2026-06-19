import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  isPending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  isPending,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const confirmClass =
    tone === "danger" ? "btn btn-danger" : "btn btn-primary";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-shell"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 440 }}
      >
        <div className="modal-body" style={{ padding: "28px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            {tone === "danger" && (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 9999,
                  background: "var(--danger-50, #FEF2F2)",
                  color: "var(--danger-600, #DC2626)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={20} />
              </div>
            )}
            <div>
              <h2
                style={{
                  margin: "0 0 6px",
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                {title}
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "var(--fg-3, #57534E)",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                }}
              >
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <span style={{ flex: 1 }} />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isPending}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmClass}
            onClick={onConfirm}
            disabled={isPending}
            style={
              tone === "danger"
                ? { background: "var(--danger-600, #DC2626)", color: "white" }
                : undefined
            }
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;