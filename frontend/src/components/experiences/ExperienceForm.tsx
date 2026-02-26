import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeaderComponent from '../common/Header';
import LocationPicker from '../common/LocationPicker';
import type { Location } from '../../@types/location.types';
import PhotoUploader from '../common/PhotoUploader';
import MultiSelect, { type SelectOption } from '../common/MultiSelect';
import { createExperience, updateExperienceFull, getExperienceById, } from '../../services/experienceService';
import { getLanguages, getPaymentMethods, getTravelPreferences } from '../../services/choiceService';
import type { CreateExperienceData } from '../../@types/experience.types';
import styles from './ExperienceForm.module.css';
import {BackIcon, ErrorIcon} from "../common/Icons";

const ExperienceForm: React.FC = () => {
  const { t } = useTranslation('experience');
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [locationId, setLocationId] = useState('');
  const [locationData, setLocationData] = useState<Location | null>(null);

  const [languageOptions, setLanguageOptions] = useState<SelectOption[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<SelectOption[]>([]);
  const [expertiseOptions, setExpertiseOptions] = useState<SelectOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [langs, payments, prefs] = await Promise.all([
          getLanguages(),
          getPaymentMethods(),
          getTravelPreferences(),
        ]);
        setLanguageOptions(langs);
        setPaymentOptions(payments);
        setExpertiseOptions(prefs);
      } finally {
        setOptionsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      try {
        const exp = await getExperienceById(id);
        setTitle(exp.title ?? '');
        setDescription(exp.description ?? '');
        setExpertise(exp.expertise ?? []);
        setPhotos(exp.photos ?? []);
        setDate(exp.date ?? '');
        setLanguages(exp.languages ?? []);
        setPaymentMethods(exp.payment_methods ?? []);
        if (exp.location) {
          setLocationId(exp.location.id);
          setLocationData(exp.location);
        }
      } catch {
        setError(t('experienceForm.errors.loadFailed'));
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [id, isEdit, t]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload: CreateExperienceData = {
      title,
      description,
      expertise,
      photos,
      date,
      languages,
      payment_methods: paymentMethods,
      location_id: locationId || undefined,
      guide_id: user?.role === 'Guide' ? user.id : undefined,
    };

    try {
      if (isEdit && id) {
        await updateExperienceFull(id, payload);
      } else {
        await createExperience(payload);
      }
      navigate('/guide');
    } catch (err: any) {
      setError(err?.response?.data?.error ?? t('experienceForm.errors.default'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLocationSaved = (savedId: string, data: Location) => {
    setLocationId(savedId);
    setLocationData(data);
  };

  if (initialLoading) {
    return (
      <>
        <HeaderComponent />
        <div className={styles.page}>
          <div className={styles.container}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonField} />
            <div className={styles.skeletonField} />
            <div className={`${styles.skeletonField} ${styles.skeletonFieldShort}`} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderComponent />
      <div className={styles.page}>
        <div className={styles.container}>

          <div className={styles.header}>
            <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
              <BackIcon size={18} />
            </button>
            <div>
              <h1 className={styles.title}>
                {isEdit ? t('experienceForm.title.edit') : t('experienceForm.title.create')}
              </h1>
              <p className={styles.subtitle}>
                {isEdit ? t('experienceForm.subtitle.edit') : t('experienceForm.subtitle.create')}
              </p>
            </div>
          </div>

          {error && (
            <div className={styles.errorBanner} role="alert">
              <ErrorIcon size={16} />
              {error}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('experienceForm.sections.basicInfo')}</h2>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="ef-title">
                  {t('experienceForm.fields.title.label')}
                </label>
                <input
                  id="ef-title"
                  type="text"
                  className={styles.fieldInput}
                  placeholder={t('experienceForm.fields.title.placeholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="ef-description">
                  {t('experienceForm.fields.description.label')}
                </label>
                <textarea
                  id="ef-description"
                  className={`${styles.fieldInput} ${styles.fieldTextarea}`}
                  placeholder={t('experienceForm.fields.description.placeholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="ef-date">
                  {t('experienceForm.fields.date')}
                </label>
                <input
                  id="ef-date"
                  type="date"
                  className={styles.fieldInput}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('experienceForm.sections.details')}</h2>

              <div className={styles.field}>
                <MultiSelect
                  label={t('experienceForm.fields.expertise.label')}
                  options={expertiseOptions}
                  selected={expertise}
                  onChange={setExpertise}
                  placeholder={t('experienceForm.fields.expertise.placeholder')}
                  loading={optionsLoading}
                />
              </div>

              <div className={styles.field}>
                <MultiSelect
                  label={t('experienceForm.fields.languages.label')}
                  options={languageOptions}
                  selected={languages}
                  onChange={setLanguages}
                  placeholder={t('experienceForm.fields.languages.placeholder')}
                  loading={optionsLoading}
                />
              </div>

              <div className={styles.field}>
                <MultiSelect
                  label={t('experienceForm.fields.paymentMethods.label')}
                  options={paymentOptions}
                  selected={paymentMethods}
                  onChange={setPaymentMethods}
                  placeholder={t('experienceForm.fields.paymentMethods.placeholder')}
                  loading={optionsLoading}
                />
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('experienceForm.sections.location')}</h2>
              <div className={styles.field}>
                <LocationPicker
                  onLocationSaved={handleLocationSaved}
                  initialLocation={locationData}
                  label={t('experienceForm.fields.location')}
                />
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('experienceForm.sections.photos')}</h2>
              <div className={styles.field}>
                <PhotoUploader
                  photos={photos}
                  onChange={setPhotos}
                  label={t('experienceForm.fields.photos')}
                  maxPhotos={10}
                />
              </div>
            </section>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                {t('experienceForm.actions.cancel')}
              </button>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={submitting}
              >
                {submitting
                  ? isEdit ? t('experienceForm.actions.saving') : t('experienceForm.actions.creating')
                  : isEdit ? t('experienceForm.actions.saveChanges') : t('experienceForm.actions.createExperience')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ExperienceForm;