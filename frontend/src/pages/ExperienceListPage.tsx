import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import HeaderComponent from '../components/common/Header';
import { ExperienceList } from '../components/experiences/ExperienceList';
import { getAllExperiences } from '../services/experienceService';
import { useTranslatedData } from '../hooks/useTranslatedData';
import type { ExperienceListItem } from '../@types/experience.types';
import styles from './ExperienceListPage.module.css';
import { BackIcon, AddIcon, ErrorIcon } from '../components/common/Icons';


const ITEMS_PER_PAGE = 15;

const ExperienceListPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('experience');
  const { user } = useAuth();

  const [experiences, setExperiences] = useState<ExperienceListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Translation
  const { translated, translating } = useTranslatedData(
    experiences,
    ['title', 'description']
  );
  const displayedExperiences = translating || translated.length === 0
    ? experiences
    : translated;

  // Fetch
  const fetchExperiences = useCallback(async (page: number = 1) => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAllExperiences({
        guide_id: user.id,
        ...(page > 1 ? { page } : {}),
      } as any);
      setExperiences(data.results);
      setTotalItems(data.count);
      setCurrentPage(page);
    } catch {
      setError(t('experienceList.error.load'));
    } finally {
      setLoading(false);
    }
  }, [user?.id, t]);

  useEffect(() => {
    fetchExperiences(currentPage);
  }, [user?.id, fetchExperiences]);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchExperiences(page);
  };

  // Subtitle
  const subtitle = loading
    ? t('experienceList.page.subtitle_loading')
    : translating
    ? t('experienceList.translating')
    : t('experienceList.page.subtitle', { count: totalItems });

  return (
    <>
      <HeaderComponent />
      <div className={styles.page}>
        <div className={styles.container}>

          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
                <BackIcon size={18} />
              </button>
              <div>
                <h1 className={styles.title}>{t('experienceList.page.title')}</h1>
                <p className={`${styles.subtitle} ${translating ? styles.subtitleTranslating : ''}`}>
                  {subtitle}
                </p>
              </div>
            </div>
            <button className={styles.createBtn} onClick={() => navigate('/guide/experiences/create')}>
              <AddIcon size={14} />
              {t('experienceList.page.newExperience')}
            </button>
          </div>

          {error && (
            <div className={styles.errorBanner} role="alert">
              <ErrorIcon size={16} />
              {error}
            </div>
          )}

          <ExperienceList
            experiences={displayedExperiences}
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            loading={loading}
            translating={translating}
          />

        </div>
      </div>
    </>
  );
};

export default ExperienceListPage;