import { useTranslation } from 'react-i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftFromLine, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardRoute } from '../../utils/roleRedirect';
import styles from './LoginForm.module.css';
import logo from '../../assets/logo.png';

const LoginForm: React.FC = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = React.useState('');
  const [password,   setPassword]   = React.useState('');
  const [loading,    setLoading]    = React.useState(false);
  const [error,      setError]      = React.useState<string | null>(null);

  const goBack = () => navigate(-1);

  const handleLogin = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(identifier, password);
      navigate(getDashboardRoute(user.role));
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(
        err?.response?.data?.error ||
        t('login.error.default')
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
           {t('login.panel.quote')} <span>{t('login.panel.quoteHighlight')}</span>.
          </p>
          <span className={styles.panelSub}>{t('login.panel.welcome')}</span>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className={styles.formPanel}>
        <div className={styles.formBox}>
          <div className={styles.formHeader}>
            <h2 className={styles.title}>{t('login.title')}</h2>
            <p className={styles.subtitle}>{t('login.subtitle')}</p>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('login.emailOrUsername')}</label>
              <input
                className={styles.formControl}
                type="text"
                placeholder={t('login.emailPlaceholder')}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('login.password')}</label>
              <input
                className={styles.formControl}
                type="password"
                placeholder={t('login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? t('login.submitting') : t('login.submit')}
            </button>

            <button type="button" className={styles.backBtn} onClick={goBack}>
              <ArrowLeftFromLine size={15} />
              {t('login.goBack')}
            </button>
          </form>

          <div className={styles.formFooter}>
            {t('login.noAccount')}{' '}
            <button onClick={() => navigate('/register')}>{t('login.register')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;