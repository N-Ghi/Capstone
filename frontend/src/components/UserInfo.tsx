import React, { useEffect, useRef, useState } from 'react';
import { Camera, Check, Loader2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User } from '../@types/auth.types';
import styles from './UserInfo.module.css';
import { uploadProfilePicture } from '../services/pictureService';

interface Props {
  user: User;
  onSave: (data: Partial<User>) => Promise<void>;
}

const UserInfoForm: React.FC<Props> = ({ user, onSave }) => {
  const { t } = useTranslation('profile');

  const [username,  setUsername]  = useState(user.username);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName,  setLastName]  = useState(user.last_name);
  const [email,     setEmail]     = useState(user.email);
  const [preview,   setPreview]   = useState<string | null>(user.profile_picture);
  const [file,      setFile]      = useState<File | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Sync if parent user changes
  useEffect(() => {
    setUsername(user.username);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setPreview(user.profile_picture);
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const clearPhoto = () => {
    setFile(null);
    setPreview(user.profile_picture);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data: Partial<User> = { username, first_name: firstName, last_name: lastName, email };

      if (file) {
        const result = await uploadProfilePicture(file);
        data.profile_picture = result.url;
      }

      await onSave(data);
      setFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err?.message ?? t('userInfo.errorSave'));
    } finally {
      setSaving(false);
    }
  };

  const initials =
    ((firstName?.[0] ?? '') + (lastName?.[0] ?? '')) ||
    (username?.[0]?.toUpperCase() ?? '?');

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Avatar */}
      <div className={styles.avatarSection}>
        <div className={styles.avatarWrap}>
          {preview ? (
            <img src={preview} alt="Profile" className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>{initials}</div>
          )}
          <button
            type="button"
            className={styles.avatarBtn}
            onClick={() => fileRef.current?.click()}
            title={t('userInfo.changePhoto')}
          >
            <Camera size={16} />
          </button>
          {(file || (preview && preview !== user.profile_picture)) && (
            <button
              type="button"
              className={styles.avatarClear}
              onClick={clearPhoto}
              title={t('userInfo.removePhoto')}
            >
              <X size={12} />
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className={styles.hidden}
          onChange={handleFileChange}
        />
      </div>

      {/* Fields */}
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="uif-username">{t('userInfo.username')}</label>
          <input
            id="uif-username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="uif-email">{t('userInfo.email')}</label>
          <input
            id="uif-email"
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="uif-first">{t('userInfo.firstName')}</label>
          <input
            id="uif-first"
            className={styles.input}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="uif-last">{t('userInfo.lastName')}</label>
          <input
            id="uif-last"
            className={styles.input}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? (
            <Loader2 size={16} className={styles.spin} />
          ) : saved ? (
            <Check size={16} />
          ) : null}
          {saving ? t('userInfo.saving') : saved ? t('userInfo.saved') : t('userInfo.saveChanges')}
        </button>
      </div>
    </form>
  );
};

export default UserInfoForm;