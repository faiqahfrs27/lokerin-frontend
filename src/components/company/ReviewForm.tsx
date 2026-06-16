import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { createReviewSchema, type CreateReviewData } from "../../schemas/companyReviewSchema";

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)}
          style={{ background: "none", border: "none", cursor: "pointer",
            padding: 2, color: star <= value ? "#F97316" : "var(--border)" }}>
          <Star size={20} fill={star <= value ? "#F97316" : "none"}
            stroke={star <= value ? "#F97316" : "var(--fg-3)"} />
        </button>
      ))}
    </div>
  );
}

export function ReviewForm({
  onSubmit,
  isPending,
}: {
  onSubmit: (data: CreateReviewData) => void;
  isPending: boolean;
}) {
  const { register, handleSubmit, setValue, watch,
    formState: { errors } } = useForm<CreateReviewData>({
    resolver: zodResolver(createReviewSchema) as any,
    defaultValues: {
      cultureRating: 0, worklifeRating: 0,
      facilityRating: 0, careerRating: 0,
    },
  });

  const ratings = {
    culture: watch("cultureRating"),
    worklife: watch("worklifeRating"),
    facility: watch("facilityRating"),
    career: watch("careerRating"),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
        <div className="ff">
          <label className="ff-label">Your Position</label>
          <input {...register("position")} className="ff-input"
            placeholder="Frontend Developer" />
          {errors.position && (
            <p style={{ color: "var(--danger-fg)", fontSize: 12, margin: "4px 0 0" }}>
              {errors.position.message}
            </p>
          )}
        </div>
        <div className="ff">
          <label className="ff-label">Salary Estimate (Rp, optional)</label>
          <input type="number" className="ff-input"
            placeholder="8000000"
            onChange={(e) => setValue("salaryEstimate",
              e.target.value ? parseInt(e.target.value) : undefined)} />
        </div>
      </div>

      <RatingRow label="Work Culture"
        value={ratings.culture}
        onChange={(v) => setValue("cultureRating", v)} />
      <RatingRow label="Work-Life Balance"
        value={ratings.worklife}
        onChange={(v) => setValue("worklifeRating", v)} />
      <RatingRow label="Facilities"
        value={ratings.facility}
        onChange={(v) => setValue("facilityRating", v)} />
      <RatingRow label="Career Opportunities"
        value={ratings.career}
        onChange={(v) => setValue("careerRating", v)} />

      <div className="ff">
        <label className="ff-label">Your Review</label>
        <textarea {...register("content")} className="ff-input" rows={4}
          placeholder="Share your experience working here..." />
        {errors.content && (
          <p style={{ color: "var(--danger-fg)", fontSize: 12, margin: "4px 0 0" }}>
            {errors.content.message}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

function RatingRow({
  label, value, onChange,
}: {
  label: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between",
      alignItems: "center", padding: "8px 0",
      borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: 13, color: "var(--fg)" }}>{label}</span>
      <StarRating value={value} onChange={onChange} />
    </div>
  );
}