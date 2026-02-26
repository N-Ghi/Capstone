import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import HeaderComponent from '../common/Header';
import SlotFormModal from './SlotFormModal';
import ConfirmDialog from '../common/ConfirmDialog';
import MapPin from '../common/Map';
import { EditIcon, DeleteIcon, DateIcon, LocationIcon, AddIcon } from '../common/Icons';
import { getExperienceById, updateExperiencePartial, getExperienceSlots, createExperienceSlot, updateExperienceSlotFull, deleteExperienceSlot, } from '../../services/experienceService';
import type { ExperienceDetail } from '../../@types/experience.types';
import type { Slot, ExperirnceSlotData } from '../../@types/experience.types';
import { useTranslatedData } from '../../hooks/useTranslatedData';
import styles from './ExperienceDetails.module.css';
import { BackIcon, BookIcon } from '../common/Icons';


// Helpers
const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const fmtTime = (t: string) =>
  new Date(`1970-01-01T${t}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

// Page 

const ExperienceDetailComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, isTourist } = useAuth();
  const { t } = useTranslation('experience');

  const [experience, setExperience] = useState<ExperienceDetail | null>(null);
  const [expLoading, setExpLoading] = useState(true);
  const [expError, setExpError] = useState<string | null>(null);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);

  const [slotModal, setSlotModal] = useState<{ open: boolean; slot?: Slot | null }>({ open: false });
  const [deleteExp, setDeleteExp] = useState(false);
  const [deletingExp, setDeletingExp] = useState(false);
  const [deleteSlotId, setDeleteSlotId] = useState<string | null>(null);
  const [deletingSlot, setDeletingSlot] = useState(false);

  const [activePhoto, setActivePhoto] = useState(0);


  const experienceArray = useMemo(
    () => (experience ? [experience] : []),
    [experience]
  );
  const { translated: translatedExperiences, translating } = useTranslatedData(
    experienceArray,
    ['title', 'description']
  );
  const translatedExperience = translatedExperiences[0] ?? experience;

  const canManage = Boolean(
    experience && (isAdmin || user?.id === experience.guide)
  );

  const canBook = Boolean(
    experience && (isAdmin || isTourist)
  );

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getExperienceById(id);
        setExperience(data);
      } catch {
        setExpError(t('experienceDetail.errors.loadFailed'));
      } finally {
        setExpLoading(false);
      }
    })();
  }, [id, t]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getExperienceSlots(id);
        setSlots(Array.isArray(data) ? data : data.results ?? []);
      } catch {
        // non-fatal
      } finally {
        setSlotsLoading(false);
      }
    })();
  }, [id]);

  const handleEditExperience = () => navigate(`/experience/${id}/edit`);

  const handleDeleteExperience = async () => {
    if (!id) return;
    setDeletingExp(true);
    try {
      await updateExperiencePartial(id, { is_active: false } as any);
      navigate('/guide/experiences');
    } catch {
      setDeletingExp(false);
      setDeleteExp(false);
    }
  };
  const handleBookingExperience = () => navigate(`/experience/${id}/book`);

  const handleSaveSlot = async (data: ExperirnceSlotData) => {
    if (!id) return;
    if (slotModal.slot) {
      const updated = await updateExperienceSlotFull(id, slotModal.slot.id, data);
      setSlots((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } else {
      const created = await createExperienceSlot(id, data);
      setSlots((prev) => [...prev, created]);
    }
  };

  const handleDeleteSlot = async () => {
    if (!id || !deleteSlotId) return;
    setDeletingSlot(true);
    try {
      await deleteExperienceSlot(id, deleteSlotId);
      setSlots((prev) => prev.filter((s) => s.id !== deleteSlotId));
      setDeleteSlotId(null);
    } catch {
      // keep dialog open on failure
    } finally {
      setDeletingSlot(false);
    }
  };

  if (expLoading) {
    return (
      <>
        <HeaderComponent />
        <div className={styles.page}>
          <div className={styles.layout}>
            <div className={styles.left}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonBlock} />
              <div className={styles.skeletonBlock} />
            </div>
            <div className={styles.right}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonBlock} />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (expError || !experience) {
    return (
      <>
        <HeaderComponent />
        <div className={styles.page}>
          <div className={styles.errorState}>
            <p>{expError ?? t('experienceDetail.errors.notFound')}</p>
            <button className={styles.btnSecondary} onClick={() => navigate(-1)}>
              {t('experienceDetail.actions.goBack')}
            </button>
          </div>
        </div>
      </>
    );
  }

  // Use translated fields where available, fall back to originals for non-translated fields
  const { photos, location, is_active, created_at } = experience;
  const title = translatedExperience?.title ?? experience.title;
  const description = translatedExperience?.description ?? experience.description;

  const lat = location ? parseFloat(location.latitude) : null;
  const lng = location ? parseFloat(location.longitude) : null;

  return (
    <>
      <HeaderComponent />
      <div className={styles.page}>

        <div className={styles.topBar}>
          <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
            <BackIcon size={16} />
            {t('experienceDetail.nav.back')}
          </button>
        </div>

        <div className={styles.layout}>

          {/* LEFT PANEL */}
          <div className={styles.left}>

            <div className={styles.panelHeader}>
              <div>
                <h1 className={`${styles.expTitle} ${translating ? styles.translating : ''}`}>
                  {title}
                </h1>
                <span className={`${styles.statusBadge} ${is_active ? styles.statusActive : styles.statusInactive}`}>
                  <span className={styles.statusDot} />
                  {is_active ? t('experienceDetail.status.active') : t('experienceDetail.status.inactive')}
                </span>
              </div>
              {canManage && (
                <div className={styles.iconBtns}>
                  <button className={styles.iconBtn} onClick={handleEditExperience} title={t('experienceDetail.actions.editExperience')}>
                    <EditIcon size={16} />
                  </button>
                  <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={() => setDeleteExp(true)} title={t('experienceDetail.actions.deleteExperience')}>
                    <DeleteIcon size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className={styles.card}>
              <p className={`${styles.description} ${translating ? styles.translating : ''}`}>
                {description}
              </p>
              {location && (
                <div className={styles.locationRow}>
                  <LocationIcon size={13} />
                  {location.place_name}
                </div>
              )}
              <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                  <DateIcon size={12} />

                  {t('experienceDetail.meta.created', { date: fmt(created_at) })}
                </span>
              </div>
            </div>

            {photos.length > 0 && (
              <div className={styles.card}>
                <h3 className={styles.sectionLabel}>{t('experienceDetail.sections.photos')}</h3>
                <div className={styles.photoMain}>
                  <img src={photos[activePhoto]} alt={title} className={styles.photoLarge} />
                </div>
                {photos.length > 1 && (
                  <div className={styles.photoThumbs}>
                    {photos.map((url, i) => (
                      <button
                        key={url}
                        type="button"
                        className={`${styles.thumb} ${i === activePhoto ? styles.thumbActive : ''}`}
                        onClick={() => setActivePhoto(i)}
                      >
                        <img src={url} alt={t('experienceDetail.sections.photoAlt', { number: i + 1 })} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {lat !== null && lng !== null && (
              <div className={styles.card}>
                <h3 className={styles.sectionLabel}>{t('experienceDetail.sections.location')}</h3>
                <MapPin lat={lat} lng={lng} label={location!.place_name} />
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className={styles.right}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>{t('experienceDetail.slots.title')}</h2>
              {canManage && (
                <button
                  className={styles.addSlotBtn}
                  onClick={() => setSlotModal({ open: true, slot: null })}
                >
                  <AddIcon size={13} />
                  {t('experienceDetail.slots.addSlot')}
                </button>
              )}
            </div>

            <div className={styles.card}>
              {slotsLoading ? (
                <div className={styles.skeletonBlock} />
              ) : slots.length === 0 ? (
                <div className={styles.emptySlots}>
                  <DateIcon size={24} />
                  <p>{t('experienceDetail.slots.empty')}</p>
                </div>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>{t('experienceDetail.slots.table.date')}</th>
                        <th>{t('experienceDetail.slots.table.time')}</th>
                        <th>{t('experienceDetail.slots.table.capacity')}</th>
                        <th>{t('experienceDetail.slots.table.remaining')}</th>
                        <th>{t('experienceDetail.slots.table.price')}</th>
                        <th>{t('experienceDetail.slots.table.status')}</th>
                        {canManage && <th />}
                        {canBook && <th />}
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map((slot) => (
                        <tr key={slot.id}>
                          <td>{fmt(slot.date)}</td>
                          <td className={styles.timeCell}>
                            {fmtTime(slot.start_time)}
                            <span className={styles.timeSep}>{t('experienceDetail.slots.timeSeparator')}</span>
                            {fmtTime(slot.end_time)}
                          </td>
                          <td>{slot.capacity}</td>
                          <td>
                            <span className={`${styles.remaining} ${slot.remaining_slots === 0 ? styles.remainingFull : ''}`}>
                              {slot.remaining_slots}
                            </span>
                          </td>
                          <td className={styles.price}>{t('experienceDetail.slots.price', { amount: slot.price })}</td>
                          <td>
                            <span className={`${styles.slotBadge} ${slot.is_active ? styles.slotActive : styles.slotInactive}`}>
                              {slot.is_active ? t('experienceDetail.slots.status.active') : t('experienceDetail.slots.status.inactive')}
                            </span>
                          </td>
                          {canManage && (
                            <td>
                              <div className={styles.rowActions}>
                                <button
                                  className={styles.iconBtn}
                                  onClick={() => setSlotModal({ open: true, slot })}
                                  title={t('experienceDetail.slots.editSlot')}
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                                  onClick={() => setDeleteSlotId(slot.id)}
                                  title={t('experienceDetail.slots.deleteSlot')}
                                >
                                  <DeleteIcon />
                                </button>
                              </div>
                            </td>
                          )}
                          {canBook && (
                            <td>
                              <div className={styles.rowActions}>
                                <button
                                  className={styles.iconBtn}
                                  onClick={() => handleBookingExperience()}
                                  title={t('experienceDetail.slots.bookSlot')}
                                >
                                  <BookIcon />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {slotModal.open && (
        <SlotFormModal
          experienceId={id!}
          slot={slotModal.slot}
          onSave={handleSaveSlot}
          onClose={() => setSlotModal({ open: false })}
        />
      )}

      {deleteExp && (
        <ConfirmDialog
          message={t('experienceDetail.dialogs.deleteExperience.message')}
          onConfirm={handleDeleteExperience}
          onCancel={() => setDeleteExp(false)}
          loading={deletingExp}
        />
      )}

      {deleteSlotId && (
        <ConfirmDialog
          message={t('experienceDetail.dialogs.deleteSlot.message')}
          onConfirm={handleDeleteSlot}
          onCancel={() => setDeleteSlotId(null)}
          loading={deletingSlot}
        />
      )}
    </>
  );
};

export default ExperienceDetailComponent;