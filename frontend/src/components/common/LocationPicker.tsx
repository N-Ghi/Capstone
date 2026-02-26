import { useTranslation } from 'react-i18next';
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Check, X } from 'lucide-react';
import { createLocation, saveLocation } from '../../services/locationService';
import type { Location, LocationData } from '../../@types/location.types';
import styles from './LocationPicker.module.css';

interface LocationPickerProps {
  onLocationSaved: (locationId: string, locationData: Location) => void;
  initialLocation?: Location | null;
  label?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSaved, initialLocation = null, label = 'Location', }) => {
    const { t } = useTranslation('common');
  const [query, setQuery] = useState(initialLocation?.place_name ?? '');
  const [geocodeResult, setGeocodeResult] = useState<LocationData | null>(
    initialLocation
      ? {
          place_name: initialLocation.place_name,
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          place_id: initialLocation.place_id,
        }
      : null
  );
  const [saved, setSaved] = useState<Location | null>(initialLocation);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initialLocation) {
      setQuery(initialLocation.place_name);
      setGeocodeResult({
        place_name: initialLocation.place_name,
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        place_id: initialLocation.place_id,
      });
      setSaved(initialLocation);
    }
  }, [initialLocation?.id]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setGeocodeResult(null);
    setSaved(null);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) return;

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await createLocation(value.trim());
        setGeocodeResult(result);
      } catch (err) {
        setError(t('location.notFound'));
      } finally {
        setLoading(false);
      }
    }, 700);
  };

  const handleSave = async () => {
    if (!geocodeResult) return;
    setSaving(true);
    setError(null);
    try {
      const savedLoc = await saveLocation(geocodeResult);
      setSaved(savedLoc);
      onLocationSaved(savedLoc.id, savedLoc);
    } catch (err) {
      setError(t('location.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setGeocodeResult(null);
    setSaved(null);
    setError(null);
  };

  const formatCoord = (value: string | number) =>
    parseFloat(value as string).toFixed(5);

  return (
    <div className={styles.picker}>
      <label className={styles.label}>{label}</label>

      <div className={styles.inputWrap}>
        <span className={styles.icon}>
          <MapPin size={16} />
        </span>
        <input
          type="text"
          className={styles.input}
          placeholder={t('location.searchPlaceholder')}
          value={query}
          onChange={handleQueryChange}
        />
        {loading && <span className={styles.spinner} />}
        {query && !loading && (
          <button type="button" className={styles.clearBtn} onClick={handleClear} aria-label="Clear">
            <X size={14} />
          </button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {geocodeResult && !saved && (
        <div className={styles.geocodeResult}>
          <div className={styles.geocodeInfo}>
            <MapPin size={14} />
            <div>
              <p className={styles.placeName}>{geocodeResult.place_name}</p>
              <p className={styles.coords}>
                {formatCoord(geocodeResult.latitude)}, {formatCoord(geocodeResult.longitude)}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? t('location.saving') : t('location.save')}
          </button>
        </div>
      )}

      {saved && (
        <div className={styles.savedBadge}>
          <Check size={14} strokeWidth={2.5} />
          <span>{saved.place_name}</span>
          <button type="button" className={styles.clearBtn} onClick={handleClear} aria-label="Clear">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;