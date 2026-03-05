import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckIcon, LinkIcon, CloseIcon, LoaderIcon } from './Icons';
import calendarService, { type CalendarStatus } from '../../services/calendarService';
import styles from './Calendar.module.css';
import { useAuth } from '../../context/AuthContext';


const Calendar: React.FC = () => {
  const { t } = useTranslation('profile');
  const { user } = useAuth();

  const userId = user?.id;

  
  const [status, setStatus] = useState<CalendarStatus>({ 
    connected: false, 
    connected_at: null 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    fetchStatus();
    checkAuthCallback();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await calendarService.getStatus();
      setStatus(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch calendar status:', err);
      setError(t('calendar.errors.loadStatus'));
    } finally {
      setLoading(false);
    }
  };

  const checkAuthCallback = () => {
    if (calendarService.checkAuthCallback()) {
      calendarService.clearAuthCallback();
      fetchStatus();
    }
  };

  const handleConnect = () => {
    calendarService.connect(userId!);
  };

  const handleDisconnect = async () => {
    if (!confirm(t('calendar.confirmDisconnect'))) return;
    
    try {
      setDisconnecting(true);
      await calendarService.disconnect();
      setStatus({ connected: false, connected_at: null });
      setError(null);
    } catch (err: any) {
      console.error('Failed to disconnect calendar:', err);
      setError(t('calendar.errors.disconnect'));
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <LoaderIcon size={20} className={styles.spin} />
          <span>{t('calendar.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.error}>
          <CloseIcon size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.content}>
        {status.connected ? (
          <>
            <div className={styles.statusConnected}>
              <div className={styles.statusBadge}>
                <CheckIcon size={14} />
                <span>{t('calendar.connected')}</span>
              </div>
              {status.connected_at && (
                <p className={styles.connectedDate}>
                  {t('calendar.connectedOn', {
                    date: new Date(status.connected_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  })}
                </p>
              )}
            </div>
            
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className={styles.disconnectBtn}
            >
              {disconnecting ? (
                <>
                  <LoaderIcon size={16} className={styles.spin} />
                  {t('calendar.disconnecting')}
                </>
              ) : (
                <>
                  <CloseIcon size={16} />
                  {t('calendar.disconnect')}
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <p className={styles.description}>
              {t('calendar.description')}
            </p>
            
            <button
              type="button"
              onClick={handleConnect}
              className={styles.connectBtn}
            >
              <LinkIcon size={16} />
              {t('calendar.connect')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;