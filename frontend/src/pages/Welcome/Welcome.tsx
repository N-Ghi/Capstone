import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Globe, Menu, X, MapPin, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllExperiences } from "../../services/experienceService";
import { getTravelPreferences, getLanguages } from "../../services/choiceService";
import type { ExperienceQueryParams } from "../../types/experience.types";
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
}

/** Shape returned by /choices/languages/ */
interface Language {
  id:   string;
  name: string;  // e.g. "English", "Français", "Kinyarwanda"
}

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  // ── Page state ───────────────────────────────────────────────────────────
  const [preferences,        setPreferences]        = useState<TravelPreference[]>([]);
  const [experiences,        setExperiences]        = useState<Experience[]>([]);
  const [loading,            setLoading]            = useState(true);
  const [selectedPreference, setSelectedPreference] = useState<string | null>(null);

  // ── Header state ─────────────────────────────────────────────────────────
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [langOpen,   setLangOpen]   = useState(false);
  const [languages,  setLanguages]  = useState<Language[]>([]);
  const [activeLang, setActiveLang] = useState<Language | null>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Data fetching ─────────────────────────────────────────────────────────
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
        const langs: Language[] = langRes.results ?? langRes;
        setLanguages(langs);
        if (langs.length > 0) setActiveLang(langs[0]);
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFiltered = async () => {
      if (!selectedPreference) return;
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

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleCategoryClick = (prefId: string) =>
    setSelectedPreference((prev) => (prev === prefId ? null : prefId));

  const clearFilter = () => {
    setSelectedPreference(null);
    (async () => {
      try {
        setLoading(true);
        const res = await getAllExperiences({ ordering: "-created_at" });
        setExperiences((res.results ?? res).slice(0, 15));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  };

  const selectLang = (lang: Language) => { setActiveLang(lang); setLangOpen(false); };
  const registerGuide = () => navigate("/register", { state: { role: "Guide"   } });
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
                <span className={styles.brandTagline}>Thousand Experiences</span>
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
                    {activeLang ? activeLang.name : "Language"}
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
                Login
              </button>
              <button className={styles.navOutline} onClick={registerTourist}>
                Sign up
              </button>
              <button className={styles.navPrimary} onClick={registerGuide}>
                <MapPin size={14} />
                Become a Guide
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

      {/* Mobile full-screen menu */}
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
          <button className={styles.navLink}    onClick={() => { navigate("/login");  setMenuOpen(false); }}>Login</button>
          <button className={styles.navOutline} onClick={() => { registerTourist();  setMenuOpen(false); }}>Sign up</button>
          <button className={styles.navPrimary} onClick={() => { registerGuide();    setMenuOpen(false); }}>
            <MapPin size={14} /> Become a Guide
          </button>
        </div>
      )}

      {/* ── Page body ───────────────────────────────────────────────────── */}
      <div className={styles.pageBody}>
        <Container>

          {/* Categories — horizontal scrollable pill strip */}
          <h2 className={styles.sectionTitle}>Explore by Category</h2>
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
                ✕ Clear filter
              </button>
            </div>
          )}

          {/* Featured Experiences */}
          <h2 className={styles.sectionTitle}>Featured Experiences</h2>
          {loading ? (
            <div className={styles.experienceGrid}>
              {Array.from({ length: 15 }).map((_, n) => <div key={n} className={styles.skeleton} />)}
            </div>
          ) : experiences.length === 0 ? (
            <p className={styles.emptyMsg}>No experiences found.</p>
          ) : (
            <div className={styles.experienceGrid}>
              {experiences.slice(0, 15).map((exp) => (
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