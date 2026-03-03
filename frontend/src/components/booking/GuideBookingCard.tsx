import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Booking } from '../../@types/booking.types';
import styles from './GuideBookingCard.module.css';
import { DateIcon, UsersIcon } from '../common/Icons';
import { useTranslatedData } from '../../hooks/useTranslatedData';


interface GuideBookingCardProps {
  booking: Booking;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const GuideBookingCard: React.FC<GuideBookingCardProps> = ({ booking }) => {
  const { t } = useTranslation('booking');
  const { experience_title, booking_date, guests, total_price } = booking;

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
    <div className={styles.card} role="article">
      <div className={styles.cardBody}>

        <div className={styles.cardTop}>
          <h2 className={`${styles.title} ${translating ? styles.translating : ''}`}>
            {experienceTitle}
          </h2>
          <span className={styles.confirmedBadge}>
            <span className={styles.statusDot} />
            {t('bookingList.status.confirmed', 'Confirmed')}
          </span>
        </div>

        <div className={styles.cardMeta}>
          <span className={styles.metaItem}>
            <DateIcon size={12} />
            {formatDate(booking_date)}
          </span>
          <span className={styles.metaItem}>
            <UsersIcon size={12} /> {guests} {guests === 1
              ? t('bookingList.card.guest')
              : t('bookingList.card.guests')}
          </span>
          <span className={styles.metaItem}>
            {t('bookingDetails.currency')} {total_price}
          </span>
        </div>

      </div>
    </div>
  );
};

export default GuideBookingCard;