import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { getReviews, createReview, updateReviewPartial } from "../../services/reviewService";
import type { Review, ReviewFormData, ReviewPatchData } from "../../@types/review.types";
import ReviewCard from "./ReviewCard";
import ReviewFormInline from "./ReviewForm";
import { Stars } from "../common/Stars";
import PaginationControl from "../common/PaginationControl";
import styles from "./ReviewSection.module.css";

interface ReviewSectionProps {
  experienceId: string;
}
const PAGE_SIZE = 15;

export default function ReviewSection({ experienceId }: ReviewSectionProps) {
  const { user, isTourist } = useAuth();
  const { t } = useTranslation("experience");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating] = useState<number | undefined>();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const myReview = reviews.find((r) => r.traveler === user?.id);

  const fetchReviews = useCallback(
    async (page: number = 1) => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      console.log(error);

      try {
        const query: Record<string, any> = {
          ...(experienceId && { experience: experienceId }),
          ...(rating && { rating }),
          ...(page > 1 && { page }),
        };

        const data = await getReviews(query);

        setReviews(data.results);
        setTotalItems(data.count);
        setCurrentPage(page);
      } catch {
        setError(t("experienceList.error.load"));
      } finally {
        setLoading(false);
      }
    },
    [experienceId, rating, isTourist, user?.id, t]
  );

  useEffect(() => {
    fetchReviews(currentPage);
  }, [experienceId, fetchReviews]);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchReviews(page);
  };

  const handleCreate = async (data: ReviewFormData | ReviewPatchData, reviewId?: string) => {
    if (!("experience" in data)) throw new Error("Missing experience ID");
    const created = await createReview(data as ReviewFormData);
    console.log("Review: ", reviewId)
    setReviews((prev) => [created, ...prev]);
    setShowForm(false);
  };

  const handleUpdate = async (data: ReviewPatchData, reviewId?: string) => {
    if (!reviewId) throw new Error("Missing review ID");
    const updated = await updateReviewPartial(reviewId, data);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, ...updated } : r))
    );
    setEditingId(null);
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return (
    <div className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Reviews</h3>
          {avgRating !== null && (
            <div className={styles.avgRow}>
              <Stars rating={Math.round(avgRating)} size={13} />
              <span className={styles.avgNumber}>{avgRating.toFixed(1)}</span>
              <span className={styles.reviewCount}>({reviews.length})</span>
            </div>
          )}
        </div>

        {isTourist && !myReview && !showForm && (
          <button
            className={styles.leaveReviewBtn}
            type="button"
            onClick={() => setShowForm(true)}
          >
            + Leave a Review
          </button>
        )}
      </div>

      {/* Inline create form */}
      {isTourist && showForm && !myReview && (
        <ReviewFormInline
          experienceId={experienceId}
          onSave={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Reviews list */}
      {loading ? (
        <div className={styles.loadingRow}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Loading reviews…</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>✦</span>
          <p className={styles.emptyText}>No reviews yet. Be the first!</p>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {reviews.map((review) => {
              const isOwn = review.traveler === user?.id;
              const isEditing = editingId === review.id;

              if (isEditing) {
                return (
                  <div key={review.id} className={styles.editingWrap}>
                    <ReviewFormInline
                      key={review.id}
                      experienceId={experienceId}
                      initial={{
                        id: review.id,
                        rating: review.rating,
                        comment: review.comment,
                      }}
                      onSave={handleUpdate}
                      onCancel={() => setEditingId(null)}
                      isEdit
                    />
                  </div>
                );
              }

              return (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwn={isOwn}
                  onEdit={() => setEditingId(review.id)}
                />
              );
            })}
          </div>
          <PaginationControl
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={PAGE_SIZE}
            onPageChange={handlePageChange}
            itemLabel="reviews"
          />
        </>
      )}
    </div>
  );
}