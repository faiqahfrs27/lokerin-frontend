import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, MapPin, Calendar, Tag, Loader2, ImagePlus } from "lucide-react";
import {
  createJobSchema,
  type CreateJobValues,
} from "../../schemas/createJobSchema";
import { useUpdateJob } from "../../hooks/useUpdateJob";
import { useJobCategories } from "../../hooks/useJobCategories";
import type { Job } from "../../hooks/useJobs";

interface EditJobModalProps {
  job: Job;
  onClose: () => void;
}

function EditJobModal({ job, onClose }: EditJobModalProps) {
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useJobCategories();
  const categories = categoriesData?.data ?? [];

  const form = useForm<CreateJobValues>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: job.title,
      description: job.description,
      categoryId: job.category?.id ?? "",
      city: job.city,
      deadline: job.deadline ? job.deadline.slice(0, 10) : "",
      salary: job.salary ? String(job.salary) : "",
      tags: Array.isArray(job.tags) ? (job.tags as string[]).join(", ") : "",
      hasTest: job.hasTest,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    reset({
      title: job.title,
      description: job.description,
      categoryId: job.category?.id ?? "",
      city: job.city,
      deadline: job.deadline ? job.deadline.slice(0, 10) : "",
      salary: job.salary ? String(job.salary) : "",
      tags: Array.isArray(job.tags) ? (job.tags as string[]).join(", ") : "",
      hasTest: job.hasTest,
    });
  }, [job, reset]);

  const fileRef = useRef<HTMLInputElement>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    job.bannerUrl ?? null,
  );

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      alert("Only JPG / PNG files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Banner size must be less than 5MB.");
      return;
    }
    setBannerFile(file);
    const reader = new FileReader();
    reader.onload = () => setBannerPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const { update, isPending } = useUpdateJob(job.id, onClose);
  const onSubmit = async (v: CreateJobValues) => {
    await update({ data: v, bannerFile });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="kicker">Edit posting</span>
            <h2
              style={{
                margin: "6px 0 0",
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              Edit job posting
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
                  <input {...register("title")} />
                </div>
                {errors.title && (
                  <span className="ff-err">{errors.title.message}</span>
                )}
              </label>

              <label>
                Category
                <div className="input-wrap">
                  <Tag size={16} />
                  <select
                    {...register("categoryId")}
                    disabled={isLoadingCategories}
                  >
                    <option value="" disabled>
                      {isLoadingCategories
                        ? "Loading categories..."
                        : "Pick a category"}
                    </option>
                    {categories.map((c) => (
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
                  <input {...register("city")} />
                </div>
                {errors.city && (
                  <span className="ff-err">{errors.city.message}</span>
                )}
              </label>

              <label>
                Salary (Rp)
                <div className="input-wrap">
                  <input {...register("salary")} type="number" />
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
                  <input {...register("tags")} />
                </div>
              </label>

              <div className="span-2">
                <span
                  style={{
                    display: "block",
                    marginBottom: 4,
                    fontSize: "var(--fs-sm)",
                    color: "var(--fg)",
                  }}
                >
                  Banner image (optional)
                </span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleBannerChange}
                  style={{ display: "none" }}
                />
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: "2px dashed var(--border-2)",
                    borderRadius: "var(--radius-md)",
                    padding: bannerPreview ? "12px" : "24px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 200ms",
                    background: bannerFile
                      ? "var(--brand-soft)"
                      : "var(--surface)",
                    marginTop: 4,
                  }}
                >
                  {bannerPreview ? (
                    <>
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: 160,
                          borderRadius: 8,
                          objectFit: "cover",
                          marginBottom: 8,
                        }}
                      />
                      <p
                        style={{
                          margin: 0,
                          fontSize: "var(--fs-sm)",
                          color: "var(--brand-fg)",
                          fontWeight: "var(--fw-semibold)",
                        }}
                      >
                        {bannerFile?.name ?? "Current banner"}
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "var(--fs-xs)",
                          color: "var(--fg-3)",
                        }}
                      >
                        Click to change
                      </p>
                    </>
                  ) : (
                    <>
                      <ImagePlus
                        size={24}
                        style={{
                          color: "var(--fg-3)",
                          margin: "0 auto 8px",
                        }}
                      />
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: "var(--fs-sm)",
                          fontWeight: "var(--fw-medium)",
                        }}
                      >
                        Click to upload banner
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "var(--fs-xs)",
                          color: "var(--fg-3)",
                        }}
                      >
                        JPG / PNG · Max 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>

              <label className="span-2">
                Description
                <textarea className="input" {...register("description")} />
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
              {isPending && <Loader2 size={14} className="spin" />}
              {isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditJobModal;