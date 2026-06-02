import { useCreateAssessment } from "../../hooks/useCreateAssessment";

interface CreateAssessmentModalProps {
  onClose: () => void;
}

function CreateAssessmentModal({ onClose }: CreateAssessmentModalProps) {
  const { form, onSubmit, isPending } = useCreateAssessment(onClose);
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <ModalHead />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal__body">
            <Field label="Assessment title" error={errors.title?.message}>
              <input {...register("title")} placeholder="e.g. JavaScript Fundamental" className="ff-input" />
            </Field>
            <Field label="Kategori skill" error={errors.skillCategory?.message}>
              <input {...register("skillCategory")} placeholder="e.g. Frontend" className="ff-input" />
            </Field>
            <div className="modal__field-row">
              <Field label="Passing score" error={errors.passingScore?.message}>
                <input type="number" {...register("passingScore")} className="ff-input" />
              </Field>
              <Field label="Duration (minutes)" error={errors.durationMin?.message}>
                <input type="number" {...register("durationMin")} className="ff-input" />
              </Field>
            </div>
          </div>
          <ModalFoot onCancel={onClose} isPending={isPending} />
        </form>
      </div>
    </div>
  );
}

function ModalHead() {
  return (
    <div className="modal__head">
      <p className="modal__kicker">New assessment </p>
      <h2 className="modal__title">Create skill assessment</h2>
    </div>
  );
}

function ModalFoot({ onCancel, isPending }: { onCancel: () => void; isPending: boolean }) {
  return (
    <div className="modal__foot">
      <button type="button" className="modal__btn-cancel" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" className="dev-btn-primary" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="ff">
      <label className="ff-label">{label}</label>
      {children}
      {error && <p className="ff-error">{error}</p>}
    </div>
  );
}

export default CreateAssessmentModal;