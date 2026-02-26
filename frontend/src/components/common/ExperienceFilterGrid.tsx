import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllExperiences } from '../../services/experienceService';
import { getTravelPreferences } from '../../services/choiceService';
import { useTranslatedData } from '../../hooks/useTranslatedData';
import type { ExperienceQueryParams } from '../../@types/experience.types';
import TouristExperienceCard from '../experiences/TouristExperienceCard';
import { useNavigate } from 'react-router-dom';
import styles from './ExperienceFilterGrid.module.css';

interface TravelPreference {
  id: string;
  name: string;
}

interface Experience {
  id: string;
  title: string;
  description: string;
  photos: string[];
  language?: string;
}

interface ExperienceFilterGridProps {
  /** Max experiences to show per fetch. Defaults to 15. */
  limit?: number;
  /** Number of grid columns. Defaults to 'auto'. */
  columns?: 'auto' | 2 | 3 | 4;
  /** Override the default route when a card is clicked. */
  onView?: (id: string) => void;
  /** Additional static query params merged into every fetch. */
  baseParams?: Partial<ExperienceQueryParams>;
  /** Override section labels if needed. */
  labels?: {
    categories?: string;
    experiences?: string;
    empty?: string;
    clearFilter?: string;
  };
}

const SKELETON_COUNT = 6;

const Skeleton: React.FC<{ columns: ExperienceFilterGridProps['columns'] }> = ({ columns }) => (
  <div className={styles.grid} data-columns={columns}>
    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
      <div key={i} className={styles.skeletonCard}>
        <div className={styles.skeletonImage} />
        <div className={styles.skeletonBody}>
          <div className={styles.skeletonLine} style={{ width: '60%' }} />
          <div className={styles.skeletonLine} style={{ width: '40%' }} />
        </div>
      </div>
    ))}
  </div>
);

export const ExperienceFilterGrid: React.FC<ExperienceFilterGridProps> = ({
  limit = 15,
  columns = 'auto',
  onView,
  baseParams = {},
  labels = {},
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState<TravelPreference[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreference, setSelectedPreference] = useState<string | null>(null);

  const { translated: displayedExperiences, translating } = useTranslatedData(
    experiences,
    ['title', 'description'],
    experiences[0]?.language ? (item) => item.language as string : undefined
  );

  const fetchExperiences = useCallback(
    async (params: Partial<ExperienceQueryParams> = {}) => {
      setLoading(true);
      try {
        const res = await getAllExperiences({
          ordering: '-created_at',
          ...baseParams,
          ...params,
        });
        setExperiences((res.results ?? res).slice(0, limit));
      } catch (err) {
        console.error('ExperienceFilterGrid: failed to fetch experiences', err);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [limit]
  );

  // Initial load: preferences + experiences in parallel
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [prefRes, expRes] = await Promise.all([
          getTravelPreferences(),
          getAllExperiences({ ordering: '-created_at', ...baseParams }),
        ]);
        setPreferences(prefRes.results ?? prefRes);
        setExperiences((expRes.results ?? expRes).slice(0, limit));
      } catch (err) {
        console.error('ExperienceFilterGrid: failed to load initial data', err);
      } finally {
        setLoading(false);
      }
    };
    init();
    // Only re-run if limit changes — baseParams is intentionally excluded
    // to avoid re-fetching when the parent re-renders with an inline object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  // Re-fetch when a preference is selected
  useEffect(() => {
    if (!selectedPreference) return;
    fetchExperiences({ expertise: selectedPreference });
  }, [selectedPreference, fetchExperiences]);

  const handleCategoryClick = (prefId: string) =>
    setSelectedPreference((prev) => (prev === prefId ? null : prefId));

  const clearFilter = () => {
    setSelectedPreference(null);
    fetchExperiences();
  };

  const handleView = onView ?? ((id: string) => navigate(`/experience/${id}`));

  const isBusy = loading || translating;

  return (
    <div className={styles.wrapper}>
      {/* Category pills */}
      {preferences.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {labels.categories ?? t('explore.title')}
          </h2>
          <div className={styles.pillStrip}>
            {preferences.map((pref) => (
              <button
                key={pref.id}
                className={`${styles.pill} ${selectedPreference === pref.id ? styles.pillActive : ''}`}
                onClick={() => handleCategoryClick(pref.id)}
                aria-pressed={selectedPreference === pref.id}
              >
                {pref.name}
              </button>
            ))}
            {selectedPreference && (
              <button className={styles.clearBtn} onClick={clearFilter}>
                {labels.clearFilter ?? t('explore.clearFilter')}
              </button>
            )}
          </div>
        </section>
      )}

      {/* Experience grid */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {labels.experiences ?? t('experiences.title')}
        </h2>

        {isBusy ? (
          <Skeleton columns={columns} />
        ) : displayedExperiences.length === 0 ? (
          <p className={styles.empty}>
            {labels.empty ?? t('experiences.empty')}
          </p>
        ) : (
          <div className={styles.grid} data-columns={columns}>
            {displayedExperiences.map((exp) => (
              <TouristExperienceCard
                key={exp.id}
                experience={exp as any}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ExperienceFilterGrid;