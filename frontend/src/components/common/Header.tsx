import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound, PlusCircle, LayoutList, ChevronDown, Users, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import styles from './Header.module.css';
import { logout } from '../../services/authService';
import { getLanguages } from '../../services/choiceService';

interface Language {
  id: string;
  name: string;
  code: string;
}

const HeaderComponent: React.FC = () => {
  const { t, i18n } = useTranslation('dashboards');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expMenuOpen, setExpMenuOpen] = useState(false);

  // ── Language state ──────────────────────────────────────────────────────
  const [languages, setLanguages] = useState<Language[]>([]);
  const [langOpen, setLangOpen]   = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const activeLang = languages.find((l) => l.code === i18n.language) ?? languages[0] ?? null;

  // Fetch available languages once on mount
  useEffect(() => {
    getLanguages()
      .then((res) => setLanguages(res.results ?? res))
      .catch((err) => console.error('Failed to load languages:', err));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectLang = (lang: Language) => {
    i18n.changeLanguage(lang.code);
    setLangOpen(false);
  };
  // ───────────────────────────────────────────────────────────────────────

  const role = user?.role;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={styles.header}>
      <a className={styles.brand} onClick={() => navigate(`/${role?.toLowerCase()}`)}>
        <img src={logo} alt="Urugendo logo" className={styles.brandLogo} />
        <span className={styles.brandName}>Urugendo</span>
      </a>

      <nav className={styles.nav}>
        {/* Guide-specific Experiences dropdown */}
        {role === 'Guide' && (
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownTrigger}
              onClick={() => setExpMenuOpen((v) => !v)}
            >
              {t('header.experiences')}
              <ChevronDown
                size={13}
                className={`${styles.chevron} ${expMenuOpen ? styles.chevronOpen : ''}`}
              />
            </button>
            {expMenuOpen && (
              <div className={styles.dropdownMenu}>
                <button
                  className={styles.dropdownItem}
                  onClick={() => { navigate('/guide/experiences/create'); setExpMenuOpen(false); }}
                >
                  <PlusCircle size={13} /> {t('header.createExperience')}
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => { navigate('/guide/experiences'); setExpMenuOpen(false); }}
                >
                  <LayoutList size={13} /> {t('header.allExperiences')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tourist-specific link */}
        {role === 'Tourist' && (
          <button className={styles.linkBtn} onClick={() => navigate('/tourist/bookings')}>
            {t('header.myBookings')}
          </button>
        )}

        {/* Admin-specific dashboard link */}
        {role === 'Admin' && (
          <button className={styles.linkBtn} onClick={() => navigate('/admin/users')}>
            <Users size={13} /> {t('header.users')}
          </button>
        )}

        {/* Settings & Profile */}
        <div className={styles.navActions}>

          {/* Language selector */}
          <div className={styles.langWrapper} ref={langRef}>
            <button
              className={styles.langTrigger}
              onClick={() => setLangOpen((v) => !v)}
              aria-label="Select language"
            >
              <Globe size={15} />
              <span className={styles.langLabel}>
                {activeLang ? activeLang.name : t('header.language')}
              </span>
              <ChevronDown
                size={12}
                className={`${styles.langChevron} ${langOpen ? styles.langChevronOpen : ''}`}
              />
            </button>

            {langOpen && (
              <div className={styles.langDropdown}>
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    className={`${styles.langItem} ${activeLang?.id === lang.id ? styles.langItemActive : ''}`}
                    onClick={() => selectLang(lang)}
                  >
                    <Globe size={13} className={styles.langItemIcon} />
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className={styles.profileBtn}
            title={t('header.profile')}
            onClick={() => navigate(`/${role?.toLowerCase()}/profile/${user?.id}`)}
          >
            <UserRound size={16} />
            <span>{user?.username || t('header.defaultName')}</span>
          </button>
          <button
            className={styles.iconBtn}
            title={t('header.logout')}
            onClick={handleLogout}
          >
            <LogOut size={16} />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default HeaderComponent;