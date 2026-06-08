import { X, Loader2, Briefcase } from "lucide-react";
import { useCreateTest } from "../../hooks/useCreateTest";
import { useJobs } from "../../hooks/useJobs";

interface NewTestModalProps {
  onClose: () => void;
}

function NewTestModal({ onClose }: NewTestModalProps) {
  const { form, onSubmit, isPending } = useCreateTest(() => onClose());
  const { data: jobsData, isLoading: isLoadingJobs } = useJobs({ limit: 100 });
  const jobs = (jobsData?.data ?? []).filter((j) => !j.hasTest);

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
            <span className="kicker">New test</span>
            <h2
              style={{
                margin: "6px 0 0",
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              Create pre-selection test
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
                Linked job
                <div className="input-wrap">
                  <Briefcase size={16} />
                  <select
                    {...register("jobId")}
                    defaultValue=""
                    disabled={isLoadingJobs}
                  >
                    <option value="" disabled>
                      {isLoadingJobs
                        ? "Loading jobs..."
                        : jobs.length === 0
                          ? "All jobs already have tests"
                          : "Pick a job"}
                    </option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.jobId && (
                  <span className="ff-err">{errors.jobId.message}</span>
                )}
              </label>

              <label className="span-2">
                Test title
                <div className="input-wrap">
                  <input
                    {...register("title")}
                    placeholder="e.g. Backend Engineer Pre-Selection"
                  />
                </div>
                {errors.title && (
                  <span className="ff-err">{errors.title.message}</span>
                )}
              </label>

              <label className="span-2">
                Description (optional)
                <div className="input-wrap">
                  <textarea
                    {...register("description")}
                    placeholder="Short context about the test..."
                    rows={3}
                  />
                </div>
              </label>

              <label>
                Passing score (0-100)
                <div className="input-wrap">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    {...register("passingScore")}
                  />
                </div>
                {errors.passingScore && (
                  <span className="ff-err">{errors.passingScore.message}</span>
                )}
              </label>

              <label>
                Duration (minutes)
                <div className="input-wrap">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    {...register("durationMinutes")}
                  />
                </div>
                {errors.durationMinutes && (
                  <span className="ff-err">
                    {errors.durationMinutes.message}
                  </span>
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
              disabled={isPending}
            >
              {isPending && <Loader2 size={14} className="spin" />}
              Create test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTestModal;