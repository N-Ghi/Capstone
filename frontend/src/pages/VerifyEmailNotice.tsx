import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MailCheck, RefreshCw, Compass } from 'lucide-react';
import styles from './VerifyEmailNotice.module.css';
import logo from '../assets/logo.png';

const VerifyEmailNotice: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>

      {/* ── Left brand panel ────────────────────────────────────────────── */}
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
            Your journey is just getting <span>started</span>.
          </p>
          <span className={styles.panelSub}>One last step</span>
        </div>
      </div>

      {/* ── Right notice panel ───────────────────────────────────────────── */}
      <div className={styles.formPanel}>
        <div className={styles.formBox}>
          <div className={styles.successBox}>

            <div className={styles.successIcon}>
              <MailCheck size={28} color="#fff" strokeWidth={1.8} />
            </div>

            <h2 className={styles.title}>Check your inbox</h2>

            <p className={styles.noticeBody}>
              Registration successful! We've sent a verification link to your
              email address. Click it to activate your account and start
              exploring.
            </p>

            <p className={styles.noticeHint}>
              Can't find it? Check your <strong>spam or junk folder</strong>.
            </p>

            <button
              className={styles.submitBtn}
              onClick={() => navigate('/resend-email')}
            >
              <RefreshCw size={15} style={{ marginRight: 7 }} />
              Resend verification email
            </button>

            <button
              className={styles.backBtn}
              style={{ marginTop: 10 }}
              onClick={() => navigate('/')}
            >
              Back to home
            </button>

          </div>
        </div>
      </div>

    </div>
  );
};

export default VerifyEmailNotice;