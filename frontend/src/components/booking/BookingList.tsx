import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Booking } from '../../@types/booking.types';
import BookingCard from './BookingCard';
import GuideBookingCard from './GuideBookingCard';
import { PaginationControl } from '../common/PaginationControl';
import styles from '../experiences/ExperienceList.module.css';
import { KeyIcon } from '../common/Icons';


interface BookingListProps {
  bookings?: Booking[];
  onView?: (id: string) => void;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

const Skeleton: React.FC = () => (
  <div className={styles.skeletonList}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className={styles.skeletonCard} />
    ))}
  </div>
);

export const BookingList: React.FC<BookingListProps> = ({
  bookings = [],
  onView,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 15,
  onPageChange,
  loading = false,
}) => {
  const { t } = useTranslation('booking');
  const navigate = useNavigate();
  const { isGuide } = useAuth();

  // Guides only see confirmed bookings
  const visibleBookings = isGuide
    ? bookings.filter((b) => b.status.toLowerCase() === 'confirmed')
    : bookings;

  const showPagination = onPageChange && totalItems > 0;

  if (loading) return <Skeleton />;

  return (
    <div className={styles.wrapper}>
      {visibleBookings.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <KeyIcon size={26} />
          </div>
          <h2 className={styles.emptyTitle}>
            {t('bookingList.empty.title')}
          </h2>
          <p className={styles.emptyText}>
            {isGuide
              ? t('bookingList.empty.textGuide')
              : t('bookingList.empty.text')}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {visibleBookings.map((booking) =>
            isGuide ? (
              <GuideBookingCard key={booking.id} booking={booking} />
            ) : (
              <BookingCard
                key={booking.id}
                booking={booking}
                onView={onView ?? ((id) => navigate(`/bookings/${id}`))}
              />
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
          itemLabel={t('bookingList.pagination.itemLabel', 'bookings')}
        />
      )}
    </div>
  );
};

export default BookingList;