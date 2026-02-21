import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import { MailCheck, XCircle, Loader, Compass } from "lucide-react";
import styles from "./VerifyEmail.module.css";
import logo from "../assets/logo.png";

const VerifyEmail: React.FC = () => {
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
      title: "Verifying your email…",
      body: "Please wait while we confirm your email address. This only takes a moment.",
      hint: null,
    },
    success: {
      icon: <MailCheck size={26} color="#fff" strokeWidth={1.8} />,
      title: "Email verified!",
      body: "Your account is now active. You're all set to start exploring authentic experiences across Africa.",
      hint: null,
    },
    error: {
      icon: <XCircle size={26} color="#fff" strokeWidth={1.8} />,
      title: "Verification failed",
      body: "This link may have expired or already been used.",
      hint: "Request a new verification link below and we'll send one to your inbox.",
    },
  };

  const current = stateConfig[status];

  return (
    <div className={styles.wrapper}>

      {/* ── Left panel ───────────────────────────────────────────────────── */}
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
            Every adventure begins with a <span>verified step</span>.
          </p>
          <span className={styles.panelSub}>Account activation</span>
        </div>
      </div>

      {/* ── Right panel ──────────────────────────────────────────────────── */}
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
              Go to login
            </button>
          )}

          {status === "error" && (
            <>
              <button className={styles.primaryBtn} onClick={() => navigate("/resend-email")}>
                Resend verification email
              </button>
              <button className={styles.ghostBtn} onClick={() => navigate("/")}>
                Back to home
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