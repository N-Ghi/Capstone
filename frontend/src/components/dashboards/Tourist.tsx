import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { ExperienceFilterGrid } from '../common/ExperienceFilterGrid';
import styles from './Tourist.module.css';
import { useAppSelector } from '../../store/hooks';
import { selectIsSearching } from '../../store/selectors/experienceSelectors';
import SearchResultsView from '../common/SearchResults';

const TouristDashboard: React.FC = () => {
  const { t } = useTranslation('experience');
  const navigate = useNavigate();
  const isSearching = useAppSelector(selectIsSearching);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.container}>
        {isSearching ? (
          <SearchResultsView />
        ) : 
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
        }
      </main>
    </div>
  );
};

export default TouristDashboard;