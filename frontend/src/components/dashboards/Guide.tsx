import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Compass, LayoutList, } from 'lucide-react';
import { getUpcomingSlotsCount, getAllExperiencesCount, getAllExperienceSlots } from '../../services/experienceService';
import { useAuth } from '../../context/AuthContext';
import Header from '../common/Header';
import styles from './Guide.module.css';
import type { Slot } from '../../@types/experience.types';
import i18n from '../../i18n';

const GuideDashboard: React.FC = () => {
  const { t } = useTranslation('dashboards');
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [allExperiencesCount, setAllExperiencesCount] = useState<number>(0);
  const [upcomingSlotsCount,  setUpcomingSlotsCount]  = useState<number>(0);
  const [upcomingSlots,       setUpcomingSlots]       = useState<Partial<Slot>[]>([]);
  const [loading,             setLoading]             = useState(true);

  // Data fetch
  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [expCount, slotCount, slots] = await Promise.all([
          getAllExperiencesCount(user.id),
          getUpcomingSlotsCount(user.id),
          getAllExperienceSlots({guide_id: user.id, upcoming: true}),
        ]);
        setAllExperiencesCount(expCount);
        setUpcomingSlotsCount(slotCount);
        setUpcomingSlots(slots.results.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);
  // Render
  return (
    <div className={styles.wrapper}>

      {/* Header */}
      <Header />

      {/* Main */}
      <main className={styles.main}>

        {/* Summary cards */}
        <div className={styles.cardRow}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Compass size={20} strokeWidth={1.5} />
            </div>
            <div className={styles.statBody}>
              <span className={styles.statValue}>
                {loading ? '—' : allExperiencesCount}
              </span>
              <span className={styles.statLabel}>{t('guide.stats.totalExperiences')}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <LayoutList size={20} strokeWidth={1.5} />
            </div>
            <div className={styles.statBody}>
              <span className={styles.statValue}>
                {loading ? '-' : upcomingSlotsCount}
              </span>
              <span className={styles.statLabel}>{t('guide.stats.upcomingSlots')}</span>
            </div>
          </div>
        </div>

        {/* Upcoming slots table */}
        <section className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>{t('guide.table.title')}</h2>

          {loading ? (
            <div className={styles.skeletonTable}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.skeletonRow} />
              ))}
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('guide.table.experienceId')}</th>
                  <th>{t('guide.table.date')}</th>
                  <th>{t('guide.table.time')}</th>
                </tr>
              </thead>
              <tbody>
                {upcomingSlots.length > 0 ? (
                  upcomingSlots.map((slot, index) => (
                    <tr key={index}>
                      <td>{slot.experience}</td>
                      <td>{slot.date ? new Date(slot.date).toLocaleDateString(i18n.language) : '—'}</td>
                      <td>{slot.start_time} – {slot.end_time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className={styles.emptyCell}>
                      {t('guide.table.empty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>

      </main>
    </div>
  );
};

export default GuideDashboard;