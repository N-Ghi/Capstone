/**
 * RegisterForm
 *
 * Registration form; uses `useAuth` context to register new users.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftFromLine, Compass, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './RegisterForm.module.css';
import logo from '../../assets/logo.png';

interface RegisterFormProps {
  role: 'Tourist' | 'Guide';
}

const RegisterForm: React.FC<RegisterFormProps> = ({ role }) => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username,         setUsername]         = React.useState('');
  const [email,            setEmail]            = React.useState('');
  const [firstName,        setFirstName]        = React.useState('');
  const [lastName,         setLastName]         = React.useState('');
  const [password,         setPassword]         = React.useState('');
  const [confirm_password, setConfirmPassword]  = React.useState('');
  const [loading,          setLoading]          = React.useState(false);
  const [error,            setError]            = React.useState<string | null>(null);

  const goBack = () => navigate(-1);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

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
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(
        err?.response?.data?.error ||
        'Registration failed. Please check your details.'
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
            Join a community of <span>authentic experiences</span> across Rwanda.
          </p>
          <span className={styles.panelSub}>Your adventure starts here</span>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className={styles.formPanel}>
        <div className={styles.formBox}>

          <div className={styles.formHeader}>
            <h2 className={styles.title}>Create account</h2>
            <p className={styles.subtitle}>Fill in your details to get started</p>
            <div className={styles.roleBadge}>
              <MapPin size={11} />
              Registering as {role}
            </div>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleRegister}>

            {/* First + Last name side by side */}
            <div className={styles.nameRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>First Name</label>
                <input
                  className={styles.formControl}
                  type="text"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Last Name</label>
                <input
                  className={styles.formControl}
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Username</label>
              <input
                className={styles.formControl}
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                className={styles.formControl}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password</label>
              <input
                className={styles.formControl}
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Confirm Password</label>
              <input
                className={styles.formControl}
                type="password"
                placeholder="Repeat your password"
                value={confirm_password}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>

            <button type="button" className={styles.backBtn} onClick={goBack}>
              <ArrowLeftFromLine size={15} />
              Go back
            </button>
          </form>

          <div className={styles.formFooter}>
            Already have an account?{' '}
            <button onClick={() => navigate('/login')}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;