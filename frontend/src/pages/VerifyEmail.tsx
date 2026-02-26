import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import { MailCheck, XCircle, Loader, Compass } from "lucide-react";
import styles from "./VerifyEmail.module.css";
import logo from "../assets/logo.png";

const VerifyEmail: React.FC = () => {
  const { t } = useTranslation('auth');
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const verify = async () => {
      try {
        if (uid && token) {
          await verifyEmail(uid, token);
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };
    verify();
  }, [uid, token]);

  const stateConfig = {
    loading: {
      icon: <Loader size={26} color="#fff" strokeWidth={1.8} className={styles.spinIcon} />,
      title: t('verifyEmail.loading.title'),
      body: t('verifyEmail.loading.body'),
      hint: null,
    },
    success: {
      icon: <MailCheck size={26} color="#fff" strokeWidth={1.8} />,
      title: t('verifyEmail.success.title'),
      body: t('verifyEmail.success.body'),
      hint: null,
    },
    error: {
      icon: <XCircle size={26} color="#fff" strokeWidth={1.8} />,
      title: t('verifyEmail.error.title'),
      body:  t('verifyEmail.error.body'),
      hint:  t('verifyEmail.error.hint'),
    },
  };

  const current = stateConfig[status];

  return (
    <div className={styles.wrapper}>

      {/* Left panel */}
      <div className={styles.panel}>
        <a className={styles.panelBrand} onClick={() => navigate("/")}>
          <img src={logo} alt="Urugendo" className={styles.panelLogo} />
          <span className={styles.panelBrandName}>Urugendo</span>
        </a>

        <div className={styles.panelBadge}>
          <Compass size={42} className={styles.panelBadgeIcon} strokeWidth={1} />
        </div>

        <div className={styles.panelContent}>
          <p className={styles.panelQuote}>
            {t('verifyEmail.panel.quote')} <span>{t('verifyEmail.panel.quoteHighlight')}</span>.
          </p>
          <span className={styles.panelSub}>{t('verifyEmail.panel.panelSub')}</span>
        </div>
      </div>

      {/* Right panel */}
      <div className={styles.formPanel}>
        <div className={`${styles.formBox} ${styles[status]}`}>

          <div className={`${styles.iconWrapper} ${status === "error" ? styles.iconError : ""}`}>
            {current.icon}
          </div>

          <h2 className={styles.title}>{current.title}</h2>
          <p className={styles.body}>{current.body}</p>
          {current.hint && <p className={styles.hint}>{current.hint}</p>}

          {status === "success" && (
            <button className={styles.primaryBtn} onClick={() => navigate("/login")}>
              {t('verifyEmail.success.goToLogin')}
            </button>
          )}

          {status === "error" && (
            <>
              <button className={styles.primaryBtn} onClick={() => navigate("/resend-email")}>
                {t('verifyEmail.error.resend')}
              </button>
              <button className={styles.ghostBtn} onClick={() => navigate("/")}>
                {t('verifyEmail.error.backToHome')}
              </button>
            </>
          )}

          {status === "loading" && (
            <div className={styles.loadingBar}>
              <div className={styles.loadingFill} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;