import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MultiSelect from './common/MultiSelect';
import type { SelectOption } from './common/MultiSelect';
import { getLanguages, getPaymentMethods, getTravelPreferences } from '../services/choiceService';
import { Roles, type Role } from '../@types/auth.types';
import type {
  TouristProfile,
  GuideProfile,
  AnyProfile,
  UpdateTouristProfileData,
  UpdateGuideProfileData,
} from '../@types/profile.types';
import styles from './ProfileForm.module.css';

interface Props {
  role: Role;
  profile?: AnyProfile;
  onSave: (data: UpdateTouristProfileData | UpdateGuideProfileData) => Promise<void>;
}

const ProfileForm: React.FC<Props> = ({ role, profile, onSave }) => {
  const { t } = useTranslation('profile');

  const [languageOptions,   setLanguageOptions]   = useState<SelectOption[]>([]);
  const [paymentOptions,    setPaymentOptions]    = useState<SelectOption[]>([]);
  const [preferenceOptions, setPreferenceOptions] = useState<SelectOption[]>([]);
  const [optionsLoading,    setOptionsLoading]    = useState(true);

  const [name,           setName]           = useState('');
  const [bio,            setBio]            = useState('');
  const [languages,      setLanguages]      = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [preferences,    setPreferences]    = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [langs, payments, prefs] = await Promise.all([
          getLanguages(),
          getPaymentMethods(),
          getTravelPreferences(),
        ]);
        setLanguageOptions(langs ?? []);
        setPaymentOptions(payments ?? []);
        setPreferenceOptions(prefs ?? []);

        if (profile) {
          if (role === Roles.Tourist) {
            const p = profile as TouristProfile;
            setLanguages(p.languages ?? []);
            setPaymentMethods(p.payment_methods ?? []);
            setPreferences(p.travel_preferences ?? []);
          }
          if (role === Roles.Guide) {
            const p = profile as GuideProfile;
            setName(p.name ?? '');
            setBio(p.bio ?? '');
            setLanguages(p.languages ?? []);
            setPaymentMethods(p.payment_methods ?? []);
            setPreferences(p.expertise ?? []);
          }
        }
      } catch {
        setError(t('profileForm.errorOptions'));
      } finally {
        setOptionsLoading(false);
      }
    })();
  }, [profile, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (role === Roles.Tourist) {
        await onSave({
          languages,
          payment_methods: paymentMethods,
          travel_preferences: preferences,
        } satisfies UpdateTouristProfileData);
      } else if (role === Roles.Guide) {
        await onSave({
          name,
          bio,
          languages,
          payment_methods: paymentMethods,
          expertise: preferences,
        } satisfies UpdateGuideProfileData);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      const detail = err?.response?.data;
      if (detail && typeof detail === 'object') {
        const messages = Object.entries(detail)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join(' | ');
        setError(messages);
      } else {
        setError(err?.message ?? t('profileForm.errorSave'));
      }
    } finally {
      setSaving(false);
    }
  };

  const BIO_MAX = 1000;
  const bioOver = bio.length > BIO_MAX;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>

      {role === Roles.Guide && (
        <>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-name">
              {t('profileForm.displayName')}
            </label>
            <input
              id="pf-name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('profileForm.displayNamePlaceholder')}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-bio">
              {t('profileForm.bio')}
              <span className={`${styles.charCount} ${bioOver ? styles.charOver : ''}`}>
                {bio.length}/{BIO_MAX}
              </span>
            </label>
            <textarea
              id="pf-bio"
              className={`${styles.input} ${styles.textarea}`}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t('profileForm.bioPlaceholder')}
              rows={5}
              maxLength={BIO_MAX}
            />
          </div>
        </>
      )}

      <MultiSelect
        label={t('profileForm.languages')}
        options={languageOptions}
        selected={languages}
        onChange={setLanguages}
        placeholder={role === Roles.Guide
          ? t('profileForm.languagesPlaceholderGuide')
          : t('profileForm.languagesPlaceholderTourist')}
        loading={optionsLoading}
        disabled={optionsLoading}
      />

      <MultiSelect
        label={role === Roles.Guide
          ? t('profileForm.expertise')
          : t('profileForm.travelPreferences')}
        options={preferenceOptions}
        selected={preferences}
        onChange={setPreferences}
        placeholder={role === Roles.Guide
          ? t('profileForm.expertisePlaceholder')
          : t('profileForm.travelPreferencesPlaceholder')}
        loading={optionsLoading}
        disabled={optionsLoading}
      />

      <MultiSelect
        label={t('profileForm.paymentMethods')}
        options={paymentOptions}
        selected={paymentMethods}
        onChange={setPaymentMethods}
        placeholder={t('profileForm.paymentMethodsPlaceholder')}
        loading={optionsLoading}
        disabled={optionsLoading}
      />

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.saveBtn}
          disabled={saving || optionsLoading || bioOver}
        >
          {saving ? (
            <Loader2 size={16} className={styles.spin} />
          ) : saved ? (
            <Check size={16} />
          ) : null}
          {saving
            ? t('profileForm.saving')
            : saved
            ? t('profileForm.saved')
            : t('profileForm.saveProfile')}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;