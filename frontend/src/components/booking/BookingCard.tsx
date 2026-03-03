import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Booking } from '../../@types/booking.types';
import styles from './BookingCard.module.css';
import { DateIcon, ViewIcon, UsersIcon } from '../common/Icons';
import { useTranslatedData } from '../../hooks/useTranslatedData';


interface BookingCardProps {
  booking: Booking;
  onView: (id: string) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const STATUS_MAP: Record<string, { label: string; mod: string }> = {
  confirmed: { label: 'Confirmed', mod: 'confirmed' },
  pending:   { label: 'Pending',   mod: 'pending'   },
  cancelled: { label: 'Cancelled', mod: 'cancelled' },
  completed: { label: 'Completed', mod: 'completed' },
};

const BookingCard: React.FC<BookingCardProps> = ({ booking, onView }) => {
  const { t } = useTranslation('booking');
  const { id, traveler_name, booking_date, guests, total_price, status } = booking;

  const statusInfo = STATUS_MAP[status] ?? { label: status, mod: 'pending' };

  const bookingArray = useMemo(
      () => (booking ? [booking] : []),
      [booking]
    );
  
  const { translated: translatedBookings, translating } = useTranslatedData(
    bookingArray,
    ['experience_title']
  );

  const translatedBooking = translatedBookings[0] ?? booking;

  const experienceTitle = translatedBooking?.experience_title ?? booking?.experience_title;

  return (
    <>
      <div className={styles.card} onClick={() => onView(id)} role="article">
        <div className={styles.cardBody}>
          <div className={styles.cardTop}>
            <div className={styles.cardTitles}>
              <h2 className={`${styles.title} ${translating ? styles.translating : ''}`}>
                {experienceTitle}
              </h2>
              <p className={styles.travelerName}>{traveler_name}</p>
            </div>
            <span className={`${styles.statusBadge} ${styles[`status_${statusInfo.mod}`]}`}>
              <span className={styles.statusDot} />
              {t(`bookingList.status.${status.toLowerCase()}`, statusInfo.label)}
            </span>
          </div>

          <div className={styles.cardMeta}>
            <span className={styles.metaItem}>
              <DateIcon size={12} />
              {formatDate(booking_date)}
            </span>
            <span className={styles.metaItem}>
              <UsersIcon size={12} /> {guests} {guests === 1 ? t('bookingList.card.guest') : t('bookingList.card.guests')}
            </span>
            <span className={styles.metaItem}>
              {t('bookingDetails.currency')} {total_price}
            </span>
          </div>

          <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
            <button
              className={`${styles.actionBtn} ${styles.actionBtnView}`}
              onClick={() => onView(id)}
            >
              <ViewIcon size={12} />
              {t('bookingList.card.view')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingCard;