import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBookingById } from '../../services/bookingService';
import { submitPayment } from '../../services/paymentService';
import type { CreateBookingResponse } from '../../@types/booking.types';
import styles from './BookingDetails.module.css';
import { DateIcon, ClockIcon, BackIcon, LocationIcon, UsersIcon } from '../common/Icons';
import HeaderComponent from '../common/Header';
import PaymentForm from '../payment/PaymentForm';
import { useTranslatedData } from '../../hooks/useTranslatedData';


const STATUS_MAP: Record<string, { label: string; mod: string }> = {
  confirmed: { label: 'Confirmed', mod: 'confirmed' },
  pending:   { label: 'Pending',   mod: 'pending'   },
  cancelled: { label: 'Cancelled', mod: 'cancelled' },
  completed: { label: 'Completed', mod: 'completed' },
  failed:    { label: 'Failed',    mod: 'cancelled' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const formatTime = (time: string) =>
  new Date(`1970-01-01T${time}Z`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const BookingDetails: React.FC = () => {
  const { t } = useTranslation('booking');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<CreateBookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ msg: string; ok: boolean } | null>(null);

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

  useEffect(() => {
    (async () => {
      try {
        if (!id) throw new Error('Booking ID missing');
        const data = await getBookingById(id);
        setBooking(data);
      } catch {
        setError(t('bookingDetails.error.load'));
      } finally {
        setLoading(false);
      }
    })();
  }, [id, t]);

  const handlePaymentSubmit = async (formData: any) => {
    if (!booking?.payment_id) {
      setError(t('bookingDetails.error.noPayment'));
      return;
    }
    setPaymentLoading(true);
    setPaymentResult(null);
    try {
      const response = await submitPayment(booking.payment_id, formData);
      if (response.payment_status === 'COMPLETED') {
        setPaymentResult({ msg: 'Payment successful!', ok: true });
        const updated = await getBookingById(booking.id);
        setBooking(updated);
      } else {
        setPaymentResult({ msg: 'Payment failed. Please try again.', ok: false });
      }
    } catch {
      setPaymentResult({ msg: 'Something went wrong. Please try again.', ok: false });
    } finally {
      setPaymentLoading(false);
      setShowPaymentModal(false);
    }
  };

  if (loading) return <><HeaderComponent /><p className={styles.loading}>{t('bookingDetails.loading')}</p></>;
  if (error)   return <><HeaderComponent /><p className={styles.error}>{error}</p></>;
  if (!booking) return <><HeaderComponent /><p className={styles.empty}>{t('bookingDetails.notFound')}</p></>;

  const statusKey  = booking.status.toLowerCase();
  const statusInfo = STATUS_MAP[statusKey] ?? { label: booking.status, mod: 'pending' };
  const canPay     = ['pending', 'failed'].includes(statusKey);

  return (
    <>
      <HeaderComponent />
      <div className={styles.page}>

        <div className={styles.topBar}>
          <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
            <BackIcon size={16} />
            {t('bookingDetails.back')}
          </button>
        </div>

        <div className={styles.container}>

          {/* Main card */}
          <div className={styles.card}>

            <div className={styles.cardHeader}>

              <h2 className={`${styles.title} ${translating ? styles.translating : ''}`}>
                {experienceTitle}
              </h2>

              <span className={`${styles.statusBadge} ${styles[`status_${statusInfo.mod}`]}`}>
                {t(`bookingList.status.${statusInfo.label.toLowerCase()}`, statusInfo.label)}
              </span>
            </div>

            <p className={styles.traveler}>
              {t('bookingDetails.traveler')}: {booking.traveler_name}
            </p>

            <div className={styles.divider} />

            {/* Meta grid */}
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <DateIcon size={14} />
                <div>
                  <div className={styles.metaLabel}>{t('bookingDetails.date')}</div>
                  <div className={styles.metaValue}>{formatDate(booking.slot.date)}</div>
                </div>
              </div>

              <div className={styles.metaItem}>
                <ClockIcon size={14} />
                <div>
                  <div className={styles.metaLabel}>{t('bookingDetails.time')}</div>
                  <div className={styles.metaValue}>
                    {formatTime(booking.slot.start_time)} – {formatTime(booking.slot.end_time)}
                  </div>
                </div>
              </div>

              <div className={styles.metaItem}>
                <LocationIcon size={14} />
                <div>
                  <div className={styles.metaLabel}>{t('bookingDetails.location')}</div>
                  <div className={styles.metaValue}>{booking.experience_location}</div>
                </div>
              </div>

              <div className={styles.metaItem}>
                <span style={{ fontSize: '0.9rem' }}>
                  <UsersIcon size={14} />
                </span>
                <div>
                  <div className={styles.metaLabel}>{t('bookingDetails.guests')}</div>
                  <div className={styles.metaValue}>{booking.guests}</div>
                </div>
              </div>
            </div>

            <div className={styles.divider} />

            {/* Price summary */}
            <div className={styles.priceCard}>
              <div className={styles.priceItem}>
                <span className={styles.totalLabel}>{t('bookingDetails.pricePerGuest')}</span>
                <span className={styles.metaValue}>{t('bookingDetails.currency')} {booking.price_per_guest}</span>
              </div>
              <div className={styles.priceDivider} />
              <div className={styles.priceItem}>
                <span className={styles.totalLabel}>{t('bookingDetails.totalPrice')}</span>
                <span className={styles.totalValue}>{t('bookingDetails.currency')} {booking.total_price}</span>
              </div>
            </div>

            {/* Pay button */}
            {canPay && (
              <>
                <div className={styles.divider} />
                <button className={styles.payBtn} onClick={() => setShowPaymentModal(true)}>
                  {t('bookingDetails.payNow')}
                </button>
              </>
            )}

            {paymentResult && (
              <p className={`${styles.paymentResult} ${paymentResult.ok ? '' : styles.error}`}>
                {paymentResult.msg}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Payment modal */}
      {showPaymentModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowPaymentModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{t('bookingDetails.payNow')}</h3>
            </div>
            <PaymentForm onSubmit={handlePaymentSubmit} loading={paymentLoading} />
            <button className={styles.modalClose} onClick={() => setShowPaymentModal(false)}>
              {t('bookingDetails.close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingDetails;