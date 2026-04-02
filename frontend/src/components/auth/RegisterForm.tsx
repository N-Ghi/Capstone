import { useTranslation } from 'react-i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftFromLine, Compass, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './RegisterForm.module.css';
import logo from '../../assets/logo.png';
import { getApiError } from '../../utils/errorUtils';

interface RegisterFormProps { role: 'Tourist' | 'Guide'; }

const RegisterForm: React.FC<RegisterFormProps> = ({ role }) => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username,         setUsername]        = React.useState('');
  const [email,            setEmail]           = React.useState('');
  const [firstName,        setFirstName]       = React.useState('');
  const [lastName,         setLastName]        = React.useState('');
  const [password,         setPassword]        = React.useState('');
  const [confirm_password, setConfirmPassword] = React.useState('');
  const [loading,          setLoading]         = React.useState(false);
  const [error,            setError]           = React.useState<string | null>(null);
  const [fieldErrors,      setFieldErrors]     = React.useState<Record<string, string>>({});

  const goBack = () => navigate(-1);

  const clearField = (key: string) =>
    setFieldErrors(prev => ({ ...prev, [key]: '' }));

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    if (password !== confirm_password) {
      setFieldErrors({ confirm_password: t('register.error.passwordMismatch') });
      setLoading(false);
      return;
    }

    try {
      await register({
        username,
        email,
        first_name: firstName,
        last_name:  lastName,
        password,
        confirm_password,
        role,
      });
      navigate('/verify-email-notice');
    } catch (err: unknown) {
      console.error('Registration failed:', err);
      const parsed = getApiError(err, t('register.error.default'));
      if (parsed.kind === 'field') {
        setFieldErrors(parsed.fields);
      } else {
        setError(parsed.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (key: string) =>
    fieldErrors[key]
      ? <span className={styles.fieldError}>{fieldErrors[key]}</span>
      : null;

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
            {t('register.panel.quote1')} <span>{t('register.panel.quoteHighlight')}</span> {t('register.panel.quote2')}
          </p>
          <span className={styles.panelSub}>{t('register.panel.panelSub')}</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.formPanel}>
        <div className={styles.formBox}>

          <div className={styles.formHeader}>
            <h2 className={styles.title}>{t('register.title')}</h2>
            <p className={styles.subtitle}>{t('register.subtitle')}</p>
            <div className={styles.roleBadge}>
              <MapPin size={11} />
              {t('register.roleBadge', { role: t(`roles.${role}`) })}
            </div>
          </div>

          {error && <div className={styles.errorAlert} role="alert">{error}</div>}

          <form onSubmit={handleRegister}>

            {/* First + Last name side by side */}
            <div className={styles.nameRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('register.firstName')}</label>
                <input
                  className={`${styles.formControl} ${fieldErrors.first_name ? styles.inputError : ''}`}
                  type="text"
                  placeholder={t('register.firstNamePlaceholder')}
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); clearField('first_name'); }}
                  required
                />
                {fieldError('first_name')}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('register.lastName')}</label>
                <input
                  className={`${styles.formControl} ${fieldErrors.last_name ? styles.inputError : ''}`}
                  type="text"
                  placeholder={t('register.lastNamePlaceholder')}
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); clearField('last_name'); }}
                  required
                />
                {fieldError('last_name')}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('register.username')}</label>
              <input
                className={`${styles.formControl} ${fieldErrors.username ? styles.inputError : ''}`}
                type="text"
                placeholder={t('register.usernamePlaceholder')}
                value={username}
                onChange={(e) => { setUsername(e.target.value); clearField('username'); }}
                required
                autoComplete="username"
              />
              {fieldError('username')}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('register.email')}</label>
              <input
                className={`${styles.formControl} ${fieldErrors.email ? styles.inputError : ''}`}
                type="email"
                placeholder={t('register.emailPlaceholder')}
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearField('email'); }}
                required
                autoComplete="email"
              />
              {fieldError('email')}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('register.password')}</label>
              <input
                className={`${styles.formControl} ${fieldErrors.password ? styles.inputError : ''}`}
                type="password"
                placeholder={t('register.passwordPlaceholder')}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearField('password'); clearField('confirm_password'); }}
                required
                autoComplete="new-password"
              />
              {fieldError('password')}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('register.confirmPassword')}</label>
              <input
                className={`${styles.formControl} ${fieldErrors.confirm_password ? styles.inputError : ''}`}
                type="password"
                placeholder={t('register.confirmPasswordPlaceholder')}
                value={confirm_password}
                onChange={(e) => { setConfirmPassword(e.target.value); clearField('confirm_password'); }}
                required
                autoComplete="new-password"
              />
              {fieldError('confirm_password')}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? t('register.submitting') : t('register.submit')}
            </button>

            <button type="button" className={styles.backBtn} onClick={goBack}>
              <ArrowLeftFromLine size={15} />
              {t('register.goBack')}
            </button>
          </form>

          <div className={styles.formFooter}>
            {t('register.haveAccount')}{' '}
            <button onClick={() => navigate('/login')}>{t('register.login')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;