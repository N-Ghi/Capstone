import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Images, ImageOff, Eye } from 'lucide-react';
import type { ExperienceListItem } from '../../@types/experience.types';
import styles from './TouristExperienceCard.module.css';

interface TouristExperienceCardProps {
  experience: ExperienceListItem;
  onView: (id: string) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const TouristExperienceCard: React.FC<TouristExperienceCardProps> = ({ experience, onView }) => {
  const { t } = useTranslation('experience');
  const { id, title, description, photos, location, is_active, created_at } = experience;
  const firstPhoto = photos?.[0];

  return (
    <div
      className={styles.card}
      onClick={() => onView(id)}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onView(id)}
      aria-label={title}
    >
      <div className={styles.photoStrip}>
        {firstPhoto ? (
          <>
            <img src={firstPhoto} alt={title} className={styles.photo} />
            {photos.length > 1 && (
              <span className={styles.photoCount}>
                <Images size={11} strokeWidth={2} />
                {photos.length}
              </span>
            )}
          </>
        ) : (
          <div className={styles.photoPlaceholder}>
            <ImageOff size={28} strokeWidth={1.25} />
          </div>
        )}

        {/* Active badge — read-only, no toggle */}
        <span className={`${styles.statusBadge} ${is_active ? styles.statusActive : styles.statusInactive}`}>
          <span className={styles.statusDot} />
          {is_active ? t('experienceList.status.active') : t('experienceList.status.inactive')}
        </span>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>

        <div className={styles.cardMeta}>
          {location && (
            <span className={styles.metaItem}>
              <MapPin size={12} strokeWidth={2} />
              {location.place_name}
            </span>
          )}
          <span className={styles.metaItem}>
            <Calendar size={12} strokeWidth={2} />
            {formatDate(created_at)}
          </span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <button
          className={styles.viewBtn}
          onClick={(e) => { e.stopPropagation(); onView(id); }}
          aria-label={`${t('experienceList.card.view')} ${title}`}
        >
          <Eye size={13} strokeWidth={2} />
          {t('experienceList.card.view')}
        </button>
      </div>
    </div>
  );
};

export default TouristExperienceCard;