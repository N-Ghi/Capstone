import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserRound, PlusCircle, LayoutList, ChevronDown,
  Users, LogOut, Globe, Menu, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import styles from './Header.module.css';
import { logout } from '../../services/authService';
import { getLanguages } from '../../services/choiceService';

interface Language { id: string; name: string; code: string; }

const HeaderComponent: React.FC = () => {
  const { t, i18n } = useTranslation('dashboards');
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user }   = useAuth();

  const [expMenuOpen,    setExpMenuOpen]    = useState(false);
  const [langOpen,       setLangOpen]       = useState(false);
  const [mobileNavOpen,  setMobileNavOpen]  = useState(false);
  const [languages,      setLanguages]      = useState<Language[]>([]);

  const langRef   = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const activeLang = languages.find((l) => l.code === i18n.language) ?? languages[0] ?? null;
  const role       = user?.role;

  // Close mobile nav on route change
  useEffect(() => { setMobileNavOpen(false); setExpMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    getLanguages()
      .then((res) => setLanguages(res.results ?? res))
      .catch((err) => console.error('Failed to load languages:', err));
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setLangOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node))
        setMobileNavOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectLang = (lang: Language) => { i18n.changeLanguage(lang.code); setLangOpen(false); };

  const handleLogout = async () => {
    try { await logout(); navigate('/'); }
    catch (err) { console.error('Logout error:', err); }
  };

  const isActive = (path: string) => location.pathname === path;

  // Shared nav links rendered in both desktop + mobile
  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {role === 'Guide' && (
        <>
          <button
            className={`${styles.navBtn} ${isActive('/guide/payouts') ? styles.navBtnActive : ''} ${mobile ? styles.mobileNavBtn : ''}`}
            onClick={() => navigate('/guide/payouts')}
          >
            {t('header.payouts')}
          </button>

          <div className={`${styles.dropdown} ${mobile ? styles.mobileDropdown : ''}`}>
            <button
              className={`${styles.navBtn} ${mobile ? styles.mobileNavBtn : ''}`}
              onClick={() => setExpMenuOpen((v) => !v)}
            >
              {t('header.experiences')}
              <ChevronDown size={13} className={`${styles.chevron} ${expMenuOpen ? styles.chevronOpen : ''}`} />
            </button>
            {expMenuOpen && (
              <div className={`${styles.dropdownMenu} ${mobile ? styles.mobileDropdownMenu : ''}`}>
                <button className={styles.dropdownItem} onClick={() => { navigate('/guide/experiences/create'); setExpMenuOpen(false); }}>
                  <PlusCircle size={13} /> {t('header.createExperience')}
                </button>
                <button className={styles.dropdownItem} onClick={() => { navigate('/guide/experiences'); setExpMenuOpen(false); }}>
                  <LayoutList size={13} /> {t('header.allExperiences')}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {role !== 'Admin' && (
        <button
          className={`${styles.navBtn} ${isActive('/bookings') ? styles.navBtnActive : ''} ${mobile ? styles.mobileNavBtn : ''}`}
          onClick={() => navigate('/bookings')}
        >
          {t('header.myBookings')}
        </button>
      )}

      {role === 'Admin' && (
        <button
          className={`${styles.navBtn} ${isActive('/admin/users') ? styles.navBtnActive : ''} ${mobile ? styles.mobileNavBtn : ''}`}
          onClick={() => navigate('/admin/users')}
        >
          <Users size={13} /> {t('header.users')}
        </button>
      )}
    </>
  );

  return (
    <header className={styles.header}>
      {/* Brand */}
      <a className={styles.brand} onClick={() => navigate(`/${role?.toLowerCase()}`)}>
        <img src={logo} alt="Urugendo logo" className={styles.brandLogo} />
        <span className={styles.brandName}>Urugendo</span>
      </a>

      {/* Desktop nav */}
      <nav className={styles.nav}>
        <NavLinks />

        <div className={styles.navActions}>
          {/* Language selector */}
          <div className={styles.langWrapper} ref={langRef}>
            <button className={styles.langTrigger} onClick={() => setLangOpen((v) => !v)} aria-label="Select language">
              <Globe size={15} />
              <span className={styles.langLabel}>{activeLang?.name ?? t('header.language')}</span>
              <ChevronDown size={12} className={`${styles.chevron} ${langOpen ? styles.chevronOpen : ''}`} />
            </button>
            {langOpen && (
              <div className={styles.dropdownMenu} style={{ minWidth: 168, right: 0, left: 'auto' }}>
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    className={`${styles.dropdownItem} ${activeLang?.id === lang.id ? styles.dropdownItemActive : ''}`}
                    onClick={() => selectLang(lang)}
                  >
                    <Globe size={13} style={{ opacity: 0.5 }} />
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

          <button className={styles.iconBtn} title={t('header.logout')} onClick={handleLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* Mobile hamburger */}
      <div className={styles.mobileActions}>
        <button className={styles.iconBtn} onClick={() => setMobileNavOpen((v) => !v)} aria-label="Toggle menu">
          {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className={styles.mobileNav} ref={mobileRef}>
          <NavLinks mobile />
          <div className={styles.mobileDivider} />

          {/* Language in mobile */}
          <div className={styles.mobileLangRow}>
            <Globe size={14} />
            <span className={styles.mobileLangLabel}>{t('header.language')}</span>
            <div className={styles.mobileLangOptions}>
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  className={`${styles.mobileLangChip} ${activeLang?.id === lang.id ? styles.mobileLangChipActive : ''}`}
                  onClick={() => selectLang(lang)}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.mobileDivider} />

          <button
            className={`${styles.mobileNavBtn} ${styles.mobileNavBtnProfile}`}
            onClick={() => navigate(`/${role?.toLowerCase()}/profile/${user?.id}`)}
          >
            <UserRound size={15} />
            <span>{user?.username || t('header.defaultName')}</span>
          </button>

          <button className={`${styles.mobileNavBtn} ${styles.mobileNavBtnLogout}`} onClick={handleLogout}>
            <LogOut size={15} />
            <span>{t('header.logout')}</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;