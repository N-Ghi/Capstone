import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { ExperienceListItem } from '../../@types/experience.types';
import ExperienceCard from './ExperienceCard';
import { PaginationControl } from '../common/PaginationControl';
import styles from './ExperienceGrid.module.css';
import { AddIcon, HomeIcon } from '../common/Icons';


interface ExperienceGridProps {
  experiences?: ExperienceListItem[];
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  translating?: boolean;
  renderCard?: (exp: ExperienceListItem) => React.ReactNode;
  columns?: 'auto' | 2 | 3 | 4;
  /** Override the create CTA route */
  createRoute?: string;
}

const SKELETON_COUNT = 6;

const Skeleton: React.FC<{ columns: ExperienceGridProps['columns'] }> = ({ columns }) => (
  <div
    className={styles.grid}
    data-columns={columns}
    aria-busy="true"
    aria-label="Loading experiences"
  >
    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
      <div key={i} className={styles.skeletonCard}>
        <div className={styles.skeletonImage} />
        <div className={styles.skeletonBody}>
          <div className={styles.skeletonLine} style={{ width: '60%' }} />
          <div className={styles.skeletonLine} style={{ width: '40%' }} />
          <div className={styles.skeletonLine} style={{ width: '80%' }} />
        </div>
      </div>
    ))}
  </div>
);

export const ExperienceGrid: React.FC<ExperienceGridProps> = ({
  experiences = [],
  onEdit,
  onView,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 12,
  onPageChange,
  loading = false,
  translating = false,
  renderCard,
  columns = 'auto',
  createRoute = '/guide/experiences/create',
}) => {
  const { t } = useTranslation('experience');
  const navigate = useNavigate();

  const showPagination = onPageChange && totalItems > 0;

  if (loading) {
    return <Skeleton columns={columns} />;
  }

  return (
    <div className={styles.wrapper}>
      {translating && (
        <div className={styles.translatingBanner} role="status">
          <span className={styles.translatingSpinner} aria-hidden="true" />
          {t('experienceList.translating')}
        </div>
      )}

      {experiences.length === 0 ? (
        <div className={styles.empty} role="region" aria-label={t('experienceList.empty.title')}>
          <div className={styles.emptyIcon} aria-hidden="true">
            <HomeIcon size={26} />
          </div>
          <h2 className={styles.emptyTitle}>{t('experienceList.empty.title')}</h2>
          <p className={styles.emptyText}>{t('experienceList.empty.text')}</p>
          <button className={styles.emptyBtn} onClick={() => navigate(createRoute)}>
            <AddIcon size={14} />
            {t('experienceList.empty.cta')}
          </button>
        </div>
      ) : (
        <div
          className={styles.grid}
          data-columns={columns}
          role="list"
          aria-label={t('experienceList.gridLabel', { defaultValue: 'Experiences' })}
        >
          {experiences.map((exp) =>
            renderCard ? renderCard(exp) : (
              <div key={exp.id} role="listitem">
                <ExperienceCard
                  experience={exp}
                  onEdit={onEdit ?? ((id) => navigate(`/experience/${id}/edit`))}
                  onView={onView ?? ((id) => navigate(`/experience/${id}`))}
                />
              </div>
            )
          )}
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

export default ExperienceGrid;