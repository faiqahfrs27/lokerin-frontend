import {
  X,
  MapPin,
  Calendar,
  Tag,
  Loader2,
  Plus,
  ImagePlus,
} from "lucide-react";
import { useRef, useState } from "react";
import { useCreateJob } from "../../hooks/useCreateJob";
import { useCreateJobCategory } from "../../hooks/useCreateJobCategory";
import { useJobCategories } from "../../hooks/useJobCategories";
import type { CreateJobValues } from "../../schemas/createJobSchema";

interface NewJobModalProps {
  onClose: () => void;
}

function NewJobModal({ onClose }: NewJobModalProps) {
  const { form, onSubmit, isPending } = useCreateJob(onClose);
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useJobCategories();
  const categories = categoriesData?.data ?? [];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const fileRef = useRef<HTMLInputElement>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const createCategoryMutation = useCreateJobCategory();
  const watchedCategoryId = form.watch("categoryId");
  const isAddingNew = watchedCategoryId === "__new__";

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const created = await createCategoryMutation.mutateAsync({
        name: newCategoryName.trim(),
      });
      form.setValue("categoryId", created.id);
      setNewCategoryName("");
    } catch {}
  };

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

  const handleFormSubmit = (data: CreateJobValues) => {
    onSubmit(data, bannerFile);
  };

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

        <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                  <select
                    {...register("categoryId")}
                    defaultValue=""
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
                    <option value="__new__">+ Add new category</option>
                  </select>
                </div>
                {errors.categoryId && !isAddingNew && (
                  <span className="ff-err">{errors.categoryId.message}</span>
                )}
                {isAddingNew && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <div className="input-wrap" style={{ flex: 1 }}>
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g. Cybersecurity"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCategory();
                          }
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleAddCategory}
                      disabled={
                        createCategoryMutation.isPending ||
                        !newCategoryName.trim()
                      }
                    >
                      {createCategoryMutation.isPending ? (
                        <Loader2 size={14} className="spin" />
                      ) : (
                        <Plus size={14} />
                      )}
                      Add
                    </button>
                  </div>
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

              <div className="span-2">
                <span style={{ display: "block", marginBottom: 4, fontSize: "var(--fs-sm)", color: "var(--fg)" }}>
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
                        {bannerFile?.name ?? "Banner selected"}
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
              {isPending && <Loader2 size={14} className="spin" />}
              {isPending ? "Posting..." : "Post job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewJobModal;