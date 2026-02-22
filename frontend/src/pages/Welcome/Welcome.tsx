import React, { useEffect, useState, useRef } from "react";
import { Container, Card } from "react-bootstrap";
import { Globe, Menu, X, MapPin, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllExperiences } from "../../services/experienceService";
import { getTravelPreferences, getLanguages } from "../../services/choiceService";
import { useTranslatedData } from "../../hooks/useTranslatedData";
import type { ExperienceQueryParams } from "../../@types/experience.types";
import styles from "./Welcome.module.css";
import logo from "../../assets/logo.png";

interface TravelPreference {
  id: string;
  name: string;
}

interface Experience {
  id: string;
  title: string;
  description: string;
  photos: string[];
  language?: string;
}

interface Language {
  id: string;
  name: string;
  code: string;
}

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // ── Page state ───────────────────────────────────────────────────────────
  const [preferences,        setPreferences]        = useState<TravelPreference[]>([]);
  const [experiences,        setExperiences]        = useState<Experience[]>([]);
  const [loading,            setLoading]            = useState(true);
  const [selectedPreference, setSelectedPreference] = useState<string | null>(null);

  // ── Header state ─────────────────────────────────────────────────────────
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [langOpen,  setLangOpen]  = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const langRef = useRef<HTMLDivElement>(null);

  // Derive active language from i18next — single source of truth
  const activeLang = languages.find((l) => l.code === i18n.language) ?? languages[0] ?? null;

  // ── Translation of dynamic DB content ────────────────────────────────────
  // If the API returns a language field on each experience, use it directly
  // to skip the Azure detect round-trip. Otherwise fall back to auto-detection.
  const { translated: displayedExperiences, translating } = useTranslatedData(
    experiences,
    ['title', 'description'],
    experiences[0]?.language
      ? (item) => item.language as string
      : undefined
  );

  // ── Scroll listener ───────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close lang dropdown on outside click ─────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Initial data fetch ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prefRes, expRes, langRes] = await Promise.all([
          getTravelPreferences(),
          getAllExperiences({ ordering: "-created_at" }),
          getLanguages(),
        ]);
        setPreferences(prefRes.results ?? prefRes);
        setExperiences((expRes.results ?? expRes).slice(0, 15));
        setLanguages(langRes.results ?? langRes);
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Filtered fetch when preference changes ────────────────────────────────
  useEffect(() => {
    if (!selectedPreference) return;
    const fetchFiltered = async () => {
      try {
        setLoading(true);
        const params: ExperienceQueryParams = {
          ordering: "-created_at",
          expertise: selectedPreference,
        };
        const res = await getAllExperiences(params);
        setExperiences((res.results ?? res).slice(0, 15));
      } catch (err) {
        console.error("Failed to fetch filtered experiences:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiltered();
  }, [selectedPreference]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCategoryClick = (prefId: string) =>
    setSelectedPreference((prev) => (prev === prefId ? null : prefId));

  const clearFilter = async () => {
    setSelectedPreference(null);
    try {
      setLoading(true);
      const res = await getAllExperiences({ ordering: "-created_at" });
      setExperiences((res.results ?? res).slice(0, 15));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectLang = (lang: Language) => {
    i18n.changeLanguage(lang.code);
    setLangOpen(false);
    setMenuOpen(false);
  };

  const registerGuide   = () => navigate("/register", { state: { role: "Guide"   } });
  const registerTourist = () => navigate("/register", { state: { role: "Tourist" } });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className={styles.wrapper}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <Container>
          <div className={styles.headerInner}>

            {/* Brand */}
            <a className={styles.brand} onClick={() => navigate("/")}>
              <img src={logo} alt="Urugendo logo" className={styles.brandLogo} />
              <div className={styles.brandText}>
                <span className={styles.brandName}>Urugendo</span>
                <span className={styles.brandTagline}>{t("brand.tagline")}</span>
              </div>
            </a>

            {/* Desktop nav */}
            <nav className={styles.desktopNav}>

              {/* Language selector */}
              <div className={styles.langWrapper} ref={langRef}>
                <button
                  className={styles.langTrigger}
                  onClick={() => setLangOpen((v) => !v)}
                  aria-label="Select language"
                >
                  <Globe size={15} />
                  <span className={styles.langLabel}>
                    {activeLang ? activeLang.name : t("header.language")}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`${styles.langChevron} ${langOpen ? styles.langChevronOpen : ""}`}
                  />
                </button>

                {langOpen && (
                  <div className={styles.langDropdown}>
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        className={`${styles.langItem} ${activeLang?.id === lang.id ? styles.langItemActive : ""}`}
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

              <button className={styles.navLink} onClick={() => navigate("/login")}>
                {t("header.login")}
              </button>
              <button className={styles.navOutline} onClick={registerTourist}>
                {t("header.signup")}
              </button>
              <button className={styles.navPrimary} onClick={registerGuide}>
                <MapPin size={14} />
                {t("header.becomeGuide")}
              </button>
            </nav>

            {/* Mobile hamburger */}
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

      {/* ── Mobile full-screen menu ──────────────────────────────────────── */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileLangRow}>
            {languages.map((lang) => (
              <button
                key={lang.id}
                className={`${styles.mobileLangBtn} ${activeLang?.id === lang.id ? styles.mobileLangBtnActive : ""}`}
                onClick={() => selectLang(lang)}
              >
                {lang.name}
              </button>
            ))}
          </div>
          <button className={styles.navLink} onClick={() => { navigate("/login"); setMenuOpen(false); }}>
            {t("header.login")}
          </button>
          <button className={styles.navOutline} onClick={() => { registerTourist(); setMenuOpen(false); }}>
            {t("header.signup")}
          </button>
          <button className={styles.navPrimary} onClick={() => { registerGuide(); setMenuOpen(false); }}>
            <MapPin size={14} /> {t("header.becomeGuide")}
          </button>
        </div>
      )}

      {/* ── Page body ────────────────────────────────────────────────────── */}
      <div className={styles.pageBody}>
        <Container>

          {/* Categories */}
          <h2 className={styles.sectionTitle}>{t("explore.title")}</h2>
          <div className={styles.categoryStrip}>
            {preferences.map((pref) => (
              <button
                key={pref.id}
                className={`${styles.categoryPill} ${selectedPreference === pref.id ? styles.categoryPillActive : ""}`}
                onClick={() => handleCategoryClick(pref.id)}
              >
                {pref.name}
              </button>
            ))}
          </div>

          {/* Clear filter */}
          {selectedPreference && (
            <div className="mb-4">
              <button className={styles.clearBtn} onClick={clearFilter}>
                {t("explore.clearFilter")}
              </button>
            </div>
          )}

          {/* Featured Experiences */}
          <h2 className={styles.sectionTitle}>{t("experiences.title")}</h2>

          {(loading || translating) ? (
            <div className={styles.experienceGrid}>
              {Array.from({ length: 15 }).map((_, n) => (
                <div key={n} className={styles.skeleton} />
              ))}
            </div>
          ) : displayedExperiences.length === 0 ? (
            <p className={styles.emptyMsg}>{t("experiences.empty")}</p>
          ) : (
            <div className={styles.experienceGrid}>
              {displayedExperiences.map((exp) => (
                <Card key={exp.id} className={styles.experienceCard}>
                  {exp.photos?.[0] ? (
                    <Card.Img variant="top" src={exp.photos[0]} className={styles.experienceImg} />
                  ) : (
                    <div className={styles.experienceImgPlaceholder} />
                  )}
                  <Card.Body>
                    <Card.Title className={styles.experienceTitle}>{exp.title}</Card.Title>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

        </Container>
      </div>
    </main>
  );
};

export default WelcomePage;