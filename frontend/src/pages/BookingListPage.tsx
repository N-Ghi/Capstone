import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeaderComponent from '../components/common/Header';
import { BookingList } from '../components/booking/BookingList';
import { getAllBookings } from '../services/bookingService';
import type { Booking } from '../@types/booking.types';
import styles from './BookingListPage.module.css';
import { BackIcon, ErrorIcon } from '../components/common/Icons';
import { useAuth } from '../context/AuthContext';


const ITEMS_PER_PAGE = 15;

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

const BookingListPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('booking');
  const { isTourist } = useAuth();
  const [bookings, setBookings]     = useState<Booking[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');

  const fetchBookings = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBookings(page);
      setBookings(data.results);
      setTotalItems(data.count);
      setCurrentPage(page);
    } catch {
      setError(t('bookingList.error.load'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchBookings(page);
  };

  const handleFilterChange = (filter: StatusFilter) => {
    setActiveFilter(filter);
  };

  // Filter bookings client-side
  const filteredBookings = useMemo(() =>
    activeFilter === 'all'
      ? bookings
      : bookings.filter((b) => b.status.toLowerCase() === activeFilter),
    [bookings, activeFilter]
  );

  const subtitle = loading
    ? t('bookingList.page.subtitle_loading', 'Loading your bookings...')
    : activeFilter === 'all'
      ? t('bookingList.page.subtitle', { count: totalItems })
      : t('bookingList.page.subtitle_filtered', { count: filteredBookings.length });

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
                <h1 className={styles.title}>{t('bookingList.page.title')}</h1>
                {isTourist && <p className={styles.subtitle}>{subtitle}</p> }
                
              </div>
            </div>
          </div>

          {/* Status filter pills */}
          {isTourist && (
            <div className={styles.filters} role="group" aria-label="Filter by status">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`${styles.filterPill} ${activeFilter === filter ? styles.filterPillActive : ''} ${filter !== 'all' ? styles[`pill_${filter}`] : ''}`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter === 'all'
                  ? t('bookingList.filter.all', 'All')
                  : t(`bookingList.status.${filter}`, filter.charAt(0).toUpperCase() + filter.slice(1))}
                {filter !== 'all' && (
                  <span className={styles.filterCount}>
                    {bookings.filter((b) => b.status.toLowerCase() === filter).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          )}
          

          {error && (
            <div className={styles.errorBanner} role="alert">
              <ErrorIcon size={16} />
              {error}
            </div>
          )}

          <BookingList
            bookings={filteredBookings}
            loading={loading}
            currentPage={currentPage}
            totalItems={filteredBookings.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />

        </div>
      </div>
    </>
  );
};

export default BookingListPage;