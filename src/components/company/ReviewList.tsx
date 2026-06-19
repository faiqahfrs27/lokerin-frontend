import { Star } from "lucide-react";
import type { CompanyReview } from "../../schemas/companyReviewSchema";

function StarDisplay({ value }: { value: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={13}
          fill={s <= value ? "#F97316" : "none"}
          stroke={s <= value ? "#F97316" : "var(--fg-3)"} />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: CompanyReview }) {
  const date = new Date(review.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className="card card-pad" style={{ display: "flex",
      flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14,
            color: "var(--fg)" }}>{review.position}</p>
          <p style={{ margin: "4px 0 0", fontSize: 12,
            color: "var(--fg-3)" }}>{date}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <StarDisplay value={Math.round(review.overallRating)} />
          <span style={{ fontSize: 13, fontWeight: 700,
            color: "var(--brand)" }}>
            {review.overallRating.toFixed(1)}
          </span>
        </div>
      </div>

      {review.salaryEstimate && (
        <p style={{ margin: 0, fontSize: 13, color: "var(--fg-3)" }}>
          💰 Salary estimate:{" "}
          <strong style={{ color: "var(--fg)" }}>
            Rp {review.salaryEstimate.toLocaleString("id-ID")}
          </strong>
        </p>
      )}

      <p style={{ margin: 0, fontSize: 13, color: "var(--fg-2)",
        lineHeight: 1.6 }}>
        {review.content}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
        <RatingItem label="Work Culture" value={review.cultureRating} />
        <RatingItem label="Work-Life Balance" value={review.worklifeRating} />
        <RatingItem label="Facilities" value={review.facilityRating} />
        <RatingItem label="Career" value={review.careerRating} />
      </div>
    </div>
  );
}

function RatingItem({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between",
      alignItems: "center" }}>
      <span style={{ fontSize: 12, color: "var(--fg-3)" }}>{label}</span>
      <StarDisplay value={value} />
    </div>
  );
}

export function ReviewList({ reviews }: { reviews: CompanyReview[] }) {
  if (reviews.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 24px",
        color: "var(--fg-3)", fontSize: 14 }}>
        No reviews yet. Be the first to review this company!
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
    </div>
  );
}