import React, { useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Alert } from 'react-bootstrap';
import { useSearch } from '../../hooks/useSearch';
import { useExperiences } from '../../hooks/useExperiences';
import TouristExperienceCard from '../experiences/TouristExperienceCard';
import { PaginationControl } from '../common/PaginationControl';
import Loader from '../common/Loader';
import styles from './SearchResults.module.css';
import { useNavigate } from 'react-router-dom';
import { BackIcon } from './Icons';

const ITEMS_PER_PAGE = 15;

const SearchResultsView: React.FC = () => {
  const { t } = useTranslation('common');
  const { query, searchType, handleClear, triggerFallbackIfEmpty } = useSearch();
  const { experiences, loading, error, currentPage, handlePageChange } = useExperiences();
  const navigate = useNavigate();

  const filteredExperiences = query
    ? experiences.filter((exp) =>
        searchType === 'guide'
          ? exp.guide_name?.toLowerCase().includes(query.toLowerCase())
          : exp.title?.toLowerCase().includes(query.toLowerCase())
      )
    : experiences;

  useEffect(() => {
    triggerFallbackIfEmpty(filteredExperiences.length);
  }, [filteredExperiences.length, triggerFallbackIfEmpty]);

  const paginated = filteredExperiences.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const labelKey = searchType === 'guide' ? 'search.guide' : 'search.experience';

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className={styles.wrapper}>
        <button className={styles.back} onClick={handleClear}>← Back</button>
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  const handleView = (id: string) => navigate(`/experience/${id}`);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            <Trans
            i18nKey="search.results"
            ns='common'
            values={{ label: t(labelKey) }}
            />
          </h1>
          <p className={styles.meta}>
            "{query}" — {filteredExperiences.length} result
            {filteredExperiences.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className={styles.back} onClick={handleClear}>
          <BackIcon size={16} />
          {t('search.back')}
        </button>
      </div>

      {filteredExperiences.length === 0 ? (
        <Alert variant="info">
          <Trans
            i18nKey="search.noItemsFound"
            ns='common'
            values={{ label: t(labelKey), query }}
          />
        </Alert>
      ) : (
        <>
          <div className={styles.grid}>
            {paginated.map((exp) => (
              <TouristExperienceCard key={exp.id} experience={exp} onView={handleView} />
            ))}
          </div>
          <PaginationControl
            currentPage={currentPage}
            totalItems={filteredExperiences.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            itemLabel="results"
          />
        </>
      )}
    </div>
  );
};

export default SearchResultsView;