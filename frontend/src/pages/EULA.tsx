import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "./EULA.module.css";
import logo from "../assets/logo.png";
import { Helmet } from 'react-helmet-async';


const EULA: React.FC = () => {
  const { t } = useTranslation("eula");
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Simulate API or EULA loading
    const timer = setTimeout(() => {
      setStatus("success");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    navigate(-1);
  };

  if (!isOpen) return null;

  return (
    <>
      <Helmet>
        <title>{`${t('pageTitles.eula', { ns: 'common' })}`}</title>
      </Helmet>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <img src={logo} alt="Logo" className={styles.logo} />
            <button className={styles.closeButton} onClick={handleClose}>
              &times;
            </button>
          </div>

          <div className={styles.content}>
            {status === "loading" && <p>{t("loading")}</p>}
            {status === "error" && <p>{t("error")}</p>}
            {status === "success" && (
              <>
                <h2>{t("title")}</h2>
                <p>{t("intro")}</p>

                <h3>{t("locationTitle")}</h3>
                <p>{t("locationText")}</p>

                <h3>{t("translationTitle")}</h3>
                <p>{t("translationText")}</p>

                <h3>{t("privacyTitle")}</h3>
                <p>{t("privacyText")}</p>

                <h3>{t("dataSharingTitle")}</h3>
                <p>{t("dataSharingText")}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
    
  );
};

export default EULA;