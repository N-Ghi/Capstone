import { Trans, useTranslation } from 'react-i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MailCheck, RefreshCw, Compass } from 'lucide-react';
import styles from './VerifyEmailNotice.module.css';
import logo from '../assets/logo.png';

const VerifyEmailNotice: React.FC = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>

      {/* Left brand panel */}
      <div className={styles.panel}>
        <a className={styles.panelBrand} onClick={() => navigate('/')}>
          <img src={logo} alt="Urugendo" className={styles.panelLogo} />
          <span className={styles.panelBrandName}>Urugendo</span>
        </a>

        <div className={styles.panelBadge}>
          <Compass size={42} className={styles.panelBadgeIcon} strokeWidth={1} />
        </div>

        <div className={styles.panelContent}>
          <p className={styles.panelQuote}>
            {t('verifyEmailNotice.panel.quote')} <span>{t('verifyEmailNotice.panel.quoteHighlight')}</span>.
          </p>
          <span className={styles.panelSub}>{t('verifyEmailNotice.panel.welcome')}</span>
        </div>
      </div>

      {/* Right notice panel */}
      <div className={styles.formPanel}>
        <div className={styles.formBox}>
          <div className={styles.successBox}>

            <div className={styles.successIcon}>
              <MailCheck size={28} color="#fff" strokeWidth={1.8} />
            </div>

            <h2 className={styles.title}>{t('verifyEmailNotice.title')}</h2>

            <p className={styles.noticeBody}>
              {t('verifyEmailNotice.body')}
            </p>

            <p className={styles.noticeHint}>
              <Trans
                i18nKey="verifyEmailNotice.hint"
                ns="auth"
                components={{ strong: <strong /> }}
              />
            </p>

            <button
              className={styles.submitBtn}
              onClick={() => navigate('/resend-email')}
            >
              <RefreshCw size={15} style={{ marginRight: 7 }} />
              {t('verifyEmailNotice.resend')}
            </button>

            <button
              className={styles.backBtn}
              style={{ marginTop: 10 }}
              onClick={() => navigate('/')}
            >
              {t('verifyEmailNotice.backToHome')}
            </button>

          </div>
        </div>
      </div>

    </div>
  );
};

export default VerifyEmailNotice;