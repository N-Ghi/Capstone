import { useState } from "react";
import type { ReviewFormData, ReviewPatchData } from "../../@types/review.types";
import { StarIcon } from "../common/Icons";
import styles from "./ReviewForm.module.css";

interface ReviewFormInlineProps {
  experienceId: string;
  initial?: { id?: string; rating: number; comment: string };
  onSave: (data: ReviewFormData | ReviewPatchData, reviewId?: string) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

const RATING_LABELS = ["", "Terrible", "Poor", "Okay", "Great", "Excellent"];

function ReviewFormInline({
  experienceId,
  initial,
  onSave,
  onCancel,
  isEdit = false,
}: ReviewFormInlineProps) {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [comment, setComment] = useState(initial?.comment ?? "");
  const [hovered, setHovered] = useState(0);
  const [errors, setErrors] = useState<{ rating?: boolean; comment?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const e: typeof errors = {};
    if (!rating) e.rating = true;
    if (!comment.trim()) e.comment = "Please write something.";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (isEdit) {
        if (!initial?.id) throw new Error("Missing review ID for edit");
        await onSave({ rating, comment }, initial.id);
      } else {
        await onSave({ experience: experienceId, rating, comment });
      }
    } catch (err: any) {
      console.error("Error saving review:", err);
      setSubmitError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.inlineForm}>
      {/* Star Rating */}
      <div className={styles.formField}>
        <div className={styles.starRow}>
          {[1, 2, 3, 4, 5].map((star) => {
            const filled = star <= (hovered || rating);
            return (
              <button
                key={star}
                type="button"
                className={styles.starBtn}
                style={{
                  color: filled ? "#E8C547" : "#c8c4bc",
                  transform: filled ? "scale(1.2)" : "scale(1)",
                }}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => {
                  setRating(star);
                  setErrors({ ...errors, rating: false });
                }}
                aria-label={`Rate ${star} stars`}
              >
                <StarIcon size={24} />
              </button>
            );
          })}
          {(hovered || rating) > 0 && (
            <span className={styles.ratingHint}>{RATING_LABELS[hovered || rating]}</span>
          )}
        </div>
        {errors.rating && <span className={styles.fieldError}>Please select a rating.</span>}
      </div>

      {/* Comment */}
      <div className={styles.formField}>
        <textarea
          className={`${styles.textarea} ${errors.comment ? styles.hasError : ""}`}
          placeholder="Share your experience…"
          value={comment}
          maxLength={1000}
          rows={3}
          onChange={(e) => {
            setComment(e.target.value);
            if (errors.comment) setErrors({ ...errors, comment: undefined });
          }}
        />
        <div className={styles.textareaFooter}>
          {errors.comment && <span className={styles.fieldError}>{errors.comment}</span>}
          <span className={styles.charCount}>{comment.length} / 1000</span>
        </div>
      </div>

      {/* Submit Error */}
      {submitError && <p className={styles.submitError}>{submitError}</p>}

      {/* Actions */}
      <div className={styles.formActions}>
        {onCancel && (
          <button className={styles.cancelBtn} type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          className={styles.submitBtn}
          type="button"
          onClick={handleSave}
          disabled={submitting}
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Post Review"}
        </button>
      </div>
    </div>
  );
}

export default ReviewFormInline;