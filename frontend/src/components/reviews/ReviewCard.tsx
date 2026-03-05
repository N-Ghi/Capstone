import { useEffect, useState } from "react";
import type { Review } from "../../@types/review.types";
import { Stars } from "../common/Stars";
import { getCurrentUser } from "../../services/authService";
import styles from "./ReviewCard.module.css";

interface ReviewCardProps {
  review: Review;
  isOwn: boolean;
  onEdit: () => void;
}

const isoToSec = (iso: string) => iso.slice(0, 19);

function getInitials(first?: string, last?: string, username?: string): string {
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first[0].toUpperCase();
  if (username) return username[0].toUpperCase();
  return "?";
}

function getAvatarColor(id: string): string {
  const colors = [
    "#627F67", "#7a6a8a", "#7a8a6a", "#6a7a8a",
    "#8a6a6a", "#6a8a7a", "#8a7a6a", "#6a6a8a",
  ];
  const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[sum % colors.length];
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function ReviewCard({ review, isOwn, onEdit }: ReviewCardProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  if (!user) return <div className={styles.reviewCard}>Loading...</div>;

  const initials = getInitials(user.first_name, user.last_name, user.username);
  const avatarBg = getAvatarColor(review.id);
  const displayName = user.first_name
    ? `${user.first_name} ${user.last_name ?? ""}`.trim()
    : user.username ?? user.email;

  return (
    <div className={`${styles.reviewCard} ${isOwn ? styles.reviewCardOwn : ""}`}>
      <div className={styles.reviewTop}>
        <div className={styles.authorRow}>
          {user.profile_picture ? (
            <img src={user.profile_picture} alt={displayName} className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback} style={{ background: avatarBg }}>
              {initials}
            </div>
          )}
          <div>
            <div className={styles.authorName}>
              {displayName}
              {isOwn && <span className={styles.youBadge}>You</span>}
            </div>
            <div className={styles.reviewMeta}>
              <Stars rating={review.rating} size={12} />
              <span className={styles.metaDot}>·</span>
              <span className={styles.reviewDate}>{fmt(review.created_at)}</span>
              {isoToSec(review.updated_at) !== isoToSec(review.created_at) && (
                <span className={styles.editedTag}>edited</span>
              )}
            </div>
          </div>
        </div>
        {isOwn && (
          <button
            className={styles.editBtn}
            type="button"
            onClick={() => {
              onEdit();
            }}
          >
            Edit
          </button>
        )}
      </div>
      <p className={styles.reviewComment}>{review.comment}</p>
    </div>
  );
}

export default ReviewCard;