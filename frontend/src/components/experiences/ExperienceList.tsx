import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { ExperienceListItem } from '../../@types/experience.types';
import ExperienceCard from './ExperienceCard';
import { PaginationControl } from '../common/PaginationControl';
import styles from './ExperienceList.module.css';
import { AddIcon, HomeIcon } from '../common/Icons';

interface ExperienceListProps {
  experiences?: ExperienceListItem[];
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  translating?: boolean;
}

const Skeleton: React.FC = () => (
  <div className={styles.skeletonList}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className={styles.skeletonCard} />
    ))}
  </div>
);

export const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences = [],
  onEdit,
  onView,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 15,
  onPageChange,
  loading = false,
  translating = false,
}) => {
  const { t } = useTranslation('experience');
  const navigate = useNavigate();

  const showPagination = onPageChange && totalItems > 0;

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className={styles.wrapper}>
      {translating && (
        <div className={styles.translatingBanner}>
          <span className={styles.translatingSpinner} />
          {t('experienceList.translating')}
        </div>
      )}

      {experiences.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <HomeIcon size={26} />
          </div>
          <h2 className={styles.emptyTitle}>{t('experienceList.empty.title')}</h2>
          <p className={styles.emptyText}>{t('experienceList.empty.text')}</p>
          <button className={styles.emptyBtn} onClick={() => navigate('/guide/experiences/create')}>
            <AddIcon size={14} />
            {t('experienceList.empty.cta')}
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {experiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onEdit={onEdit ?? ((id) => navigate(`/experience/${id}/edit`))}
              onView={onView ?? ((id) => navigate(`/experience/${id}`))}
            />
          ))}
        </div>
      )}

      {showPagination && (
        <PaginationControl
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          itemLabel={t('experienceList.pagination.itemLabel')}
        />
      )}
    </div>
  );
};

export default ExperienceList;