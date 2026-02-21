/**
 * Resend email
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeftFromLine, Compass } from 'lucide-react';
import { resendVerificationEmail } from '../../services/authService';
import styles from './ResendEmail.module.css';
import logo from '../../assets/logo.png';

const ResendEmail: React.FC = () => {
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
        'Failed to resend verification email.'
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
            One email away from your next <span>great adventure</span>.
          </p>
          <span className={styles.panelSub}>Almost there</span>
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
              <h2 className={styles.title}>Email sent!</h2>
              <p className={styles.subtitle}>
                A verification link is on its way to <strong>{identifier}</strong>.
                Check your inbox — and your spam folder just in case.
              </p>
              <button className={styles.submitBtn} onClick={() => navigate('/')}>
                Back to home
              </button>
            </div>
          ) : (
            /* ── Form state ────────────────────────────────────────────── */
            <>
              <div className={styles.formHeader}>
                <div className={styles.iconWrapper}>
                  <Mail size={24} color="#fff" strokeWidth={1.8} />
                </div>
                <h2 className={styles.title}>Resend verification</h2>
                <p className={styles.subtitle}>
                  Enter your email and we'll send a new verification link
                </p>
              </div>

              {error && <div className={styles.errorAlert}>{error}</div>}

              <form onSubmit={handleResend}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email address</label>
                  <input
                    className={styles.formControl}
                    type="email"
                    placeholder="you@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Sending…' : 'Resend verification email'}
                </button>

                <button type="button" className={styles.backBtn} onClick={goBack}>
                  <ArrowLeftFromLine size={15} />
                  Go back
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