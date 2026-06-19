import { useState } from "react";
import { useAuth } from "../../stores/useAuth";
import {
  useCompanyReviews,
  useCreateReview,
  useMyCompanyReview,
  useReviewEligibility,
} from "../../hooks/company/useCompanyReviews";
import { ReviewList } from "./ReviewList";
import { ReviewForm } from "./ReviewForm";
import Spinner from "../common/Spinner";
import Pagination from "../common/Pagination";
import type { CreateReviewData } from "../../schemas/companyReviewSchema";

export function CompanyReviewSection({ companyId }: { companyId: string }) {
  const user = useAuth((s) => s.user);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);

  const { data: reviewsRes, isLoading } = useCompanyReviews(companyId, page);
  const { data: eligibility } = useReviewEligibility(
    user ? companyId : undefined,
  );
  const { data: myReview } = useMyCompanyReview(
    user ? companyId : undefined,
  );
  const { mutate: createReview, isPending } = useCreateReview(companyId);

  const handleSubmit = (data: CreateReviewData) => {
    createReview(data, { onSuccess: () => setShowForm(false) });
  };

  return (
    <div>
      <ReviewHeader
        user={user}
        eligibility={eligibility}
        myReview={myReview}
        showForm={showForm}
        onToggleForm={() => setShowForm((v) => !v)}
      />
      {showForm && eligibility?.eligible && !myReview?.hasReviewed && (
        <div className="card card-pad" style={{ marginBottom: 16 }}>
          <ReviewForm onSubmit={handleSubmit} isPending={isPending} />
        </div>
      )}
      {isLoading ? (
        <Spinner text="Loading reviews..." />
      ) : (
        <>
          <ReviewList reviews={reviewsRes?.data ?? []} />
          <Pagination
            page={page}
            totalPages={reviewsRes?.meta.totalPages ?? 1}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

function ReviewHeader({
  user,
  eligibility,
  myReview,
  showForm,
  onToggleForm,
}: {
  user: { id: string } | null | undefined;
  eligibility?: { eligible: boolean };
  myReview?: { hasReviewed: boolean };
  showForm: boolean;
  onToggleForm: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <p style={{ margin: 0, fontSize: 13, color: "var(--fg-3)" }}>
        {!user && "Login to write a review"}
        {user &&
          !eligibility?.eligible &&
          "Only verified employees can write a review"}
        {user &&
          eligibility?.eligible &&
          myReview?.hasReviewed &&
          "You have already reviewed this company"}
      </p>
      {user && eligibility?.eligible && !myReview?.hasReviewed && (
        <button
          className="btn btn-primary"
          onClick={onToggleForm}
          style={{ fontSize: 13 }}
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      )}
    </div>
  );
}