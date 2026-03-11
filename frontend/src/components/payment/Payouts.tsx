import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPayouts } from '../../services/payoutService';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import styles from '../../components/dashboards/Guide.module.css';
import payoutStyles from './Payouts.module.css'
import type { Payout } from '../../@types/payout.types';
import i18n from '../../i18n';
import { useNavigate } from 'react-router-dom';

const GuidePayouts: React.FC = () => {
  const { t } = useTranslation('dashboards');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchPayouts = async () => {
      try {
        setLoading(true);
        const data = await getPayouts();
        setPayouts(data.results);
      } catch (err) {
        console.error('Failed to load payouts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
  }, [user?.id]);

  const statusClass = (code: string): string => {
    const map: Record<string, string> = {
      PAID:       payoutStyles.statusPaid,
      PENDING:    payoutStyles.statusPending,
      PROCESSING: payoutStyles.statusProcessing,
      FAILED:     payoutStyles.statusFailed,
    };
    return `${payoutStyles.statusBadge} ${map[code] ?? payoutStyles.statusDefault}`;
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        <section className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>{t('guide.payouts.title')}</h2>

          {loading ? (
            <div className={styles.skeletonTable}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.skeletonRow} />
              ))}
            </div>
          ) : payouts.length === 0 ? (
            <p className={styles.emptyCell}>{t('guide.payouts.empty')}</p>
          ) : (
            <div className={payoutStyles.payoutList}>
              {payouts.map((payout) => {
                const statusCode = payout.status_detail?.code ?? '';
                const date = payout.booking_detail?.slot_date
                  ? new Date(payout.booking_detail.slot_date).toLocaleDateString(i18n.language)
                  : '—';

                return (
                  <div
                    key={payout.id}
                    className={payoutStyles.payoutCard}
                    onClick={() => navigate(`/guide/payouts/${payout.id}`)}
                  >
                    <div className={payoutStyles.payoutCardLeft}>
                      <span className={payoutStyles.payoutTitle}>
                        {payout.booking_detail?.experience_title ?? '—'}
                      </span>
                      <span className={payoutStyles.payoutDate}>{date}</span>
                    </div>
                    <div className={payoutStyles.payoutCardRight}>
                      <span className={payoutStyles.payoutAmount}>
                        RWF {parseFloat(payout.amount).toLocaleString()}
                      </span>
                      <span className={statusClass(statusCode)}>{statusCode}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default GuidePayouts;