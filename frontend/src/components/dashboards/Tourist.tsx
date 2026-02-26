import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { ExperienceFilterGrid } from '../common/ExperienceFilterGrid';
import styles from './Tourist.module.css';

const TouristDashboard: React.FC = () => {
  const { t } = useTranslation('experience');
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.container}>
        <ExperienceFilterGrid
          columns={3}
          limit={12}
          onView={(id) => navigate(`/experience/${id}`)}
          labels={{
            experiences: t('dashboard.title', { defaultValue: 'Explore Experiences' }),
            categories: t('experienceFilter.title'),
            clearFilter: t('experienceFilter.clearFilters'),
            empty: t('experienceFilter.empty'),
          }}
        />
      </main>
    </div>
  );
};

export default TouristDashboard;