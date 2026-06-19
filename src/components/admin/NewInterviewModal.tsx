import { Calendar, Loader2, MapPin, Users, X } from "lucide-react";
import { useApplicants } from "../../hooks/useApplicants";
import { useCreateInterview } from "../../hooks/useInterviews";
import { useEffect } from "react";

interface NewInterviewModalProps {
  onClose: () => void;
  preselectedApplicationId?: string;
  preselectedLabel?: string;
}

function NewInterviewModal({
  onClose,
  preselectedApplicationId,
  preselectedLabel,
}: NewInterviewModalProps) {
  const { form, onSubmit, isPending } = useCreateInterview(onClose);

  useEffect(() => {
    if (preselectedApplicationId) {
      form.setValue("applicationId", preselectedApplicationId);
    }
  }, [preselectedApplicationId, form]);
  const { data: applicantsData, isLoading: isLoadingApplicants } =
    useApplicants({ status: "accepted", limit: 100 });

  const applicants = applicantsData?.data ?? [];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="kicker">Interview</span>
            <h2
              style={{
                margin: "6px 0 0",
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              Schedule an interview
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            <div className="form-grid">
              <label className="span-2">
                Applicant
                {preselectedApplicationId ? (
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid var(--border-1)",
                      background: "var(--surface-2)",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {preselectedLabel ?? "Selected applicant"}
                    <input type="hidden" {...register("applicationId")} />
                  </div>
                ) : (
                  <>
                    <div className="input-wrap">
                      <Users size={16} />
                      <select
                        {...register("applicationId")}
                        defaultValue=""
                        disabled={isLoadingApplicants}
                      >
                        <option value="" disabled>
                          {isLoadingApplicants
                            ? "Loading applicants..."
                            : "Select an accepted applicant"}
                        </option>
                        {applicants.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.user.profile?.fullName ?? a.user.email} —{" "}
                            {a.job.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    {!isLoadingApplicants && applicants.length === 0 && (
                      <span
                        style={{
                          color: "var(--fg-3)",
                          fontSize: 12,
                          marginTop: 4,
                        }}
                      >
                        No accepted applicants yet. Accept some applicants first
                        via /admin/applicants.
                      </span>
                    )}
                  </>
                )}
                {errors.applicationId && (
                  <span className="ff-err">{errors.applicationId.message}</span>
                )}
              </label>

              <label className="span-2">
                Scheduled at
                <div className="input-wrap">
                  <Calendar size={16} />
                  <input type="datetime-local" {...register("scheduledAt")} />
                </div>
                {errors.scheduledAt && (
                  <span className="ff-err">{errors.scheduledAt.message}</span>
                )}
              </label>

              <label className="span-2">
                Location / link
                <div className="input-wrap">
                  <MapPin size={16} />
                  <input
                    {...register("location")}
                    placeholder="Zoom link, office address, etc."
                  />
                </div>
                {errors.location && (
                  <span className="ff-err">{errors.location.message}</span>
                )}
              </label>

              <label className="span-2">
                Notes (optional)
                <textarea
                  {...register("notes")}
                  placeholder="Bring portfolio, prepare a 5-min intro, etc."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--border-1)",
                    fontFamily: "inherit",
                    fontSize: 14,
                    resize: "vertical",
                  }}
                />
                {errors.notes && (
                  <span className="ff-err">{errors.notes.message}</span>
                )}
              </label>
            </div>
          </div>

          <div className="modal-foot">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending || applicants.length === 0}
            >
              {isPending ? (
                <Loader2 className="spin" size={14} />
              ) : (
                <Calendar size={14} />
              )}
              {isPending ? "Scheduling..." : "Schedule interview"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewInterviewModal;
