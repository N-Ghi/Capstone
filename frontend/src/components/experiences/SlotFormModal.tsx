import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Slot, ExperirnceSlotData } from '../../@types/experience.types';
import styles from './SlotFormModal.module.css';
import { CloseIcon } from '../common/Icons';
import { getApiError } from '../../utils/errorUtils';

interface SlotFormModalProps {
  experienceId: string;
  slot?: Slot | null;
  onSave: (data: ExperirnceSlotData) => Promise<void>;
  onClose: () => void;
}

const empty: ExperirnceSlotData = {
  date: '',
  end_date: '',
  capacity: 1,
  price: 0,
  start_time: '',
  end_time: '',
};

const SlotFormModal: React.FC<SlotFormModalProps> = ({ slot, onSave, onClose }) => {
  const isEdit = Boolean(slot);
  const [form,        setForm]        = useState<ExperirnceSlotData>(empty);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { t } = useTranslation('experience');

  useEffect(() => {
    if (slot) {
      setForm({
        date:       slot.date,
        end_date:   slot.end_date,
        capacity:   slot.capacity,
        price:      slot.price,
        start_time: slot.start_time,
        end_time:   slot.end_time,
      });
    } else {
      setForm(empty);
    }
  }, [slot]);

  const set = <K extends keyof ExperirnceSlotData>(key: K, value: ExperirnceSlotData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
  };

  // Client-side validation before hitting the API
  const validate = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!form.date)
      errors.date = t('slotFormModal.errors.dateRequired');
    if (form.end_date && form.end_date < form.date)
      errors.end_date = t('slotFormModal.errors.endDateBeforeStart');
    if (!form.start_time)
      errors.start_time = t('slotFormModal.errors.startTimeRequired');
    if (!form.end_time)
      errors.end_time = t('slotFormModal.errors.endTimeRequired');
    if (form.end_time && form.start_time && form.end_time <= form.start_time)
      errors.end_time = t('slotFormModal.errors.endTimeBeforeStart');
    if (form.capacity < 1)
      errors.capacity = t('slotFormModal.errors.capacityMin');
    if (form.price < 0)
      errors.price = t('slotFormModal.errors.negativePrice');

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setSaving(true);
    setFieldErrors({});
    try {
      await onSave(form);
      onClose();
    } catch (err: unknown) {
      console.error('Slot save failed:', err);
      const parsed = getApiError(err, t('slotFormModal.errors.saveFailed'));
      if (parsed.kind === 'field') {
        setFieldErrors(parsed.fields);
      } else {
        setError(parsed.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const fieldError = (key: string) =>
    fieldErrors[key]
      ? <span className={styles.fieldError}>{fieldErrors[key]}</span>
      : null;

  const inputClass = (key: string) =>
    `${styles.input} ${fieldErrors[key] ? styles.inputError : ''}`;

  return (
    <div className={styles.overlay} onClick={saving ? undefined : onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEdit ? t('slotFormModal.title.edit') : t('slotFormModal.title.add')}
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} disabled={saving}>
            <CloseIcon size={18} />
          </button>
        </div>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.field}>
            <label className={styles.label}>{t('slotFormModal.fields.date')}</label>
            <input
              type="date"
              className={inputClass('date')}
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              required
            />
            {fieldError('date')}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('slotFormModal.fields.end_date')}</label>
            <input
              type="date"
              className={inputClass('end_date')}
              value={form.end_date}
              onChange={(e) => set('end_date', e.target.value)}
            />
            {fieldError('end_date')}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>{t('slotFormModal.fields.startTime')}</label>
              <input
                type="time"
                className={inputClass('start_time')}
                value={form.start_time}
                onChange={(e) => set('start_time', e.target.value)}
                required
              />
              {fieldError('start_time')}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t('slotFormModal.fields.endTime')}</label>
              <input
                type="time"
                className={inputClass('end_time')}
                value={form.end_time}
                onChange={(e) => set('end_time', e.target.value)}
                required
              />
              {fieldError('end_time')}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>{t('slotFormModal.fields.capacity')}</label>
              <input
                type="number"
                className={inputClass('capacity')}
                min={1}
                value={form.capacity}
                onChange={(e) => set('capacity', Number(e.target.value))}
                required
              />
              {fieldError('capacity')}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t('slotFormModal.fields.price')}</label>
              <input
                type="number"
                className={inputClass('price')}
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => set('price', Number(e.target.value))}
                required
              />
              {fieldError('price')}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onClose}
              disabled={saving}
            >
              {t('slotFormModal.actions.cancel')}
            </button>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={saving}
            >
              {saving
                ? t('slotFormModal.actions.saving')
                : isEdit
                  ? t('slotFormModal.actions.saveChanges')
                  : t('slotFormModal.actions.addSlot')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotFormModal;