import { Trans, useTranslation } from 'react-i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeftFromLine, Compass } from 'lucide-react';
import { resendVerificationEmail } from '../../services/authService';
import styles from './ResendEmail.module.css';
import logo from '../../assets/logo.png';

const ResendEmail: React.FC = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();

  const [identifier, setIdentifier] = React.useState('');
  const [loading,    setLoading]    = React.useState(false);
  const [error,      setError]      = React.useState<string | null>(null);
  const [success,    setSuccess]    = React.useState(false);

  const goBack = () => navigate(-1);

  const handleResend = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await resendVerificationEmail(identifier);
      setSuccess(true);
    } catch (err: any) {
      console.error('Resend verification email failed:', err);
      setError(
        err?.response?.data?.error ||
        t('resendVerification.error.default')
      );
    } finally {
      setLoading(false);
    }
  };

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
            {t('resendVerification.leftPanel.quote')} <span>{t('resendVerification.leftPanel.quoteHighlight')}</span>.
          </p>
          <span className={styles.panelSub}>{t('resendVerification.leftPanel.panelSub')}</span>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className={styles.formPanel}>
        <div className={styles.formBox}>

          {success ? (
            /* ── Success state ─────────────────────────────────────────── */
            <div className={styles.successBox}>
              <div className={styles.successIcon}>
                <Mail size={28} color="#fff" strokeWidth={1.8} />
              </div>
              <h2 className={styles.title}>{t('resendVerification.rightPanel.title')}</h2>
              <p className={styles.subtitle}>
                <Trans
                  i18nKey="resendVerification.rightPanel.subtitle"
                  ns="auth"
                  values={{ identifier }}
                  components={{ strong: <strong /> }}
                />
              </p>
              <button className={styles.submitBtn} onClick={() => navigate('/')}>
                {t('resendVerification.rightPanel.home')}
              </button>
            </div>
          ) : (
            /* ── Form state ────────────────────────────────────────────── */
            <>
              <div className={styles.formHeader}>
                <div className={styles.iconWrapper}>
                  <Mail size={24} color="#fff" strokeWidth={1.8} />
                </div>
                <h2 className={styles.title}>{t('resendVerification.form.title')}</h2>
                <p className={styles.subtitle}>
                  {t('resendVerification.form.subtitle')}
                </p>
              </div>

              {error && <div className={styles.errorAlert}>{error}</div>}

              <form onSubmit={handleResend}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t('resendVerification.form.email')}</label>
                  <input
                    className={styles.formControl}
                    type="email"
                    placeholder={t('resendVerification.form.emailPlaceholder')}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? t('resendVerification.form.submitting') : t('resendVerification.form.submit')}
                </button>

                <button type="button" className={styles.backBtn} onClick={goBack}>
                  <ArrowLeftFromLine size={15} />
                  {t('resendVerification.form.goBack')}
                </button>
              </form>

              <div className={styles.formFooter}>
                Remembered your password?{' '}
                <button onClick={() => navigate('/login')}>Sign in</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResendEmail;