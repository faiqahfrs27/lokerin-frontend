import { Calendar, FileText, MapPin } from "lucide-react";
import type { Interview } from "../../hooks/useInterviews";
import { useUpdateInterview } from "../../hooks/useUpdateInterview";

interface EditInterviewModalProps {
  interview: Interview;
  onClose: () => void;
}

function EditInterviewModal({ interview, onClose }: EditInterviewModalProps) {
  const { form, onSubmit, isPending } = useUpdateInterview(interview, onClose);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const applicantName =
    interview.application.user.profile?.fullName ??
    interview.application.user.email;
  const jobTitle = interview.application.job.title;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: 0 }}>Reschedule interview</h3>
        <p style={{ color: "var(--fg-3)", fontSize: 13, margin: "4px 0 16px" }}>
          {applicantName} — {jobTitle}
        </p>
        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          <label className="span-2">
            Date and time
            <div className="input-wrap">
              <Calendar size={16} />
              <input
                type="datetime-local"
                {...register("scheduledAt")}
              />
            </div>
            {errors.scheduledAt && (
              <span className="ff-err">{errors.scheduledAt.message}</span>
            )}
          </label>

          <label className="span-2">
            Location (optional)
            <div className="input-wrap">
              <MapPin size={16} />
              <input
                type="text"
                placeholder="Zoom meeting / Office HQ Jakarta"
                {...register("location")}
              />
            </div>
            {errors.location && (
              <span className="ff-err">{errors.location.message}</span>
            )}
          </label>

          <label className="span-2">
            Notes (optional)
            <div className="input-wrap">
              <FileText size={16} />
              <textarea
                rows={3}
                placeholder="Anything to share..."
                {...register("notes")}
              />
            </div>
            {errors.notes && (
              <span className="ff-err">{errors.notes.message}</span>
            )}
          </label>

          <div className="form-actions span-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditInterviewModal;