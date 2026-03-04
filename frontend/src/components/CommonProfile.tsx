import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import Header from './common/Header';
import { LoaderIcon } from './common/Icons';

import { getUserById } from '../services/userService';
import { getProfileById } from '../services/profileService';
import { getAllExperiences } from '../services/experienceService';
import { getLanguages, getPaymentMethods } from '../services/choiceService';
import { useTranslatedData } from '../hooks/useTranslatedData';

import type { User } from '../@types/auth.types';
import type { GuideProfile } from '../@types/profile.types';
import type { ExperienceListItem } from '../@types/experience.types';

import styles from './CommonProfile.module.css';

const CommonProfileComponent: React.FC = () => {
  const { t } = useTranslation('profile');
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [guideProfile, setGuideProfile] = useState<GuideProfile | null>(null);
  const [experiences, setExperiences] = useState<ExperienceListItem[]>([]);
  const [languagesMap, setLanguagesMap] = useState<Record<string, string>>({});
  const [paymentMethodsMap, setPaymentMethodsMap] = useState<Record<string, string>>({});
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoadingUser(true);
    getUserById(id)
      .then(setUser)
      .catch((err) => { console.error(err); setUserError(t('errors.loadUser')); })
      .finally(() => setLoadingUser(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingProfile(true);
    getProfileById(id)
      .then((data) => { if ('expertise' in data) setGuideProfile(data as GuideProfile); })
      .catch((err) => {
        console.error(err);
        if (!(axios.isAxiosError(err) && err.response?.status === 404))
          setProfileError(t('errors.loadProfile'));
      })
      .finally(() => setLoadingProfile(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingExperiences(true);
    getAllExperiences({ guide_id: id })
      .then((data) => setExperiences(data.results || []))
      .catch(console.error)
      .finally(() => setLoadingExperiences(false));
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const [langs, payments] = await Promise.all([getLanguages(), getPaymentMethods()]);
        const langMap: Record<string, string> = {};
        langs.forEach((l: any) => (langMap[l.id] = l.name));
        const payMap: Record<string, string> = {};
        payments.forEach((p: any) => (payMap[p.id] = p.name));
        setLanguagesMap(langMap);
        setPaymentMethodsMap(payMap);
      } catch (err) { console.error(err); }
    })();
  }, []);

  // Translate experience titles and descriptions
  const { translated: translatedExperiences, translating } = useTranslatedData(
    experiences,
    ['title', 'description']
  );

  const languageNames = guideProfile?.languages?.map((lid) => languagesMap[lid]).filter(Boolean) || [];
  const paymentNames = guideProfile?.payment_methods?.map((pid) => paymentMethodsMap[pid]).filter(Boolean) || [];

  const isLoading = loadingUser || loadingProfile;

  return (
    <div className={styles.page}>
      <Header />

      {/* ── Unified profile card ─────────────────────────────── */}
      <div className={styles.layout}>
        <div className={styles.profileCard}>

          {/* Left: avatar + identity */}
          <div className={styles.profileLeft}>
            {loadingUser ? (
              <LoaderIcon className={styles.spin} />
            ) : userError ? (
              <p className={styles.error}>{userError}</p>
            ) : user ? (
              <>
                <img
                  src={user.profile_picture || '/default-avatar.png'}
                  className={styles.avatar}
                  alt={user.username}
                />
                <h2 className={styles.displayName}>
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.username}
                </h2>
                <p className={styles.username}>@{user.username}</p>
              </>
            ) : (
              <p className={styles.mutedText}>{t('errors.noUser')}</p>
            )}
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Right: bio + tags */}
          <div className={styles.profileRight}>
            {loadingProfile ? (
              <LoaderIcon className={styles.spin} />
            ) : profileError ? (
              <p className={styles.error}>{profileError}</p>
            ) : guideProfile ? (
              <>
                {guideProfile.bio && (
                  <p className={styles.bio}>{guideProfile.bio}</p>
                )}

                {languageNames.length > 0 && (
                  <div className={styles.tagGroup}>
                    <span className={styles.tagLabel}>{t('profile.languages')}</span>
                    <div className={styles.tagRow}>
                      {languageNames.map((l) => (
                        <span key={l} className={styles.tag}>{l}</span>
                      ))}
                    </div>
                  </div>
                )}

                {paymentNames.length > 0 && (
                  <div className={styles.tagGroup}>
                    <span className={styles.tagLabel}>{t('profile.paymentMethods')}</span>
                    <div className={styles.tagRow}>
                      {paymentNames.map((p) => (
                        <span key={p} className={styles.tag}>{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              !loadingProfile && (
                <p className={styles.mutedText}>{t('errors.noProfile')}</p>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── Experiences grid ─────────────────────────────────── */}
      <div className={styles.experiencesSection}>
        <h3 className={styles.sectionHeading}>{t('profile.experiences')}</h3>

        {loadingExperiences ? (
          <div className={styles.loaderWrap}><LoaderIcon className={styles.spin} /></div>
        ) : experiences.length === 0 ? (
          <p className={styles.emptyText}>{t('profile.noExperiences')}</p>
        ) : (
          <div className={styles.grid}>
            {(translatedExperiences.length ? translatedExperiences : experiences).map((exp) => (
              <div
                key={exp.id}
                className={`${styles.cardItem} ${translating ? styles.translating : ''}`}
                onClick={() => navigate(`/experience/${exp.id}/`)}
              >
                <div className={styles.cardItemImage}>
                  <img src={exp.photos[0] || '/default-avatar.png'} alt={exp.title} />
                </div>
                <div className={styles.cardItemBody}>
                  <h3 className={styles.cardTitle}>{exp.title}</h3>
                  <p className={styles.cardDescription}>{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonProfileComponent;