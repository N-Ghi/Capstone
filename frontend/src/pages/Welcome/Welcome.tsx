import React, { useEffect, useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { Globe, Menu, X, MapPin, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLanguages } from '../../services/choiceService';
import { ExperienceFilterGrid } from '../../components/common/ExperienceFilterGrid';
import styles from './Welcome.module.css';
import logo from '../../assets/logo.png';

interface Language {
  id: string;
  name: string;
  code: string;
}

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [langOpen,  setLangOpen]  = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const langRef = useRef<HTMLDivElement>(null);

  const activeLang = languages.find((l) => l.code === i18n.language) ?? languages[0] ?? null;

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Languages only — experiences are owned by ExperienceFilterGrid
  useEffect(() => {
    getLanguages()
      .then((res) => setLanguages(res.results ?? res))
      .catch((err) => console.error('Failed to load languages', err));
  }, []);

  const selectLang = (lang: Language) => {
    i18n.changeLanguage(lang.code);
    setLangOpen(false);
    setMenuOpen(false);
  };

  const registerGuide   = () => navigate('/register', { state: { role: 'Guide'   } });
  const registerTourist = () => navigate('/register', { state: { role: 'Tourist' } });

  return (
    <main className={styles.wrapper}>

      {/* Header */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <Container>
          <div className={styles.headerInner}>

            <a className={styles.brand} onClick={() => navigate('/')}>
              <img src={logo} alt="Urugendo logo" className={styles.brandLogo} />
              <div className={styles.brandText}>
                <span className={styles.brandName}>Urugendo</span>
                <span className={styles.brandTagline}>{t('brand.tagline')}</span>
              </div>
            </a>

            <nav className={styles.desktopNav}>
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

              <div className={styles.navDivider} />

              <button className={styles.navLink} onClick={() => navigate('/login')}>
                {t('header.login')}
              </button>
              <button className={styles.navOutline} onClick={registerTourist}>
                {t('header.signup')}
              </button>
              <button className={styles.navPrimary} onClick={registerGuide}>
                <MapPin size={14} />
                {t('header.becomeGuide')}
              </button>
            </nav>

            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileLangRow}>
            {languages.map((lang) => (
              <button
                key={lang.id}
                className={`${styles.mobileLangBtn} ${activeLang?.id === lang.id ? styles.mobileLangBtnActive : ''}`}
                onClick={() => selectLang(lang)}
              >
                {lang.name}
              </button>
            ))}
          </div>
          <button className={styles.navLink} onClick={() => { navigate('/login'); setMenuOpen(false); }}>
            {t('header.login')}
          </button>
          <button className={styles.navOutline} onClick={() => { registerTourist(); setMenuOpen(false); }}>
            {t('header.signup')}
          </button>
          <button className={styles.navPrimary} onClick={() => { registerGuide(); setMenuOpen(false); }}>
            <MapPin size={14} /> {t('header.becomeGuide')}
          </button>
        </div>
      )}

      {/* Page body */}
      <div className={styles.pageBody}>
        <Container>
          <ExperienceFilterGrid
            columns={3}
            limit={15}
            onView={(id) => navigate(`/experience/${id}`)}
          />
        </Container>
      </div>

    </main>
  );
};

export default WelcomePage;