import { X, MapPin, Calendar, Tag, Loader2 } from "lucide-react";
import { useCreateJob } from "../../hooks/useCreateJob";


const CATEGORIES = [
  { id: "PASTE-UUID-KATEGORI-1", name: "Engineering" },
  { id: "PASTE-UUID-KATEGORI-2", name: "Design" },
  { id: "PASTE-UUID-KATEGORI-3", name: "Marketing" },
];

interface NewJobModalProps {
  onClose: () => void;
}

function NewJobModal({ onClose }: NewJobModalProps) {
  const { form, onSubmit, isPending } = useCreateJob(onClose);
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
            <span className="kicker">New posting</span>
            <h2
              style={{
                margin: "6px 0 0",
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              Post a new job
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
                Job title
                <div className="input-wrap">
                  <input
                    {...register("title")}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
                {errors.title && (
                  <span className="ff-err">{errors.title.message}</span>
                )}
              </label>

              <label>
                Category
                <div className="input-wrap">
                  <Tag size={16} />
                  <select {...register("categoryId")} defaultValue="">
                    <option value="" disabled>
                      Pick a category
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.categoryId && (
                  <span className="ff-err">{errors.categoryId.message}</span>
                )}
              </label>

              <label>
                Location
                <div className="input-wrap">
                  <MapPin size={16} />
                  <input
                    {...register("city")}
                    placeholder="Jakarta, Bandung, Remote..."
                  />
                </div>
                {errors.city && (
                  <span className="ff-err">{errors.city.message}</span>
                )}
              </label>

              <label>
                Salary (Rp)
                <div className="input-wrap">
                  <input
                    {...register("salary")}
                    type="number"
                    placeholder="15000000"
                  />
                </div>
              </label>

              <label>
                Application deadline
                <div className="input-wrap">
                  <Calendar size={16} />
                  <input type="date" {...register("deadline")} />
                </div>
                {errors.deadline && (
                  <span className="ff-err">{errors.deadline.message}</span>
                )}
              </label>

              <label className="span-2">
                Tags (comma separated)
                <div className="input-wrap">
                  <input
                    {...register("tags")}
                    placeholder="react, typescript, remote"
                  />
                </div>
              </label>

              <label className="span-2">
                Banner URL (optional)
                <div className="input-wrap">
                  <input {...register("bannerUrl")} placeholder="https://..." />
                </div>
              </label>

              <label className="span-2">
                Description
                <textarea
                  className="input"
                  {...register("description")}
                  placeholder="What does the role do, and who's a great fit?"
                />
                {errors.description && (
                  <span className="ff-err">{errors.description.message}</span>
                )}
              </label>

              <label
                className="span-2"
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <input
                  type="checkbox"
                  {...register("hasTest")}
                  style={{ accentColor: "var(--brand)" }}
                />
                <span>Require pre-selection test</span>
              </label>
            </div>
          </div>

          <div className="modal-foot">
            <span style={{ flex: 1 }} />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isPending ? "Posting..." : "Post job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewJobModal;