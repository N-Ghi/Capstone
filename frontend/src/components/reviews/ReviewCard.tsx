import { useEffect, useState } from "react";
import type { Review } from "../../@types/review.types";
import { Stars } from "../common/Stars";
import { getUserById } from "../../services/userService";
import styles from "./ReviewCard.module.css";
import { useTranslation } from "react-i18next";
import { getInitials, getAvatarColor } from "../../utils/avatar";


interface ReviewCardProps {
  review: Review;
  isOwn: boolean;
  onEdit: () => void;
}

const isoToSec = (iso: string) => iso.slice(0, 19);


function ReviewCard({ review, isOwn, onEdit }: ReviewCardProps) {
  const { t, i18n } = useTranslation("review");
  const [author, setAuthor] = useState<any>(null);
  const [authorError, setAuthorError] = useState(false);

  useEffect(() => {
    setAuthor(null);
    setAuthorError(false);
    getUserById(review.traveler)
      .then(setAuthor)
      .catch(() => setAuthorError(true));
  }, [review.traveler]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const initials = getInitials(author?.first_name, author?.last_name, author?.username);
  const avatarBg = getAvatarColor(review.id);
  const displayName = author?.first_name
    ? `${author.first_name} ${author.last_name ?? ""}`.trim()
    : author?.username ?? author?.email ?? t("card.unknownUser");

  return (
    <div className={`${styles.reviewCard} ${isOwn ? styles.reviewCardOwn : ""}`}>
      <div className={styles.reviewTop}>
        <div className={styles.authorRow}>
          {/* Avatar */}
          {author?.profile_picture ? (
            <img src={author.profile_picture} alt={displayName} className={styles.avatar} />
          ) : (
            <div
              className={styles.avatarFallback}
              style={{ background: authorError ? "#bbb" : avatarBg }}
            >
              {authorError ? "?" : author ? initials : "…"}
            </div>
          )}

          <div>
            <div className={styles.authorName}>
              {authorError
                ? t("card.unknownUser")
                : author
                ? displayName
                : t("card.loading")}
              {isOwn && <span className={styles.youBadge}>{t("card.you")}</span>}
            </div>
            <div className={styles.reviewMeta}>
              <Stars rating={review.rating} size={12} />
              <span className={styles.metaDot}>·</span>
              <span className={styles.reviewDate}>{fmt(review.created_at)}</span>
              {isoToSec(review.updated_at) !== isoToSec(review.created_at) && (
                <span className={styles.editedTag}>{t("card.edited")}</span>
              )}
            </div>
          </div>
        </div>

        {isOwn && (
          <button className={styles.editBtn} type="button" onClick={onEdit}>
            {t("card.edit")}
          </button>
        )}
      </div>
      <p className={styles.reviewComment}>{review.comment}</p>
    </div>
  );
}

export default ReviewCard;