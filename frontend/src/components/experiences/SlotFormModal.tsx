import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Slot, ExperirnceSlotData } from '../../@types/experience.types';
import styles from './SlotFormModal.module.css';
import { CloseIcon } from '../common/Icons';

interface SlotFormModalProps {
  experienceId: string;
  slot?: Slot | null;
  onSave: (data: ExperirnceSlotData) => Promise<void>;
  onClose: () => void;
}

const empty: ExperirnceSlotData = {
  date: '',
  capacity: 1,
  price: 0,
  start_time: '',
  end_time: '',
};

const SlotFormModal: React.FC<SlotFormModalProps> = ({ slot, onSave, onClose }) => {
  const isEdit = Boolean(slot);
  const [form, setForm] = useState<ExperirnceSlotData>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation('experience');

  useEffect(() => {
    if (slot) {
      setForm({
        date: slot.date,
        capacity: slot.capacity,
        price: slot.price,
        start_time: slot.start_time,
        end_time: slot.end_time,
      });
    } else {
      setForm(empty);
    }
  }, [slot]);

  const set = <K extends keyof ExperirnceSlotData>(key: K, value: ExperirnceSlotData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch {
      setError(t('slotFormModal.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEdit ? t('slotFormModal.title.edit') : t('slotFormModal.title.add')}
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <CloseIcon size={18} />
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>{t('slotFormModal.fields.date')}</label>
            <input
              type="date"
              className={styles.input}
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>{t('slotFormModal.fields.startTime')}</label>
              <input
                type="time"
                className={styles.input}
                value={form.start_time}
                onChange={(e) => set('start_time', e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t('slotFormModal.fields.endTime')}</label>
              <input
                type="time"
                className={styles.input}
                value={form.end_time}
                onChange={(e) => set('end_time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>{t('slotFormModal.fields.capacity')}</label>
              <input
                type="number"
                className={styles.input}
                min={1}
                value={form.capacity}
                onChange={(e) => set('capacity', Number(e.target.value))}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t('slotFormModal.fields.price')}</label>
              <input
                type="number"
                className={styles.input}
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => set('price', Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose} disabled={saving}>
              {t('slotFormModal.actions.cancel')}
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
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