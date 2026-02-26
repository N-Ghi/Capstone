import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ExperienceListItem } from '../../@types/experience.types';
import styles from './ExperienceCard.module.css';
import {PhotoCountIcon, LocationIcon, DateIcon, EditIcon, ViewIcon} from '../common/Icons';

interface ExperienceCardProps {
  experience: ExperienceListItem;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onEdit, onView }) => {
  const { t } = useTranslation('experience');
  const { id, title, description, photos, location, is_active, created_at } = experience;
  const firstPhoto = photos?.[0];

  return (
    <div className={styles.card} onClick={() => onView(id)} role="article">

      <div className={styles.photoStrip}>
        {firstPhoto ? (
          <>
            <img src={firstPhoto} alt={title} className={styles.photo} />
            {photos.length > 1 && (
              <span className={styles.photoCount}>+{photos.length - 1}</span>
            )}
          </>
        ) : (
          <div className={styles.photoPlaceholder}>
            <PhotoCountIcon size={32} />
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <span className={`${styles.statusBadge} ${is_active ? styles.statusActive : styles.statusInactive}`}>
            <span className={styles.statusDot} />
            {is_active ? t('experienceList.status.active') : t('experienceList.status.inactive')}
          </span>
        </div>

        <p className={styles.cardDescription}>{description}</p>

        <div className={styles.cardMeta}>
          {location && (
            <span className={styles.metaItem}>
              <LocationIcon size={12} />
              {location.place_name}
            </span>
          )}
          <span className={styles.metaItem}>
            <DateIcon size={12} />
            {formatDate(created_at)}
          </span>
        </div>

        <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
          <button
            className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
            onClick={() => onEdit(id)}
          >
            <EditIcon size={12} />
            {t('experienceList.card.edit')}
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionBtnView}`}
            onClick={() => onView(id)}
          >
            <ViewIcon size={12} />
            {t('experienceList.card.view')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;