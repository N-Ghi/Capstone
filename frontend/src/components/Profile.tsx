import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LinkIcon, NextIcon, KeyIcon, LoaderIcon } from './common/Icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from './common/Header';
import UserInfoForm from './UserInfo';
import ProfileForm from './ProfileForm';
import { getUserById, updateUserPartial } from '../services/userService';
import { getProfileById, updatePartialProfile, createGuideProfile, createTouristProfile } from '../services/profileService';
import { Roles, type Role } from '../@types/auth.types';
import type { User } from '../@types/auth.types';
import type { AnyProfile, UpdateTouristProfileData, UpdateGuideProfileData } from '../@types/profile.types';
import styles from './Profile.module.css';

const ProfileComponent: React.FC = () => {
  const { t } = useTranslation('profile');
  const { userId: userIdParam } = useParams<{ userId?: string }>();
  const { refreshUser, user: authUser } = useAuth();

  const userId = userIdParam ?? authUser?.id;

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AnyProfile | null>(null);
  const [profileExists, setProfileExists] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Fetch user
  useEffect(() => {
    if (!userId) return;
    setLoadingUser(true);
    setUserError(null);
    getUserById(userId)
      .then(setUser)
      .catch((err) => {
        console.error('getUserById failed:', err);
        setUserError(t('errors.loadUser'));
      })
      .finally(() => setLoadingUser(false));
  }, [userId]);

  // Fetch role profile
  useEffect(() => {
    if (!userId || !user) return;
    if (user.role === Roles.Admin) {
      setLoadingProfile(false);
      return;
    }

    setLoadingProfile(true);
    setProfileError(null);
    setProfileExists(true);
    getProfileById(userId)
      .then((data) => {
        setProfile(data);
        setProfileExists(true);
      })
      .catch((err) => {
        console.error('getProfileById failed:', err);
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setProfile(null);
          setProfileExists(false);
        } else {
          setProfileError(t('errors.loadProfile'));
        }
      })
      .finally(() => setLoadingProfile(false));
  }, [userId, user]);

  // Save user account info
  const handleSaveUser = async (data: Partial<User>) => {
    if (!userId) return;
    const updated: User = await updateUserPartial(userId, data);
    setUser(updated);
    await refreshUser();
  };

  // Save role profile — create if none exists, patch if it does
  const handleSaveProfile = async (
    data: UpdateTouristProfileData | UpdateGuideProfileData
  ) => {
    if (!userId) return;
    const role = user?.role as Role | undefined;
    let updated: AnyProfile;

    if (!profileExists || !profile) {
      if (role === Roles.Guide) {
        updated = await createGuideProfile(data as UpdateGuideProfileData);
      } else {
        updated = await createTouristProfile(data as UpdateTouristProfileData);
      }
      setProfileExists(true);
    } else {
      updated = await updatePartialProfile(profile.id, data);
    }

    setProfile(updated);
  };

  const role = user?.role as Role | undefined;
  const isAdmin = role === Roles.Admin;

  const roleBadgeClass = role
    ? ({
        [Roles.Tourist]: styles.badgeTourist,
        [Roles.Guide]:   styles.badgeGuide,
        [Roles.Admin]:   styles.badgeAdmin,
      }[role] ?? '')
    : '';

  const roleLabel = role ? (t(`profile.roleBadges.${role}`) ?? role) : '';

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {/* Card 1: Account info */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>{t('profile.account.title')}</h2>
              <p className={styles.cardSub}>{t('profile.account.sub')}</p>
            </div>
            {role && (
              <span className={`${styles.badge} ${roleBadgeClass}`}>
                {roleLabel}
              </span>
            )}
          </div>

          {loadingUser ? (
            <div className={styles.loading}>
              <LoaderIcon size={24} className={styles.spin} />
            </div>
          ) : userError ? (
            <p className={styles.error}>{userError}</p>
          ) : user ? (
            <UserInfoForm user={user} onSave={handleSaveUser} />
          ) : null}

          {!loadingUser && !userError && (
            <button
              type="button"
              className={styles.resetPasswordBtn}
              onClick={() => alert('Navigate to password reset flow.')}
            >
              <KeyIcon size={16} />
              {t('profile.account.resetPassword')}
              <NextIcon size={14} className={styles.chevron} />
            </button>
          )}
          {!loadingUser && !isAdmin && (
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => alert('Navigate to google calendar linking.')}
            >
              <LinkIcon size={16} />
              {t('profile.account.linkGoogleCalendar')}
              <NextIcon size={14} className={styles.chevron} />
            </button>
          )}
        </section>

        {/* Card 2: Role profile — hidden entirely for Admin */}
        {!loadingUser && !isAdmin && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>
                  {role
                    ? t('profile.roleProfile.title', { role: roleLabel })
                    : t('profile.roleProfile.titleFallback')}
                </h2>
                <p className={styles.cardSub}>
                  {role === Roles.Guide
                    ? t('profile.roleProfile.subGuide')
                    : t('profile.roleProfile.subTourist')}
                </p>
              </div>
              {!profileExists && !loadingProfile && (
                <span className={`${styles.badge} ${styles.badgeNew}`}>{t('profile.roleProfile.badgeNew')}</span>
              )}
            </div>

            {loadingProfile ? (
              <div className={styles.loading}>
                <LoaderIcon size={24} className={styles.spin} />
              </div>
            ) : profileError ? (
              <p className={styles.error}>{profileError}</p>
            ) : role ? (
              <ProfileForm
                role={role}
                profile={profile ?? undefined}
                onSave={handleSaveProfile}
              />
            ) : null}
          </section>
        )}
      </main>
    </div>
  );
};

export default ProfileComponent;