import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPayoutById } from '../../services/payoutService';
import type { Payout } from '../../@types/payout.types';
import styles from '../booking/BookingDetails.module.css';
import { DateIcon, ClockIcon, BackIcon, PhoneIcon } from '../common/Icons';
import HeaderComponent from '../../components/common/Header';

const STATUS_MAP: Record<string, { label: string; mod: string }> = {
  PAID:       { label: 'Paid',       mod: 'confirmed' },
  PENDING:    { label: 'Pending',    mod: 'pending'   },
  PROCESSING: { label: 'Processing', mod: 'pending'   },
  FAILED:     { label: 'Failed',     mod: 'cancelled' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const formatTime = (time: string) =>
  new Date(`1970-01-01T${time}Z`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const PayoutDetails: React.FC = () => {
  const { t } = useTranslation('dashboards');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [payout,  setPayout]  = useState<Payout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!id) throw new Error('Payout ID missing');
        const data = await getPayoutById(id);
        setPayout(data);
      } catch {
        setError(t('guide.payout.errorLoad'));
      } finally {
        setLoading(false);
      }
    })();
  }, [id, t]);

  if (loading) return <><HeaderComponent /><p className={styles.loading}>{t('guide.payout.loading')}</p></>;
  if (error)   return <><HeaderComponent /><p className={styles.error}>{error}</p></>;
  if (!payout) return <><HeaderComponent /><p className={styles.empty}>{t('guide.payout.notFound')}</p></>;

  const statusCode = payout.status_detail?.code ?? '';
  const statusInfo = STATUS_MAP[statusCode] ?? { label: statusCode, mod: 'pending' };
  const detail     = payout.booking_detail;

  const total    = parseFloat(detail?.total_price ?? '0');
  const fee      = parseFloat(detail?.platform_fee ?? '0');
  const net      = parseFloat(payout.amount);

  return (
    <>
      <HeaderComponent />
      <div className={styles.page}>

        <div className={styles.topBar}>
          <button type="button" className={styles.backBtn} onClick={() => navigate('/guide/payouts')}>
            <BackIcon size={16} />
            {t('guide.payout.back')}
          </button>
        </div>

        <div className={styles.container}>
          <div className={styles.card}>

            {/* Header */}
            <div className={styles.cardHeader}>
              <h2 className={styles.title}>
                {detail?.experience_title ?? t('guide.payout.unknownExperience')}
              </h2>
              <span className={`${styles.statusBadge} ${styles[`status_${statusInfo.mod}`]}`}>
                {statusInfo.label}
              </span>
            </div>

            <p className={styles.traveler}>
              {t('guide.payout.payoutId')}: {payout.id}
            </p>

            <div className={styles.divider} />

            {/* Meta */}
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <DateIcon size={14} />
                <div>
                  <div className={styles.metaLabel}>{t('guide.payout.slotDate')}</div>
                  <div className={styles.metaValue}>
                    {detail?.slot_date ? formatDate(detail.slot_date) : '—'}
                  </div>
                </div>
              </div>

              <div className={styles.metaItem}>
                <ClockIcon size={14} />
                <div>
                  <div className={styles.metaLabel}>{t('guide.payout.slotTime')}</div>
                  <div className={styles.metaValue}>
                    {detail?.slot_start_time && detail?.slot_end_time
                      ? `${formatTime(detail.slot_start_time)} – ${formatTime(detail.slot_end_time)}`
                      : '—'}
                  </div>
                </div>
              </div>

              <div className={styles.metaItem}>
                <div>
                  <DateIcon size={14}/>
                  <div className={styles.metaLabel}>{t('guide.payout.payoutDate')}</div>
                  <div className={styles.metaValue}>{formatDate(payout.payout_date)}</div>
                </div>
              </div>

              <div className={styles.metaItem}>
                <div>
                  
                  <div className={styles.metaLabel}>
                    <PhoneIcon size={14} /> 
                    {t('guide.payout.provider')}
                  </div>
                  <div className={styles.metaValue}>
                    {payout.guide_profile?.payout_provider?.name ?? '—'}
                  </div>
                  <div className={styles.metaLabel}>
                    <PhoneIcon size={14} /> 
                    {t('guide.payout.phoneNumber')}
                  </div>
                  <div className={styles.metaValue}>
                    {payout.guide_profile?.phone_number?? '—'}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.divider} />

            {/* Price breakdown */}
            <div className={styles.priceCard}>
              <div className={styles.priceItem}>
                <span className={styles.totalLabel}>{t('guide.payout.bookingAmount')}</span>
                <span className={styles.metaValue}>RWF {total.toLocaleString()}</span>
              </div>
              <div className={styles.priceDivider} />
              <div className={styles.priceItem}>
                <span className={styles.totalLabel}>{t('guide.payout.platformFee')}</span>
                <span className={styles.metaValue}>− RWF {fee.toLocaleString()}</span>
              </div>
              <div className={styles.priceDivider} />
              <div className={styles.priceItem}>
                <span className={styles.totalLabel}>{t('guide.payout.yourPayout')}</span>
                <span className={styles.totalValue}>RWF {net.toLocaleString()}</span>
              </div>
            </div>

            {/* Transaction ID if paid */}
            {payout.provider_payout_id && (
              <>
                <div className={styles.divider} />
                <p className={styles.traveler}>
                  {t('guide.payout.transactionId')}: {payout.provider_payout_id}
                </p>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default PayoutDetails;