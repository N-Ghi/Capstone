import type { CreateBooking } from "../../@types/booking.types";
import React, { useEffect, useState } from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './BookingForm.module.css';

interface Props {
  slotId: string;
  maxGuests?: number;
  onBook: (data: CreateBooking) => Promise<void>;
}

const parseApiError = (err: any): string => {
  if (typeof err === 'string') {
    try {
      const parsed = JSON.parse(err);
      return flattenErrors(parsed);
    } catch {
      return err;
    }
  }
  if (err?.message) {
    try {
      const parsed = JSON.parse(err.message);
      return flattenErrors(parsed);
    } catch {
      return err.message;
    }
  }
  if (typeof err === 'object') {
    return flattenErrors(err);
  }
  return 'Something went wrong. Please try again.';
};

const flattenErrors = (obj: any): string => {
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.join(' ');
  if (typeof obj === 'object' && obj !== null) {
    return Object.values(obj)
      .flatMap((v) => (Array.isArray(v) ? v : [v]))
      .join(' ');
  }
  return String(obj);
};

const BookingForm: React.FC<Props> = ({ slotId, maxGuests = 20, onBook }) => {
  const { t } = useTranslation('booking');

  const [guestInput, setGuestInput] = useState('1');
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    setGuestInput('1');
    setSaved(false);
    setError(null);
  }, [slotId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow empty string so the user can delete and retype
    if (raw === '' || raw === '-') {
      setGuestInput(raw);
      return;
    }
    const num = Number(raw);
    if (!isNaN(num)) {
      // Clamp upper bound immediately; lower bound is deferred to onBlur
      setGuestInput(String(Math.min(maxGuests, num)));
    }
  };

  // Snap to valid range when the user leaves the field
  const handleBlur = () => {
    const clamped = Math.max(1, Math.min(maxGuests, Number(guestInput) || 1));
    setGuestInput(String(clamped));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const guests = Math.max(1, Math.min(maxGuests, Number(guestInput) || 1));
    setSaving(true);
    setError(null);
    try {
      await onBook({ slot_id: slotId, guests });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setError(parseApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="bf-guests">
            {t('booking.guests')}
          </label>
          <input
            id="bf-guests"
            type="number"
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            value={guestInput}
            min={1}
            max={maxGuests}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          <AlertCircle size={15} className={styles.errorIcon} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? (
            <Loader2 size={16} className={styles.spin} />
          ) : saved ? (
            <Check size={16} />
          ) : null}
          {saving
            ? t('booking.saving', 'Booking…')
            : saved
            ? t('booking.saved', 'Booked!')
            : t('booking.confirm', 'Confirm Booking')}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;