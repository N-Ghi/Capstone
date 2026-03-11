import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { getInitials, getAvatarColor } from '../utils/avatar';
import Header from './common/Header';
import { LoaderIcon, BackIcon } from './common/Icons';

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
  const [_paymentMethodsMap, setPaymentMethodsMap] = useState<Record<string, string>>({});
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoadingUser(true);
      try {
        const fetched = await getUserById(id);
        if (!cancelled) setUser(fetched);
      } catch (err) {
        console.error(err);
        if (!cancelled) setUserError(t('errors.loadUser'));
      } finally {
        if (!cancelled) setLoadingUser(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, t]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoadingProfile(true);
      try {
        const data = await getProfileById(id);
        console.log('Raw profile data:', data);
        if (!cancelled && 'payout_provider' in data) setGuideProfile(data as GuideProfile);
      } catch (err: unknown) {
        console.error(err);
        if (!cancelled && !(axios.isAxiosError(err) && err.response?.status === 404))
          setProfileError(t('errors.loadProfile'));
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, t]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoadingExperiences(true);
      try {
        const data = await getAllExperiences({ guide_id: id });
        if (!cancelled) setExperiences(data.results || []);
      } catch (err: unknown) {
        console.error(err);
      } finally {
        if (!cancelled) setLoadingExperiences(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);


  useEffect(() => {
    (async () => {
      try {
        const [langs, payments] = await Promise.all([getLanguages(), getPaymentMethods()]);
        const langMap: Record<string, string> = {};
        langs.forEach((l: { id: string; name: string }) => (langMap[l.id] = l.name));
        const payMap: Record<string, string> = {};
        payments.forEach((p: { id: string; name: string }) => (payMap[p.id] = p.name));
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

  const avatarInitials = user ? getInitials(user.first_name, user.last_name, user.username) : "…";
  const avatarBg = id ? getAvatarColor(id) : "#bbb";
  const displayName = user
    ? user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.username
    : "";

  return (
    <div className={styles.page}>
      <Header />
      {/* Unified profile card */}
      <div className={styles.layout}>
        <span className={styles.backBtn} onClick={() => navigate(-1)}>
          <BackIcon /> {t('profile.back')}
        </span>
        <div className={styles.profileCard}>
          {/* Left: avatar + identity */}
          <div className={styles.profileLeft}>
            {loadingUser ? (
              <LoaderIcon className={styles.spin} />
            ) : userError ? (
              <p className={styles.error}>{userError}</p>
            ) : user ? (
              <>
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    className={styles.avatar}
                    alt={displayName}
                  />
                ) : (
                  <div className={styles.avatarFallback} style={{ background: avatarBg }}>
                    {avatarInitials}
                  </div>
                )}
                <h2 className={styles.displayName}>{displayName}</h2>
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

                {guideProfile.phone_number && (
                  <div className={styles.tagGroup}>
                    <span className={styles.tagLabel}>{t('profile.phone')}</span>
                    <div className={styles.tagRow}>
                      <span className={styles.tag}>{guideProfile.phone_number}</span>
                    </div>
                  </div>
                )}

              </>
            ) : (
              !loadingProfile && (
                <p className={styles.mutedText}>{t('profile.errors.noProfile')}</p>
              )
            )}
          </div>
        </div>
      </div>

      {/* Experiences grid */}
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